package com.example.teamproject2025;

import lombok.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;

@SpringBootApplication
public class TeamProject2025Application {

	public static void main(String[] args) {
		SpringApplication.run(TeamProject2025Application.class, args);
	}

}

//@Component
//public class RedisConfigLogger implements CommandLineRunner {
//
//	@Value("${spring.data.redis.host}")
//	private String redisHost;
//
//	@Value("${spring.data.redis.port}")
//	private int redisPort;
//
//	@Override
//	public void run(String... args) {
//		System.out.println("Redis Host: " + redisHost);
//		System.out.println("Redis Port: " + redisPort);
//	}
//}
