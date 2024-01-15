let calls = document.getElementById('calls');
document.getElementById('form').addEventListener('submit', (e) => {e.preventDefault()})

//Carrega usuário na primeira abertura da página

update().then(() => {console.log('Page loaded and updated...')});

function addUser(){
    let name = document.getElementById('name');
    let region = document.getElementById('region');
    if(name != '' && region != ''){
        console.log(`Post requested. Name: ${name}, Region: ${region}`);
        fetch(`http://localhost:4002/dados/`, 
        {
            method: "POST",
            headers: {'Content-type' : 'application/json' },
            body: JSON.stringify(
                    {   name: name.value,
                        region: region.value
                    }
                )
        }
                ).then(() => {update();})

        name.value = '';
        region.value = '';
    } else {
        alert('Empty entry!')
    }
}

function deleteUser(id){
    fetch(`http://localhost:4002/dados/${id}`, {method: "DELETE"})
    .then(() => {update();})
}

function updateUser(id, name = '', region = ''){
    if(name != '' && region != ''){
        console.log(`Update requested`);
        fetch(`http://localhost:4002/dados/${id}`, {method: "PUT", headers: {'Content-type' : 'application/json' } ,body: JSON.stringify({name: name, region: region})})
        .then(() => {update();})
    } else {
        alert('Empty entry!')
    }
}

async function update(){
    calls.innerHTML = '';
    fetch('http://localhost:4002/dados')
       .then((res) => res.json())
       .then((json) => {
        for (let i = 0; i < json.users.length; i++) {
            let call = document.createElement('div');
            let name = document.createElement('input');
            let region = document.createElement('input')
            let update = document.createElement('button');
            let del = document.createElement('button');

            call.setAttribute('class', 'call');
            name.setAttribute('class', 'customerData');
            region.setAttribute('class', 'customerData');
            update.setAttribute('class', 'update');
            del.setAttribute('class', 'del');

            name.setAttribute('id', `name${json.users[i].id}`)
            name.value = json.users[i].nome;

            region.setAttribute('id', `region${json.users[i].id}`)
            region.value = json.users[i].region;
            update.innerHTML = "Update";
            del.innerHTML = "X";

            update.onclick = () => {updateUser(json.users[i].id, document.getElementById(`name${json.users[i].id}`).value, document.getElementById(`region${json.users[i].id}`).value)}
            del.onclick = () => {
                if(confirm(`Do you want to delete the user: ${json.users[i].nome}?`)){
                    deleteUser(json.users[i].id)
                }
            };

            call.appendChild(name)
            call.appendChild(region)
            call.appendChild(update)
            call.appendChild(del)

            calls.appendChild(call);
        }
       })
}