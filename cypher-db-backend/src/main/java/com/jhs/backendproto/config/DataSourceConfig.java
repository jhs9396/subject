package com.jhs.backendproto.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {
    @Bean(name="agensDataSource")
    @ConfigurationProperties("spring.datasource.hikari.agens")
    public DataSource agensSource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }
    @Bean(name="agensJdbcTemplate")
    public JdbcTemplate agensJdbcTemplate(@Qualifier("agensDataSource")DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

    @Bean(name="postgresDataSource")
    @ConfigurationProperties("spring.datasource.hikari.pg")
    public DataSource postgresDataSource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }

    @Bean(name="postgresJdbcTemplate")
    public NamedParameterJdbcTemplate postgresJdbcTemplate(@Qualifier("postgresDataSource") DataSource dataSource) {
        return new NamedParameterJdbcTemplate(dataSource);
    }
}
