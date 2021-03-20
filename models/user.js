const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true
    },
    cart:{//embedded documet    
        item: []
    }
});

module.exports = mongoose.model('User', userSchema);