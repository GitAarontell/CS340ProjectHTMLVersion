// grabs html collection of elements with class name delButton
let tableBodyCustomer = document.getElementsByClassName('tableBodyDriver');

// grabs the tbody element of the table
let table = document.querySelector('tbody');

// grabs the add button and the selections for the search
let addButton = document.querySelector('.addEntity');

// used for edit button event listener
check = false;

// makes a new row document element and appends it to the table given a single customer entity
function makeDriverRow(driver, addOption = true) {
  let tr = document.createElement('tr');
  tr.setAttribute('align', 'center');
  tr.setAttribute('height', '35');
  tr.className = 'rows';

  // create the table data elements
  let td1 = document.createElement('td'); // edit and delete buttons

  let tableData = [];
  var inputElements = [];
  var numDataElements = 4;
  for (var i = 0; i < numDataElements; i ++) {
    tableData[i] = document.createElement('td');
    inputElements[i] = document.createElement('input');
  }

  inputElements[0].value = driver.name;
  inputElements[1].value = driver.email;
  inputElements[2].value = driver.late_deliveries;
  inputElements[3].value = driver.early_deliveries;

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
  editButton.id = driver.driver_id;

  delButton.setAttribute('type', 'button');
  delButton.setAttribute('value', 'Del');
  delButton.className = 'delButton';
  delButton.id = driver.driver_id;

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

  /*
  // adds options to the search menu
  if (addOption) {
    option = document.createElement('option');
    option.textContent = driver.name;
    option.setAttribute('value', driver.name);

    selection.appendChild(option);
  }
  */
}

// make a request to this url which is on the express server as a get request
fetch('/allDrivers', {method: 'GET'})
.then(data => {
    // get the data that was sent back and return it as json to next promise
    // will send a json object of current customers
    return data.json();
}).then(newData => {

  /*
  // add general search option
  option = document.createElement('option');
  option.textContent = selectAllString;
  option.setAttribute('value', selectAllString);
  selection.appendChild(option);
  */

  // add all customer data rows
  console.log(newData);
  newData.forEach(element => makeDriverRow(element))
});

// add click event listener to customer table
table.addEventListener('click', (e) => {
    // if the class name of the clicked element within table is delButton
    if(e.target.className == "delButton"){
        fetch(`/deleteDriver/${e.target.id}`, {method: 'DELETE'})
        // then remove the current elements parents parent from the table, which is the table row, which is a child
        // element of the table, so removes that row from the table
        table.removeChild(e.target.parentElement.parentElement);
    }
    //
    // else if(e.target.className == 'editButton'){
    //     // grabs name and email based on proximity to e.target
    //     usrName = e.target.parentElement.nextElementSibling.childNodes[0];
    //     email= e.target.parentElement.nextElementSibling.nextElementSibling.childNodes[0];
    //
    //     if (check == false){
    //         e.target.setAttribute('value', 'Update');
    //         check = true;
    //         usrName.removeAttribute('readOnly');
    //         email.removeAttribute('readOnly');
    //     } else {
    //         e.target.setAttribute('value', 'Edit');
    //         check = false;
    //
    //         usrName.setAttribute('readOnly', 'readonly');
    //         email.setAttribute('readOnly', 'readonly');
    //
    //         fetch('/editCustomer',
    //         {
    //             method: 'PUT',
    //             body: JSON.stringify(
    //             {
    //                 'name': usrName.value,
    //                 'email': email.value,
    //                 'table': 'Customers',
    //                 'id': e.target.id,
    //             }),
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         }).catch(err => {
    //             console.log(err);
    //         });
    //     }
    // }
});

addButton.addEventListener('click', (e) => {
    e.preventDefault();
    // if the class name of the clicked element within table is delButton
    let name = document.getElementById('iName').value;
    let email = document.getElementById('iEmail').value;
    let ld = document.getElementById('iLd').value;
    let ed = document.getElementById('iEd').value;

    if (name != "" && email != "") {
      fetch('/addDriver',
      {
          method: 'PUT',
          body: JSON.stringify(
              {
                  'name': name,
                  'email': email,
                  'ld': ld,
                  'ed': ed
              }),
          headers: {
              'Content-Type': 'application/json',
          },

      }).then(data => {
          return data.json();
      }).then(jData =>{
          makeDriverRow({'name': name, 'email': email, 'late_deliveries': ld, 'early_deliveries': ed, 'driver_id': jData.id.insertId})
      }).catch(err => {
          console.log(err);
      });
    } else {
      console.log("Addition Unsuccessful: Missing Data");
    }
});
