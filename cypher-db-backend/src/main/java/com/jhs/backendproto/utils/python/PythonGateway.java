package com.jhs.backendproto.utils.python;

import org.springframework.stereotype.Component;
import py4j.GatewayServer;

@Component
public class PythonGateway {
    private GatewayServer gatewayServer;

    private GatewayServer connectionServer(Object className) {
        if (gatewayServer == null) {
            gatewayServer = new GatewayServer(className);
        }

        return gatewayServer;
    }

    private void connectionServer() {
        gatewayServer.start();
    }

    public void run(Object className) {
        connectionServer(className);
        connectionServer();
    }

    public void stop() {
        if (gatewayServer != null) {
            gatewayServer.serverStopped();
        }
    }

    public String exec(String script) {
        System.out.println("script >> " + script);
        return "";
    }
}
