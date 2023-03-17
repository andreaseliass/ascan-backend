const axios = require('axios');
const connection = require('./database');
const { faker } = require('@faker-js/faker');
const process = require('process');
const { exit } = require('process');
const readlineSync = require('readline-sync');




async function execute(name, user_id) {
    await axios.post('http://localhost:3000/users', {
        "full_name": name
    })
    await axios.post('http://localhost:3000/subscriptions/create', {
        "user_id": user_id
    })
    await axios.patch('http://localhost:3000/subscriptions/cancel', {
        "user_id": user_id
    })
    await axios.patch('http://localhost:3000/subscriptions/restart', {
        "user_id": user_id
     })
}

async function createforsameuser(user_id){
    await axios.post('http://localhost:3000/subscriptions/create', {
        "user_id": user_id
    })
}

async function cancelforsameuser(user_id){
    await axios.patch('http://localhost:3000/subscriptions/cancel', {
        "user_id": user_id
    })
}

async function restartforsameuser(user_id){
    await axios.patch('http://localhost:3000/subscriptions/restart', {
        "user_id": user_id
    })
}

function main (name, user_id){
    setTimeout(() => {
        execute(name, user_id);
        console.log('\n- Criando usuário, criando subscription, cancelando subscription e recuperando subscription')
      
        setTimeout(() => {
            restartforsameuser(user_id);
          console.log('\n- Recuperando novamente a mesma subscription')
      
          setTimeout(() => {
            cancelforsameuser(user_id);
            console.log('\n- Cancelando subscription')
      
            setTimeout(() => {
                cancelforsameuser(user_id);
              console.log('\n- Cancelando novamente a mesma subscription')
      
              setTimeout(() => {
                createforsameuser(user_id);
                console.log('\n- Tentando criar outra subscription para usuário que já tem subscription');
                process.exit();
              }, 800)
            }, 800)
          }, 800)
        }, 800)
      }, 0)

}

async function executando(callback){
    const [last_id]= await connection.query(
         'SELECT MAX(id) FROM users;'
    );
    
     var idfinal = Object.values(last_id[0])[0];
     user_id = idfinal+1;
     // if (!process.argv[2]){
     //     console.log('Digite o nome do usuário a ser criado!')
     //     process.exit(); 
     // }
     // var name = process.argv[2];

     var nomeuser = readlineSync.question('Digite o nome do usuario\n');
     console.log()
     if (nomeuser == ''){
            console.log('Digite o nome do usuário a ser criado!');
            return;

        }
        
     var name = nomeuser;
   
     callback(name, user_id);
}

async function criando_user(name){
    await axios.post('http://localhost:3000/users', {
        "full_name": name
    })
    const [last_id]= await connection.query(
        'SELECT MAX(id) FROM users;'
    );
   
    var idfinal = Object.values(last_id[0])[0];
    console.log(`Usuario ${name}, de id ${idfinal}, criado com sucesso!`);
    process.exit();
}

async function criando_assinatura(user_id){
    await axios.post('http://localhost:3000/subscriptions/create', {
        "user_id": user_id
    })
}

async function cancelando_assinatura(user_id){
    await axios.patch('http://localhost:3000/subscriptions/cancel', {
        "user_id": user_id
    })
}

async function recuperando_assinatura(user_id){
    await axios.patch('http://localhost:3000/subscriptions/restart', {
        "user_id": user_id
    })
}


   function init(){
    var readlineSync = require('readline-sync');
    var valor = readlineSync.question(' Seja bem vindo(a)!\n- Para uma rapida demonstracao do sistema digite 1;\n- Para criar um usuario digite 2;\n- Para criar uma assinatura digite 3;\n- Para cancelar uma assinatura digite 4;\n- Para recuperar uma assinatura digite 5;\n  Para sair, digite 0.\n');

    if (valor == 1){
        console.log('Script de demonstração:');
        executando(main);
    }else if (valor == 2){
       console.log('Criando um usuário');
       var nome = readlineSync.question('Digite o nome do usuario:\n');
       criando_user(nome);
   }else if (valor == 3){
       console.log('Criando uma assinatura');
       var id = readlineSync.question('Digite o id do usuario da assinatura a ser criada:\n');
       criando_assinatura(id);
   }else if (valor == 4){
       console.log('Cancelando uma assinatura');
       var id = readlineSync.question('Digite o id do usuario da assinatura a ser cancelada:\n');
       cancelando_assinatura(id);
   }else if (valor == 5){
       console.log('Recuperando uma assinatura');
       var id = readlineSync.question('Digite o id do usuario da assinatura a ser recuperada:\n');
       recuperando_assinatura(id);
   }else if (valor == 0){
       console.log('Saindo!');
       process.exit();  
   }else{
        console.log('Digite um valor de 0 a 5!');
       process.exit();  
   }
}
   

init();

