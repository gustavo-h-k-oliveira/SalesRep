package org.company;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class App {

    private static final Logger logger = LoggerFactory.getLogger(App.class);

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(App.class);
        Environment env = app.run(args).getEnvironment();
        String port = env.getProperty("local.server.port");
        String actualPort = port != null ? port : env.getProperty("server.port", "8080");
        logger.info("Application started at http://localhost:{}", actualPort);
    }

    public String getGreeting() {
        return "Hello World!";
    }
}
