import * as productDao from '../Dao/productDao.js';

/**
 * Get all active products
 */
export const getAllProducts = async () => {
  return await productDao.getAllProducts();
};

/**
 * Retrieve specific product details
 */
export const getProduct = async (productId) => {
  const product = await productDao.getProductById(productId);
  if (!product) {
    throw { statusCode: 404, message: 'Product not found.' };
  }
  return product;
};

/**
 * Create a new product record
 */
export const createProduct = async (productData, createdBy) => {
  if (!productData.Product_Name) {
    throw { statusCode: 400, message: 'Product Name is required.' };
  }
  return await productDao.createProduct(productData, createdBy);
};

/**
 * Update an existing product record
 */
export const updateProduct = async (productId, productData, updatedBy) => {
  const product = await productDao.getProductById(productId);
  if (!product) {
    throw { statusCode: 404, message: 'Product not found.' };
  }
  return await productDao.saveProduct(productId, productData, updatedBy);
};

/**
 * Perform soft-delete on product record
 */
export const deleteProduct = async (productId, updatedBy) => {
  const product = await productDao.getProductById(productId);
  if (!product) {
    throw { statusCode: 404, message: 'Product not found.' };
  }
  await productDao.deleteProduct(productId, updatedBy);
  return true;
};


/**
 * Get filtered products list
 */
export const getFilterProducts = async (filter) => {
  return await productDao.getFilterProducts(filter);
};
