const mongoose = require('mongoose');

const Mongo = (function() {

    let instance = null

    function MongoConnection() {
        
        this.connections = {}

        this.connect = (db) => {
            if (!this.connections[db]) {
                this.connections[db] = mongoose.connect(`${process.env.MONGO_DSN}/${process.env.MONGO_DB_NAME}`);
            }
            return this.connections[db];
        }

    }

    return {
        getInstance : async () => {
            if (!instance) {
                //Make db connection
                instance = new MongoConnection
            }
            return instance
        }
    }

})()

module.exports = { Mongo : Mongo.getInstance(), mongoose : mongoose }