import mongoose from 'mongoose';

import mongoosePaginate from 'mongoose-paginate-v2' 
const { Schema } = mongoose;

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
    index: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
    cart: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

// plugin de paginación
userSchema.plugin(mongoosePaginate)

const userModel = mongoose.model("User", userSchema);


export default userModel;