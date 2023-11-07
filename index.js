const express = require('express');
const jsonwebtoken = require('jsonwebtoken');

const app = express();

const datas = require('./data.js');

// allow cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/auth', (req, res) => {
    // verify with a basic token
    let basicToken = req.headers?.authorization?.split(' ')[1];
    if (!basicToken && basicToken !== "a5c0104b-61eb-46e1-8ada-76ad88c5c456") res.status(401).json({
        message: 'Unauthorized'
    });
    let data = {
        name: 'Saravana Raja',
        email: 'saravanaraja@demo.com'
    };
    const token = jsonwebtoken.sign(data, "YOYOYOSARAVANARAJA");
    res.json({
        access_token: token
    });
});

function authMiddleware(req, res, next) {
    let token = req.headers?.authorization?.split(' ')[1];
    if (!token) res.status(401).json({
        message: 'Unauthorized'
    });
    try {
        let data = jsonwebtoken.verify(token, "YOYOYOSARAVANARAJA");
        req.user = data;
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Unauthorized'
        });
    }
}

app.get('/memberspayout', authMiddleware ,(req, res) => {
    res.json(datas).status(200);
});

// run the server
app.listen(4000, () => {
    console.log('server started');
});