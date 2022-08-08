
DROP TABLE IF EXISTS TruckDrivers;
DROP TABLE IF EXISTS DeliveryOrders;
DROP TABLE IF EXISTS Deliveries;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Trucks;
DROP TABLE IF EXISTS Drivers;
DROP TABLE IF EXISTS Facilities;
DROP TABLE IF EXISTS Customers;

CREATE OR REPLACE TABLE Customers (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(45) NOT NULL,
  email varchar(45) NOT NULL,
  PRIMARY KEY (id)
);

CREATE OR REPLACE TABLE Facilities (
  id int NOT NULL AUTO_INCREMENT,
  location varchar(45) NOT NULL,
  name varchar(45) NOT NULL,
  PRIMARY KEY (id)
);

CREATE OR REPLACE TABLE Trucks (
  id int NOT NULL AUTO_INCREMENT,
  current_facility_id int,
  plate varchar(8),
  max_weight int NOT NULL,
  max_volume int NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (current_facility_id) REFERENCES Facilities(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE OR REPLACE TABLE Drivers (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(45) NOT NULL,
  email varchar(45) NOT NULL,
  late_deliveries int NOT NULL DEFAULT 0,
  early_deliveries int NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
);

CREATE OR REPLACE TABLE Orders (
  id int NOT NULL AUTO_INCREMENT,
  customer_id int,
  start_facility_id int,
  end_facility_id int,
  current_facility_id int,
  volume int NOT NULL,
  weight int NOT NULL,

  PRIMARY KEY (id),
  FOREIGN KEY (customer_id) REFERENCES Customers(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (start_facility_id) REFERENCES Facilities(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (end_facility_id) REFERENCES Facilities(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (current_facility_id) REFERENCES Facilities(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE OR REPLACE TABLE Deliveries (
  id int NOT NULL AUTO_INCREMENT,
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

  PRIMARY KEY (id),
  FOREIGN KEY (driver_id) REFERENCES Drivers(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (truck_id) REFERENCES Trucks(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (start_facility_id) REFERENCES Facilities(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (end_facility_id) REFERENCES Facilities(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE OR REPLACE TABLE DeliveryOrders (
  delivery_id int NOT NULL,
  order_id int NOT NULL,
  FOREIGN KEY (delivery_id) REFERENCES Deliveries(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES Orders(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE OR REPLACE TABLE TruckDrivers (
  driver_id int NOT NULL,
  truck_id int NOT NULL,
  FOREIGN KEY (driver_id) REFERENCES Drivers(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (truck_id) REFERENCES Trucks(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Create Customers --
INSERT INTO Customers (name, email)
VALUES ("Local Store Owner", "1253@gmail.com");

-- Create Facilities --

INSERT INTO Facilities (name, location)
VALUES ("Corvallis Warehouse", "Corvallis, OR"),
("Salem Warehouse", "Salem OR"),
("Corvallis Store", "Corvallis, OR"),
("Austin Warehouse", "Austin, TX"),
("Tennessee Warehouse", "Nashville, TN"),
("Los Angelos Warehouse", "Los Angelos, CA");

-- Create Drivers --

INSERT INTO Drivers (name, email, late_deliveries, early_deliveries)
VALUES ("Asher", "1264@gmail.com", 12, 87);

-- Create Trucks --

INSERT INTO Trucks (plate, max_weight, max_volume, current_facility_id)
VALUES ("HA3421LP", 5000, 3500, 1),
("89PAD932", 2000, 2000, 2),
("87GJI09R", 4500, 3000, 3);

-- TruckDrivers --
INSERT INTO TruckDrivers (truck_id, driver_id)
VALUES (
  (SELECT id FROM Trucks WHERE plate="HA3421LP"),
  (SELECT id FROM Drivers WHERE name="Asher"));

-- Create Orders --
INSERT INTO Orders (customer_id, volume, weight, start_facility_id, end_facility_id, current_facility_id)
VALUES ((SELECT id FROM Customers WHERE name="Local Store Owner"), 400, 80,
        (SELECT id FROM Facilities WHERE name="Salem Warehouse"),
        (SELECT id FROM Facilities WHERE name="Corvallis Store"),
        (SELECT id FROM Facilities WHERE name="Corvallis Store"));

INSERT INTO Orders (customer_id, volume, weight, start_facility_id, end_facility_id, current_facility_id)
VALUES ((SELECT id FROM Customers WHERE name="Local Store Owner"), 200, 220,
        (SELECT id FROM Facilities WHERE name="Corvallis Warehouse"),
        (SELECT id FROM Facilities WHERE name="Corvallis Store"),
        (SELECT id FROM Facilities WHERE name="Corvallis Store"));

-- Create Deliveries --
INSERT INTO Deliveries (departure_time, expected_arrival_time, actual_arrival_time, total_volume, total_weight,
                        truck_id, driver_id, start_facility_id, end_facility_id)
VALUES ('2022-07-10 09:00:00', '2022-07-10 10:00:00', '2022-07-10 09:52:00', 80, 400,
        (SELECT id FROM Trucks WHERE plate="HA3421LP"),
        (SELECT id FROM Drivers WHERE name="Asher"),
        (SELECT id FROM Facilities WHERE name="Salem Warehouse"),
        (SELECT id FROM Facilities WHERE name="Corvallis Warehouse"));

INSERT INTO Deliveries (departure_time, expected_arrival_time, actual_arrival_time, total_volume, total_weight,
                        truck_id, driver_id, start_facility_id, end_facility_id)
VALUES ('2022-07-11 13:00:00', '2022-07-10 13:25:00', '2022-07-11 03:47:00', 280, 620,
        (SELECT id FROM Trucks WHERE plate="HA3421LP"),
        (SELECT id FROM Drivers WHERE name="Asher"),
        (SELECT id FROM Facilities WHERE name="Corvallis Warehouse"),
        (SELECT id FROM Facilities WHERE name="Corvallis Store"));

-- Delivery Orders --
INSERT INTO DeliveryOrders (delivery_id, order_id)
VALUES (1, 1);

INSERT INTO DeliveryOrders (delivery_id, order_id)
VALUES (2, 1);

INSERT INTO DeliveryOrders (delivery_id, order_id)
VALUES (2, 2);
