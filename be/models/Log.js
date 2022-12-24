const Model = require('./Model')

class Log extends Model {

    schema = {
        loggerId    :   Number,
        error       :   String,
        createdAt   :   Number
    }

    database = process.env.MONGO_DB_NAME

    collection = process.env.MONGO_COLLECTION_NAME

    constructor() {
        super()
    }

}

module.exports = { Log : (new Log).instance() }