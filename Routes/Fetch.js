const express = require('express')
const fetch = express.Router()
const db = require("../DB/connection")
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, "mysecretkey", (err, user) => {
        if (err) return res.sendStatus(403);

        if(user.type == '2'){
            next();
        }else{
             return res.sendStatus(403);
        }


    });
};
fetch.get("/EMP_PENDING", verifyToken, (req,res) => {

    db.query('SELECT * FROM employee WHERE hire_status = ?', ["0"], (err,result) =>{
        if(err){
            return res.json({ error: "1", msg: "Something went wrong!" });
        }else{
            return res.json({ error: "0", msg: result });
        }
    })

})


fetch.get("/EMP_HIRED",verifyToken, (req,res) => {

    db.query('SELECT * FROM employee', (err,result) =>{
        if(err){
            return res.json({ error: "1", msg: "Something went wrong!" });
        }else{
            return res.json({ error: "0", msg: result });
        }
    })

})
module.exports = fetch;