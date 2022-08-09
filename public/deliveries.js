let table = document.querySelector('tbody');
let selection = document.getElementById('selections');
let addButton = document.querySelector('.addEntity');
let searchButton = document.querySelector('#searchSubmit');
let driver_sel = document.querySelector('#driver_sel');
let truck_sel = document.querySelector('#truck');
let s_fac = document.querySelector('#sf_selection');
let e_fac = document.querySelector('#ef_selection');
// used for edit button event listener
check = false;
test = ''

fetch('/allDeliveries', {method: 'GET'})
.then(data => {
    // get the data that was sent back and return it as json to next promise
    // will send a json object of current customers
    newData = data.json();
    test = newData;
    return newData;
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
        let td5 = document.createElement('td');
        let td6 = document.createElement('td');
        let td7 = document.createElement('td');
        let td8 = document.createElement('td');
        let td9 = document.createElement('td');
        let td10 = document.createElement('td');
        let td11 = document.createElement('td');
        let td12 = document.createElement('td');

        // set text content of table data to name and email
        i1 = document.createElement('input')
        i2 = document.createElement('input')
        i3 = document.createElement('input')
        i4 = document.createElement('input')
        i5 = document.createElement('input')
        i6 = document.createElement('input')
        i7 = document.createElement('input')
        i8 = document.createElement('input')
        i9 = document.createElement('input')
        i10 = document.createElement('input')

        i1.value = element.name;
        i2.value = element.plate;
        i3.value = element.start_facility;
        i4.value = element.end_facility;
        i5.value = element.total_volume;
        i6.value = element.total_weight;
        i7.value = element.late;
        i8.value = element.departure_time;
        i9.value = element.expected_arrival_time;
        i10.value = element.actual_arrival_time;
        td2.textContent = element.id

        i1.setAttribute('readonly', 'readonly')
        i2.setAttribute('readonly', 'readonly')
        i3.setAttribute('readonly', 'readonly')
        i4.setAttribute('readonly', 'readonly')
        i5.setAttribute('readonly', 'readonly')
        i6.setAttribute('readonly', 'readonly')
        i7.setAttribute('readonly', 'readonly')
        i8.setAttribute('readonly', 'readonly')
        i9.setAttribute('readonly', 'readonly')
        i10.setAttribute('readonly', 'readonly')

        td3.appendChild(i1);
        td4.appendChild(i2);
        td5.appendChild(i3);
        td6.appendChild(i4);
        td7.appendChild(i5);
        td8.appendChild(i6);
        td9.appendChild(i7);
        td10.appendChild(i8);
        td11.appendChild(i9);
        td12.appendChild(i10);

        // set td1 attributes
        td1.setAttribute('width', '100');
        td1.setAttribute('height', '35');
        
        // create the edit and delete buttons

        delButton = document.createElement('input');

        // create edit and delete buttons


        delButton.setAttribute('type', 'button');
        delButton.setAttribute('value', 'Del');
        delButton.className = 'delButton';
        delButton.id = element.id;
        
        // append the edit button and delete button to table data 1
        td1.appendChild(delButton);

        // add as a child element all table data to table row
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(td7);
        tr.appendChild(td8);
        tr.appendChild(td9);
        tr.appendChild(td10);
        tr.appendChild(td11);
        tr.appendChild(td12);

        // append the row to the table
        table.appendChild(tr);

        // adds options to the customer search
        option = document.createElement('option');
        option.textContent = element.id;
        option.setAttribute('value', element.id);
        option.id = element.id;

        selection.appendChild(option);
    });
});

// add click event listener to customer table
table.addEventListener('click', (e) => {
    // if the class name of the clicked element within table is delButton
    if(e.target.className == "delButton"){
        // gets the name of the facility warehouse we are deleting
        warehouse = e.target.parentElement.nextElementSibling.textContent
        console.log(warehouse)
        fetch(`/delete/Deliveries/${e.target.id}`, {method: 'DELETE'})
        
        // remove name from search form
        nodes = Array.from(selection.children)
        for (node in nodes){
            if (nodes[node].value == warehouse){
                nodes[node].remove()
            }
        }
        // element of the table, so removes that row from the table
        table.removeChild(e.target.parentElement.parentElement);
        
    }
    
});

fetch('getIDS/Facilities/name', {method: 'GET'})
.then( (data) => {
    return data.json()
}).then( (newData) => {
    newData.forEach(element => {
        // adds options to the customer search
        option = document.createElement('option');
        option.textContent = element.name;
        option.id = element.id;

        option2 = document.createElement('option');
        option2.textContent = element.name;
        option2.id = element.id;

        s_fac.appendChild(option);
        e_fac.appendChild(option2)
    })
});

fetch('getIDS/Trucks/plate', {method: 'GET'})
.then( (data) => {
    return data.json()
}).then( (newData) => {
    newData.forEach(element => {
        option = document.createElement('option');
        option.textContent = element.plate;
        option.id = element.id;

        truck_sel.appendChild(option);
    })
});

fetch('getIDS/Drivers/name', {method: 'GET'})
.then( (data) => {
    return data.json()
}).then( (newData) => {
    newData.forEach(element => {
        option = document.createElement('option');
        option.textContent = element.name;
        option.id = element.id;

        driver_sel.appendChild(option);
    })
});

addButton.addEventListener('click', (e) => {
    e.preventDefault();
    // if the class name of the clicked element within table is delButton
    let parent = e.target.parentElement.children
    let actual_arrival_time = parent[38].value

    let expected_arrival_time = parent[34].value

    let departure_time = parent[30].value

    let late = parent[26].value

    let volume = parent[22].value

    let weight = parent[18].value

    driver_id = ''
    driver = parent[2].value
    Array.from(parent[2].children).forEach(opt =>{
        if (opt.textContent == parent[2].value) {
            driver_id = opt.id
        }
    })

    truck_id = ''
    truck = parent[6].value
    Array.from(parent[6].children).forEach(opt =>{
        if (opt.textContent == parent[6].value) {
            truck_id = opt.id
        }
    })

    start_facility_id = ''
    start_facility = parent[10].value
    Array.from(parent[10].children).forEach(opt =>{
        if (opt.textContent == parent[10].value) {
            start_facility_id = opt.id
        }
    })

    end_facility_id = ''
    end_facility = parent[14].value
    Array.from(parent[14].children).forEach(opt =>{
        if (opt.textContent == parent[14].value) {
            end_facility_id = opt.id
        }
    })

    if (driver != "" && truck != "" && start_facility != "" && end_facility != "", volume != "" && weight != "") {
      fetch('/addDelivery',
      {
          method: 'POST',
          body: JSON.stringify(
              {
                'table': 'Deliveries',
                'driver_id':  driver_id,
                'truck_id': truck_id,
                'start_facility_id': start_facility_id,
                'end_facility_id': end_facility_id,
                'total_volume': volume,
                'total_weight': weight,
                'late': late,
                'departure_time': departure_time,
                'expected_arrival_time': expected_arrival_time,
                'actual_arrival_time': actual_arrival_time,
              }),
          headers: {
              'Content-Type': 'application/json',
          },

      }).then(data => {
          return data.json();
      }).then(newData =>{
          console.log(newData.id.insertId)
          makeCustomerRow({
            'name': driver, 
            'plate': truck,
            'start_facility': start_facility,
            'end_facility': end_facility,
            'total_volume': volume,
            'total_weight': weight,
            'late': late,
            'departure_time': departure_time,
            'expected_arrival_time': expected_arrival_time,
            'actual_arrival_time': actual_arrival_time,
            'id': newData.id.insertId
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
    let td5 = document.createElement('td');
    let td6 = document.createElement('td');
    let td7 = document.createElement('td');
    let td8 = document.createElement('td');
    let td9 = document.createElement('td');
    let td10 = document.createElement('td');
    let td11 = document.createElement('td');
    let td12 = document.createElement('td');

    // set text content of table data to name and email
    i1 = document.createElement('input')
    i2 = document.createElement('input')
    i3 = document.createElement('input')
    i4 = document.createElement('input')
    i5 = document.createElement('input')
    i6 = document.createElement('input')
    i7 = document.createElement('input')
    i8 = document.createElement('input')
    i9 = document.createElement('input')
    i10 = document.createElement('input')

    i1.value = element.name;
    i2.value = element.plate;
    i3.value = element.start_facility;
    i4.value = element.end_facility;
    i5.value = element.total_volume;
    i6.value = element.total_weight;
    i7.value = element.late;
    i8.value = element.departure_time;
    i9.value = element.expected_arrival_time;
    i10.value = element.actual_arrival_time;
    td2.textContent = element.id

    i1.setAttribute('readonly', 'readonly')
    i2.setAttribute('readonly', 'readonly')
    i3.setAttribute('readonly', 'readonly')
    i4.setAttribute('readonly', 'readonly')
    i5.setAttribute('readonly', 'readonly')
    i6.setAttribute('readonly', 'readonly')
    i7.setAttribute('readonly', 'readonly')
    i8.setAttribute('readonly', 'readonly')
    i9.setAttribute('readonly', 'readonly')
    i10.setAttribute('readonly', 'readonly')

    td3.appendChild(i1);
    td4.appendChild(i2);
    td5.appendChild(i3);
    td6.appendChild(i4);
    td7.appendChild(i5);
    td8.appendChild(i6);
    td9.appendChild(i7);
    td10.appendChild(i8);
    td11.appendChild(i9);
    td12.appendChild(i10);

    // set td1 attributes
    td1.setAttribute('width', '100');
    td1.setAttribute('height', '35');

    // create the edit and delete buttons

    delButton = document.createElement('input');

    // create edit and delete buttons


    delButton.setAttribute('type', 'button');
    delButton.setAttribute('value', 'Del');
    delButton.className = 'delButton';
    delButton.id = element.id;

    // append the edit button and delete button to table data 1
    td1.appendChild(delButton);

    // add as a child element all table data to table row
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    tr.appendChild(td7);
    tr.appendChild(td8);
    tr.appendChild(td9);
    tr.appendChild(td10);
    tr.appendChild(td11);
    tr.appendChild(td12);

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
    console.log(name)
    // remove all entries in the table
    choices = Array.from(selection.children);
    
    count = 0;
    // delete whole table
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
    fetch(`/search/select/Deliveries/${id}`, {method: 'GET',})
    .then(data => {
        // get the data that was sent back and return it as json to next promise
        // will send a json object of current customers
        return data.json();
    }).then(newData => { 
        console.log(newData)
        newData.forEach(element => makeCustomerRow(element));
    });
  });