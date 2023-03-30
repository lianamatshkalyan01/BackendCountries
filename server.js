const express = require('express')
const Sequelize = require('sequelize')
const app=express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
const sequelize = new Sequelize("mydb",null,null,{dialect:"sqlite", storage:"database.db"})

const Country = sequelize.define("country",{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    capital: Sequelize.STRING,
    land_area: Sequelize.FLOAT
})

Country.sync()
.then(()=> console.log("Table created successfully"))
.catch((err)=> console.log("Error creating table", err))

app.get('/country', (req,res)=>{
    const {limit, offset} = req.query;
    Country.count().then((count) => {
        Country.findAll({limit, offset}).then((country)=>{
            console.log(count);
            res.json({country, count});
        }).catch((err)=>{
            res.status(500).json({error:err.message});
        });
    })
});

app.get('/country/:id', (req, res)=>{
    const id= req.params.id
    Country.findByPk(id).then((country)=>{
        res.json(country)
    }).catch((err)=>{
        res.status(500).json({error:err.message})
    })
})

app.post('/country/new', (req,res)=>{
    const{name, capital, land_area}=req.body
    Country.create({name, capital, land_area}).then((country)=>{
        res.status(201).json(country)
    }).catch((err)=>{
        res.status(500).json({error:err.message})
    })
})

app.put('/country/update/:id', (req, res)=>{
    const id= req.params.id
    const{name, capital, land_area}=req.body
    Country.update({name, capital, land_area}, {where:{id:id}}).then((country)=>{
        res.status(201).json(country)
    }).catch((err)=>{
        res.status(500).json({error:err.message})
    })
})

app.delete('/country/delete/:id', (req, res)=>{
    const {id}=req.params
    Country.destroy({where:{id}}).then((country)=>{
        res.status(201).json(country)
    }).catch((err)=>{
        res.status(500).json({error:err.message})
    })
})

app.listen(4000)