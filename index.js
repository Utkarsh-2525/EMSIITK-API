const express = require('express')
const con = require('./DB/connection')
const md5 = require('md5');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const reg = require("./Routes/Emp_routes/Registration")
const fetch = require("./Routes/Admin_routes/Fetch")
const auth = require("./Routes/Admin_routes/Auth")
const routes = require("./Routes/Admin_routes/Routes")
const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use('',routes)
app.use('/Employee/Register',reg)
app.use('/Admin/Fetch',fetch)
app.use('/Admin/Auth',auth)


app.listen(8000)