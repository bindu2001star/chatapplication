const express=require('express');
const cors=require('cors');
const bodyparser=require('body-parser');
const path=require('path');
const app=express();


app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))


const sequelize = require('./util/database');





const userRoutes=require('./Routes/user');



const User=require('./model/users');


app.use('/user',userRoutes);



app.use(express.static(path.join(__dirname,'view')));
// app.use(cors({origin:'*'}))


app.get('/',(req,res)=>{
    
    res.sendFile(path.join(__dirname,'view','signup.html'))
})



sequelize.sync({force:true})
.then(()=>{
    console.log("details synced with database")
})
.catch((err)=>{
    console.log("details could not be synced with database")
})

app.listen(3004);