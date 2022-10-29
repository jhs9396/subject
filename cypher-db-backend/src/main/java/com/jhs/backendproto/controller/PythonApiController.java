package com.jhs.backendproto.controller;

import com.jhs.backendproto.api.inf.PythonApi;
import com.jhs.backendproto.utils.python.PythonGateway;
import com.jhs.backendproto.vo.Stack;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/python")
public class PythonApiController {
    PythonGateway pythonGateway;
    PythonApi pythonApi;


    /**
     * API Header 셋팅 메소드
     * @return 기본값 http 헤더
     */
    public final HttpHeaders productHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("product.name",    "jhs");
        headers.add("product.version", "1.0");
        return headers;
    }

    @Autowired
    public PythonApiController(PythonGateway pythonGateway, PythonApi pythonApi) {
        this.pythonGateway = pythonGateway;
        this.pythonApi = pythonApi;
    }

    @RequestMapping(value = "/conn", method = RequestMethod.POST)
    public ResponseEntity<?> doStart(Map<String,Object> params) {
        pythonGateway.run(new Stack());
        return new ResponseEntity<>(true, productHeaders(), HttpStatus.OK);
    }

    @RequestMapping(value = "/stop", method = RequestMethod.POST)
    public ResponseEntity<?> doStop(Map<String,Object> params) {
        pythonGateway.stop();
        return new ResponseEntity<>(true, productHeaders(), HttpStatus.OK);
    }

    @RequestMapping(value = "/run", method = RequestMethod.POST)
    public ResponseEntity<?> doScript(@RequestBody Map<String,Object> params) {
        pythonApi.run(params.get("script").toString());
        return new ResponseEntity<>(true, productHeaders(), HttpStatus.OK);
    }
}
