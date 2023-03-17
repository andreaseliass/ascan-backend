const express = require('express');
const connection = require('./database');
const amqp = require('amqplib/callback_api');
const app = express();

app.use(express.json());

app.post('/users', async (req, res) => {
    const { full_name } = req.body;

    const  [ result ] = await connection.execute('INSERT INTO users (full_name) VALUE (?)', [full_name]);
    return res.status(201).json(result);
} );

app.post('/subscriptions/create', async (req, res) => {
    const { user_id } = req.body;

    amqp.connect('amqp://admin:admin@localhost', (error0, con) => {
        if (error0){ throw error0}
        con.createChannel((error1, channel) => {
            if (error1){ throw error1}
            const queue = 'SUBSCRIPTION_PURCHASED';
            var msg = JSON.stringify({ user_id, status_id: 1 });
            channel.assertQueue(queue, {
                durable: false,
              });
            channel.sendToQueue(queue, Buffer.from(msg));
            console.log('Create - [x] Enviado %s', msg);
        })
    });

    return res.send('Subscrição Criada');
} );

app.patch('/subscriptions/restart', async (req, res) => {
    const { user_id } = req.body;

    amqp.connect('amqp://admin:admin@localhost', (error0, con) => {
        if (error0){ throw error0}
        con.createChannel((error1, channel) => {
            if (error1){ throw error1}
            const queue = 'SUBSCRIPTION_RESTARTED';
            var msg = JSON.stringify({ user_id, status_id: 3 });
            channel.assertQueue(queue, {
                durable: false,
              });
            channel.sendToQueue(queue, Buffer.from(msg));
            console.log('Restart - [x] Enviado %s', msg);
        })
    });

    return res.send('Subscrição Recuperada');
} );

app.patch('/subscriptions/cancel', async (req, res) => {
    const { user_id } = req.body;

    amqp.connect('amqp://admin:admin@localhost', (error0, con) => {
        if (error0){ throw error0}
        con.createChannel((error1, channel) => {
            if (error1){ throw error1}
            const queue = 'SUBSCRIPTION_CANCELED';
            var msg = JSON.stringify({ user_id, status_id: 2 });
            channel.assertQueue(queue, {
                durable: false,
              });
            channel.sendToQueue(queue, Buffer.from(msg));
            console.log('Cancel - [x] Enviado %s', msg);
        })
    });

    return res.send('Subscrição Cancelada');
} );

amqp.connect('amqp://admin:admin@localhost:5672', (err, con) => {
    con.createChannel((err, ch) => {
    ch.assertQueue('SUBSCRIPTION_PURCHASED', { durable: false });
    ch.assertQueue('SUBSCRIPTION_CANCELED', { durable: false });
    ch.assertQueue('SUBSCRIPTION_RESTARTED', { durable: false });

    console.log(' [*] Esperando pelas mensagens. Para sair pressione CTRL+C');

    //lê a fila SUBSCRIPTION_PURCHASED
    ch.consume(
      'SUBSCRIPTION_PURCHASED',
      async (msg) => {
        console.log('Create - [x] Recebido %s', msg.content.toString());

        const { user_id, status_id } = JSON.parse(msg.content.toString());

        //verifica se o usuário já possui uma assinatura
        const [rows]= await connection.query(
          'SELECT * FROM subscriptions WHERE user_id = ?',
          [user_id]
        );

        if (rows.length > 0) {
          console.log('-------------------------------------------------------\nUsuário já possui uma assinatura\n-------------------------------------------------------');
          return;
        }else{
          console.log('-------------------------------------------------------\nAssinatura criada com sucesso\n-------------------------------------------------------');
        }
        
        connection.getConnection().then(async (connection) =>{
          connection.beginTransaction() ;
          try {
            connection.query(
              'INSERT INTO subscriptions (user_id, status_id) VALUES (?, ?)',
              [user_id, status_id]
            );
                

          const [subid]= await connection.query(
            'SELECT * FROM subscriptions WHERE user_id = ?',
            [user_id]
          );
          const subscription_id = subid[0].id;

            connection.query(
              'INSERT INTO event_history (subscription_id, type) VALUES (?, ?)',
              [subscription_id, 'SUBSCRIPTION_PURCHASED']
            );
            connection.commit();
          } catch (error) {
            connection.rollback();
            throw error;
        }
        })
        
      },
      { noAck: true }
    );

    //lê a fila SUBSCRIPTION_CANCELED
    ch.consume(
      'SUBSCRIPTION_CANCELED',
      async (msg) => {
        console.log('Cancel - [x] Recebido %s', msg.content.toString());

        const { user_id, status_id } = JSON.parse(msg.content.toString());
        //verifica se o usuário já possui uma assinatura, e se o status é diferente de 2
        
        const [rows] = await connection.query(
          'SELECT * FROM subscriptions WHERE user_id = ? AND status_id = 2',
          [user_id]
        );

        if (rows.length > 0) {
          console.log('-------------------------------------------------------\nAssinatura já foi cancelada\n-------------------------------------------------------');
          return;
        }else{
          console.log('-------------------------------------------------------\nAssinatura cancelada com sucesso\n-------------------------------------------------------');
        }

        connection.getConnection().then(async (connection) =>{
          connection.beginTransaction();
          try {
              connection.query(
              'UPDATE subscriptions SET status_id = ? WHERE user_id = ?',
              [status_id, user_id]
              );

              const [subid]= await connection.query(
                'SELECT * FROM subscriptions WHERE user_id = ?',
                [user_id]
              );

              const subscription_id = subid[0].id;

              connection.query(
              'INSERT INTO event_history (subscription_id, type) VALUES (?, ?)',
              [subscription_id, 'SUBSCRIPTION_CANCELED']
              );
              connection.commit();
          } catch (error) {
            connection.rollback();
            throw error;
          }
        })
      },
      { noAck: true }
    );

    //lê a fila SUBSCRIPTION_RESTARTED
    ch.consume(
      'SUBSCRIPTION_RESTARTED',
      async (msg) => {
        console.log('Restart - [x] Recebido %s', msg.content.toString());

        const { user_id, status_id } = JSON.parse(msg.content.toString());

        //verifica se o usuário já possui uma assinatura com o status restart
        const [rows] = await connection.query(
          'SELECT * FROM subscriptions WHERE user_id = ? AND status_id = 3',
          [user_id]
        );

        if (rows.length > 0) {
          console.log('-------------------------------------------------------\n Usuário já possui uma assinatura com o status recuperada \n-------------------------------------------------------');
          return;
        }else{
          console.log('-------------------------------------------------------\nAssinatura recuperada com sucesso\n-------------------------------------------------------');
        }

        connection.getConnection().then(async (connection) =>{
          connection.beginTransaction();
          try {
              connection.query(
              'UPDATE subscriptions SET status_id = ? WHERE user_id = ?',
              [status_id, user_id]
              );

              const [subid]= await connection.query(
                'SELECT * FROM subscriptions WHERE user_id = ?',
                [user_id]
              );

              const subscription_id = subid[0].id;

              connection.query(
              'INSERT INTO event_history (subscription_id, type) VALUES (?, ?)',
              [subscription_id, 'SUBSCRIPTION_RESTARTED']
              );
              connection.commit();
          } catch (error) {
            connection.rollback();
            throw error;
          }
        })
      },
      { noAck: true }
    );
  });
});

app.listen(3000);