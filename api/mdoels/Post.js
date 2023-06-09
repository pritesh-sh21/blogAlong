const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: String,
    summary: String,
    content: String,
    cover: String,
    author:{type:mongoose.Schema.Types.ObjectId,ref:'User'},// to grab author name
}, {
    timestamps: true,//update timestamp to know when post is created
});

const PostModel = mongoose.model('Post', PostSchema);
module.exports = PostModel;