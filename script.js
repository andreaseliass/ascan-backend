const axios = require('axios');
const connection = require('./database');
const { faker } = require('@faker-js/faker');



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
                console.log('\n- Tentando criar outra subscription para usuário que já tem subscription')
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
    const name = faker.name.fullName(); 
    callback(name, user_id);
    return;
}

executando(main);
