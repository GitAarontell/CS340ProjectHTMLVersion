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

app.get('/getIDS/:table/:name', (req, res) => {
    connection.query(`SELECT id, ${req.params.name} FROM ${req.params.table};`, (err, results) => {
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
    connection.query("SELECT Deliveries.id, Drivers.name, Trucks.plate, F1.location as start_facility, F2.location as end_facility, Deliveries.total_volume, Deliveries.total_weight, Deliveries.late, Deliveries.departure_time, Deliveries.expected_arrival_time, Deliveries.actual_arrival_time FROM Deliveries JOIN Drivers ON Drivers.id = Deliveries.driver_id JOIN Facilities as F1 ON F1.id = Deliveries.start_facility_id JOIN Facilities as F2 ON F2.id = Deliveries.end_facility_id JOIN Trucks ON Trucks.id = Deliveries.truck_id GROUP BY Deliveries.id;", (err, results) => {
        if (err){
            res.status(500).json({error: err});
        }
        res.status(200).json(results);
    });
});

// Manage Delivery Requests
app.get('/search/select/Deliveries/:id', (req, res) => {
    // send query through the connection
    connection.query(`SELECT Deliveries.id, Drivers.name, Trucks.plate, F1.location as start_facility, F2.location as end_facility, Deliveries.total_volume, Deliveries.total_weight, Deliveries.late, Deliveries.departure_time, Deliveries.expected_arrival_time, Deliveries.actual_arrival_time FROM Deliveries JOIN Drivers ON Drivers.id = Deliveries.driver_id JOIN Facilities as F1 ON F1.id = Deliveries.start_facility_id JOIN Facilities as F2 ON F2.id = Deliveries.end_facility_id JOIN Trucks ON Trucks.id = Deliveries.truck_id WHERE Deliveries.id = ${req.params.id};`, (err, results) => {
        if (err){
            res.status(500).json({error: err});
        }
        res.status(200).json(results);
    });
});

function deliverAddObjProcess(obj) {
    temp = {}
    for (item in obj) {
        if (obj[item].length != ''){
            temp[item] = obj[item]
            
        }
    }
    console.log(temp)
    return temp
}

function deliverAddProcess(obj) {
    //'2022-07-10 09:00:00'
    string1 = 'INSERT INTO '
    string2 = ''
    count = 0
    console.log(Object.keys(obj).length)
    for (item in obj){
        if (count == 0) {
            string1 += obj[item] + '('
        }
        else if(count == Object.keys(obj).length - 1){
            string1 += item + ') VALUES ('
            console.log(string2)
            string2 += "'" + obj[item] + "');"
        }
        else if (obj[item].length != ''){
            string1 += item + ', '
            string2 += "'" + obj[item] + "', "
            //console.log(string2)
        }
        count += 1
    }
    string1 += string2
    return string1
}

app.post('/addDelivery', (req, res) => {
    connection.query(deliverAddProcess(deliverAddObjProcess(req.body)), (err, results) => {
        if (err) {
            res.status(500).json({error: err});
        }
        //console.log(results);
        res.status(200).json({id: results});
    });
});


// Manage Driver requests
app.get('/allDrivers', (req, res) => {
    // send query through the connection

    connection.query('SELECT Drivers.id as id, Drivers.name as name, Drivers.email as email, COUNT(LD.id) as late_deliveries, COUNT(ED.id) as early_deliveries FROM Drivers JOIN Deliveries AS LD ON LD.driver_id = Drivers.id AND LD.late=1 JOIN Deliveries AS ED ON ED.driver_id = Drivers.id AND ED.late=0;', (err, results) => {

        if (err){
            res.status(500).json({error: err});
        }
        res.status(200).json(results);
    });
});

app.put('/addDriver', (req, res) => {

    connection.query(`INSERT INTO Drivers (name, email) VALUES ("${req.body.name}", "${req.body.email}");`, (err, results) => {
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

let q = "SELECT Drivers.name as driver, Trucks.plate as plate, SUM(Orders.volume) as total_volume, SUM(Orders.weight) as total_weight, F1.name as start_facility, F2.name as end_facility, Deliveries.late as late_deliveries, Deliveries.expected_arrival_time as estimated_arrival_time, Deliveries.departure_time as departure_time, Deliveries.actual_arrival_time as actual_arrival_time FROM Deliveries JOIN Drivers ON Drivers.id = Deliveries.driver_id JOIN Trucks ON Trucks.id = Deliveries.truck_id JOIN Facilities AS F1 ON F1.id = Deliveries.start_facility_id JOIN Facilities AS F2 ON F2.id = Deliveries.end_facility_id JOIN DeliveryOrders ON DeliveryOrders.delivery_id = Deliveries.id JOIN Orders ON DeliveryOrders.order_id = Orders.id;"

/*
"SELECT Drivers.name as driver, Trucks.plate as plate, SUM(Orders.volume) as total_volume, SUM(Orders.weight) as total_weight, F1.name as start_facility, F2.name as end_facility, Deliveries.late as late_deliveries, Deliveries.expected_arrival_time as estimated_arrival_time, Deliveries.departure_time as departure_time, Deliveries.actual_arrival_time as actual_arrival_time FROM Deliveries
JOIN Drivers ON Drivers.id = Deliveries.driver_id
JOIN Trucks ON Trucks.id = Deliveries.truck_id
JOIN Facilities AS F1 ON F1.id = Deliveries.start_facility_id
JOIN Facilities AS F2 ON F2.id = Deliveries.end_facility_id
JOIN DeliveryOrders ON DeliveryOrders.delivery_id = Deliveries.id
JOIN Orders ON DeliveryOrders.order_id = Orders.id;"
*/
