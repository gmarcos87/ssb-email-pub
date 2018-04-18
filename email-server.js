const db = require('./db')
const mailin = require('mailin')
const ssbClient = require('ssb-client')

var ssb = null
var ssbId = null
ssbClient(function (err, sbot) {
    ssb = sbot;
    sbot.whoami((err,info)=>{
        ssbId = info.id
        console.log('SSB', info)
    })
})

const toPrivateMessage = (message, sbot, cb) => {
    console.log(message)
    sbot.private.publish({ type: 'post', text: message.text, email: message.email }, [ssbId, message.id], cb)
}
  

const findSSBid = (address, db, cb) => {
    const username = address.split('@')[0];
    db.get(username, (err, data) => {
        if (err) return cb(new Error('Email not found'))
        data = JSON.parse(data);
        console.log(data)
        if (data.deleted !== true && data.confirm === true) {
            cb(null, { id: data.ssbId })
            return;
        }
        cb(new Error('Email not found'))
    })
}
   
mailin.on('message', function (connection, data, content) {
    const send = (err, address) => {
        if (err) return console.log(err)
        toPrivateMessage(
            {
                id: address.id,
                text: `### **From:** ${data.headers.from}\n### **Subject:** ${data.subject}\n### **Date:** ${new Date(data.date).toLocaleDateString()}\n------\n${data.text}`,
                email: data.headers
            },
            ssb,
            console.log
        );
    }
    findSSBid(data.headers.to, db, send)
});

module.exports = mailin;