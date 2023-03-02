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