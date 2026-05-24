# ⚔️ API Produtos — Arsenal de Berserk

API REST em **Java 21 + Spring Boot** para gerenciamento de **produtos (armamentos)**, com **persistência em MySQL** e execução via **Docker Compose**.

A aplicação inclui:
- CRUD completo de produtos
- Interface Web estática (servida pelo próprio Spring em `/`)
- Banco MySQL 8.0 via Docker
- Healthcheck via Spring Boot Actuator (`/actuator/health`)

---

## ✅ Tecnologias

- Java **21**
- Spring Boot **3.x**
- Spring Web
- Spring Data JPA (Hibernate)
- MySQL Connector/J
- Spring Boot Actuator
- Docker + Docker Compose

---

## 📦 Estrutura do projeto (resumo)

- `src/main/java/...` — API REST (Controller/Service/Repository/Model)
- `src/main/resources/application.properties` — configuração do datasource/actuator
- `src/main/resources/static/` — interface web (HTML/CSS/JS)
- `Dockerfile` — build e runtime da aplicação
- `docker-compose.yml` — sobe MySQL + aplicação

---

## 🌐 Endpoints da API

Base: `http://localhost:8080`

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/produtos` | Lista todos os produtos |
| `GET` | `/produtos/{id}` | Busca produto por ID |
| `POST` | `/produtos` | Cria um produto |
| `PUT` | `/produtos/{id}` | Atualiza um produto |
| `DELETE` | `/produtos/{id}` | Remove um produto |

### Exemplo de JSON (POST/PUT)

```json
{
  "nome": "Dragon Slayer",
  "descricao": "Massa de ferro pesada e bruta.",
  "preco": 15000,
  "quantidade": 1
}
```

---

## 🖥️ Interface Web

- URL: `http://localhost:8080/`

A interface é servida pelo próprio Spring Boot a partir de `src/main/resources/static`.

---

## ❤️ Healthcheck (Actuator)

- URL: `http://localhost:8080/actuator/health`

---

## 🐳 Executando com Docker Compose (recomendado)

### Pré-requisitos
- Docker Desktop (em **Linux containers / WSL2** no Windows)

### Subir o ambiente
Na raiz do projeto:

```bash
docker compose up --build
```

### Parar e remover containers
```bash
docker compose down
```

### Resetar o banco (apaga o volume e recria do zero)

> Use se você mudar schema/config e quiser “zerar” tudo.

```bash
docker compose down -v
docker compose up --build
```

---

## 🔌 Portas / Acessos

Após subir com:

```bash
docker compose up --build
```

A aplicação ficará disponível em:

- **Interface Web (frontend):** `http://localhost:8080/`
- **API REST (base):** `http://localhost:8080/produtos`
- **Healthcheck (Actuator):** `http://localhost:8080/actuator/health`
- **MySQL (acesso externo):** `localhost:3306`
  - Database: `cp3_devops`
  - User: `maicon`
  - Password: `rm5611279`

## 🗄️ Banco de Dados (MySQL)

O `docker-compose.yml` sobe um MySQL 8.0 com:

- Porta local: `3306`
- Database: `cp3_devops`
- User: `maicon`
- Password: `rm5611279`

> Dica: você pode conectar via DBeaver/MySQL Workbench em `localhost:3306`.

---

## ⚙️ Configuração (application.properties)

Arquivo: `src/main/resources/application.properties`

- A aplicação lê as variáveis do banco via environment (definidas no compose):
  - `MYSQL_HOST`
  - `MYSQL_PORT`
  - `MYSQL_DATABASE`
  - `MYSQL_USER`
  - `MYSQL_PASSWORD`

---

## 👨‍💻 Autores
Evellyn Ferreira  
RM: 562744

Herique S.Maran  
RM: 562977

Maicon Douglas  
RM: 561279  
Turma: 2TDSPW