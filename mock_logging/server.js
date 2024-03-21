const winston = require('winston');
const { createLogger, transports } = winston;
const { LogstashTransport } = require('winston-logstash-transport');

const logger = createLogger({
  transports: [
    new transports.Console(),
    new LogstashTransport({
      host: 'logstash',
      port: 5001, // or your Logstash port
      max_retries: -1
    })
  ]
});

function sendLogs() {
  logger.info('Sending periodic log message to Logstash');
}

// Send logs every 5 seconds
setInterval(sendLogs, 5000);
