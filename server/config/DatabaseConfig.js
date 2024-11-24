import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const databaseConnect = () => {
  const DATABASE_URL = process.env.DATABASE_URL;

  mongoose
    .connect(DATABASE_URL)
    .then(() => {
      console.log("Database connection is successfully");
    })
    .catch((error) => {
      console.error("Database connect error at: ", error.message);
    });
};

export default databaseConnect;
