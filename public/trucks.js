let table = document.querySelector('tbody');
let selection = document.getElementById('selections');
let addButton = document.querySelector('.addEntity');
let searchButton = document.querySelector('#searchSubmit');
let cf_sel = document.querySelector('#current_facility_id');
// used for edit button event listener
check = false;

fetch('/getAll/Trucks', {method: 'GET'})
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
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        let td5 = document.createElement('td');

        // set text content of table data to name and email
        i1 = document.createElement('input')
        i2 = document.createElement('input')
        i3 = document.createElement('input')
        i4 = document.createElement('input')

        i1.value = element.current_facility_id;
        i2.value = element.plate;
        i3.value = element.max_weight;
        i4.value = element.max_volume;

        i1.setAttribute('readonly', 'readonly')
        i2.setAttribute('readonly', 'readonly')
        i3.setAttribute('readonly', 'readonly')
        i4.setAttribute('readonly', 'readonly')

        td2.appendChild(i1);
        td3.appendChild(i2);
        td4.appendChild(i3);
        td5.appendChild(i4);

        // set td1 attributes
        td1.setAttribute('width', '100');
        td1.setAttribute('height', '35');
        
        // create the edit and delete buttons
        delButton = document.createElement('input');

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

        // append the row to the table
        table.appendChild(tr);

        // adds options to the customer search
        option = document.createElement('option');
        option.textContent = element.plate;
        option.setAttribute('value', element.plate);
        option.id = element.id;

        selection.appendChild(option);
    });
});

fetch('getIDS/Trucks/plate', {method: 'GET'})
.then( (data) => {
    return data.json()
}).then( (newData) => {
    console.log(newData)
    newData.forEach(element => {
        // adds options to the customer search
        option = document.createElement('option');
        option.textContent = element.id;
        option.id = element.id;

        cf_sel.appendChild(option);
    })
});

// add click event listener to customer table
table.addEventListener('click', (e) => {
    // if the class name of the clicked element within table is delButton
    if(e.target.className == "delButton"){
        // gets the name of the facility warehouse we are deleting
        warehouse = e.target.parentElement.nextElementSibling.childNodes[0].value

        fetch(`/delete/Trucks/${e.target.id}`, {method: 'DELETE'})
        
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

addButton.addEventListener('click', (e) => {
    e.preventDefault();
    // if the class name of the clicked element within table is delButton
    let parent = e.target.parentElement.children
    console.log(parent)
    let current_facility_id = ''


    Array.from(parent[2].children).forEach(opt =>{
        if (opt.textContent == parent[2].value) {
            current_facility_id = opt.id.toString()
        }
    })

    let plate = parent[6].value
    let max_weight = parent[10].value
    let max_volume = parent[14].value
    if (plate != "" && current_facility_id != "" && max_weight != '' && max_volume != '') {
      fetch('/add/Trucks',
      {
          method: 'POST',
          body: JSON.stringify(
              {
                'table': 'Trucks',
                'current_facility_id': current_facility_id,
                'plate': plate,
                'max_weight': max_weight,
                'max_volume': max_volume,
              }),
          headers: {
              'Content-Type': 'application/json',
          },

      }).then(data => {
          return data.json();
      }).then(jData =>{
          // makeCustomerRow needs to be implemented with a customer json passed into it
          makeCustomerRow({
            'current_facility_id': current_facility_id,
            'plate': plate,
            'max_weight': max_weight,
            'max_volume': max_volume,
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
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let td4 = document.createElement('td');
    let td5 = document.createElement('td');

    // set text content of table data to name and email
    i1 = document.createElement('input')
    i2 = document.createElement('input')
    i3 = document.createElement('input')
    i4 = document.createElement('input')

    i1.value = element.current_facility_id;
    i2.value = element.plate;
    i3.value = element.max_weight;
    i4.value = element.max_volume;

    i1.setAttribute('readonly', 'readonly')
    i2.setAttribute('readonly', 'readonly')
    i3.setAttribute('readonly', 'readonly')
    i4.setAttribute('readonly', 'readonly')

    td2.appendChild(i1);
    td3.appendChild(i2);
    td4.appendChild(i3);
    td5.appendChild(i4);

    // set td1 attributes
    td1.setAttribute('width', '100');
    td1.setAttribute('height', '35');
    
    // create the edit and delete buttons
    delButton = document.createElement('input');

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

    // append the row to the table
    table.appendChild(tr);

    // adds options to the customer search
    option = document.createElement('option');
    option.textContent = element.plate;
    option.setAttribute('value', element.plate);
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
    fetch(`/search/Trucks/${id}`, {method: 'GET',})
    .then(data => {
        // get the data that was sent back and return it as json to next promise
        // will send a json object of current customers
        return data.json();
    }).then(newData => { 
        newData.forEach(element => makeCustomerRow(element));
    });
  });