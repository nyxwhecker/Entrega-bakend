import { createHash } from "../../utils.js";
import userModel from "../../dao/models/userModel.js";

export default class UserManager {
  constructor() {
    console.log("Constructor UserManager");
  }

  getAll = async () => {
    const result = await userModel.find();
    return result;
  };

  getById = async (id) => {
    const result = await userModel.findById(id);
    return result;
  };

  createUser = async (userData) => {
    userData.password = createHash(userData.password);
    const result = await userModel.create(userData);
    return result;
  };

  updateUser = async (id, userData) => {
  
    if (userData.password) {
      userData.password = createHash(userData.password);
    }
    const result = await userModel.updateOne({ _id: id }, { $set: userData });
    return result;
  };

  deleteUser = async (id) => {
    const result = await userModel.deleteOne({ _id: id });
    return result;
  };

  getAllUsersWithCart = async () => {
   
    try {
      const users = await userModel.find().populate("cart.product");
      return users;
    } catch (error) {
      console.log("error al obtener los usuarios ", error.message);
    }
  };

  // Paginación
  getPaginatedUsers = async (page = 1, limit = 10) => {
    try {
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
      };
      const users = await userModel.paginate({}, options);

      return users;
    } catch (error) {
      console.log("Error al realizar la paginación " + error.message);
    }
  };
}