const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/notebook?readPreference=primary&appName=MongoDB%25Compass&directConnection=true';

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => { console.log('Connected to Mongo successfully') });
}

module.exports = connectToMongo;