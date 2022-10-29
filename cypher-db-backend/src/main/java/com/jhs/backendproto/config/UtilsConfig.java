package com.jhs.backendproto.config;

import com.jhs.backendproto.utils.handler.CypherHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UtilsConfig {

    @Bean(name="cypherHandler")
    public CypherHandler cypherHandler() {
        return new CypherHandler();
    }

}
