const { query } = require('express');
const express = require('express');
const app = express();
const PORT = 65438;

app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));

let db = require('./connection.js');
let connection = db.pool;


// requests handlers
app.get('/customersinfo', (req, res) => {
    // send query through the connection
    connection.query('SELECT customer_id, name, email FROM Customers;', (err, results) => {
        if (err){
            res.status(500).json({error: err});
        }
        res.status(200).json(results);
    });
});

app.get('/customerData', (req,res) => {
    console.log(req.query);
    connection.query(`SELECT * FROM Customers WHERE name = "${req.query.customers}";`, (err, results) => {
        if (err){
            res.status(500).json({error: err});
        }
        res.status(200).json(results);
    });
})

app.post('/addEntity', (req, res) => {
    
    console.log(req.body);
    connection.query(`INSERT INTO Customers(name, email) VALUES("${req.body.dName}", "${req.body.dEmail}");`, (err) => {
        if (err) {
            res.status(500).json({error: err});
        }
    });
    res.status(200).json({OK: '200'});
});

app.delete('/delete/:id/:table', (req, res) => {
    connection.query(`DELETE FROM ${req.params.table} WHERE customer_id = ${req.params.id};`, (err) => {
        if (err){
            res.status(500).json({error: err});
        }
        res.status(200);
    });
})

app.put('/editCustomer', (req, res) => {
    console.log(req.params);
})

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));