var winston = require('winston');
require('./log4stuff').Log4stuff;

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Log4stuff)({applicationId: "winston_example"})
  ]
});

logger.log('info', 'Hello, this is a raw logging event',   { 'foo': 'bar' });
logger.log('info', 'Hello, this is a raw logging event 2', { 'foo': 'bar' });