const express = require('express')
const registration = express.Router()
const db = require("../../DB/connection")
const md5 = require('md5');
const bcrypt = require('bcryptjs');
const multer = require("multer");
const crypto = require("crypto");
var path = require('path')



//file storage file naming for multer

var storage = multer.diskStorage({
    destination: 'Public//uploads/',
    filename: function(req, file, cb) {
        crypto.pseudoRandomBytes(16, function(err, raw) {
            if (err) return cb(err)

            cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
})


const upload = multer({
    storage: storage
})

let id = (Math.random() + 1).toString(36).substring(1);
id = md5(id);

registration.post("/ADMIN_REG", (req, res) => {
    const {
        email,
        password
    } = req.body;

    bcrypt.hash(password, 10, function(err, hash) {

        db.query('INSERT INTO user_login (id,email,password,type) VALUES (?,?,?,"2")', [id, email, hash], (err, result) => {
            if (err) {
                console.log(err);
                return res.json({
                    error: "1",
                    msg: "Something Went Wrong!"
                });
            }
            return res.json({
                error: "0",
                msg: "Admin Registered"
            });
        });

    });

})

//the initial registration process for the employee

registration.post("/initial", (req, res) => {

    //Current date

    let date_time = new Date();

    let date = ("0" + date_time.getDate()).slice(-2);

    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);

    let year = date_time.getFullYear();

    date = year + "-" + month + "-" + date;


    const {
        name,
        email,
        password
    } = req.body;


    db.query('SELECT id FROM user_login WHERE email = ?', [email], (err, results) => {


        if (err) {
            console.log(err);
        } else {

            if (results.length > 0) {
                return res.json({
                    error: "1",
                    msg: "Email Already Exists!"
                });
            } else {

                db.query('INSERT INTO employee (id,name,email,apply_date) VALUES (?,?,?,?)', [id, name, email, date], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.json({
                            error: "1",
                            msg: "Something Went Wrong!"
                        });
                    }
                });

                bcrypt.hash(password, 10, function(err, hash) {

                    db.query('INSERT INTO user_login (id,email,password,type) VALUES (?,?,?,"0")', [id, email, hash], (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.json({
                                error: "1",
                                msg: "Something Went Wrong!"
                            });
                        } else {

                            db.query('INSERT INTO admin_notification (data) VALUES (?)', ["You have a new pending request for " + name + " "], (err, result) => {

                            });

                            return res.json({
                                error: "0",
                                msg: "You are Successfully registered.<br> Kindly wait for the Confirmation."
                            });
                        }
                    });

                });




            }

        }
    })



});


//the second part of the employee registration process

registration.post("/EMP_REG_SECOND", (req, res) => {

    const {
        id,
        designation,
        phone,
        bank,
        bankAccNo,
        ifsc,
        dob
    } = req.body;


    db.query('SELECT id FROM user_login WHERE id = ? AND isactive = ?', [id, '1'], (err, results, fields) => {
        if (err) {
            console.log(err);
        } else {

            if (results.length > 0) {

                db.query('UPDATE employee set designation = ?,phone=?,bank_name=?,bank_acc_no=?,ifsc_code=?,dob=? where id = ?', [designation, phone, bank, bankAccNo, ifsc, dob, id], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.json({
                            error: "1",
                            msg: "Something Went Wrong!"
                        });
                    } else {
                        return res.json({
                            error: "0",
                            msg: "details updated successfully!"
                        });
                    }
                });

            } else {
                return res.json({
                    error: "1",
                    msg: "user not found!"
                });
            }
        }



    });

});


registration.post("/EMP_EDIT_DETAILS", (req, res) => {

    const {
        id,
        designation,
        total_leaves,
        salary,
        phone,
        bank,
        bankAccNo,
        ifsc,
        dob
    } = req.body;


    db.query('SELECT id FROM user_login WHERE id = ?', [id], (err, results, fields) => {
        if (err) {
            console.log(err);
        } else {

            if (results.length > 0) {

                db.query('UPDATE employee set designation = ?,phone=?,bank_name=?,bank_acc_no=?,ifsc_code=?,dob=?,salary=?,total_leave=? where id = ?', [designation, phone, bank, bankAccNo, ifsc, dob,salary,total_leaves, id], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.json({
                            error: "1",
                            msg: "Something Went Wrong!"
                        });
                    } else {
                        return res.json({
                            error: "0",
                            msg: "details updated successfully!"
                        });
                    }
                });

            } else {
                return res.json({
                    error: "1",
                    msg: "user not found!"
                });
            }
        }



    });

});

//the third part foe the registration process

registration.post("/upload", upload.array('avatar'), (req, res) => {

    const id = req.body.id;
    const fields = [
        'photo',
        'aadhar',
        'bank_passbook',
        'marksheet_10',
        'marksheet_12',
        'grad_marksheet',
        'pg_marksheet',
        'pan_id'
    ];

    const queries = fields.map((field, index) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE employee SET ${field} = ? WHERE id = ?`, [req.files[index].path, id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    });

    Promise.all(queries)
        .then(() => {
            res.json({
                error: "0",
                msg: "Details updated successfully!"
            });
        })
        .catch(err => {
            res.json({
                error: "1",
                msg: "Something went wrong!"
            });
        });

})



module.exports = registration;