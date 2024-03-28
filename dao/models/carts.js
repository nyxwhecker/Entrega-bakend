import mongoose from "mongoose";
const { Schema } = mongoose;

const cartSchema = new Schema({
    products: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "products"
    }]
});

const cartModel = mongoose.model("Carts", cartSchema);

export default cartModel;
