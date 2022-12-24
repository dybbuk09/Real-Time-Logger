const { Schema } = require("mongoose")
const { mongoose, Mongo } = require("../../database/Mongo")

class Model {

    constructor() {}

    model = (database, collection, schema) => {
        (async function() {
            await (await Mongo).connect(database)
        })()
        return mongoose.model(collection, schema)
    }

    instance = () => {
        return this.model(this.database, this.collection, new Schema(this.schema))
    }

}

module.exports = Model