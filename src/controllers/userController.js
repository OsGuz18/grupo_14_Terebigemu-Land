//Declaración de las constantes a utilizar 
const path = require('path'); //Requerimos la paquetería "path" incluida en node
const fs = require('fs');  //Requerimos la paquetería de filesystem incluida en node
const {validationResult} =require("express-validator")
const bcrypt = require('bcryptjs')

const usersFilePath = path.join(__dirname, '../data/users.json'); //Definimos la ruta que contiene nuestra base de datos 
let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8')); //Extraemos nuestros datos y los ponemos en formato de array


const controller = {
    register:(req,res) =>{
        res.render("Users/registerUser")
    },

    storage:(req,res) => {
        
        let errores =validationResult(req);
        let find = 0;
        
        if(errores.errors.length > 0){
          return  res.render("Users/registerUser",{
                errors:errores.mapped(),
                oldData: req.body
            })
        }

        users.forEach(user => {
            let compareEmail = bcrypt.compareSync(req.body.email, user.email)
            if(compareEmail){
                find = 1
            }
        });

        if(find == 1){
            return res.render("Users/registerUser",{
                errors:{
                    email:{
                        msg: "Este email ya esta registrado"
                    }
                },
                oldData: req.body
            })
        }else{
            id=users.length + 1
            let newUser={}
            let passEncrypt = bcrypt.hashSync(req.body.password,10);
            let emailEncrypt = bcrypt.hashSync(req.body.email,10);
            newUser={
                id: Date.now() + id,
                name:req.body.name,
                lastName: req.body.lastName,
                age: req.body.age,
                email:emailEncrypt,
                password:passEncrypt,
                gender:req.body.gender,
                address:req.body.address,
                level:req.body.level,
                Image: req.file.filename
            }   
            users.push(newUser);
            userListJSON=JSON.stringify(users,null,2);
            fs.writeFileSync(usersFilePath, userListJSON);
            res.redirect("/");
        }
        
    }
}

module.exports= controller; //Exportación del controlador 