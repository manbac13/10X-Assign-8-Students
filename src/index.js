const express = require('express')
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/studentsdb');
const students = require("../models/studentdb")
const counter = require("../models/counter")
const initialData = require("./InitialData")
const app = express()
const bodyParser = require("body-parser");
const e = require('express');
const port = 8080
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here

app.get("/api/student", async(req,res)=>{
    const data = await students.find()
    res.json({
        data
    })
})

app.get("/api/student/:id", async(req,res)=>{
    const data = await students.findOne({id : req.params.id})
    if(data === null){
        res.status(404).json({
            message : "Invalid ID"
        })
    }
    else{
        res.json({
            data
        })
    }
    
})

app.post("/api/student", async(req,res)=>{
    
    let seqid;
    counter.findOneAndUpdate(
            {id : "updateID"},
            {$inc:{sequence_value:1}},
            {new : true},(err, counterdata)=>{
                console.log("countervalue ", counterdata)
                if(counterdata == null){
                    const newCounter =  counter.create({
                        id : "updateID",
                        sequence_value: 8
                    })
                    seqid = 8;
                }
                else{
                    seqid = counterdata.sequence_value;
                }
                const numberOfDocs = students.countDocuments();
                if(numberOfDocs === 0){
                    for(let i = 0; i < initialData.length; i++){
                        const data =  students.create(initialData[i]);
                    }
                }
                else{
                    try{
                        const data = students.create({
                            name : req.body.name,
                            currentClass : req.body.currentClass,
                            division : req.body.division,
                            id : seqid
                        })
                        res.setHeader('content-type','application/x-www-form-urlencoded')
                        res.json({
                            id : seqid
                        })
                    }
                    catch(error){
                        res.status(400).json({ 
                            msg : error.message,
                            message : "Incomplete or Invalid Details"
                        })
                    }
                    
                }
            }
        )

})

app.put("/api/student/:id", async(req,res)=>{
    try{
        const data = await students.updateOne({id : req.params.id}, {name : req.body.name, currentClass : req.body.currentClass,division : req.body.division});
        if(data === null){
            res.status(404).json({
                message : "Invalid ID"
            })
        }
        else{
            res.json({
                result : req.body
            })
        }
    }
    catch{
        res.status(400).json({
            message : "Either invalid ID or Update"
        })
    }
})

app.delete("/api/student/:id", async(req,res)=>{
    try{
        const data = await students.deleteOne({id : req.params.id});
        res.json({
            data
        })
    }
    catch(error){
        res.status(404).json({
            message : "Invalid ID"
        })
    }
})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   