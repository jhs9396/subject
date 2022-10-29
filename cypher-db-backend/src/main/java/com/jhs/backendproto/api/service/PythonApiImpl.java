package com.jhs.backendproto.api.service;

import com.jhs.backendproto.api.inf.Operator;
import com.jhs.backendproto.api.inf.PythonApi;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class PythonApiImpl implements PythonApi {

    private final static int MAX = 1000;
    private Operator operator;

    @Override
    public List<Integer> exec(Operator operator) {
        Random random = new Random();
        List<Integer> numbers = new ArrayList<>();
        numbers.add(random.nextInt(MAX));
        numbers.add(random.nextInt(MAX));
        numbers.add(operator.doOperation(numbers.get(0), numbers.get(1)));
        System.out.println("파이썬에서 자바를 실행하는거 아닌가??");
        return numbers;
    }

    @Override
    public Operator executor(Operator operator) {
        this.operator = operator;
        return operator;
    }

    public String run(String script) {
        if (operator != null) {
            System.out.println("operator >> " + operator);
        }
        return "";
    }
}
