// grabs html collection of elements with class name delButton
let tableBodyCustomer = document.getElementsByClassName('tableBodyDelivery');

// grabs the tbody element of the table
let table = document.querySelector('tbody');

// grabs the add button and the selections for the search
let addButton = document.querySelector('.addEntity');

check = false;

// makes a new row document element and appends it to the table given a single delivery entity
function makeDeliveryRow(delivery, addOption = true) {
  let tr = document.createElement('tr');
  tr.setAttribute('align', 'center');
  tr.setAttribute('height', '35');
  tr.className = 'rows';

  // create the table data elements
  let td1 = document.createElement('td'); // edit and delete buttons

  let tableData = [];
  var inputElements = [];
  var numDataElements = 10;
  for (var i = 0; i < numDataElements; i ++) {
    tableData[i] = document.createElement('td');
    inputElements[i] = document.createElement('input');
  }

  inputElements[0].value = delivery.driver;
  inputElements[1].value = delivery.plate;
  inputElements[2].value = delivery.sf;
  inputElements[3].value = delivery.ef;
  inputElements[4].value = delivery.totVol;
  inputElements[5].value = delivery.totWgt;
  inputElements[6].value = delivery.late;
  inputElements[7].value = delivery.dt;
  inputElements[8].value = delivery.eat;
  inputElements[9].value = delivery.aat;

  // make input fields read only
  for (var i = 0; i < numDataElements; i ++) {
      inputElements[i].setAttribute('readonly', 'readonly');
      inputElements[i].setAttribute('size', '13');
      tableData[i].appendChild(inputElements[i]);
  }

  // set edit/Delete button attributes
  td1.setAttribute('width', '100');
  td1.setAttribute('height', '35');

  // create the edit and delete buttons
  editButton = document.createElement('input');
  delButton = document.createElement('input');

  // create edit and delete buttons
  editButton.setAttribute('type', 'button');
  editButton.setAttribute('value', 'Edit');
  editButton.className = 'editButton';
  editButton.id = delivery.delivery_id;

  delButton.setAttribute('type', 'button');
  delButton.setAttribute('value', 'Del');
  delButton.className = 'delButton';
  delButton.id = delivery.delivery_id;

  // append the edit button and delete button to table data 1
  td1.appendChild(editButton);
  td1.appendChild(delButton);

  // add as a child element all table data to table row
  tr.appendChild(td1);
  for (var i = 0; i < numDataElements; i ++) {
      tr.appendChild(tableData[i]);
  }

  // append the row to the table
  //tr.setAttribute('width', '1000');
  table.appendChild(tr);


  // adds options to the search menu
  if (addOption) {
    option = document.createElement('option');
    option.textContent = delivery.name;
    option.setAttribute('value', delivery.name);

    selection.appendChild(option);
  }
}

// load in all deliveries
fetch('/allDeliveries', {method: 'GET'})
.then(data => {
    // get the data that was sent back and return it as json to next promise
    // will send a json object of current customers
    return data.json();
}).then(newData => {

  // add general search option
  /* only for searching
  option = document.createElement('option');
  option.textContent = selectAllString;
  option.setAttribute('value', selectAllString);
  selection.appendChild(option);
  */
  // add all customer data rows
  //console.log(element);
  newData.forEach(element => makeDeliveryRow(element, false))
});

// add data to drop down menus
// add drivers
fetch('/driverNames', {method: 'GET'})
.then(data => {
    // get the data that was sent back and return it as json to next promise
    // will send a json object of current customers
    return data.json();
}).then(newData => {

  newData.forEach(element => {

  let addTo = document.getElementById('iDriver');

  // add general search option
  let thing = document.createElement('option');
  thing.textContent = element.name;
  thing.setAttribute('value', element.name);
  addTo.appendChild(thing);

})

});

// add trucks
fetch('/truckPlates', {method: 'GET'})
.then(data => {
    // get the data that was sent back and return it as json to next promise
    // will send a json object of current customers
    return data.json();
}).then(newData => {

  newData.forEach(element => {

  let addTo = document.getElementById('iPlate');

  // add general search option
  let thing = document.createElement('option');
  thing.textContent = element.plate;
  thing.setAttribute('value', element.plate);
  addTo.appendChild(thing);

})

});

fetch('/facilityNames', {method: 'GET'})
.then(data => {
    // get the data that was sent back and return it as json to next promise
    // will send a json object of current customers
    return data.json();
}).then(newData => {

  newData.forEach(element => {

  let addTo1 = document.getElementById('iSf');
  let addTo2 = document.getElementById('iEf');

  // add general search option
  let thing1 = document.createElement('option');
  thing1.textContent = element.name;
  thing1.setAttribute('value', element.name);

  let thing2 = document.createElement('option');
  thing2.textContent = element.name;
  thing2.setAttribute('value', element.name);
  addTo1.appendChild(thing1);
  addTo2.appendChild(thing2);
})


});

addButton.addEventListener('click', (e) => {
    e.preventDefault();
    // if the class name of the clicked element within table is delButton
    let driver = document.getElementById('iDriver').value;
    let plate = document.getElementById('iPlate').value;
    let sf = document.getElementById('iSf').value;
    let ef = document.getElementById('iEf').value;
    let late = document.getElementById('iLate').value;
    let dt = document.getElementById('iDt').value;
    let eat = document.getElementById('iEat').value;
    let aat = document.getElementById('iAat').value;

    if (sf != "" && ef != "" && driver != "" && plate != "") {
      fetch('/addDelivery',
      {
          method: 'PUT',
          body: JSON.stringify(
              {
                  'driver': driver,
                  'plate': plate,
                  'sf': sf,
                  'ef': ef,
                  'late': late,
                  'dt': dt,
                  'eat': eat,
                  'aat': aat
              }),
          headers: {
              'Content-Type': 'application/json',
          },

      }).then(data => {
          return data.json();
      }).then(jData =>{
          // makeCustomerRow needs to be implemented with a customer json passed into it
          makeDeliveryRow({'driver': driver, 'plate': plate, 'sf': sf, 'ef': ef, 'late': late, 'dt': dt, 'eat': eat, 'aat': aat, 'totWgt': 0, 'totVol': 0}, false)

      }).catch(err => {
          console.log(err);
      });
    } else {
      console.log("Addition Unsuccessful: Missing Data");
    }

});
