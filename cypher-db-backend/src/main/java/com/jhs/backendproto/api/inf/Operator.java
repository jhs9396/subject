package com.jhs.backendproto.api.inf;

public interface Operator {
    int doOperation(int i, int j);
    int doOperation(int i, int j, int k);
    String execute(String script);
}
