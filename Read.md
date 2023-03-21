* Primeiro uso:<br>
Logo após da clone no projeto, o usuário deve seguir os seguinte comandos:
1. no terminal, digitar o comando: npm install
2. no terminal, digitar o comando: docker-compose up -d
3. no navegador ir em localhost:8080, preencher login com "root" e senha com "example"
4. clicar à esquerda em "SQL command"(comando SQL)
5. copiar o conteúdo que está no arquivo que está em seed.sql, colar na caixa de comando SQL e clicar em executar
6. no terminal, digitar o comando: npm run start
7. abrir um segundo terminal e digitar o comando: node .\script.js
<br>
<br>

* Iniciar o projeto (após o primeiro uso):
1. no terminal, digitar o comando: docker-compose up -d
2. no terminal, digitar o comando: npm run start
3. abrir um segundo terminal e digitar o comando: node .\script.js
<br>
<br>

* Para mexer no banco de dados:
1. docker exec -it projetobackend-db-1 bash -l
2. mysql -u root -p
<br>
<br>

* Endereços<br>
http://localhost:15672/ - rabbitmq - login: admin / senha: admin<br>
http://localhost:8080/ - banco de dados - login: root /  senha: example
