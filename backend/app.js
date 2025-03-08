const express = require("express");
const cors = require('cors');
const cron = require('node-cron');
const mongoose = require("mongoose")
const confessRoute = require("./routes/conffes-route");
const SecretMessage=require("./models/secretmessage")
const secretMessageRoute = require("./routes/secretMessage-route")
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());


app.use(cors());

app.use("/confession", confessRoute);
app.use("/secret", secretMessageRoute);


app.use((error, req, res, next) => {
    if (req.headerSent) {
        return next(error)
    }

    res.status(error.code || 500);
    res.json({ message: error.message || "an unnown error" })
})

cron.schedule('0 * * * *', async () => { // Runs every hour
    const expirationTime = new Date(Date.now() -  12 * 60 * 60 *1000); // 12 hours ago
    await SecretMessage.deleteMany({ createdAt: { $lt: expirationTime } });
    console.log('Expired secrets deleted');
  });

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mernproject.e7paa.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=MERNproject`).then(() => {
    console.log("connected");
    app.listen(3000);
}).catch(err => {
    console.log(err);
})