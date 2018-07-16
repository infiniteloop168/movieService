var winston = require('winston');
var CloudWatchTransport = require('winston-aws-cloudwatch');

var NODE_ENV = process.env.NODE_ENV || 'dev';

const logger = new winston.Logger({
  transports: [
    new (winston.transports.Console)({
      timestamp: true,
      colorize: true,
      //format: winston.format.simple()
    })
  ]
});

var config = {
  logGroupName: 'movie-log-group',
  logStreamName: NODE_ENV,
  createLogGroup: true,
  createLogStream: true,
  awsConfig: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: process.env.AWS_REGION
  },
  formatLog: function (item) {
    console.log("winston log");
    return item.level + ': ' + item.message + ' ' + JSON.stringify(item.meta)
  }
}

//if (NODE_ENV != 'dev') logger.add(CloudWatchTransport, config);
logger.add(CloudWatchTransport, config);
logger.level = process.env.LOG_LEVEL || "info";

logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};

module.exports = logger;