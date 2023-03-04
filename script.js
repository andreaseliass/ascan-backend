const axios = require('axios');

// var a='Thiago Elias';
async function execute(a, user_id) {
    await axios.post('http://localhost:3000/users', {
        "full_name": a
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



function main (a, user_id){
    setTimeout(() => {
        execute(a, user_id);
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

main('Renata', 139);
  