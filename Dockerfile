FROM maven:3.9.9-eclipse-temurin-21 AS build

# Metadados da imagem
LABEL maintainer="Maicon Douglas"
LABEL version="1.0"
LABEL description="API Java com Spring Boot"

# Argumento usado no build
ARG APP_NAME=app-produto

# Diretório de trabalho
WORKDIR /app

# Variáveis de ambiente do banco
ENV MYSQL_HOST=mysql
ENV MYSQL_PORT=3306
ENV MYSQL_USER=maicon
ENV MYSQL_PASSWORD=rm5611279

# Copia o pom primeiro para aproveitar cache
COPY pom.xml .

# Copia os arquivos fonte
ADD src ./src

# Baixa dependências
RUN mvn dependency:go-offline

# Gera o jar
RUN mvn clean package -DskipTests


FROM eclipse-temurin:21-jdk-jammy

# Metadados
LABEL application="app-produto"

# Argumento
ARG APP_NAME=app-produto

# Variáveis de ambiente do banco
ENV MYSQL_HOST=mysql
ENV MYSQL_PORT=3306
ENV MYSQL_USER=maicon
ENV MYSQL_PASSWORD=rm5611279

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# Volume para logs
VOLUME /app/logs

EXPOSE 8080

# Cria usuário do container
RUN useradd -ms /bin/bash rm561928

# Define usuário
USER rm561928

CMD ["java", "-jar", "app.jar"]

ENTRYPOINT ["java", "-jar", "app.jar"]