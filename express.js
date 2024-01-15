const express   = require('express');
const app       = express();
const cors      = require('cors');
const fs        = require('fs');
require('dotenv').config();


const PORT = process.env.PORT;
const HOST = process.env.HOST;

app.use(express.static(__dirname + '/public'))

//Rodando HTML, CSS e SCRIPT no servidor Express 
app.get('/', (req, res) => {
    console.log('Client-ip', req.socket.remoteAddress.slice(7));
    fs.readFile('./index.html', (err, data) => {
        res.writeHead(200, )
        res.write(data)
        res.end();
    })
})

app.get('/script.js', (req, res) => {
    fs.readFile('./script.js', (err, data) => {
        res.write(data)
        res.end();
    })
})

app.get('/public/css/index.css', (req, res) => {
    fs.readFile('./public/css/index.css', (err, data) => {
        res.write(data)
        res.end();
    })
})

//MIDDLEWARES
app.use(express.json());
app.use(cors())


//Redirecionamento para WebServer localhost
app.get('/5500', (req, res, next) => {
    res.redirect("http://localhost:5500/");
    next();
})

//ROTA PARA VISUALIZAÇÃO DO JSON
app.get('/dados', (req, res) =>{
    let datas;
    //console.log(`Sending users to Client: ${req.socket.remoteAddress}`);
        fs.readFile('./public/src/calls.json', (err, data) =>{
            if(err){
                throw err;
            }
            datas = JSON.parse(data);
            try{
                res.send(datas);
            } catch(err){
                console.log(err);
                res.send(`ERROR! ${err}`)
            }
        })
})

//ROTA PARA LEITURA DO USUÁRIO POR ID
app.get('/dados/:id', (req, res) =>{
    const id = req.params.id;
    console.log(`Sending user id:${id} to Client: ${req.socket.remoteAddress}`);
        fs.readFile('./public/src/calls.json', (err, data) =>{
            if(err){
                throw err;
            }
            let users = JSON.parse(data).users;
            console.log(users.length);
            if(users.length < id){
                res.send('Usuário não encontrado!')
            } else {
                for (let i = 0; i < users.length; i++) {
                    if(users[i].id == id){
                        res.send(users[i])
                    }
                }
            }
    })
})

//DELETAR USUÁRIO
app.delete('/dados/:id', (req, res) => {
    const id = req.params.id;
    console.log(`Client: ${req.socket.remoteAddress} requested to delete user: ${id}`);
    let deletedUser;
    fs.readFile('./public/src/calls.json', (err, data) =>{
        if(err){
            throw err;
        }
        data = JSON.parse(data);
        
        deletedUser = data.users.find(user => user.id == id);
        let index = data.users.indexOf(deletedUser);
        data.users.splice(index, 1);

        fs.writeFile('./public/src/calls.json', JSON.stringify(data), (err) => {
            if(err){
                console.log(err);
            } else {
                console.log("Data updated sucessfully")
                res.status(204).send('Deleting user');
                console.log("Users new array: ", data.users);;
            }
        });
    })
})


//Adicionar usuário
app.put('/dados/:id', (req, res) => {
    const id = req.params.id;
    console.log(`Client: ${req.socket.remoteAddress} requested to update user: ${id}`);
    console.warn(req.body.name, req.body.region);

    fs.readFile('./public/src/calls.json', (err, data) =>{
        if(err){
            throw err;
        }
        data = JSON.parse(data);

        if(data.users.length < id && data.users.length > id){
            res.send('Usuário não encontrado!')
        } else {
            for (let i = 0; i < data.users.length; i++) {
                if(data.users[i].id == id){
                    data.users[i].nome = req.body.name;
                    data.users[i].region = req.body.region;
                }
            }
            fs.writeFile('./public/src/calls.json', JSON.stringify(data), (err) => {
                if(err){
                    console.log(err);
                } else {
                    console.log("User updated sucessfully")
                    res.status(204).send(`User updated!`);
                }
            });
        }
    })
})

//CRIAR NOVO USUÁRIO
app.post('/dados', (req, res) =>{
    fs.readFile('./public/src/calls.json', (err, data) =>{
        if(err){
            throw err;
        }
        data = JSON.parse(data);
        data.users.push({id: data.users.length + 1, nome: req.body.name, region: req.body.region})
        fs.writeFile('./public/src/calls.json', JSON.stringify(data), (err) => {
            if(err){
                console.log(err);
            } else {
                console.log("User added sucessfully")
                res.status(204).send(`User added!`);
            }
        });
    })
})

app.listen(PORT, HOST, () => {
    console.log(`Server running on: http://${HOST}:${PORT}`);
})
