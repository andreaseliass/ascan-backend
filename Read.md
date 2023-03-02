# Projeto Node

## Primeiro uso:

1. `npm install`
2. `docker-compose up -d`
3. Acesse `localhost:8080`, preencha o login com "root" e senha com "example"
4. Clique à esquerda em "comando SQL"
5. Copie o conteúdo do arquivo seed.sql, cole no campo de comando e execute

## Iniciar o projeto:

1. `docker-compose up -d`
2. `npm run start`

## Para mexer no banco de dados:

1. `docker exec -it projetobackend-db-1 bash -l`
2. `mysql -u root -p`

## Git flow:

1. `git flow feature start`
2. `git checkout feature/nomedafeature`

## URLs úteis:

- RabbitMQ: http://localhost:15672/ (login: admin / senha: admin)
- Aplicação: http://localhost:3000/
- Banco de dados: http://localhost:8080/
