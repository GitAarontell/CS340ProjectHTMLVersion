// grabs html collection of elements with class name delButton
let tableBodyCustomer = document.getElementsByClassName('tableBodyCustomer');

// grabs the tbody element of the table
let table = document.querySelector('tbody');

let addButton = document.querySelector('.addEntity');
let selection = document.getElementById('selections');

// make a request to this url which is on the express server as a get request
fetch('/customersinfo', {method: 'GET'})
.then(data => {
    // get the data that was sent back and return it as json to next promise
    // will send a json object of current customers
    return data.json();
}).then(newData => {
    
    // newData.forEach(element => {
    //     new Row(element.name, element.email);
    // });

    // take the now json data and loop through it
    newData.forEach(element => {
        let tr = document.createElement('tr');
        tr.setAttribute('align', 'center');
        tr.setAttribute('height', '35');
        tr.className = 'rows';

        // create the table data elements
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');

        // set text content of table data to name and email
        //i1 = document.createElement('input')
        //i2 = document.createElement('input')

        //i1.textContent = element.name;
        //i2.textContent = element.email;

        //i1.setAttribute('readOnly', 'True')
        //i2.setAttribute('readOnly', 'True')
        td2.textContent = element.name;
        td3.textContent = element.email;
        //td2.appendChild(i1);
        //td3.appendChild(i2);

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
        delButton.setAttribute('type', 'button');
        delButton.setAttribute('value', 'Del');
        delButton.className = 'delButton';
        delButton.id = element.customer_id;

        // append the edit button and delete button to table data 1
        td1.appendChild(editButton);
        td1.appendChild(delButton);

        // add as a child element all table data to table row
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        // append the row to the table
        table.appendChild(tr);

        option = document.createElement('option');
        option.textContent = element.name;
        option.setAttribute('value', element.name);

        selection.appendChild(option);
    });
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
    // else if(e.target.className == 'editButton'){
        
    // }
});

// addButton.addEventListener('click', (e) => {
//     //e.preventDefault();
//     // if the class name of the clicked element within table is delButton
//     let email = e.target.previousElementSibling.previousElementSibling.value;
//     let name = e.target.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.value;

//     data = new FormData();
//     data.append("name", name);
//     data.append("eamil", email);
//     fetch('/addEntity',
//     {
//         method: 'POST',
//         body: JSON.stringify(data),
//         headers: {
//             'Content-Type': 'application/json',
//         },
        
//     }). catch(err => {console.log(err);});
// });



class Row {
    constructor(name, email){
        this.createNewRow(name, email);
    }

    createNewRow(name, email){
        // create the table row element with align and height attributes and class name
        let tr = document.createElement('tr');
        tr.setAttribute('align', 'center');
        tr.setAttribute('height', '35');
        tr.className = 'rows';

        // create the table data elements
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');

        // set text content of table data to name and email
        td2.textContent = name;
        td3.textContent = email;

        // set td1 attributes
        td1.setAttribute('width', '100');
        td1.setAttribute('height', '35');
        
        // create the edit and delete buttons
        editButton = document.createElement('input');
        delButton = document.createElement('input');

        // create edit and delete buttons
        editButton.setAttribute('type', 'button');
        editButton.setAttribute('value', 'Edit');
        delButton.setAttribute('type', 'button');
        delButton.setAttribute('value', 'Del');
        delButton.className = 'delButton';

        // append the edit button and delete button to table data 1
        //td1.appendChild(editButton);
        td1.appendChild(delButton);

        // add as a child element all table data to table row
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        // append the row to the table
        table.appendChild(tr);
    }
}