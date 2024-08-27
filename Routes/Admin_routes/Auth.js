const express = require('express')
const auth = express.Router()
const db = require("../../DB/connection")
const md5 = require('md5');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



auth.post("/EMP_AUTH", (req,res) =>{

    const {email,password} = req.body;

    db.query("select * from user_login where email = ?", [email], (err,result) => {

        if(err){
            return res.json({ error: "1", msg: "Something Went Wrong!" });
        }else{

            if(result.length > 0){



                bcrypt.compare(password, result[0].password, function(err, check) {

                    if(err){
                        return res.json({ error: "1", msg: "Something Went Wrong!" });
                    }

                    if(check == true){

                        const token = jwt.sign({
                           id: result[0].id,
                            type: result[0].type
                        }, "mysecretkey", { expiresIn: '1h' });

                        return res.json({ error: "0", msg: token });

                    }else{
                        return res.json({ error: "1", msg: "Wrong credentials!" });
                    }
                });

            }else {

                return res.json({ error: "1", msg: "Wrong credentials" });

            }

        }

    });

});


module.exports = auth;