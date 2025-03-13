package com.example.teamproject2025;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TeamProject2025Application {
	public static void main(String[] args) {
		SpringApplication.run(TeamProject2025Application.class, args);
	}
}

/* 💡 Descriptions -> MainApplication.java 제거 : @dev_taehyun
*
* 	   Ref1. Spring Boot 에서 CommondLineRunner 가 없어도 정상적으로 실행됨
* 		     CommonadLineRunner 는 Application 이 실행된 후
* 			 특정 로직을 실행할 때 사용하는 것일 뿐, 필수적인 클래스가 아님
* 			 기존에는 run method 안에 비밀번호 해싱로직을 추가하려 했지만
* 			 이미 register API 에서 비밀번호를 해싱해서 저장하므로 무의미
* 			 -> 있을 의미가 없어져서 삭제했음
* */
