const express = require('express');
const db = require('./database');
const amqp = require('amqplib/callback_api');
const connection = require('./database');

const app = express();

app.use(express.json());

app.post('/users', async (req, res) => {
    const { full_name } = req.body;

    const [ result ] = await db.execute('INSERT INTO users (full_name) VALUE (?)', [full_name]);

    return res.status(201).json(result);
} );


app.post('/subscriptions', async (req, res) => {
    const { user_id, status_id } = req.body;

    amqp.connect('amqp://admin:admin@localhost', (error0, connection) => {
        if (error0){ throw error0}
        connection.createChannel((error1, channel) => {
            if (error1){ throw error1}
            const queue = 'subscriptions';
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
    const { status_name } = req.body;

    const [ result ] = await db.execute('INSERT INTO subscriptions (full_name) VALUE (?)', [status_name]);

    return res.status(201).json(result);
} );


app.listen(3000);