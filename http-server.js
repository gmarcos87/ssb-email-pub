const express = require('express')  
const path = require('path')  
const bodyParser = require('body-parser')
const validate = require('./utils/validate')
const db  = require('./db')
const sendLink = require('./ssb-actions').sendLink
const removeLink = require('./ssb-actions').removeLink
const app = express()

const jsonParser = bodyParser.json()

app.use('/', express.static('html'))

app.post('/api/link', jsonParser, (req, res) => {
    Promise.all([
        validate.jsonLink(req.body),
        validate.hashExist(req.body.username, db)
    ]).then(result => {
        if (!result[1]) {
            if (result[0].status === 'ok') {
                sendLink(req.body.ssbId, req.body.username, db)
                res.json({status:'ok'})
            } else {
                res.json(result[0])
            }
        } else {
            res.json({status: 'error', message: 'Username already taken'})
        }
    }).catch(err => {
        res.json(err)
    })

})

app.post('/api/unlink',jsonParser, (req, res) => {
    Promise.all([
        validate.jsonLink(req.body),
        validate.hashExist(req.body.username, db)
    ]).then(result => {
        if (result[1]) {
            if (result[0].status === 'ok') {
                removeLink(req.body.ssbId, req.body.username, db)
                res.json({status:'ok'})
            } else {
                res.json(result[0])
            }
        } else {
            res.json({status: 'error', message: 'Username not found'})
        }
    }).catch(err => {
        res.json(err)
    })
})

app.use('/action/link/:hash', (req, res) => {
    validate.hashExist(req.params.hash,db)
        .then(exist => {
            if (exist === true) {
                db.get(req.params.hash, (err, value) => {
                    value = JSON.parse(value);
                    db.put(value.username, JSON.stringify(Object.assign(value, {confirm: true})))
                    res.redirect('/#linked')
                })
            } else {
                res.json({error: 'Hash not found'})
            }
        })
})

app.use('/action/unlink/:hash', (req, res) => {
    validate.hashExist(req.params.hash,db)
        .then(exist => {
            if (exist === true) {
                db.get(req.params.hash, (err, value) => {
                    value = JSON.parse(value);
                    db.put(value.username, JSON.stringify(Object.assign(value, {confirm: true, deleted: true})))
                    res.redirect('/#unlinked')
                })
            } else {
                res.json({error: 'Hash not found'})
            }
        })
})

module.exports = app  
