const express = require('express')
const registration = express.Router()
const db = require("../DB/connection")
const md5 = require('md5');
const bcrypt = require('bcrypt');

let id = (Math.random() + 1).toString(36).substring(1);
id = md5(id);

registration.post("/ADMIN_REG", (req, res) => {
    const {email,password} = req.body;

    bcrypt.hash(password, 10, function(err, hash) {

        db.query('INSERT INTO user_login (id,email,password,type) VALUES (?,?,?,"2")',[id,email,hash], (err,result) =>{
            if (err){
                console.log(err);
                return res.json({ error: "1", msg: "Something Went Wrong!" });
            }
            return res.json({ error: "0", msg: "Admin Registered" });
        });

    });

})

registration.post("", (req, res) => {
     const {name,email,password} = req.body;
    res.send(email);
    console.log(email)


})
registration.post("/initial", (req, res) => {

    //Current date

    let date_time = new Date();

    let date = ("0" + date_time.getDate()).slice(-2);

    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);

    let year = date_time.getFullYear();

    date = year + "-" + month + "-" + date;


    const {name,email,password} = req.body;


    db.query('SELECT id FROM user_login WHERE email = ?',[email], (err,results) =>{


        if (err){
            console.log(err);
        }else{

            if(results.length > 0){
                return res.json({ error: "1", msg: "Email Already Exists!" });
            }else{

                db.query('INSERT INTO employee (id,name,email,apply_date) VALUES (?,?,?,?)',[id,name,email,date], (err,result) =>{
                    if (err){
                        console.log(err);
                        return res.json({ error: "1", msg: "Something Went Wrong!" });
                    }
                });

                bcrypt.hash(password, 10, function(err, hash) {

                    db.query('INSERT INTO user_login (id,email,password,type) VALUES (?,?,?,"0")',[id,email,hash], (err,result) =>{
                        if (err){
                            console.log(err);
                            return res.json({ error: "1", msg: "Something Went Wrong!" });
                        }
                    });

                });



                return res.json({ error: "0", msg: "You are Successfully registered.<br> Kindly wait for the Confirmation." });
            }

        }
    })



})


registration.post("/EMP_REG_FINAL",(req,res) =>{
    
});



module.exports = registration;