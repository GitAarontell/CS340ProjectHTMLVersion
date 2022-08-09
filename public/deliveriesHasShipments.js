let table = document.querySelector('tbody');

fetch('/getAll/DeliveryOrders', {method: 'GET'})
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

        // set text content of table data to name and email

        td2.textContent = element.delivery_id;
        td3.textContent = element.order_id

        // set td1 attributes

        // add as a child element all table data to table row
        tr.appendChild(td2);
        tr.appendChild(td3);

        // append the row to the table
        table.appendChild(tr);
    });
});