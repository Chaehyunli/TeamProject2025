FROM openjdk:17-jdk-slim
VOLUME /tmp
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar
COPY src/main/resources/service-key.json /app/credentials/service-key.json
ENTRYPOINT ["java","-jar","/app.jar"]

