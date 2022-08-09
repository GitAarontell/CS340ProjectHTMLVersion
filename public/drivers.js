let table = document.querySelector('tbody');
let selection = document.getElementById('selections');
let addButton = document.querySelector('.addEntity');
let searchButton = document.querySelector('#searchSubmit');
// used for edit button event listener
check = false;

fetch('/getAll/Drivers', {method: 'GET'})
.then(data => {
    // get the data that was sent back and return it as json to next promise
    // will send a json object of current customers
    return data.json();
}).then(newData => {

    //take the now json data and loop through it
    newData.forEach(element => {
        let tr = document.createElement('tr');
        tr.setAttribute('align', 'center');
        tr.setAttribute('height', '35');
        tr.className = 'rows';

        // create the table data elements
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');

        // set text content of table data to name and email
        i1 = document.createElement('input')
        i2 = document.createElement('input')
        i3 = document.createElement('input')
        i4 = document.createElement('input')

        i1.value = element.name;
        i2.value = element.email;
        i3.value = element.late_deliveries;
        i4.value = element.early_deliveries;

        i1.setAttribute('readonly', 'readonly')
        i2.setAttribute('readonly', 'readonly')
        i3.setAttribute('readonly', 'readonly')
        i4.setAttribute('readonly', 'readonly')
        //td2.textContent = element.name;
        //td3.textContent = element.email;
        td1.appendChild(i1);
        td2.appendChild(i2);
        td3.appendChild(i3);
        td4.appendChild(i4);

        // set td1 attributes
        td1.setAttribute('width', '100');
        td1.setAttribute('height', '35');


        // add as a child element all table data to table row
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        // append the row to the table
        table.appendChild(tr);

        // adds options to the customer search
        option = document.createElement('option');
        option.textContent = element.name;
        option.setAttribute('value', element.name);
        option.id = element.id;

        selection.appendChild(option);
    });
});

addButton.addEventListener('click', (e) => {
    e.preventDefault();
    // if the class name of the clicked element within table is delButton
    parent = e.target.parentElement.children

    let name = parent[2].value
    let email = parent[6].value
    let late_deliveries = parent[10].value
    let early_deliveries = parent[14].value
    console.log(name)
    console.log(email)
    console.log(late_deliveries)
    console.log(early_deliveries)

    if (name != "" && email != "") {
      fetch('/add/Drivers',
      {
          method: 'POST',
          body: JSON.stringify(
              {
                'table': 'Drivers',
                'name': name,
                'email': email,
                'late_deliveries': late_deliveries,
                'early_deliveries': early_deliveries, 
              }),
          headers: {
              'Content-Type': 'application/json',
          },

      }).then(data => {
          return data.json();
      }).then(jData =>{
          // makeCustomerRow needs to be implemented with a customer json passed into it
          makeCustomerRow({
            'name': name,
            'email': email,
            'id': jData.id.insertId,
            'late_deliveries': late_deliveries,
            'early_deliveries': early_deliveries
        })

      }).catch(err => {
          console.log(err);
      });
    } else {
      alert("Addition Unsuccessful: Missing Data");
    }
});

function makeCustomerRow(element) {
    let tr = document.createElement('tr');
    tr.setAttribute('align', 'center');
    tr.setAttribute('height', '35');
    tr.className = 'rows';

    // create the table data elements
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let td4 = document.createElement('td');

    // set text content of table data to name and email
    i1 = document.createElement('input')
    i2 = document.createElement('input')
    i3 = document.createElement('input')
    i4 = document.createElement('input')

    i1.value = element.name;
    i2.value = element.email;
    i3.value = element.late_deliveries;
    i4.value = element.early_deliveries;

    i1.setAttribute('readonly', 'readonly')
    i2.setAttribute('readonly', 'readonly')
    i3.setAttribute('readonly', 'readonly')
    i4.setAttribute('readonly', 'readonly')
    //td2.textContent = element.name;
    //td3.textContent = element.email;
    td1.appendChild(i1);
    td2.appendChild(i2);
    td3.appendChild(i3);
    td4.appendChild(i4);

    // set td1 attributes
    td1.setAttribute('width', '100');
    td1.setAttribute('height', '35');


    // add as a child element all table data to table row
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);

    // append the row to the table
    table.appendChild(tr);

    // adds options to the customer search
    option = document.createElement('option');
    option.textContent = element.name;
    option.setAttribute('value', element.name);
    option.id = element.id;

    selection.appendChild(option);
}

searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    id = '';

    let name = selection.value;

    // remove all entries in the table
    choices = Array.from(selection.children);
    
    count = 0;
    for(obj in choices) {
        if (choices[obj].value == name){
            id = choices[obj].id;
            selection.children[count].remove();
        }
        count += 1
        
        if (table.children.length > 0){
            table.children[0].remove();
        }
        
    }
    
    // add new entries
    fetch(`/search/Drivers/${id}`, {method: 'GET',})
    .then(data => {
        // get the data that was sent back and return it as json to next promise
        // will send a json object of current customers
        return data.json();
    }).then(newData => { 
        newData.forEach(element => makeCustomerRow(element));
    });
  });