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

// Universal queries #########################################################
app.get('/getAll/:table', (req, res) => {
    // send query through the connection
    console.log(`SELECT * FROM ${req.params.table};`)
    connection.query(`SELECT * FROM ${req.params.table};`, (err, results) => {
        if (err){
            res.status(500).json({error: err});
        }
        res.status(200).json(results);
    });
})

app.get('/search/:table/:id', (req, res) => {
    connection.query(`SELECT * FROM ${req.params.table} WHERE id = "${req.params.id}";`, (err, results) => {
        if (err){
            res.status(500).json({error: err});
        }
        res.status(200).json(results);
    });
  })

app.delete('/delete/:table/:id', (req, res) => {
    connection.query(`DELETE FROM ${req.params.table} WHERE id = ${req.params.id};`, (err) => {
        if (err){
            res.status(500).json({error: err});
        }
        res.status(200);
    });
})

// processes data of any size attributes and turns into appropriate string
// can only be used with single entities and used for the universal edit
// for this to work properly the table has to be the first key and the id must be the last key
// in the json object
function processEditData(bodyObj) {
    string = ``
    count = 0
    for (prop in bodyObj){
        count += 1
        if (prop == 'table'){
            string += "UPDATE " + bodyObj[prop] + " SET "
        }
        else if (count == Object.keys(bodyObj).length - 1){
            string +=  prop + ' = ' + "'" + bodyObj[prop] + "' "
        }
        else if (prop == 'id'){
            string += 'WHERE id = ' + "'" + bodyObj[prop] + "';"
        }
        else{
            string +=  prop + ' = ' + "'" + bodyObj[prop] + "', "
        }
    }
    return string
}

app.put('/edit/:table', (req, res) => {
    // console.log(`UPDATE ${req.body.table} SET name = '${req.body.name}', email = '${req.body.email}' WHERE id = '${req.body.id}';`)
    connection.query(processEditData(req.body), (err) => {
        if (err) {
            res.status(500).json({error: err});
        }

    })
    res.status(200);
})

function processPostData(bodyObj) {
    string = ``
    string2 = ``
    count = 0
    for (prop in bodyObj){
        count += 1
        if (prop == 'table'){
            string += "INSERT INTO " + bodyObj[prop] + "("
        }
        else if (count == Object.keys(bodyObj).length){
            string += prop + ') VALUES('
            string2 += `"${bodyObj[prop]}");`
        }
        else{
            string += prop + ', '
            string2 += `"${bodyObj[prop]}", `
        }
    }
    string += string2
    return string
}

app.post('/add/:table', (req, res) => {
    console.log(processPostData(req.body))
    connection.query(processPostData(req.body), (err, results) => {
        if (err) {
            res.status(500).json({error: err});
        }
        console.log(results);
        console.log(results.OkPacket);
        res.status(200).json({id: results});
    });
});
// Universal queries #########################################################

app.get('/customerByName/:name', (req,res) => {
  var name = req.params.name;
  connection.query(`SELECT * FROM Customers WHERE name = "${name}";`, (err, results) => {
      if (err){
          res.status(500).json({error: err});
      }
      res.status(200).json(results);
  });
});

app.post('/addCustomer', (req, res) => {

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

app.delete('/deleteCustomer/:id', (req, res) => {
    connection.query(`DELETE FROM Customers WHERE id = ${req.params.id};`, (err) => {
        if (err){
            res.status(500).json({error: err});
        }
        res.status(200);
    });
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


// Manage Driver requests
app.get('/allDrivers', (req, res) => {
    // send query through the connection
    connection.query('SELECT * FROM Drivers;', (err, results) => {
        if (err){
            res.status(500).json({error: err});
        }
        res.status(200).json(results);
    });
});

app.put('/addDriver', (req, res) => {

    connection.query(`INSERT INTO Drivers (name, email, late_deliveries, early_deliveries) VALUES ("${req.body.name}", "${req.body.email}", "${req.body.ld}", "${req.body.ed}");`, (err, results) => {
        if (err) {
            res.status(500).json({error: err});
        }
        //console.log(results);
        res.status(200).json({id: results});
    });
});

app.delete('/deleteDriver/:id', (req, res) => {
    connection.query(`DELETE FROM Drivers WHERE driver_id = ${req.params.id};`, (err) => {
        if (err){
            res.status(500).json({error: err});
        }
        res.status(200);
    });
})


app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
