package com.jhs.backendproto.elasticsearch.controller;

import com.jhs.backendproto.utils.logger.JestLoggerInjection;
import com.jhs.backendproto.common.header.CommonController;
import com.jhs.backendproto.elasticsearch.component.inf.ElasticSearchApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Elasticsearch API 컨트롤러
 */
@RequestMapping("/elasticsearch")
@RestController
public class ElasticSearchApiController extends CommonController {

    ElasticSearchApi elasticSearchApi;

    @Autowired
    public ElasticSearchApiController(
            ElasticSearchApi elasticSearchApi,
            ApplicationContext applicationContext,
            AutowireCapableBeanFactory autowireCapableBeanFactory,
            JestLoggerInjection jestLoggerInjection
    ) {
        super(applicationContext, autowireCapableBeanFactory, jestLoggerInjection);
        this.elasticSearchApi = elasticSearchApi;
    }

    @RequestMapping(value ="/source", method= RequestMethod.GET)
    public ResponseEntity<Map> getSource(@RequestParam Map<String,Object> params) {
        return new ResponseEntity<>(
                elasticSearchApi.getSource(
                        params.get("idx").toString(),
                        params.get("id").toString()),
                productHeaders(),
                HttpStatus.OK
        );
    }

    @RequestMapping(value ="/search", method= RequestMethod.POST)
    public ResponseEntity<?> getSearch(@RequestBody Map<String,Object> params) {
        return new ResponseEntity<>(
                elasticSearchApi.getSearch(
                        params.get("idx").toString(),
                        (Map<String,Object>)params.get("options")),
                productHeaders(),
                HttpStatus.OK
        );
    }

    @RequestMapping(value ="/indices", method= RequestMethod.POST)
    public ResponseEntity<?> getIndices() {
        return new ResponseEntity<>(
                elasticSearchApi.getIndices(),
                productHeaders(),
                HttpStatus.OK
        );
    }

    @RequestMapping(value ="/idx/keys", method= RequestMethod.POST)
    public ResponseEntity<?> getPropertyKeys(@RequestBody Map<String,Object> params) {
        return new ResponseEntity<>(
                elasticSearchApi.getPropertyKeys(params.get("idx").toString()),
                productHeaders(),
                HttpStatus.OK
        );
    }

    @RequestMapping(value ="/indices/meta", method= RequestMethod.POST)
    public ResponseEntity<?> getMetaByIndices(@RequestBody Map<String,Object> params) {
        return new ResponseEntity<>(
                elasticSearchApi.getMetaByIndices(params.get("idx").toString()),
                productHeaders(),
                HttpStatus.OK
        );
    }

    @RequestMapping(value ="/create", method= RequestMethod.POST)
    public ResponseEntity<?> createDocument(@RequestBody Map<String,Object> params) {
        return new ResponseEntity<>(
                elasticSearchApi.createDocument(
                        params.get("idx").toString(),
                        params.get("id").toString(),
                        (Map<String,Object>)params.get("params")),
                productHeaders(),
                HttpStatus.OK
        );
    }

    @RequestMapping(value ="/delete", method= RequestMethod.POST)
    public ResponseEntity<?> deleteDocument(@RequestBody Map<String,Object> params) {
        return new ResponseEntity<>(
                elasticSearchApi.deleteDocument(
                        params.get("idx").toString(),
                        params.get("id").toString()),
                productHeaders(),
                HttpStatus.OK
        );
    }
}
