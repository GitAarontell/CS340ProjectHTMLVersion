// grabs html collection of elements with class name delButton
let tableBodyCustomer = document.getElementsByClassName('tableBodyCustomer');

// grabs the tbody element of the table
let table = document.querySelector('tbody');

// make a request to this url which is on the express server as a get request
fetch('/customersinfo', {method: 'GET'})
.then(data => {
    // get the data that was sent back and return it as json to next promise
    // will send a json object of current customers
    return data.json();
}).then(newData => {
    // take the now json data and loop through it
    // newData.forEach(element => {
    //     new Row(element.name, element.email);
    // });

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
        td2.textContent = element.name;
        td3.textContent = element.email;

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
    });
});

// add click event listener to customer table
table.addEventListener('click', (e) => {
    // if the class name of the clicked element within table is delButton
    if(e.target.className == "delButton"){
        fetch(`/delete/${e.target.id}`, {method: 'DELETE'})
        console.log("Trying to grab its data to delete on database")
        // then remove the current elements parents parent from the table, which is the table row, which is a child
        // element of the table, so removes that row from the table
        table.removeChild(e.target.parentElement.parentElement);
    }
});


// class Row {
//     constructor(name, email){
//         this.createNewRow(name, email);
//     }

//     createNewRow(name, email){
//         // create the table row element with align and height attributes and class name
//         let tr = document.createElement('tr');
//         tr.setAttribute('align', 'center');
//         tr.setAttribute('height', '35');
//         tr.className = 'rows';

//         // create the table data elements
//         let td1 = document.createElement('td');
//         let td2 = document.createElement('td');
//         let td3 = document.createElement('td');

//         // set text content of table data to name and email
//         td2.textContent = name;
//         td3.textContent = email;

//         // set td1 attributes
//         td1.setAttribute('width', '100');
//         td1.setAttribute('height', '35');
        
//         // create the edit and delete buttons
//         editButton = document.createElement('input');
//         delButton = document.createElement('input');

//         // create edit and delete buttons
//         editButton.setAttribute('type', 'button');
//         editButton.setAttribute('value', 'Edit');
//         delButton.setAttribute('type', 'button');
//         delButton.setAttribute('value', 'Del');
//         delButton.className = 'delButton';

//         // append the edit button and delete button to table data 1
//         //td1.appendChild(editButton);
//         td1.appendChild(delButton);

//         // add as a child element all table data to table row
//         tr.appendChild(td1);
//         tr.appendChild(td2);
//         tr.appendChild(td3);

//         // append the row to the table
//         table.appendChild(tr);
//     }
// }