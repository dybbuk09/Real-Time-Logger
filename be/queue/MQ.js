const CC =  require("./CC");

class MQ {

    queueName = null

    cc = null

    connection = null

    channel = null

    constructor() {
        this.cc = new CC()
    }

    makeCC = async () => {
        this.connection = await this.cc.createConnection()
        this.channel = await this.connection.createChannel()
    }

    queue = async (queueName) => {
        //Create connection and channel before making a queue
        await this.makeCC()
        
        this.queueName = queueName

        //assertQueue -> find or create queue
        await this.channel.assertQueue(this.queueName)
        return this
    }

    sendMessage = (message) => {
        this.channel.sendToQueue(this.queueName, Buffer.from(message));
        return this
    }

    close = async (channel = true, connection = true) => {
        if (channel) {
            await this.channel.close();
        }
        if (connection) {
            await this.connection.close();
        }
        return true;
    }
}

module.exports = MQ