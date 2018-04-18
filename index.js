const httpServer = require('./http-server')  
const config = require('./config')
const emailServer = require('./email-server')

httpServer.listen(config.webPort, function() {  
    console.log('Web server listening on port ' + config.webPort)
})

emailServer.start({
    port: config.smtp.port,
    disableWebhook: true // Disable the webhook posting. 
})
