import cartModel from "../models/carts.js"

export default class CartManager {

    constructor(){
        console.log("Trabajando con cartManager")
    }

    getCartById = async (id) => {
        try {
            let result = await cartModel.findById(id).populate('products');
            return result;
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            throw error;
        }
    }

    createCart = async () => {
        try {
            let result = await cartModel.create({});
            return result;
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            throw error;
        }
    }
    addProduct = async (cid, pid, quantity) => {
        let cart = await cartModel.findById(cid)
        let product = cart.products.find((product) => product.product.toString() === pid)

        if (product) {
            product.quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity });
        }

        return await cart.save();
    }

    deleteProduct = async (cid, pid) => {
        let cart = await cartModel.findById(cid);
        let productIndex = cart.products.findIndex((product) => product.product.toString() === pid);

        if (productIndex !== -1) {
            cart.products.splice(productIndex, 1); 
            return await cart.save(); 
        } else {
            console.log("Producto no encontrado en el carrito");
            return cart; 
        }
    };

    updateCart = async (cartId, products) => {
        let cart = await cartModel.findById(cartId);
        cart.products = products;
    
        return await cart.save();
    };
    
    updateProductQuantity = async (cartId, productId, quantity) => {
        let cart = await cartModel.findById(cartId);
    
        let product = cart.products.find(product => product.product.toString() === productId);
    
        if (product) {
            product.quantity = quantity;
            return await cart.save();
        } else {
            console.log("Producto no encontrado en el carrito");
            return null;
        }
    };
    
    removeAllProducts = async (cartId) => {
        let cart = await cartModel.findById(cartId);
    
        cart.products = [];
        return await cart.save();
    };
    

}