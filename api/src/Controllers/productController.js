import * as productService from '../services/productService.js';

/**
 * Get list of all active products
 */
export const getProducts = async (req, res, next) => {
  try {
    const result = await productService.getAllProducts();
    return res.status(200).json({
      success: true,
      message: 'Products retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get product details by ID
 */
export const getProductDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await productService.getProduct(parseInt(id, 10));
    return res.status(200).json({
      success: true,
      message: 'Product details retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new product
 */
export const createProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = await productService.createProduct(req.body, userId);
    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: { productId }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing product
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await productService.updateProduct(parseInt(id, 10), req.body, userId);
    return res.status(200).json({
      success: true,
      message: 'Product updated successfully.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a product by ID (soft-delete)
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await productService.deleteProduct(parseInt(id, 10), userId);
    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Get filtered list of products
 */
export const getFilterProducts = async (req, res, next) => {
  try {
    const result = await productService.getFilterProducts(req.body);
    return res.status(200).json({
      success: true,
      message: 'Filtered products retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};
