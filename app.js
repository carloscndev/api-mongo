'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Product= require('./models/product')

const app = express()
const port = process.env.PORT || 3000


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/api/product', (req, res) => {
    Product.find({}, (err, products) => {
        if(err) return res.status(500).send({ message: `Error al realizar la peticion ${err}`})
        if(!products) return res.status(404).send({ message: `No existen productos`})
        res.status(200).send({ products })
    })
})

app.get('/api/product/:productId', (req, res) => {
    let productId = req.params.productId

    Product.findById(productId, (err, product) => {
        if(err) return res.status(500).send({ message: `Error al realizar la peticion ${err}`})
        if(!product) return res.status(404).send({ message: `El producto no existe`})
         res.status(200).send({ product })
    })
})

app.post('/api/product', (req, res) => {
    console.log('POST /api/product')
    console.log(req.body)

    let product = new Product()
    product.name = req.body.name
    product.picture = req.body.picture
    product.price = req.body.price
    product.category = req.body.category
    product.description = req.body.description

    product.save((err, productStored) => {
        if(err) res.status(500).send({ message: `Erro al salvar en la base de datos: ${err}`})
        
        res.status(200).send({ product: productStored })
    })
})

app.put('/api/product/:productId', (req, res) => {
    let productId = req.params.productId
    let updated = req.body

    Product.findByIdAndUpdate(productId, updated, (err, productUpdated) => {
        if(err) return res.status(500).send({ message: `Error al actulizar el prodcuto ${err}`})
        res.status(200).send({ product: productUpdated })
    })
})

app.delete('/api/product/:productId', (req,res) => {
    let productId = req.params.productId

    Product.findById(productId, (err, product) => {
        if(err) return res.status(500).send({ message: `Error al borrar el prodcuto ${err}`})

        product.remove(err => {
            if(err) return res.status(500).send({ message: `Error al borrar el prodcuto ${err}`})
            res.status(200).send({ message: 'El producto ha sido eliminado' })
        })
    })
})


mongoose.connect('mongodb://localhost:27017/shop', { useNewUrlParser: true }, (err, res) => {
    if(err) {
        return console.log(`Error al conectar a la base de datos: ${err}`)
    }

    console.log('Conexion a la base de datos establecida...')
    app.listen(port, () => 
        console.log(`Servidor corriendo en http://localhost:${port}`)
    )
})