const express = require('express');
const connection = require('./db');
const app = express();
const { appointmentRoute}=require('./Routes/appointment.route')
const {contectRoute}=require('./Routes/contect.route')
require("dotenv").config();

app.get("/",(req,res)=>{
    res.status(200).send("Welcome to TimeWizard Backend");
})
app.use("/appointment",appointmentRoute)
app.use("/contect",contectRoute)

app.listen(process.env.PORT, async()=>{
    await connection;
    console.log(`Server is running at PORT ${process.env.PORT}`);
})