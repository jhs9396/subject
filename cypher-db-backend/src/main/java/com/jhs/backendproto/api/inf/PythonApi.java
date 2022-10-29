package com.jhs.backendproto.api.inf;

import java.util.List;

public interface PythonApi {
    List<Integer> exec(Operator operator);
    Operator executor(Operator operator);
    String run(String script);
}
