const express = require('express')
const con = require('./DB/connection')
const md5 = require('md5');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const reg = require("./Routes/Registration")
const fetch = require("./Routes/Fetch")
const auth = require("./Routes/Auth")
const routes = require("./Routes/Routes")
const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use('',routes)
app.use('/Register',reg)
app.use('/Fetch',fetch)
app.use('/Auth',auth)


app.listen(process.env.PORT)
