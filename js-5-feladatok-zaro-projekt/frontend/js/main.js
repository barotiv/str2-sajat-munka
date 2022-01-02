let keys = ["id", "name", "emailAddress", "address"];

window.onload = () => {
    getUsers();
}

function getUsers() {
    getServerData("http://localhost:3000/users").then(
        data => fillDataTable(data, "userTable")
    );
}

async function getServerData(url) {
    let fetchOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache"
    };

    return await fetch(url, fetchOptions).then(
        response => response.json(),
        err => console.error(err)
    );
}

function fillDataTable(data, userTable) {
    let table = document.querySelector(`#${userTable}`);
    if (!table) {
        console.error(`Table "${userTable} is not found.`);
        return;
    }

    let tBody = table.querySelector("tbody");
    tBody.innerHTML = '';
    let newRow = newUserRow();
    tBody.appendChild(newRow);

    for (let row of data) {
        let tr = createAnyElement("tr");
        for (let k of keys) {
            let td = createAnyElement("td");
            let input = createAnyElement("input", {
                class: "form-control",
                value: row[k],
                name: k
            });
            if (k == "id") {
                input.setAttribute("readonly", true);
            }
            td.appendChild(input);
            tr.appendChild(td);
        }

        let btnGroup = addBtnGroup();
        tr.appendChild(btnGroup);
        tBody.appendChild(tr);
    }
}

function createAnyElement(name, attributes) {
    let element = document.createElement(name);
    for (let k in attributes) {
        element.setAttribute(k, attributes[k]);
    }
    return element;
}

function addBtnGroup() {
    let group = createAnyElement("div", {
        class: "btn btn-group"
    });
    let editBtn = createAnyElement("button", {
        class: "btn modify",
        onclick: "setRow(this)"
    });
    editBtn.innerHTML = '<i class="fa fa-refresh" aria-hidden="true"></i>'
    let delBtn = createAnyElement("button", {
        class: "btn delete",
        onclick: "delRow(this)"
    });
    delBtn.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>'

    group.appendChild(editBtn);
    group.appendChild(delBtn);

    let td = createAnyElement("td");
    td.appendChild(group);
    return td;
}

async function delRow(btn) {
    let tr = btn.parentElement.parentElement.parentElement;
    let id = tr.querySelector("td:first-child").getElementsByTagName("input")[0].value;
    console.log(id);
    let fetchOptions = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache"
    };

    await fetch(`http://localhost:3000/users/${id}`, fetchOptions).then(
        resp => resp.json,
        err => console.error(err)
    ).then(
        data => {
            getUsers();
        }
    );
}

function newUserRow(row) {
    let tr = createAnyElement("tr");
    for (let k of keys) {
        let td = createAnyElement("td");
        let input = createAnyElement("input", {
            class: "form-control",
            name: k
        });
        td.appendChild(input);
        tr.appendChild(td);
    }

    let addBtn = createAnyElement("button", {
        class: "btn add",
        onclick: "createUser(this)"
    });

    addBtn.innerHTML = '<i class="fa fa-plus-circle" aria-hidden="true"></i>';
    let td = createAnyElement("td");
    td.appendChild(addBtn);
    tr.appendChild(td);

    return tr;
}

function createUser(btn) {
    let tr = btn.parentElement.parentElement;
    let data = getRowData(tr);
    delete data.id;
    let fetchOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch(`http://localhost:3000/users`, fetchOptions).then(
        resp => resp.json(),
        err => console.error(err)
    ).then(
        data => getUsers()
    );
}

function getRowData(tr) {
    let inputs = tr.querySelectorAll("input.form-control");
    let data = {};
    for (let i = 0; i < inputs.length; i++) {
        data[inputs[i].name] = inputs[i].value;
    }
    return data;
}

function setRow(btn) {
    let tr = btn.parentElement.parentElement.parentElement;
    let data = getRowData(tr)
    let fetchOptions = {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch(`http://localhost:3000/users/${data.id}`, fetchOptions).then(
        resp => resp.json(),
        err => console.error(err)
    ).then(
        data => getUsers()
    );
}