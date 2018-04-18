const config = require('./config')

const httpServer = require('./http-server')  
const emailServer = require('./email-server')
const ssbServer = require('./ssb-server')
const ssbActions = require('./ssb-actions')

ssbActions.setSsb(ssbServer())


httpServer.listen(config.webPort, function() {  
    console.log('Web server listening on port ' + config.webPort)
})

emailServer.start({
    port: config.smtp.port,
    disableWebhook: true // Disable the webhook posting. 
})
