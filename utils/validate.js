const ref = require('ssb-ref')

function has(obj) {
    obj.has = (key) => {
        return (obj[key] !== undefined && obj[key] !== '')
    }
    return obj;
}

module.exports = {
    jsonLink: function(data) {
        data = has(data)
        if (
            data.has('username') &&
            data.has('ssbId') &&
            ref.isFeedId(data.ssbId) &&
            data.has('action')
        ) {
            return Promise.resolve({status: 'ok'})
        }
        return Promise.reject({
            status: 'error',
            message: 'Wrong data',
            validation: {
                username: data.has('username'),
                ssbId: data.has('ssbId') && ref.isFeedId(data.ssbId),
                action: data.has('action')
            }
        })
    },

    hashExist: function(hash, db) {
        return new Promise((res, rej) => {
            db.get(hash,(err, value) => {
                if (err) { res(false); return }
                res(true)
            })
        })
    }
}