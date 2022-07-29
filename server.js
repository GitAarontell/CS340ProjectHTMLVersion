const express = require('express');
const app = express();
const PORT = 65438;

app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));

let db = require('./connection.js');
let connection = db.pool;

app.get('/customersinfo', (req, res) => {
    // send query through the connection
    connection.query('SELECT customer_id, name, email FROM Customers;', (err, results) => {
        if (err){
            res.status(500).json({error: err});
        }
        res.status(200).json(results);
    });
});

app.post('/testing', (req, res) => {
    
    console.log(req.body)
    connection.query('INSERT INTO tester(name) VALUES ("Bob");', (err) => {
        if (err) {
            console.log(err)
        }
    });
    res.send('Hopefully it worked!');
});

app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id);
    // connection.query('DELETE;', (err, rows, fields) => {

    // });
})

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));