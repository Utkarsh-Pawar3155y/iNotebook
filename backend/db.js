const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://Utkarsh:Utkarsh3155y@inotebook.qo4la09.mongodb.net/?appName=iNotebook";

const connectToMongo = async () => {
    await mongoose.connect(mongoURI);
    console.log("Connected to mongoDB successfully");
}

module.exports = connectToMongo;