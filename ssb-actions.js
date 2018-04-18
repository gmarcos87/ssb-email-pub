const ssbClient = require('ssb-client')
const uuid = require('uuid/v1')
const config = require('./config')

var sbot = null
ssbClient(function (err, ssb) {
    if (err) throw new Error('Error starting sbot')
    sbot = ssb;
})


module.exports = {
    sendLink: function (ssbId, username, db) {
        //generate random hash  
        const hash = uuid()
        //save in db
        db.put(hash, JSON.stringify({ssbId: ssbId, username: username}), (err, value) => {
            //send ssb private message
            if (err) return console.log('Error saving hash', err)
            const message = `Confirm your new email address: ${username}@${config.domain} - ${config.url}/action/link/${hash}`
            sbot.private.publish({ type: 'post', text: message }, [ssbId], console.log)
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
                    sbot.private.publish({ type: 'post', text: message }, [ssbId], console.log)
                    return
                })
            }
            return console.log('Invalid data')
        })

    }
}