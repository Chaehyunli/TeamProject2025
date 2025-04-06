# 1. OpenJDK 기반 이미지 사용
FROM openjdk:17-jdk-slim

# 2. JAR 파일 복사
COPY build/libs/*.jar app.jar

# 3. 실행 명령어
ENTRYPOINT ["java", "-jar", "/app.jar"]
