package com.jhs.backendproto.controller;

import com.jhs.backendproto.dao.GenericDao;
import com.jhs.backendproto.utils.logger.JestLoggerInjection;
import com.jhs.backendproto.common.header.CommonController;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * 데이터베이스 질의문 API 컨트롤러
 * 업무 요건에 따른 쿼리 작성 후 질의를 위함
 * 범용성을 갖기 위해 쿼리 이외의 모듈은 공통화
 *
 * @author jhs
 * @since 2021.05
 */
@RestController
@RequestMapping("/")
public class QueryController extends CommonController {

    public QueryController(
            ApplicationContext applicationContext,
            AutowireCapableBeanFactory autowireCapableBeanFactory,
            JestLoggerInjection jestLoggerInjection
    ) {
        super(applicationContext, autowireCapableBeanFactory, jestLoggerInjection);
    }

    /**
     *
     * @param params
     * @return
     */
    @RequestMapping(value = "/query", method = RequestMethod.POST)
    public ResponseEntity<List<Map<String, Object>>> doQuery(@RequestBody Map<String,Object> params) {
        GenericDao dao = getDaoByName(params.get("daoName").toString());
        List<Map<String,Object>> res = dao.executeGenericQuery(params);
        return new ResponseEntity<>(res, productHeaders(), HttpStatus.OK);
    }

    /**
     *
     * @param params
     * @return
     */
    @RequestMapping(value = "/query/cypher", method = RequestMethod.POST)
    public ResponseEntity<List<Map<String, Object>>> doCypherQuery(@RequestBody Map<String,Object> params) {
        GenericDao dao = getDaoByName(params.get("daoName").toString());
        List<Map<String,Object>> res = dao.executeCypherQuery(params);
        return new ResponseEntity<>(res, productHeaders(), HttpStatus.OK);
    }

    /**
     *
     * @param params
     * @return
     */
    @RequestMapping(value = "/execute", method = RequestMethod.POST)
    public ResponseEntity<Object> doExecute(@RequestBody Map<String,Object> params) {
        GenericDao dao = getDaoByName(params.get("daoName").toString());
        Object res = dao.execute(params);
        return new ResponseEntity<>(res, productHeaders(), HttpStatus.OK);
    }

    /**
     *
     * @param params
     * @return
     */
    @RequestMapping(value = "/bulk/execute", method = RequestMethod.POST)
    public ResponseEntity<Object> doBulkExecute(@RequestBody Map<String,Object> params) {
        GenericDao dao = getDaoByName(params.get("daoName").toString());
        Object res = dao.bulkExecute(params);
        return new ResponseEntity<>(res, productHeaders(), HttpStatus.OK);
    }
}
