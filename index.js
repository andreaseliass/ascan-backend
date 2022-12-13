const express = require('express');
const connection = require('./database');
const amqp = require('amqplib/callback_api');

const app = express();

app.use(express.json());

app.post('/users', async (req, res) => {
    const { full_name } = req.body;

    const  [ result ] = await db.execute('INSERT INTO users (full_name) VALUE (?)', [full_name]);
    // console.log(result);
    return res.status(201).json(result);
} );


app.post('/subscriptions', async (req, res) => {
    const { user_id, status_id } = req.body;

    amqp.connect('amqp://admin:admin@localhost', (error0, con) => {
        if (error0){ throw error0}
        con.createChannel((error1, channel) => {
            if (error1){ throw error1}
            const queue = 'SUBSCRIPTION_PURCHASED';
            var msg = JSON.stringify({ user_id, status_id });
            channel.assertQueue(queue, {
                durable: false,
              });
            channel.sendToQueue(queue, Buffer.from(msg));
            console.log(' [x] Sent %s', msg);
        })
    });

    // const [ result ] = await db.execute('INSERT INTO subscriptions (user_id, status_id) VALUE (?, ?)', [user_id, status_id]);

    // return res.status(201).json(result);

    return res.send('ok');
} );


app.patch('/subscriptions', async (req, res) => {
    const { user_id, status_id } = req.body;

    amqp.connect('amqp://admin:admin@localhost', (error0, con) => {
        if (error0){ throw error0}
        con.createChannel((error1, channel) => {
            if (error1){ throw error1}
            const queue = 'SUBSCRIPTION_RESTARTED';
            var msg = JSON.stringify({ user_id, status_id });
            channel.assertQueue(queue, {
                durable: false,
              });
            channel.sendToQueue(queue, Buffer.from(msg));
            console.log(' [x] Sent %s', msg);
        })
    });

    return res.send('ok');
} );

app.patch('/subscriptions', async (req, res) => {
    const { user_id, status_id } = req.body;

    amqp.connect('amqp://admin:admin@localhost', (error0, con) => {
        if (error0){ throw error0}
        con.createChannel((error1, channel) => {
            if (error1){ throw error1}
            const queue = 'SUBSCRIPTION_CANCELED';
            var msg = JSON.stringify({ user_id, status_id });
            channel.assertQueue(queue, {
                durable: false,
              });
            channel.sendToQueue(queue, Buffer.from(msg));
            console.log(' [x] Enviado %s', msg);
        })
    });

    return res.send('ok');
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
        console.log(' [x] Recebido %s', msg.content.toString());

        const { user_id, status_id } = JSON.parse(msg.content.toString());

        //verifica se o usuário já possui uma assinatura
        const [rows] = await connection.query(
          'SELECT * FROM subscriptions WHERE user_id = ?',
          [user_id]
        );

        if (rows.length > 0) {
          console.log('Usuário já possui uma assinatura');
          return;
        }

        await connection.beginTransaction ;
        try {
          await connection.query(
            'INSERT INTO subscriptions (user_id, status_id) VALUES (?, ?)',
            [user_id, status_id]
          );

          await connection.query(
            'INSERT INTO event_history (subscription_id, type) VALUES (?, ?)',
            [user_id, 'SUBSCRIPTION_PURCHASED']
          );
          await connection.commit();
        } catch (error) {
          await connection.rollback();
          throw error;
        }
      },
      { noAck: true }
    );

    //lê a fila SUBSCRIPTION_CANCELED
    ch.consume(
      'SUBSCRIPTION_CANCELED',
      async (msg) => {
        console.log(' [x] Recebido %s', msg.content.toString());
        //verifica se o usuário já possui uma assinatura, e se o status é diferente de 2

        const [rows] = await connection.query(
          'SELECT * FROM subscriptions WHERE user_id = ? AND status_id == 2',
          [user_id]
        );

        if (rows.length > 0) {
          console.log('Assinatura já foi cancelada');
          return;
        }

        const { user_id, status_id } = JSON.parse(msg.content.toString());
        await connection.beginTransaction();
        try {
            await connection.query(
            'UPDATE subscriptions SET status_id = ? WHERE user_id = ?',
            [status_id, user_id]
            );

            await connection.query(
            'INSERT INTO event_history (subscription_id, type) VALUES (?, ?)',
            [user_id, 'SUBSCRIPTION_CANCELED']
            );
            await connection.commit();
        } catch (error) {
          await connection.rollback();
          throw error;
        }
      },
      { noAck: true }
    );

    //lê a fila SUBSCRIPTION_RESTARTED
    ch.consume(
      'SUBSCRIPTION_RESTARTED',
      async (msg) => {
        console.log(' [x] Recebido %s', msg.content.toString());

        const { user_id, status_id } = JSON.parse(msg.content.toString());

        //verifica se o usuário já possui uma assinatura com o status restart
        const [rows] = await connection.query(
          'SELECT * FROM subscriptions WHERE user_id = ? AND status_id = ?',
          [user_id, status_id]
        );

        if (rows.length > 0) {
          console.log('Usuário já possui uma assinatura com o status restart');
          return;
        }

        await connection.beginTransaction();
        try {
            await connection.query(
            'UPDATE subscriptions SET status_id = ? WHERE user_id = ?',
            [status_id, user_id]
            );
            await connection.commit();
        } catch (error) {
          await connection.rollback();
          throw error;
        }
      },
      { noAck: true }
    );
  });
});


app.listen(3000);