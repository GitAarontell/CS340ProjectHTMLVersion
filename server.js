const { query } = require('express');
const express = require('express');
const app = express();
const PORT = 65438;

app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

let db = require('./connection.js');
let connection = db.pool;

//declare Queries

// requests handlers

//Drop down menu requests
app.get('/driverNames', (req,res) => {
  var name = req.params.name;
  connection.query(`SELECT name FROM Drivers;`, (err, results) => {
      if (err){
          res.status(500).json({error: err});
      }
      res.status(200).json(results);
  });
});

app.get('/truckPlates', (req,res) => {
  var name = req.params.name;
  connection.query(`SELECT plate FROM Trucks;`, (err, results) => {
      if (err){
          res.status(500).json({error: err});
      }
      res.status(200).json(results);
  });
});

app.get('/facilityNames', (req,res) => {
  var name = req.params.name;
  connection.query(`SELECT name FROM Facilities;`, (err, results) => {
      if (err){
          res.status(500).json({error: err});
      }
      res.status(200).json(results);
  });
});

// Manage Customer Requests
app.get('/allCustomers', (req, res) => {
    // send query through the connection
    connection.query('SELECT customer_id, name, email FROM Customers;', (err, results) => {
        if (err){
            res.status(500).json({error: err});
        }
        res.status(200).json(results);
    });
});

app.get('/customerByName/:name', (req,res) => {
  var name = req.params.name;
  connection.query(`SELECT * FROM Customers WHERE name = "${name}";`, (err, results) => {
      if (err){
          res.status(500).json({error: err});
      }
      res.status(200).json(results);
  });
});

app.put('/addCustomer', (req, res) => {

    connection.query(`INSERT INTO Customers(name, email) VALUES("${req.body.name}", "${req.body.email}");`, (err, results) => {
        if (err) {
            res.status(500).json({error: err});
        }
        console.log(results);
        console.log(results.OkPacket);
        res.status(200).json({id: results});
    });


});

app.put('/editCustomer', (req, res) => {
    console.log(req.body);
    console.log(`UPDATE ${req.body.table} SET name = '${req.body.name}', email = '${req.body.email}' WHERE customer_id = '${req.body.id}';`)
    connection.query(`UPDATE ${req.body.table} SET name = '${req.body.name}', email = '${req.body.email}' WHERE customer_id = '${req.body.id}';`, (err) => {
        if (err) {
            res.status(500).json({error: err});
        }

    })
    res.status(200);
})

// Manage Delivery Requests
app.get('/allDeliveries', (req, res) => {
    // send query through the connection
    connection.query('SELECT Drivers.name as driver, Trucks.plate as plate, SUM(Orders.volume) as totVol, SUM(Orders.weight) as totWgt, F1.name as sf, F2.name as ef, Deliveries.late as late, Deliveries.expected_arrival_time as eat, Deliveries.departure_time as dt, Deliveries.actual_arrival_time as aat FROM Deliveries JOIN Drivers ON Drivers.driver_id = Deliveries.driver_id JOIN Trucks ON Trucks.truck_id = Deliveries.truck_id JOIN Facilities AS F1 ON F1.facility_id = Deliveries.start_facility_id JOIN Facilities AS F2 ON F2.facility_id = Deliveries.end_facility_id JOIN DeliveryOrders ON DeliveryOrders.delivery_id = Deliveries.delivery_id JOIN Orders ON DeliveryOrders.order_id = Orders.order_id;', (err, results) => {
        if (err){
            res.status(500).json({error: err});
        }
        console.log(results);
        res.status(200).json(results);
    });
});

app.put('/addDelivery', (req, res) => {

    connection.query(`INSERT INTO Deliveries (departure_time, expected_arrival_time, actual_arrival_time, total_volume, total_weight, truck_id, driver_id, start_facility_id, end_facility_id) VALUES ("${req.body.dt}", "${req.body.eat}", "${req.body.aat}", "${req.body.totVol}", "${req.body.totWgt}", SELECT truck_id FROM Trucks WHERE plate="${req.body.plate}" LIMIT 1, SELECT driver_id FROM Drivers WHERE name="${req.body.name}" LIMIT 1, SELECT facility_id FROM Facilities WHERE name="${req.body.name}" LIMIT 1, SELECT facility_id FROM Facilites WHERE name="${req.body.ef}" LIMIT 1);`, (err, results) => {
        if (err) {
            res.status(500).json({error: err});
        }
        //console.log(results);
        res.status(200)//.json(0);
    });
});


app.delete('/delete/:id/:table', (req, res) => {
    connection.query(`DELETE FROM ${req.params.table} WHERE customer_id = ${req.params.id};`, (err) => {
        if (err){
            res.status(500).json({error: err});
        }
        res.status(200);
    });
})



app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
