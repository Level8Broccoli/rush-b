# spring-boot-preact-skeleton

## Prerequisite

- Docker
- Docker Compose

## Start Development Environment

```shell
docker compose -f docker-compose.dev.yml up
```

- Frontend will be available through: `localhost:5173`
- Backend will be available through: `localhost:8080` ( + `/ws`)

## Start Production Environment

```shell
docker compose -f docker-compose.prod.yml up
```

- Bundled App will be available on port `8080`
