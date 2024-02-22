import express from "express";
import mongoDBUrl from "./config.js";
import userRoute from './routes/userRoute.js';
import trackRoute from './routes/trackRoute.js';
import adminRoute from './routes/adminRoute.js';
import cors from "cors";
import mongoose from "mongoose";

const port = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World").sendStatus(200);
});

app.use('/',userRoute);
app.use('/track-info',trackRoute);
app.use('/admin',adminRoute);

mongoose
  .connect(mongoDBUrl)
  .then(() => {
    console.log("App Connected to DB");
    app.listen(port, () => { 
      console.log(`App is listening to ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
