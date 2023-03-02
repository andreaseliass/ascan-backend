Primeiro uso:
1. npm install
2. docker-compose up -d
3. ir em localhost:8080, preencher login com "root" e senha com "example"
4. clicar à esquerda em "comando SQL"
5. copiar o que está em seed, colar e executar


Iniciar o projeto:
1. docker-compose up -d
2. npm run start


Para mexer no banco de dados:
1. docker exec -it projetobackend-db-1 bash -l
2. mysql -u root -p

git flow:
git flow feature start
git checkout feature/nomedafeature


http://localhost:15672/ - rabbitmq - login: admin / senha: admin
http://localhost:3000/ - aplicação
http://localhost:8080/ - banco de dados

Documentação das notificações

- Criar usuário
Postman:
1. POST - http://localhost:3000/users
2. Body
3. Seleciona raw e JSON
4. Requisição:
{
    "full_name": "nome da pessoa"
}

Tipos de Notificações:

- Criar subscrição (SUBSCRIPTION_PURCHASED - A Compra foi realizada e a assinatura deve estar com status ativa).
1. POST - http://localhost:3000/subscriptions/create
2. Body
3. Seleciona raw e JSON
4. Requisição:
{
    "user_id": 2,
}
- Cancelar subscrição (SUBSCRIPTION_CANCELED - A Compra foi cancelada e a assinatura deve estar com status cancelada).
- Criar subscrição (SUBSCRIPTION_PURCHASED - A Compra foi realizada e a assinatura deve estar com status ativa).
1. POST - http://localhost:3000/subscriptions/cancel
2. Body
3. Seleciona raw e JSON
4. Requisição:
{
    "user_id": 2,
}

- Subscrição recuperada (SUBSCRIPTION_RESTARTED - A Compra foi recuperada e a assinatura deve estar com status ativa).
- Cancelar subscrição (SUBSCRIPTION_CANCELED - A Compra foi cancelada e a assinatura deve estar com status cancelada).
- Criar subscrição (SUBSCRIPTION_PURCHASED - A Compra foi realizada e a assinatura deve estar com status ativa).
1. POST - http://localhost:3000/subscriptions/restart
2. Body
3. Seleciona raw e JSON
4. Requisição:
{
    "user_id": 2,
}

FIM