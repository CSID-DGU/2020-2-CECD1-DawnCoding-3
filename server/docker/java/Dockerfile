FROM openjdk:12-jdk

MAINTAINER kimhyounjun <4whomtbts@gmail.com>

EXPOSE 8080
#ARG JAR_FILE=rna-0.0.1-SNAPSHOT.jar
ADD build/libs/rna-0.0.1-SNAPSHOT.jar rna-springboot.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/rna-springboot.jar"]
