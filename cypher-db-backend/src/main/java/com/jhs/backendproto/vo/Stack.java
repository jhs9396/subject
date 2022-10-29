package com.jhs.backendproto.vo;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class Stack {
    private List<String> internalList = new ArrayList<>();

    public void push(String element) {
        internalList.add(0, element);
    }

    public String pop() {
        return internalList.remove(0);
    }

    public List<String> getInternalList() {
        return internalList;
    }

    public String printPythonResult(List<Object> obj) {
        System.out.println("python >> " + obj);
        return obj.toString();
    }

    public String[] getAll() {
        return internalList.stream().collect(Collectors.toList()).toArray(String[]::new);
    }

    public void pushAll(List<String> elements) {
        for (String element : elements) {
            this.push(element);
        }
    }

    public Stack getStack() {
        return this;
    }
}
