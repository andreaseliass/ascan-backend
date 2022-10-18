const express = require('express');
const db = require('./database');

const app = express();

app.use(express.json());

app.post('/users', async (req, res) => {
    const { full_name } = req.body;

    const [ result ] = await db.execute('INSERT INTO users (full_name) VALUE (?)', [full_name]);

    return res.status(201).json(result);
} )

app.listen(3000);