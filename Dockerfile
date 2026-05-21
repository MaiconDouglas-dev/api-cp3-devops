FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copia o pom primeiro para cache
COPY pom.xml .

# Baixa dependências (cacheável enquanto pom.xml não muda)
RUN mvn -q -e -DskipTests dependency:go-offline

# Agora copia o código e compila
COPY src ./src
RUN mvn -q -e -DskipTests clean package

# Runtime (mais leve que JDK)
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Cria usuário não-root
RUN useradd -ms /bin/bash appuser
USER root
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
USER appuser

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]