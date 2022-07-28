const express = require('express');
const app = express();
const PORT = 65438;

app.use(express.static('public'));
let db = require('./connection.js');
let connection = db.pool;


app.get('/testing', (req, res) => {
    
    console.log(req.query)
    connection.query('INSERT INTO tester(name) VALUES ("Bob");', (err, rows, fields) => {
        if (err) {
            console.log(err)
        }
    });
    res.send('Hopefully it worked!');
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));