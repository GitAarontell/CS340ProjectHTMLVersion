// grabs html collection of elements with class name delButton
let tableBodyCustomer = document.getElementsByClassName('tableBodyCustomer');

// grabs the tbody element of the table
let table = document.querySelector('tbody');

// grabs the add button and the selections for the search
let addButton = document.querySelector('.addEntity');
let selection = document.getElementById('selections');

let searchButton = document.getElementById('searchSubmit');

const selectAllString = "All Customers";

// used for edit button event listener
check = false;
/*
class MakeRow {
    constructor(name, email, id){
        this.createNewRow(name, email, id);
    }

    createNewRow(name, email, id){
        let tr = document.createElement('tr');
        tr.setAttribute('align', 'center');
        tr.setAttribute('height', '35');
        tr.className = 'rows';

        // create the table data elements
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');

        // set text content of table data to name and email
        i1 = document.createElement('input');
        i2 = document.createElement('input');

        i1.value = name;
        i2.value = email;

        i1.setAttribute('readonly', 'readonly');
        i2.setAttribute('readonly', 'readonly');
        //td2.textContent = element.name;
        //td3.textContent = element.email;
        td2.appendChild(i1);
        td3.appendChild(i2);

        // set td1 attributes
        td1.setAttribute('width', '100');
        td1.setAttribute('height', '35');

        // create the edit and delete buttons
        editButton = document.createElement('input');
        delButton = document.createElement('input');

        // create edit and delete buttons
        editButton.setAttribute('type', 'button');
        editButton.setAttribute('value', 'Edit');
        editButton.className = 'editButton';
        editButton.id = id;

        delButton.setAttribute('type', 'button');
        delButton.setAttribute('value', 'Del');
        delButton.className = 'delButton';
        delButton.id = id;

        // append the edit button and delete button to table data 1
        td1.appendChild(editButton);
        td1.appendChild(delButton);

        // add as a child element all table data to table row
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        // append the row to the table
        table.appendChild(tr);

        // adds options to the customer search
        option = document.createElement('option');
        option.textContent = element.name;
        option.setAttribute('value', element.name);

        selection.appendChild(option);
    }
}
*/

// makes a new row document element and appends it to the table given a single customer entity
function makeCustomerRow(customer, addOption = true) {
  let tr = document.createElement('tr');
  tr.setAttribute('align', 'center');
  tr.setAttribute('height', '35');
  tr.className = 'rows';

  // create the table data elements
  let td1 = document.createElement('td');
  let td2 = document.createElement('td');
  let td3 = document.createElement('td');

  // set text content of table data to name and email
  i1 = document.createElement('input')
  i2 = document.createElement('input')

  i1.value = customer.name;
  i2.value = customer.email;

  i1.setAttribute('readonly', 'readonly')
  i2.setAttribute('readonly', 'readonly')
  //td2.textContent = element.name;
  //td3.textContent = element.email;
  td2.appendChild(i1);
  td3.appendChild(i2);

  // set td1 attributes
  td1.setAttribute('width', '100');
  td1.setAttribute('height', '35');

  // create the edit and delete buttons
  editButton = document.createElement('input');
  delButton = document.createElement('input');

  // create edit and delete buttons
  editButton.setAttribute('type', 'button');
  editButton.setAttribute('value', 'Edit');
  editButton.className = 'editButton';
  editButton.id = customer.customer_id;

  delButton.setAttribute('type', 'button');
  delButton.setAttribute('value', 'Del');
  delButton.className = 'delButton';
  delButton.id = customer.customer_id;

  // append the edit button and delete button to table data 1
  td1.appendChild(editButton);
  td1.appendChild(delButton);

  // add as a child element all table data to table row
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);

  // append the row to the table
  table.appendChild(tr);


  // adds options to the customer search
  if (addOption) {
    option = document.createElement('option');
    option.textContent = customer.name;
    option.setAttribute('value', customer.name);

    selection.appendChild(option);
  }
}

// make a request to this url which is on the express server as a get request
fetch('/allCustomers', {method: 'GET'})
.then(data => {
    // get the data that was sent back and return it as json to next promise
    // will send a json object of current customers
    return data.json();
}).then(newData => {

  // add general search option
  option = document.createElement('option');
  option.textContent = selectAllString;
  option.setAttribute('value', selectAllString);
  selection.appendChild(option);

  // add all customer data rows
  newData.forEach(element => makeCustomerRow(element))
});

// add click event listener to customer table
table.addEventListener('click', (e) => {
    // if the class name of the clicked element within table is delButton
    if(e.target.className == "delButton"){
        fetch(`/delete/${e.target.id}/Customers`, {method: 'DELETE'})
        // then remove the current elements parents parent from the table, which is the table row, which is a child
        // element of the table, so removes that row from the table
        table.removeChild(e.target.parentElement.parentElement);
    }
    else if(e.target.className == 'editButton'){
        // grabs name and email based on proximity to e.target
        usrName = e.target.parentElement.nextElementSibling.childNodes[0];
        email= e.target.parentElement.nextElementSibling.nextElementSibling.childNodes[0];

        if (check == false){
            e.target.setAttribute('value', 'Update');
            check = true;
            usrName.removeAttribute('readOnly');
            email.removeAttribute('readOnly');
        } else {
            e.target.setAttribute('value', 'Edit');
            check = false;

            usrName.setAttribute('readOnly', 'readonly');
            email.setAttribute('readOnly', 'readonly');

            fetch('/editCustomer',
            {
                method: 'PUT',
                body: JSON.stringify(
                {
                    'name': usrName.value,
                    'email': email.value,
                    'table': 'Customers',
                    'id': e.target.id,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).catch(err => {
                console.log(err);
            });
        }
    }
});

addButton.addEventListener('click', (e) => {
    e.preventDefault();
    // if the class name of the clicked element within table is delButton
    let email = e.target.previousElementSibling.previousElementSibling.value;
    let name = e.target.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.value;

    if (name != "" && email != "") {
      fetch('/addCustomer',
      {
          method: 'PUT',
          body: JSON.stringify(
              {
                  'name': name,
                  'email': email
              }),
          headers: {
              'Content-Type': 'application/json',
          },

      }).then(data => {
          return data.json();
      }).then(jData =>{
          // makeCustomerRow needs to be implemented with a customer json passed into it
          makeCustomerRow({'name': name, 'email': email, 'customer_id': jData.id.insertId})

      }).catch(err => {
          console.log(err);
      });
    } else {
      console.log("Addition Unsuccessful: Missing Data");
    }
});

searchButton.addEventListener('click', (e) => {
  e.preventDefault();

  // remove all entries in the table
  for (let i = table.children.length - 1; i > 0; i --) {
    table.children[i].remove();
  }

  let name = selection.value;


  if (name != selectAllString) {
    // add new entries
    fetch('/customerByName/' + name, {method: 'GET',})
    .then(data => {
        // get the data that was sent back and return it as json to next promise
        // will send a json object of current customers
        return data.json();
    }).then(newData => { newData.forEach(element => makeCustomerRow(element, false))});
  } else {
    // add new entries
    fetch('/allCustomers', {method: 'GET'})
    .then(data => {
        // get the data that was sent back and return it as json to next promise
        // will send a json object of current customers
        return data.json();
    }).then(newData => { newData.forEach(element => makeCustomerRow(element, false))});
  }


});
