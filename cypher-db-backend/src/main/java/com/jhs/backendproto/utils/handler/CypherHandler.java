package com.jhs.backendproto.utils.handler;

import com.jhs.backendproto.utils.logger.JestLogger;
import lombok.Getter;
import org.slf4j.Logger;
import org.springframework.stereotype.Component;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Cypher language tools for Elasticsearch, Redis
 *
 * @author jhs
 * @since 2021.05
 */
@Component
@SuppressWarnings("unchecked")
public class CypherHandler {
    @JestLogger Logger logger;
    Map<String,Object> variablesStore = new HashMap<>();

    /*
     * enumeration area : Cypher 관련 키워드 및 Operator
     */
    public enum CypherKeywords { MATCH, WHERE, RETURN, WITH, LIMIT, UNION }
    public enum WhereWhiteKeywords { AND, OR }
    public enum ReturnKeywords { AS("as");
        @Getter String keyword;
        ReturnKeywords(String keyword) {
            this.keyword = keyword;
        }
    }
    public enum Operator { NEQ("!="), EQ("="), NEQ2("<>"), LT("<"), LTE("<="), GT(">"), GTE(">="), IN("in"), NIN("not in");
        @Getter String operator;
        Operator(String operator) {
            this.operator = operator;
        }
    }
    public enum OperatorAdvanced { COMPARE("comp", Arrays.asList(
            Operator.NEQ.getOperator(),
            Operator.EQ.getOperator(),
            Operator.NEQ2.getOperator(),
            Operator.LT.getOperator(),
            Operator.LTE.getOperator(),
            Operator.GT.getOperator(),
            Operator.GTE.getOperator(),
            Operator.IN.getOperator(),
            Operator.NIN.getOperator()));

        @Getter protected String title;
        final private List<String> datum;
        @Getter protected String presentOperator;

        OperatorAdvanced(String title, List<String> datum) {
            this.title = title;
            this.datum = datum;
        }

        public List<String> parse2operator(String sentence) {
            this.presentOperator = this.findByOperator(sentence);
            return Arrays.stream(sentence.split(this.presentOperator))
                    .map(String::trim)
                    .collect(Collectors.toList());
        }

        private String findByOperator(String sentence) {
            return datum.stream()
                    .filter(data -> Pattern.compile(String.format("(%s)", data)).matcher(sentence).find())
                    .findAny()
                    .orElse("");
        }
    }
    public enum ReturnType { ALL("all"), PART("part");
        @Getter String type;
        ReturnType(String type) {
            this.type = type;
        }
    }
    public enum Properties {
        SOURCE("source"),
        TARGET("target"),
        LABEL("label"),
        IDX("idx"),
        ALIAS("alias"),
        CONDITION("condition"),
        COLUMN("column"),
        VALUE("value"),
        ASTERISK("asterisk"),
        OPERATOR("operator"),
        NODES("nodes"),
        EDGE("edge"),
        EDGES("edges");

        @Getter String prop;
        Properties(String prop) {
            this.prop = prop;
        }
    }

    public String appendCypherKeywords(String delimiter) {
        if (variablesStore.get("cypherKeywords") != null) {
            return variablesStore.get("cypherKeywords").toString();
        }
        String sentence = Arrays.stream(CypherKeywords.values()).map(Enum::toString).collect(Collectors.joining(delimiter));
        variablesStore.put("cypherKeywords", sentence);

        return sentence;
    }

    /**
     * 키워드를 구분자로 사용하여 문장을 나누는 메소드
     * 
     * @param sentence Cypher Query 문장
     * @return 토큰화된 문장 배열
     */
    public String[] splitByKeyword(String sentence) {
        return sentence.split(
                String.format("(%s)", Arrays.stream(WhereWhiteKeywords.values()).map(Enum::toString).collect(Collectors.joining("|"))));
    }

    /**
     * WHERE clause 조건 타입별 치환/처리기
     *
     * @param value Cypher 쿼리에서 추출된 WHERE 조건 값
     * @return 문자열 값 핸들링된 내용 리턴
     */
    public Object handleWhereValue(String value) {
        return value.contains("'") ? value.replaceAll("'", "") : value;
    }

    /**
     * Cypher query 키워드별 문장 종류 판독기
     * 
     * @param sentence 키워드별 나눠진 Cypher query 문장
     * @return 판별된 문장 타입 문자열
     */
    public String chkSentenceType(String sentence) {
        sentence = sentence.toUpperCase();

        if (sentence.contains(CypherKeywords.MATCH.toString()) || sentence.contains(CypherKeywords.MATCH + "(")) {
            return CypherKeywords.MATCH.toString();
        } else if (sentence.contains(CypherKeywords.WHERE.toString())) {
            return CypherKeywords.WHERE.toString();
        } else if (sentence.contains(CypherKeywords.RETURN.toString())) {
            return CypherKeywords.RETURN.toString();
        } else if (sentence.contains(CypherKeywords.WITH.toString())) {
            return CypherKeywords.WITH.toString();
        } else if (sentence.contains(CypherKeywords.LIMIT.toString())) {
            return CypherKeywords.LIMIT.toString();
        } else if (sentence.contains(CypherKeywords.UNION.toString())) {
            return CypherKeywords.UNION.toString();
        } else {
            return null;
        }
    }

    /**
     * Cypher query 문장 해석기
     * 문장을 잘라 쿼리 키워드에 맞는 문장별로 메소드를 수행
     * 
     * @param query Cypher Query 문자열
     * @return Cypher Query 문장별 얻을 수 있는 노드, 엣지 정보
     */
    public Map<String,Object> parseCypherQuery(String query) {
        Map<String,Object> params = new HashMap<>();
        params.put(Properties.NODES.getProp(), new HashMap<>());
        params.put(Properties.EDGES.getProp(), new HashMap<>());

        query = query.replaceAll("\n|\r|\r\n", "");

        Pattern pattern = Pattern.compile(String.format("(?i)(%s).*?(?=%s|$)", appendCypherKeywords("|"), appendCypherKeywords("|")));
        Matcher matcher = pattern.matcher(query);

        while (matcher.find()) {
            try {
                String type = this.chkSentenceType(matcher.group());
                Method method = this.getClass().getDeclaredMethod(
                        "parse" + type.charAt(0) + type.toLowerCase().substring(1, type.length()),
                        String.class,
                        Map.class
                );
                method.invoke(this, matcher.group(), params);
            } catch (NoSuchMethodException e) {
                logger.error(String.format("NoSuchMethodException (sentence : %s) >> %s", matcher.group(), e.getMessage()));
            } catch (InvocationTargetException e) {
                logger.error(String.format("InvocationTargetException (sentence : %s) >> %s", matcher.group(), e.getTargetException()));
            } catch (IllegalAccessException e) {
                logger.error(String.format("IllegalAccessException (sentence : %s) >> %s", matcher.group(), e.getMessage()));
            }
        }

        return params;
    }

    /**
     * MATCH clause 해석기
     * MATCH 문에서 알 수 있는 것들
     * 조회할 노드, 엣지, 패턴
     * Method.invoke 수행
     *
     * @param matchClause MATCH 문장
     * @param params MATCH 문에서 찾을 수 있는 파라미터 값
     * @return 노드/엣지 선별된 파라미터
     */
    private Map<String,Object> parseMatch(String matchClause, Map<String,Object> params) {
        Pattern nodePattern = Pattern.compile("(?<=\\().*?(?=\\))");
        Matcher nodeMatcher = nodePattern.matcher(matchClause);

        // for find node
        while (nodeMatcher.find()) {
            Map<String,Object> node = new HashMap<>();
            String alias = nodeMatcher.group().split(":")[0].trim();
            node.put(Properties.ALIAS.getProp(), alias);

            /*
                if exists node label
             */
            if (nodeMatcher.group().split(":").length > 1) {
                String label = nodeMatcher.group().split(":")[1].trim();
                node.put(Properties.IDX.getProp(),   label);
                node.put(Properties.LABEL.getProp(), new String[]{label});
            }

            ((Map<String,Object>)params.get(Properties.NODES.getProp())).put(alias, node);
        }

        // for find edge
        Pattern edgePattern = Pattern.compile("(?<=\\[).*?(?=])");
        Matcher edgeMatcher = edgePattern.matcher(matchClause);

        // make edge data
        while (edgeMatcher.find()) {
            Map<String,Object> edge = new HashMap<>();

            /*
                if exists edge label
             */
            if (edgeMatcher.group().split(":").length > 1) {
                edge.put(Properties.LABEL.getProp(), new String[]{edgeMatcher.group().split(":")[1].trim()});
            } else {
                String alias = edgeMatcher.group().split(":")[0].trim();
                Pattern asteriskPattern = Pattern.compile("(\\*)");
                Matcher asteriskMatcher = asteriskPattern.matcher(alias);

                while (asteriskMatcher.find()) {
                    edge.put(Properties.ASTERISK.getProp(), true);
                }
                edge.put(Properties.ALIAS.getProp(), alias.replaceAll("\\*", ""));
            }

            ((Map<String,Object>)params.get(Properties.EDGES.getProp()))
                    .put(edgeMatcher.group().split(":")[0].trim().replaceAll("\\*", ""), edge);
        }

        /*
          source node select
           (source) -[]-> (target)
           (target) <-[]- (source)
         */
        List<Pattern> sourcePatterns = new ArrayList<>(){{
            add(Pattern.compile("(?i)(?=\\().+?(?=-).+?(?>->)"));
            add(Pattern.compile("(?i)(?=<-).+?(?=-).+?(?>\\))"));
        }};

        for (Pattern sourcePattern : sourcePatterns) {
            Matcher sourcePatternMatcher = sourcePattern.matcher(matchClause);

            while (sourcePatternMatcher.find()) {
                // 패턴에서 소스를 발라내기 위함
                Matcher sourceMatcher = nodePattern.matcher(sourcePatternMatcher.group());

                while (sourceMatcher.find()) {
                    Map<String,Object> node = (Map<String,Object>)((Map<String,Object>)params.get("nodes")).get(sourceMatcher.group().split(":")[0].trim());
                    node.put(Properties.SOURCE.getProp(), true);
                }
            }
        }

        return params;
    }

    /**
     * WHERE clause 해석기
     * Method.invoke 수행
     *
     * @param whereClause WHERE 문장
     * @param params 노드, 엣지 정보
     * @return WHERE clause 내용에서 알 수 있는 정보를 추가한 노드, 엣지 정보
     */
    private Map<String,Object> parseWhere(String whereClause, Map<String,Object> params) {
        Pattern wherePattern = Pattern.compile(String.format("(?i)(?<=%s).+?$", CypherKeywords.WHERE));
        Matcher whereMatcher = wherePattern.matcher(whereClause);

        while (whereMatcher.find()) {
            String where = whereMatcher.group();
            List<String> conditions = Arrays.stream(this.splitByKeyword(where)).map(String::trim).collect(Collectors.toList());

            for (String condition : conditions) {
                List<String> conditionTokens = OperatorAdvanced.COMPARE.parse2operator(condition);
                Object value = this.handleWhereValue(conditionTokens.get(1));
                String[] conditionName = conditionTokens.get(0).trim().split("\\.");
                String alias = conditionName[0];
                String column = conditionName[1];

                Map<String,Object> node = (Map<String,Object>) ((Map<String,Object>)params.get("nodes")).get(alias);

                node.computeIfAbsent(Properties.CONDITION.getProp(), k -> new ArrayList<>());
                ((List<Map<String,Object>>)node.get(Properties.CONDITION.getProp())).add(new HashMap<>() {{
                    put(Properties.COLUMN.getProp(),   column);
                    put(Properties.VALUE.getProp(),    value);
                    put(Properties.OPERATOR.getProp(), OperatorAdvanced.COMPARE.getPresentOperator());
                }});
            }
        }

        return params;
    }

    /**
     * RETURN clause 해석기
     * Method.invoke 수행
     * 
     * @param returnClause RETURN 문장
     * @param params 노드, 엣지 정보
     * @return RETURN clause 파싱결과 / 알 수 있는 정보가 추가된 노드, 엣지 정보
     */
    private Map<String,Object> parseReturn(String returnClause, Map<String,Object> params) {
        Pattern returnPattern = Pattern.compile(String.format("(?i)(?<=%s).+?$", CypherKeywords.RETURN));
        Matcher returnMatcher = returnPattern.matcher(returnClause);

        while (returnMatcher.find()) {
            String returnStr = returnMatcher.group().trim();
            
            if (returnStr.contains(".") && returnStr.contains(",")) {
                // 컬럼 여러 개 인 경우
                List<String> li = new ArrayList<>();
                Map<String,Object> aliasMapper = new HashMap<>();

                for (String commaSplit : returnStr.split(",")) {
                    commaSplit = commaSplit.trim();

                    String[] aliasSplit = commaSplit.split(String.format("(?i)\\s(%s)\\s|(\\s)", ReturnKeywords.AS));
                    String[] splitReturnStr = aliasSplit[0].split("\\.");
                    Map<String,Object> node = (Map<String, Object>) ((Map<String,Object>)params.get("nodes")).get(splitReturnStr[0]);
                    li.add(splitReturnStr[1]);
                    node.put(ReturnType.PART.getType(), li);

                    if (aliasSplit.length > 1) {
                        aliasMapper.put(splitReturnStr[1], aliasSplit[1]);
                        node.put(ReturnKeywords.AS.getKeyword(), aliasMapper);
                    }
                }

            } else if (returnStr.contains(".") && !returnStr.contains(",")) {
                // 컬럼 하나 명시한 경우
                String[] aliasSplit = returnStr.split(String.format("(?i)\\s(%s)\\s|(\\s)", ReturnKeywords.AS));
                String[] splitReturnStr = aliasSplit[0].split("\\.");
                Map<String,Object> aliasMapper = new HashMap<>();

                Map<String,Object> node = (Map<String, Object>) ((Map<String,Object>)params.get("nodes")).get(splitReturnStr[0]);
                List<String> li = new ArrayList<>();
                li.add(splitReturnStr[1]);
                node.put(ReturnType.PART.getType(), li);

                if (aliasSplit.length > 1) {
                    aliasMapper.put(splitReturnStr[1], aliasSplit[1]);
                    node.put(ReturnKeywords.AS.getKeyword(), aliasMapper);
                }
            } else if (!returnStr.contains(".") && returnStr.contains(",")) {
                // alias 구성된 문장
                for (String commaSplit : returnStr.split(",")) {
                    Map<String,Object> node = (Map<String, Object>) ((Map<String,Object>)params.get("nodes")).get(commaSplit.trim());
                    node.put(ReturnType.ALL.getType(), ReturnType.ALL.getType());
                }
            } else {
                // 전체 조회
                Map<String,Object> node = (Map<String, Object>) ((Map<String,Object>)params.get("nodes")).get(returnStr);
                node.put(ReturnType.ALL.getType(), ReturnType.ALL.getType());
            }

        }
        return params;
    }

    private Map<String,Object> parseWith(String withClause, Map<String,Object> params) {
        return null;
    }

    private Map<String,Object> parseUnion(String withClause, Map<String,Object> params) {
        return null;
    }
}
