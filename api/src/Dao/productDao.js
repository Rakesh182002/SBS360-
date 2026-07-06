import { query } from '../models/dbModel.js';

/**
 * Get all active products
 */
export const getAllProducts = async () => {
  const sql = 'SELECT * FROM eng_product_master WHERE IsActive = 1 ORDER BY ProductID DESC';
  return await query(sql);
};

/**
 * Get product details by ID
 */
export const getProductById = async (productId) => {
  const sql = 'SELECT * FROM eng_product_master WHERE ProductID = ? AND IsActive = 1';
  const rows = await query(sql, [productId]);
  return rows.length > 0 ? rows[0] : null;
};

/**
 * Create a new product
 */
export const createProduct = async (data, createdBy) => {
  const sql = `
    INSERT INTO eng_product_master (
      Product_Name, Product_Type, Product_Company_Name, Product_Description,
      Dimension, Measuring_Unit, Unit_Price, Product_Code,
      CreatedDate, CreatedBy, IsActive, Barcode1, Barcode2
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, 1, ?, ?)
  `;

  const params = [
    data.Product_Name || null,
    data.Product_Type || null,
    data.Product_Company_Name || null,
    data.Product_Description || null,
    data.Dimension || null,
    data.Measuring_Unit || null,
    data.Unit_Price !== undefined && data.Unit_Price !== null ? parseFloat(data.Unit_Price) : null,
    data.Product_Code || null,
    createdBy,
    data.Barcode1 || null,
    data.Barcode2 || null
  ];

  const result = await query(sql, params);
  return result.insertId;
};

/**
 * Update an existing product
 */
export const saveProduct = async (productId, data, updatedBy) => {
  const sql = `
    UPDATE eng_product_master 
    SET 
      Product_Name = ?,
      Product_Type = ?,
      Product_Company_Name = ?,
      Product_Description = ?,
      Dimension = ?,
      Measuring_Unit = ?,
      Unit_Price = ?,
      Product_Code = ?,
      UpdatedDate = NOW(),
      UpdatedBy = ?,
      Barcode1 = ?,
      Barcode2 = ?
    WHERE ProductID = ?
  `;

  const params = [
    data.Product_Name || null,
    data.Product_Type || null,
    data.Product_Company_Name || null,
    data.Product_Description || null,
    data.Dimension || null,
    data.Measuring_Unit || null,
    data.Unit_Price !== undefined && data.Unit_Price !== null ? parseFloat(data.Unit_Price) : null,
    data.Product_Code || null,
    updatedBy,
    data.Barcode1 || null,
    data.Barcode2 || null,
    productId
  ];

  await query(sql, params);
  return true;
};

/**
 * Soft delete a product by setting IsActive = 0
 */
export const deleteProduct = async (productId, updatedBy) => {
  const sql = `
    UPDATE eng_product_master 
    SET IsActive = 0, UpdatedBy = ?, UpdatedDate = NOW()
    WHERE ProductID = ?
  `;
  return await query(sql, [updatedBy, productId]);
};

/**
 * Get filtered products list
 */
export const getFilterProducts = async (filter) => {
  let sql = 'SELECT * FROM eng_product_master WHERE IsActive = 1';
  const params = [];

  if (filter.Product_Name && filter.Product_Name.trim() !== '') {
    sql += ' AND Product_Name LIKE ?';
    params.push(`%${filter.Product_Name.trim()}%`);
  }

  if (filter.Product_Company_Name && filter.Product_Company_Name.trim() !== '') {
    sql += ' AND Product_Company_Name LIKE ?';
    params.push(`%${filter.Product_Company_Name.trim()}%`);
  }

  if (filter.Product_Code && filter.Product_Code.trim() !== '') {
    sql += ' AND Product_Code LIKE ?';
    params.push(`%${filter.Product_Code.trim()}%`);
  }

  sql += ' ORDER BY ProductID DESC';

  return await query(sql, params);
};
