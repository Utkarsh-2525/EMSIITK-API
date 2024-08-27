const express = require('express')
const fetch = express.Router()
const db = require("../../DB/connection")
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

});

fetch.get("/Overview", verifyToken, async (req, res) => {
    try {

        const empResult = await new Promise((resolve, reject) => {
            db.query('SELECT COUNT(*) AS count FROM employee', (err, result) => {
                if (err) return reject(err);
                resolve(result[0].count);
            });
        });

        const intResult = await new Promise((resolve, reject) => {
            db.query('SELECT COUNT(*) AS count FROM intern', (err, result) => {
                if (err) return reject(err);
                resolve(result[0].count);
            });
        });

        const taskResult = await new Promise((resolve, reject) => {
            db.query('SELECT COUNT(*) AS count FROM tasks', (err, result) => {
                if (err) return reject(err);
                resolve(result[0].count);
            });
        });

        const pendResult = await new Promise((resolve, reject) => {
            db.query('SELECT COUNT(*) AS count FROM user_login WHERE isactive = ?', ['0'], (err, result) => {
                if (err) return reject(err);
                resolve(result[0].count);
            });
        });

        // All queries have completed successfully
        return res.json({
            error: "0",
            msg: {
                emp: empResult,
                int: intResult,
                task: taskResult,
                pend: pendResult
            }
        });

    } catch (err) {
        // Handle errors here
        return res.json({ error: "1", msg: "NaN" });
    }
});
module.exports = fetch;