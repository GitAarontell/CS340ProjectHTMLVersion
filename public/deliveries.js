let table = document.querySelector('tbody');
let selection = document.getElementById('selections');
let addButton = document.querySelector('.addEntity');
let searchButton = document.querySelector('#searchSubmit');
// used for edit button event listener
check = false;

fetch('/allDeliveries', {method: 'GET'})
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
        editButton = document.createElement('input');
        delButton = document.createElement('input');

        // create edit and delete buttons
        editButton.setAttribute('type', 'button');
        editButton.setAttribute('value', 'Edit');
        editButton.className = 'editButton';
        editButton.id = element.id;

        delButton.setAttribute('type', 'button');
        delButton.setAttribute('value', 'Del');
        delButton.className = 'delButton';
        delButton.id = element.id;
        
        // append the edit button and delete button to table data 1
        td1.appendChild(editButton);
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
        fetch(`/delete/Facilities/${e.target.id}`, {method: 'DELETE'})
        
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
    else if(e.target.className == 'editButton'){
    
        idOfRow = e.target.parentElement.nextElementSibling.childNodes[0];
        driver = idOfRow.parentElement.nextElementSibling.childNodes[0];
        plate = driver.parentElement.nextElementSibling.childNodes[0];
        sf = plate.parentElement.nextElementSibling.childNodes[0];
        ef = sf.parentElement.nextElementSibling.childNodes[0];
        tv = ef.parentElement.nextElementSibling.childNodes[0];
        tw = tv.parentElement.nextElementSibling.childNodes[0];
        late = tv.parentElement.nextElementSibling.childNodes[0];
        dt = late.parentElement.nextElementSibling.childNodes[0];
        
        console.log(idOfRow)
        console.log(driver)
        console.log(plate)
        // if (check == false){
        //     e.target.setAttribute('value', 'Update');
        //     check = true;
        //     locationName.removeAttribute('readOnly');
        //     city.removeAttribute('readOnly');
        // } else {
        //     e.target.setAttribute('value', 'Edit');
        //     check = false;

        //     locationName.setAttribute('readOnly', 'readonly');
        //     city.setAttribute('readOnly', 'readonly');

        //     fetch('/edit/Facilities',
        //     {
        //         method: 'PUT',
        //         body: JSON.stringify(
        //         {
        //             'table': 'Facilities',
        //             'name': locationName.value,
        //             'location': city.value,
        //             'id': e.target.id,
        //         }),
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //     }).catch(err => {
        //         console.log(err);
        //     });
        // }
    }
});

// addButton.addEventListener('click', (e) => {
//     e.preventDefault();
//     // if the class name of the clicked element within table is delButton
//     let location = e.target.previousElementSibling.previousElementSibling.value;
//     let name = e.target.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.value;

//     if (name != "" && location != "") {
//       fetch('/add/Facilities',
//       {
//           method: 'POST',
//           body: JSON.stringify(
//               {
//                 'table': 'Facilities',
//                 'name': name,
//                 'location': location
//               }),
//           headers: {
//               'Content-Type': 'application/json',
//           },

//       }).then(data => {
//           return data.json();
//       }).then(jData =>{
//           // makeCustomerRow needs to be implemented with a customer json passed into it
//           makeCustomerRow({'name': name, 'location': location, 'id': jData.id.insertId})

//       }).catch(err => {
//           console.log(err);
//       });
//     } else {
//       alert("Addition Unsuccessful: Missing Data");
//     }
// });

// function makeCustomerRow(element) {
//     let tr = document.createElement('tr');
//     tr.setAttribute('align', 'center');
//     tr.setAttribute('height', '35');
//     tr.className = 'rows';

//     // create the table data elements
//     let td1 = document.createElement('td');
//     let td2 = document.createElement('td');
//     let td3 = document.createElement('td');
//     let td4 = document.createElement('td');

//     // set text content of table data to name and email
//     i1 = document.createElement('input')
//     i2 = document.createElement('input')

//     i1.value = element.name;
//     i2.value = element.location;

//     i1.setAttribute('readonly', 'readonly')
//     i2.setAttribute('readonly', 'readonly')
//     //td2.textContent = element.name;
//     //td3.textContent = element.email;
//     td2.appendChild(i1);
//     td3.appendChild(i2);
//     td4.textContent = element.id

//     // set td1 attributes
//     td1.setAttribute('width', '100');
//     td1.setAttribute('height', '35');
    
//     // create the edit and delete buttons
//     editButton = document.createElement('input');
//     delButton = document.createElement('input');

//     // create edit and delete buttons
//     editButton.setAttribute('type', 'button');
//     editButton.setAttribute('value', 'Edit');
//     editButton.className = 'editButton';
//     editButton.id = element.id;

//     delButton.setAttribute('type', 'button');
//     delButton.setAttribute('value', 'Del');
//     delButton.className = 'delButton';
//     delButton.id = element.id;
    
//     // append the edit button and delete button to table data 1
//     td1.appendChild(editButton);
//     td1.appendChild(delButton);

//     // add as a child element all table data to table row
//     tr.appendChild(td1);
//     tr.appendChild(td2);
//     tr.appendChild(td3);
//     tr.appendChild(td4);

//     // append the row to the table
//     table.appendChild(tr);

//     // adds options to the customer search
//     option = document.createElement('option');
//     option.textContent = element.name;
//     option.setAttribute('value', element.name);
//     option.id = element.id;

//     selection.appendChild(option);
// }

// searchButton.addEventListener('click', (e) => {
//     e.preventDefault();
//     id = '';

//     let name = selection.value;

//     // remove all entries in the table
//     choices = Array.from(selection.children);
    
//     count = 0;
//     for(obj in choices) {
//         if (choices[obj].value == name){
//             id = choices[obj].id;
//             selection.children[count].remove();
//         }
//         count += 1
        
//         if (table.children.length > 0){
//             table.children[0].remove();
//         }
        
//     }
    
//     // add new entries
//     fetch(`/search/Facilities/${id}`, {method: 'GET',})
//     .then(data => {
//         // get the data that was sent back and return it as json to next promise
//         // will send a json object of current customers
//         return data.json();
//     }).then(newData => { 
//         newData.forEach(element => makeCustomerRow(element));
//     });
//   });