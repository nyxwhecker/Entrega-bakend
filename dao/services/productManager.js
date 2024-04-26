import productsModel from "../models/products.js"

export default class ProductManager {

    constructor(){
        console.log("Trabajando con productManager")
    }

    getAll = async (page = 1, limit = 10, query = {}, sort = '') => {
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
    
        const skip = (page - 1) * limit;
    
        let sortOptions = {};
        if (sort === 'asc' || sort === 'desc') {
            sortOptions.price = sort === 'asc' ? 1 : -1;
        }
    
        const [result, totalDocs] = await Promise.all([
            productsModel.find(query).skip(skip).limit(limit).sort(sortOptions),
            productsModel.countDocuments(query)
        ]);
    
        const totalPages = Math.ceil(totalDocs / limit);
    
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;
    
        const hasPrevPage = prevPage !== null;
        const hasNextPage = nextPage !== null;
    
        const prevLink = hasPrevPage ? `/api/products?page=${prevPage}&limit=${limit}` : null;
        const nextLink = hasNextPage ? `/api/products?page=${nextPage}&limit=${limit}` : null;
    
        return {
            status: "success",
            payload: result,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        };
    }
    getById = async (id) => {
        let result = await productsModel.findById(id)
        return result
    }
    getByBrand = async (brand) => {
        let result = await productsModel.find({brand: brand})
        return result
    }
    addProduct = async (product) => {
        let result = await productsModel.create(product)
        return result
    }
    updateProduct = async (id, productData) => {
        let result = await productsModel.updateOne({_id:id}, {$set: productData})
        return result
    }
    deleteProduct = async (id) => {
        let result = await productsModel.deleleOne({_id:id})
        return result
    }

    
  getAllProductsWithCategories = async () => {
  
    try {
      const products = await productsModel.find().populate("category");
      return products;
    } catch (error) {
      console.log("Error  al obtener todos lo productos");
    }
  };

  //paginate
  getPaginatedProducts = async (page = 1, limit = 10) => {
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };
    const products = await productsModel.paginate({}, options);
    return products;
  };

}