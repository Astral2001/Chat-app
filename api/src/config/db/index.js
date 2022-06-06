const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URL,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
        )
        console.log("Connect to Database successfully!!!");
    } catch (err) {
        console.log("Connect to Database failed")
    }
}

module.exports = { connect };