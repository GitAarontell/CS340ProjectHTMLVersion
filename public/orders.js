let table = document.querySelector('tbody');
let selection = document.getElementById('selections');
let addButton = document.querySelector('.addEntity');
let searchButton = document.querySelector('#searchSubmit');
let s_fac = document.querySelector('.sf');
let e_fac = document.querySelector('.ef');
let c_fac = document.querySelector('.cf');
let cID = document.querySelector('.cID');
// used for edit button event listener
check = false;

fetch('/getAll/Orders', {method: 'GET'})
.then(data => {
    // get the data that was sent back and return it as json to next promise
    // will send a json object of current customers
    return data.json();
}).then(newData => {
    console.log(newData)
    //take the now json data and loop through it
    newData.forEach(element => {
        let tr = document.createElement('tr');
        tr.setAttribute('align', 'center');
        tr.setAttribute('height', '35');
        tr.className = 'rows';

        // create the table data elements
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        let td5 = document.createElement('td');
        let td6 = document.createElement('td');
        let td7 = document.createElement('td');

        // set text content of table data to name and email
        i1 = document.createElement('input')
        i2 = document.createElement('input')
        i3 = document.createElement('input')
        i4 = document.createElement('input')
        i5 = document.createElement('input')

        td2.textContent = element.customer_id;
        i1.value = element.start_facility_id;
        i2.value = element.end_facility_id;
        i3.value = element.current_facility_id;
        i4.value = element.volume;
        i5.value = element.weight;

        i1.setAttribute('readonly', 'readonly')
        i2.setAttribute('readonly', 'readonly')
        i3.setAttribute('readonly', 'readonly')
        i4.setAttribute('readonly', 'readonly')
        i5.setAttribute('readonly', 'readonly')

        td3.appendChild(i1);
        td4.appendChild(i2);
        td5.appendChild(i3);
        td6.appendChild(i4);
        td7.appendChild(i5);

        // set td1 attributes
        td2.setAttribute('width', '100');
        td2.setAttribute('height', '35');

        // add as a child element all table data to table row
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(td7);

        // append the row to the table
        table.appendChild(tr);

        // adds options to the customer search
        option = document.createElement('option');
        option.textContent = element.id;
        option.setAttribute('value', element.cid);
        option.id = element.id;

        selection.appendChild(option);
    });
});

fetch('getIDS/Facilities/name', {method: 'GET'})
.then( (data) => {
    return data.json()
}).then( (newData) => {
    newData.forEach(element => {
        // adds options to the customer search
        option = document.createElement('option');
        option.textContent = element.id;
        option.id = element.id;

        option2 = document.createElement('option');
        option2.textContent = element.id;
        option2.id = element.id;

        option3 = document.createElement('option');
        option3.textContent = element.id;
        option3.id = element.id;

        s_fac.appendChild(option);
        e_fac.appendChild(option2);
        c_fac.appendChild(option3);
    })
});

fetch('getIDS/Customers/name', {method: 'GET'})
.then( (data) => {
    return data.json()
}).then( (newData) => {
    console.log(newData)
    newData.forEach(element => {
        // adds options to the customer search
        option = document.createElement('option');
        option.textContent = element.id;
        option.id = element.id;

        cID.appendChild(option);
    })
});

addButton.addEventListener('click', (e) => {
    e.preventDefault();
    // if the class name of the clicked element within table is delButton
    let parent = e.target.parentElement.children
    console.log(parent)
    let customer_id = parent[2].value.toString()
    let start_facility = parent[6].value.toString()
    let end_facility = parent[10].value.toString()
    let current_facility = parent[14].value.toString()
    volume = parent[18].value.toString()
    weight = parent[22].value.toString()
    if (customer_id != "" && start_facility != "" && end_facility != "" && current_facility != "" && volume != "" && weight != "") {
      fetch('/add/Orders',
      {
          method: 'POST',
          body: JSON.stringify(
              {
                'table': 'Orders',
                'customer_id': customer_id,
                'start_facility_id': start_facility,
                'end_facility_id': end_facility,
                'current_facility_id': current_facility,
                'volume': volume,
                'weight': weight,
              }),
          headers: {
              'Content-Type': 'application/json',
          },

      }).then(data => {
          return data.json();
      }).then(jData =>{
          // makeCustomerRow needs to be implemented with a customer json passed into it
          makeCustomerRow({
            'customer_id': customer_id,
            'start_facility_id': start_facility,
            'end_facility_id': end_facility,
            'current_facility_id': current_facility,
            'volume': volume,
            'weight': weight, 
            'id': jData.id.insertId})

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
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let td4 = document.createElement('td');
    let td5 = document.createElement('td');
    let td6 = document.createElement('td');
    let td7 = document.createElement('td');

    // set text content of table data to name and email
    i1 = document.createElement('input')
    i2 = document.createElement('input')
    i3 = document.createElement('input')
    i4 = document.createElement('input')
    i5 = document.createElement('input')

    td2.textContent = element.customer_id;
    i1.value = element.start_facility_id;
    i2.value = element.end_facility_id;
    i3.value = element.current_facility_id;
    i4.value = element.volume;
    i5.value = element.weight;

    i1.setAttribute('readonly', 'readonly')
    i2.setAttribute('readonly', 'readonly')
    i3.setAttribute('readonly', 'readonly')
    i4.setAttribute('readonly', 'readonly')
    i5.setAttribute('readonly', 'readonly')

    td3.appendChild(i1);
    td4.appendChild(i2);
    td5.appendChild(i3);
    td6.appendChild(i4);
    td7.appendChild(i5);

    // set td1 attributes
    td2.setAttribute('width', '100');
    td2.setAttribute('height', '35');

    // add as a child element all table data to table row
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    tr.appendChild(td7);

    // append the row to the table
    table.appendChild(tr);

    // adds options to the customer search
    option = document.createElement('option');
    option.textContent = element.id;
    option.setAttribute('value', element.id);
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
    fetch(`/search/Orders/${id}`, {method: 'GET',})
    .then(data => {
        // get the data that was sent back and return it as json to next promise
        // will send a json object of current customers
        return data.json();
    }).then(newData => { 
        newData.forEach(element => makeCustomerRow(element));
    });
  });