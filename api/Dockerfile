#
# Build stage
#
FROM maven:3.8.4-jdk-11 AS build
COPY src /home/api/src
COPY pom.xml /home/api
RUN mvn -f /home/api/pom.xml clean package

#
# Package stage
#
FROM openjdk:11
COPY --from=build /home/api/target/api-1.0-SNAPSHOT.jar /usr/local/lib/api.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/usr/local/lib/api.jar"]