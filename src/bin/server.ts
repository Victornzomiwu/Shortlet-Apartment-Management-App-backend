import dotenv from "dotenv";
dotenv.config();
import { createServer } from "http";
import app from "../app";
import db from "../db";
import { alt } from "joi";
// import "../src/components/OAuth/index";

const port = process.env.PORT ?? 3000;

const server = createServer(app);

//please for whatever reason don't just think of {force:true}

db.sync()
  .then(() => console.log("database connected successfully"))
  .catch((err) => {
    console.error("Unable to connect to you to your database:", err);
  });
app.listen(port, () => {
  console.log(`server is live on http://localhost:${port}`);
});
