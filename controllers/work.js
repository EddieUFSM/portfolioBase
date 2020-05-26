const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')
const Category = require('../models/category')
const Work = require('../models/work')
const {errorHandler} = require('../helpers/dbErrorHandler')

exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.KeepExtnsions = true
    form.parse(req, (err, fields, files) => {
        if(err){
            return res.status(400).json({
                error: 'image could not be uploaded'
            })
        }

         //check for fields
         const {name, description, price, category, quantity, shipping} = fields

         if(!name || !description || !price || !category || !quantity || !shipping){
             return res.status(400).json({
                 error: "Todos os campos são requeridos"
             })
         }

        let work = new Work(fields)

        if(files.photo){
            console.log('Files Photo: ', files.photo)
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: "imagem deve ter menos que 1 megabyte de tamanho"
                })
            }
            work.photo.data = fs.readFileSync(files.photo.path)
            work.photo.contentType = files.photo.type
        }

        work.save((err, result) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result);
        })
    })
}

exports.workById = (req, res, next, id) => {
    Work.findById(id).exec((err, work)=> {
        if(err || !work){
            return res.status(400).json({
                error:"Produto não encontrado"
            })
        }
        req.work = work
        next();
    })
}

exports.read = (req, res) => {
    req.work.photo = undefined
    return res.json(req.work);
}

exports.remove = (req, res) => {
    let work = req.work
    work.remove((err, deletedWork)=>{
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            message: "Produto deletado com sucesso"
        })
    })
}

exports.update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.KeepExtnsions = true
    form.parse(req, (err, fields, files) => {
        if(err){
            return res.status(400).json({
                error: 'image could not be uploaded'
            })
        }
        
        //check for fields
        const {name, description, price, category, quantity, shipping} = fields

        if(!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({
                error: "Todos os campos são requeridos"
            })
        }

        let work = req.work
        work = _.extend(work, fields)

        if(files.photo){
            console.log('Files Photo: ', files.photo)
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: "imagem deve ter menos que 1 megabyte de tamanho"
                })
            }
            work.photo.data = fs.readFileSync(files.photo.path)
            work.photo.contentType = files.photo.type
        }


        work.save((err, result) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result);
        })
    })
}