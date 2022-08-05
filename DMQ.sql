-- Data Manipulation Queries --

-- Trucks
INSERT INTO Trucks (plate, max_weight, max_volume, current_facility_id)
VALUES (:plate, :max_weight, :max_volume, :cf_id);

DELETE FROM Trucks WHERE truck_id=:t_id;

UPDATE Trucks SET plate=:plate, max_volume=:max_volume, max_weight=:max_weight, current_facility_id=:cf_id
WHERE truck_id=:t_id;

SELECT Trucks.truck_id, Trucks.plate, Trucks.min_weight, Trucks.max_weight, Facilities.name FROM Trucks WHERE truck_id=:t_id
JOIN Facilities ON Trucks.current_facility_id=Facilities.facility_id;

-- Drivers
INSERT INTO Drivers (name, email, late_deliveries, early_deliveries)
VALUES (:name, :email, :ld, :ed);

DELETE FROM Drivers WHERE driver_id=:d_id;

UPDATE Drivers SET name=:name, email=:email, late_deliveries=:ld, early_deliveries=:ed
WHERE driver_id=:d_id;

SELECT * FROM Drivers WHERE driver_id=:d_id;

-- Facilities
INSERT INTO Facilities (name, location, customer_id)
VALUES (:name, :location, :cid);

DELETE FROM Facilities WHERE facility_id=:f_id;

UPDATE Facilities SET name=:name, location=:location, customer_id=:c_id
WHERE facility_id=:f_id;

SELECT Facilities.facility_id, Facilities.name, Facilities.location, Customers.name FROM Facilities WHERE facility_id=:f_id
JOIN Customers ON Facilities.customer_id=Customers.customer_id;

-- Customers
INSERT INTO Customers (name, email)
VALUES (:name, :email);

DELETE FROM Customers WHERE customer_id=:c_id;

UPDATE Customers SET name=:name, email=:email
WHERE customer_id=:c_id;

SELECT * FROM Customers WHERE customer_id=:c_id;

-- Deliveries
INSERT INTO Deliveries (departure_time, expected_arrival_time, actual_arrival_time, total_volume, total_weight,
                        truck_id, driver_id, start_facility_id, end_facility_id)
VALUES (:dt, :eat, :aat, :total_volume, :total_weight, :t_id, :d_id, :sf_id, :ef_id);

DELETE FROM Deliveries WHERE delivery_id=:d_id;

UPDATE Deliveries SET departure_time=:dt, expected_arrival_time=:eat, actual_arrival_time=:aat, total_volume=:total_volume
                      total_weight=:total_weight, truck_id=:t_id, driver_id=:d_id, start_facility_id=:sf_id, end_facility_id=:ef_id
WHERE delivery_id=:d_id;

SELECT * FROM Deliveries WHERE delivery_id=:d_id;

-- Orders
INSERT INTO Orders (customer_id, volume, weight, start_facility_id, end_facility_id, current_facility_id)
VALUES (:c_if, :volume, :weight, :sf_id, :ef_id, :cf_id);

DELETE FROM Orders WHERE order_id=:o_id;

UPDATE Orders SET customer_id=:c_id, volume=:volume, weight=:weight, start_facility_id=:sf_id, end_facility_id=:ef_id, current_facility_id=:cf_id
WHERE order_id=:o_id;

SELECT * FROM Orders WHERE order_id=:o_id;

-- TruckDrivers
INSERT INTO TruckDrivers (truck_id, driver_id)
VALUES (:t_rd, :d_id);

DELETE FROM TruckDrivers WHERE driver_id=:d_id;
DELETE FROM TruckDrivers WHERE truck_id=:t_id;

UPDATE TruckDrivers SET driver_id=:d_id
WHERE  truck_id=:t_id;

UPDATE TruckDrivers SET truck_id=:t_id
WHERE  driver_id=:d_id;

SELECT * FROM TruckDrivers WHERE driver_id=:d_id AND truck_id=:t_id;
SELECT * FROM TruckDrivers WHERE truck_id=:t_id;
SELECT * FROM TruckDrivers WHERE driver_id=:d_id;

-- DeliveryOrders
INSERT INTO DeliveryOrders (delivery_id, order_id)
VALUES (:d_id, :o_id);

DELETE FROM DeliveryOrders WHERE delivery_id=:d_id;
DELETE FROM DeliveryOrders WHERE order_id=:o_id;

UPDATE DeliveryOrders SET delivery_id=:d_id
WHERE  order_id=:o_id;

UPDATE DeliveryOrders SET order_id=:o_id
WHERE  delivery_id=:d_id;

SELECT * FROM DeliveryOrders WHERE delivery_id=:d_id AND order_id=:o_id;
SELECT * FROM DeliveryOrders WHERE order_id=:o_id;
SELECT * FROM DeliveryOrders WHERE delivery_id=:d_id;
