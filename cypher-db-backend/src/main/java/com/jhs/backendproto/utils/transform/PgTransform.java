package com.jhs.backendproto.utils.transform;

import lombok.extern.slf4j.Slf4j;
import org.postgresql.util.PGobject;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * class for PG Object handling
 */
@Slf4j
public class PgTransform {
    public List<Map<String,Object>> transformPgObject(Map<String, Object>[] datum) {
        List<Map<String,Object>> res = new ArrayList<>();
        for (Map<String, Object> map : datum) {
            Map<String,Object> data = new HashMap<>();
            for (Map.Entry<String, Object> entry : map.entrySet()) {
                if (entry.getValue() instanceof Map) {
                    PGobject object = new PGobject();
                    object.setType("json");
                    try {
                        object.setValue((String) entry.getValue());
                    } catch (SQLException e) {
                        log.error("bulk execute sql exception >> " + e.getMessage());
                    }
                    data.put(entry.getKey(), object);
                } else {
                    data.put(entry.getKey(), entry.getValue());
                }
            }
            res.add(data);
        }
        return res;
    }

}
