const amqp = require("amqplib");

/**
 * Class to create RabbitMQ connectiona and channel
 */
class CC {

    connection = null

    createConnection = async () => {
        return await amqp.connect(process.env.MQ_DSN);
    }

    createChannel = async () => {
        return await this.connection.createChannel()
    }
}

module.exports = CC