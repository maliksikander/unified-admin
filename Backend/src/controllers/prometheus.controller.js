const promclient = require('prom-client');
const logger = require('../config/logger');

 const register = new promclient.Registry()

 // Add a default label which is added to all metrics
 register.setDefaultLabels({
     app: 'cim-backend'
 })
 
 // Enable the collection of default metrics
 promclient.collectDefaultMetrics({ register })
 

exports.getDefaultMetrics=async function (req, res) {
    // Return all metrics the Prometheus exposition format
    logger.info("Getting Prometheus default metrics")
    let metrics;
    try{
        res.set('Content-Type', register.contentType);
        metrics = await register.metrics();
    }
    catch(err)
    {
        logger.error("Error occured while getting prom metrics",JSON.stringify(err))
    }
    
    res.send(metrics);
}