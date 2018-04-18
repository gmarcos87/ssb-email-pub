const db = require('./db')
const mailin = require('mailin')
const ssbClient = require('ssb-client')
const toPrivateMessage = require('./ssb-actions').toPrivateMessage


  

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
            console.log
        );
    }
    findSSBid(data.headers.to, db, send)
});

module.exports = mailin;