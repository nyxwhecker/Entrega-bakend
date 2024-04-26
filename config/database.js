import mongoose from "mongoose";

const DB_URL =
  `mongodb://127.0.0.1:27017/ecommerce?retryWrites=true&w=majority`; 
 
const connectDb = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.log("error de conexion");
  }
};
export default connectDb;