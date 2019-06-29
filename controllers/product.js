'use strict'

const Product= require('../models/product')

function getProduct(req, res) {
    let productId = req.params.productId

    Product.findById(productId, (err, product) => {
        if(err) return res.status(500).send({ message: `Error al realizar la peticion ${err}`})
        if(!product) return res.status(404).send({ message: `El producto no existe`})
         res.status(200).send({ product })
    })
}

function getProducts(req, res) {
    Product.find({}, (err, products) => {
        if(err) return res.status(500).send({ message: `Error al realizar la peticion ${err}`})
        if(!products) return res.status(404).send({ message: `No existen productos`})
        res.status(200).send({ products })
    })
}

function saveProduct(req, res) {
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
} 

function updateProduct(req, res) {
    let productId = req.params.productId
    let updated = req.body

    Product.findByIdAndUpdate(productId, updated, (err, productUpdated) => {
        if(err) return res.status(500).send({ message: `Error al actulizar el prodcuto ${err}`})
        res.status(200).send({ product: productUpdated })
    })
}

function deleteProduct(req, res) {
    let productId = req.params.productId

    Product.findById(productId, (err, product) => {
        if(err) return res.status(500).send({ message: `Error al borrar el prodcuto ${err}`})

        product.remove(err => {
            if(err) return res.status(500).send({ message: `Error al borrar el prodcuto ${err}`})
            res.status(200).send({ message: 'El producto ha sido eliminado' })
        })
    })
}

module.exports = {
    getProduct,
    getProducts,
    saveProduct,
    updateProduct,
    deleteProduct
}