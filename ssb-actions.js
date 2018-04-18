const uuid = require('uuid/v1')
const config = require('./config')

let actions = {
    actions: null,
    ssbId: null,
    setSsb: function(ssb) {
        actions.ssb = ssb
        ssb.whoami((err, info) => {
            actions.ssbId = info.id
        })
    },
    sendLink: function (ssbId, username, db) {
        //generate random hash  
        const hash = uuid()
        //save in db
        db.put(hash, JSON.stringify({ssbId: ssbId, username: username}), (err, value) => {
            //send ssb private message
            if (err) return console.log('Error saving hash', err)
            const message = `Confirm your new email address: ${username}@${config.domain} - ${config.url}/action/link/${hash}`
            actions.ssb.private.publish({ type: 'post', text: message }, [actions.ssbId, ssbId], console.log)
        })
    },
    removeLink: function (ssbId, username, db) {
        //find username
        db.get(username, function(err, data) {
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
                    actions.ssb.private.publish({ type: 'post', text: message }, [actions.ssbId, ssbId], console.log)
                    return
                })
            }
            return console.log('Invalid data')
        })
    },
    toPrivateMessage: (message, cb) => {
        actions.ssb.private.publish({ type: 'post', text: message.text, email: message.email }, [actions.ssbId, message.id], cb)
    }
}

module.exports = actions;