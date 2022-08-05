
DROP TABLE IF EXISTS TruckDrivers;
DROP TABLE IF EXISTS DeliveryOrders;
DROP TABLE IF EXISTS Deliveries;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Trucks;
DROP TABLE IF EXISTS Drivers;
DROP TABLE IF EXISTS Facilities;
DROP TABLE IF EXISTS Customers;

CREATE OR REPLACE TABLE Customers (
  customer_id int NOT NULL AUTO_INCREMENT,
  name varchar(45) NOT NULL,
  email varchar(45) NOT NULL,

  PRIMARY KEY (customer_id)
);

CREATE OR REPLACE TABLE Facilities (
  facility_id int NOT NULL AUTO_INCREMENT,
  customer_id int,
  location varchar(45) NOT NULL,
  name varchar(45) NOT NULL,

  PRIMARY KEY (facility_id),
  FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE OR REPLACE TABLE Trucks (
  truck_id int NOT NULL AUTO_INCREMENT,
  current_facility_id int,
  plate varchar(7),
  max_weight int NOT NULL,
  max_volume int NOT NULL,

  PRIMARY KEY (truck_id),
  FOREIGN KEY (current_facility_id) REFERENCES Facilities(facility_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE OR REPLACE TABLE Drivers (
  driver_id int NOT NULL AUTO_INCREMENT,
  name varchar(45) NOT NULL,
  email varchar(45) NOT NULL,
  late_deliveries int NOT NULL DEFAULT 0,
  early_deliveries int NOT NULL DEFAULT 0,

  PRIMARY KEY (driver_id)
);

CREATE OR REPLACE TABLE Orders (
  order_id int NOT NULL AUTO_INCREMENT,
  customer_id int,
  start_facility_id int,
  end_facility_id int,
  current_facility_id int,
  volume int NOT NULL,
  weight int NOT NULL,

  PRIMARY KEY (order_id),
  FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (start_facility_id) REFERENCES Facilities(facility_id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (end_facility_id) REFERENCES Facilities(facility_id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (current_facility_id) REFERENCES Facilities(facility_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE OR REPLACE TABLE Deliveries (
  delivery_id int NOT NULL AUTO_INCREMENT,
  driver_id int NOT NULL,
  truck_id int NOT NULL,
  start_facility_id int NOT NULL,
  end_facility_id int NOT NULL,
  total_volume int NOT NULL,
  total_weight int NOT NULL,

  late tinyint(1),
  departure_time datetime,
  expected_arrival_time datetime,
  actual_arrival_time datetime,

  PRIMARY KEY (delivery_id),
  FOREIGN KEY (driver_id) REFERENCES Drivers(driver_id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (truck_id) REFERENCES Trucks(truck_id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (start_facility_id) REFERENCES Facilities(facility_id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (end_facility_id) REFERENCES Facilities(facility_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE OR REPLACE TABLE DeliveryOrders (
  delivery_id int NOT NULL,
  order_id int NOT NULL,
  FOREIGN KEY (delivery_id) REFERENCES Deliveries(delivery_id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE OR REPLACE TABLE TruckDrivers (
  driver_id int NOT NULL,
  truck_id int NOT NULL,
  FOREIGN KEY (driver_id) REFERENCES Drivers(driver_id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (truck_id) REFERENCES Trucks(truck_id) ON UPDATE CASCADE ON DELETE CASCADE
);


-- Create Customers --
INSERT INTO Customers (name, email)
VALUES ("Local Store Owner", "1253@gmail.com");

-- Create Facilities --

INSERT INTO Facilities (name, location, customer_id)
VALUES ("Corvallis Warehouse", "Corvallis OR", NULL);

INSERT INTO Facilities (name, location, customer_id)
VALUES ("Salem Warehouse", "Salem OR", NULL);

INSERT INTO Facilities (name, location, customer_id)
VALUES ("Corvallis Store", "Corvallis OR", (SELECT customer_id FROM Customers WHERE name="Local Store Owner"));

-- Create Drivers --

INSERT INTO Drivers (name, email, late_deliveries, early_deliveries)
VALUES ("Asher", "1264@gmail.com", 12, 87);

-- Create Trucks --

INSERT INTO Trucks (plate, max_weight, max_volume, current_facility_id)
VALUES ("abc 123", 56000, 8262, NULL);

-- TruckDrivers --
INSERT INTO TruckDrivers (truck_id, driver_id)
VALUES ((SELECT truck_id FROM Trucks WHERE plate="abc 123"),
        (SELECT driver_id FROM Drivers WHERE name="Asher"));

-- Create Orders --
INSERT INTO Orders (customer_id, volume, weight, start_facility_id, end_facility_id, current_facility_id)
VALUES ((SELECT customer_id FROM Customers WHERE name="Local Store Owner"), 400, 80,
        (SELECT facility_id FROM Facilities WHERE name="Salem Warehouse"),
        (SELECT facility_id FROM Facilities WHERE name="Corvallis Store"),
        (SELECT facility_id FROM Facilities WHERE name="Corvallis Store"));

INSERT INTO Orders (customer_id, volume, weight, start_facility_id, end_facility_id, current_facility_id)
VALUES ((SELECT customer_id FROM Customers WHERE name="Local Store Owner"), 200, 220,
        (SELECT facility_id FROM Facilities WHERE name="Corvallis Warehouse"),
        (SELECT facility_id FROM Facilities WHERE name="Corvallis Store"),
        (SELECT facility_id FROM Facilities WHERE name="Corvallis Store"));

-- Create Deliveries --
INSERT INTO Deliveries (departure_time, expected_arrival_time, actual_arrival_time, total_volume, total_weight,
                        truck_id, driver_id, start_facility_id, end_facility_id)
VALUES ('2022-07-10 09:00:00', '2022-07-10 10:00:00', '2022-07-10 09:52:00', 80, 400,
        (SELECT truck_id FROM Trucks WHERE plate="abc 123"),
        (SELECT driver_id FROM Drivers WHERE name="Asher"),
        (SELECT facility_id FROM Facilities WHERE name="Salem Warehouse"),
        (SELECT facility_id FROM Facilities WHERE name="Corvallis Warehouse"));

INSERT INTO Deliveries (departure_time, expected_arrival_time, actual_arrival_time, total_volume, total_weight,
                        truck_id, driver_id, start_facility_id, end_facility_id)
VALUES ('2022-07-11 13:00:00', '2022-07-10 13:25:00', '2022-07-11 03:47:00', 280, 620,
        (SELECT truck_id FROM Trucks WHERE plate="abc 123"),
        (SELECT driver_id FROM Drivers WHERE name="Asher"),
        (SELECT facility_id FROM Facilities WHERE name="Corvallis Warehouse"),
        (SELECT facility_id FROM Facilities WHERE name="Corvallis Store"));

-- Delivery Orders --
INSERT INTO DeliveryOrders (delivery_id, order_id)
VALUES (1, 1);

INSERT INTO DeliveryOrders (delivery_id, order_id)
VALUES (2, 1);

INSERT INTO DeliveryOrders (delivery_id, order_id)
VALUES (2, 2);
