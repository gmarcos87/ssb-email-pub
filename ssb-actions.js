const ssbClient = require('ssb-client')
const uuid = require('uuid/v1')
const config = require('./config')

var ssb = {
    private: {
        publish: function(data, ids, cb) {
            ssbClient(function (err, sbot) {
                sbot.whoami((err, data) => {
                    sbot.private.publish(data,[ids].concat([data.id]),cb)
                })
            })            
        }
    }
}


module.exports = {
    sendLink: (ssbId, username, db) => {
        //generate random hash  
        const hash = uuid()
        //save in db
        db.put(hash, JSON.stringify({ssbId: ssbId, username: username}), (err, value) => {
            //send ssb private message
            if (err) return console.log('Error saving hash', err)
            const message = `Confirm your new email address: ${username}@${config.domain} - ${config.url}/action/link/${hash}`
            ssb.private.publish({ type: 'post', text: message }, [ssbId], console.log)
        })
    },
    removeLink: (ssbId, username, db) => {
        //find username
        db.get(username, (err, data) => {
            if (err) return console.log('Error load hash', err)
            data = JSON.parse(data)
            if (data.ssbId === ssbId){
                //generate random hash  
                const hash = uuid()
                //save in db
                db.put(hash, JSON.stringify({ssbId: ssbId, username: username}), (err, value) => {
                    //send ssb private message
                    if (err) return console.log('Error saving hash', err)
                    const message = `Confirm your unlink: ${config.url}/action/unlink/${hash}`
                    ssb.private.publish({ type: 'post', text: message }, [ssbId], console.log)
                    return
                })
            }
            return console.log('Invalid data')
        })
    },
    toPrivateMessage: (message, cb) => {
        ssb.private.publish({ type: 'post', text: message.text, email: message.email }, [message.id], cb)
    }
}