import mongoose, { Schema } from "mongoose";
//importar paginacion
 import mongoosePaginate from 'mongoose-paginate-v2'

const collection = "product";

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "category", 
    required: true, 
  },
  price: {
    type: Number, // Precio
  },
  brand: {
    type: String, // Marca
  },
  model: {
    type: String, // Modelo
  },
  colors: {
    type: [String], // Array de colores
  },
  sizes: {
    type: [String], // Array de talles
  },
  images: [
    {
      color: {
        type: String, // Color al que corresponde la imagen
      },
      url: {
        type: String, // URL de la imagen
      },
    },
  ],
});

 //populate y paginate
 productSchema.plugin(mongoosePaginate)

export default mongoose.model(collection, productSchema);