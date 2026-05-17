import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username must be unique']
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email must be unique']
    },
    password:{
        type: String,
        required: [true, "Password is required"]
    },
    verified:{
        type: Boolean,
        default: false
    }
});

const userModel = mongoose.model("users", userSchema); // "users" is the name of the collection in MongoDB
// It will create a collection named "users" in MongoDB if it doesn't exist, and use the defined schema for documents in that collection.
//collection means table in SQL database. It is a group of documents in MongoDB that share the same structure defined by the schema.

export default userModel;