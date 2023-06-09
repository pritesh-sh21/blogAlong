const mongoose = require('mongoose');
//Setting structure for  our future documents of db and assign them to the collection
// Create a new schema; struture for the data

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        mini: 4,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// when you call mongoose.model() on a schema, Mongoose compiles a model for you.

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;