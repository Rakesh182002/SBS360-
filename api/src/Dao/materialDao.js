import { query } from '../models/dbModel.js';
import db from '../config/db.js';

/**
 * Stores DAO
 */
export const getAllStores = async () => {
  const sql = 'SELECT * FROM eng_store_master ORDER BY StoreID DESC';
  return await query(sql);
};

export const getStoreById = async (storeId) => {
  const sql = 'SELECT * FROM eng_store_master WHERE StoreID = ?';
  const rows = await query(sql, [storeId]);
  return rows.length > 0 ? rows[0] : null;
};

export const insertStore = async (data, createdBy) => {
  const sql = `
    INSERT INTO eng_store_master (
      Store_Code, Branch_Name, Start_Date, Store_Name, 
      Address1, Address2, City, Country, Store_Description, 
      Incharge_Name, Remarks, CreatedDate, CreatedBy
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
  `;
  const params = [
    data.Store_Code || null,
    data.Branch_Name || null,
    data.Start_Date || null,
    data.Store_Name,
    data.Address1 || null,
    data.Address2 || null,
    data.City || null,
    data.Country || null,
    data.Store_Description || null,
    data.Incharge_Name || null,
    data.Remarks || null,
    createdBy
  ];
  const result = await query(sql, params);
  return result.insertId;
};

export const updateStore = async (storeId, data, updatedBy) => {
  const sql = `
    UPDATE eng_store_master 
    SET 
      Store_Code = ?, 
      Branch_Name = ?, 
      Start_Date = ?, 
      Store_Name = ?, 
      Address1 = ?, 
      Address2 = ?, 
      City = ?, 
      Country = ?, 
      Store_Description = ?, 
      Incharge_Name = ?, 
      Remarks = ?, 
      UpdatedDate = NOW(), 
      UpdatedBy = ?
    WHERE StoreID = ?
  `;
  const params = [
    data.Store_Code || null,
    data.Branch_Name || null,
    data.Start_Date || null,
    data.Store_Name,
    data.Address1 || null,
    data.Address2 || null,
    data.City || null,
    data.Country || null,
    data.Store_Description || null,
    data.Incharge_Name || null,
    data.Remarks || null,
    updatedBy,
    storeId
  ];
  await query(sql, params);
  return true;
};

export const deleteStore = async (storeId) => {
  const sql = 'DELETE FROM eng_store_master WHERE StoreID = ?';
  return await query(sql, [storeId]);
};

export const getLatestStoreCodes = async () => {
  const sql = "SELECT Store_Code FROM eng_store_master WHERE Store_Code LIKE 'CITI-ST%'";
  return await query(sql);
};


/**
 * Inwards DAO
 */
export const getAllInwards = async () => {
  const sql = `
    SELECT inw.*, s.Store_Name, sup.Company_Name as Supplier_Name, 
           CONCAT(emp.FirstName, ' ', COALESCE(emp.LastName, '')) as Receiver_Name 
    FROM eng_inward inw 
    LEFT JOIN eng_store_master s ON inw.StoreID = s.StoreID 
    LEFT JOIN eng_supplier_master sup ON inw.SupplierID = sup.SupplierID 
    LEFT JOIN eng_employee_profile emp ON inw.ReceivedBy = emp.UserID
    ORDER BY inw.Inward_ID DESC
  `;
  return await query(sql);
};

export const getInwardById = async (inwardId) => {
  const inwardSql = `
    SELECT inw.*, s.Store_Name, sup.Company_Name as Supplier_Name, 
           CONCAT(emp.FirstName, ' ', COALESCE(emp.LastName, '')) as Receiver_Name 
    FROM eng_inward inw 
    LEFT JOIN eng_store_master s ON inw.StoreID = s.StoreID 
    LEFT JOIN eng_supplier_master sup ON inw.SupplierID = sup.SupplierID 
    LEFT JOIN eng_employee_profile emp ON inw.ReceivedBy = emp.UserID
    WHERE inw.Inward_ID = ?
  `;
  const inwards = await query(inwardSql, [inwardId]);
  if (inwards.length === 0) return null;

  const descSql = `
    SELECT d.*, p.Product_Name, p.Product_Code 
    FROM eng_mm_inwdesc d 
    LEFT JOIN eng_product_master p ON d.ProductID = p.ProductID 
    WHERE d.Inward_ID = ?
  `;
  const items = await query(descSql, [inwardId]);
  
  return {
    ...inwards[0],
    items
  };
};

export const createInwardTransaction = async (inwardData, descriptionsList, createdBy) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert into eng_inward
    const [inwardResult] = await connection.execute(
      `INSERT INTO eng_inward (
         Inward_Number, StoreID, Branch_Name, SupplierID, Invoice_or_DO_Number, 
         Invoice_or_DO_Date, Receipt_Type, Received_Date, ReceivedBy, 
         CreatedBy, CreatedDate, DraftFlag
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [
        inwardData.Inward_Number || null,
        inwardData.StoreID,
        inwardData.Branch_Name || null,
        inwardData.SupplierID,
        inwardData.Invoice_or_DO_Number || null,
        inwardData.Invoice_or_DO_Date || null,
        inwardData.Receipt_Type || null,
        inwardData.Received_Date || null,
        inwardData.ReceivedBy || null,
        createdBy,
        inwardData.DraftFlag
      ]
    );
    const inwardId = inwardResult.insertId;

    // 2. Insert inward description list
    for (const desc of descriptionsList) {
      await connection.execute(
        `INSERT INTO eng_mm_inwdesc (Inward_ID, ProductID, Quantity, UoM, Remarks)
         VALUES (?, ?, ?, ?, ?)`,
        [
          inwardId,
          desc.ProductID,
          desc.Quantity,
          desc.UoM,
          desc.Remarks || null
        ]
      );
    }

    // 3. Write transaction log to eng_mm_trmaster if approved/confirmed (DraftFlag === 1)
    if (inwardData.DraftFlag === 1) {
      for (const desc of descriptionsList) {
        await connection.execute(
          `INSERT INTO eng_mm_trmaster (inoutadj_ref, ProductID, Quantity, UoM, StoreID, Trn_Date)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            `INW-${inwardId}`,
            desc.ProductID,
            desc.Quantity,
            desc.UoM,
            inwardData.StoreID,
            inwardData.Received_Date || null
          ]
        );
      }
    }

    await connection.commit();
    return inwardId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const updateInwardTransaction = async (inwardId, inwardData, descriptionsList, updatedBy) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Update eng_inward record
    await connection.execute(
      `UPDATE eng_inward 
       SET 
         Inward_Number = ?, StoreID = ?, Branch_Name = ?, SupplierID = ?, 
         Invoice_or_DO_Number = ?, Invoice_or_DO_Date = ?, Receipt_Type = ?, 
         Received_Date = ?, ReceivedBy = ?, UpdatedBy = ?, UpdatedDate = NOW(), DraftFlag = ?
       WHERE Inward_ID = ?`,
      [
        inwardData.Inward_Number || null,
        inwardData.StoreID,
        inwardData.Branch_Name || null,
        inwardData.SupplierID,
        inwardData.Invoice_or_DO_Number || null,
        inwardData.Invoice_or_DO_Date || null,
        inwardData.Receipt_Type || null,
        inwardData.Received_Date || null,
        inwardData.ReceivedBy || null,
        updatedBy,
        inwardData.DraftFlag,
        inwardId
      ]
    );

    // 2. Delete existing items in eng_mm_inwdesc
    await connection.execute(`DELETE FROM eng_mm_inwdesc WHERE Inward_ID = ?`, [inwardId]);

    // 3. Delete existing ledger entries in eng_mm_trmaster
    await connection.execute(`DELETE FROM eng_mm_trmaster WHERE inoutadj_ref = ?`, [`INW-${inwardId}`]);

    // 4. Insert new description items
    for (const desc of descriptionsList) {
      await connection.execute(
        `INSERT INTO eng_mm_inwdesc (Inward_ID, ProductID, Quantity, UoM, Remarks)
         VALUES (?, ?, ?, ?, ?)`,
        [
          inwardId,
          desc.ProductID,
          desc.Quantity,
          desc.UoM,
          desc.Remarks || null
        ]
      );
    }

    // 5. Insert new ledger entries if approved (DraftFlag === 1)
    if (inwardData.DraftFlag === 1) {
      for (const desc of descriptionsList) {
        await connection.execute(
          `INSERT INTO eng_mm_trmaster (inoutadj_ref, ProductID, Quantity, UoM, StoreID, Trn_Date)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            `INW-${inwardId}`,
            desc.ProductID,
            desc.Quantity,
            desc.UoM,
            inwardData.StoreID,
            inwardData.Received_Date || null
          ]
        );
      }
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};


/**
 * Outwards DAO
 */
export const getAllOutwards = async () => {
  const sql = `
    SELECT ouw.*, s.Store_Name, c.Company_Name as Client_Name, 
           CONCAT(emp.FirstName, ' ', COALESCE(emp.LastName, '')) as Deliverer_Name 
    FROM eng_outward ouw 
    LEFT JOIN eng_store_master s ON ouw.StoreID = s.StoreID 
    LEFT JOIN eng_client_master c ON ouw.ClientID = c.ClientID 
    LEFT JOIN eng_employee_profile emp ON ouw.DeliveredBy = emp.UserID
    ORDER BY ouw.Outward_ID DESC
  `;
  return await query(sql);
};

export const getOutwardById = async (outwardId) => {
  const outwardSql = `
    SELECT ouw.*, s.Store_Name, c.Company_Name as Client_Name, 
           CONCAT(emp.FirstName, ' ', COALESCE(emp.LastName, '')) as Deliverer_Name 
    FROM eng_outward ouw 
    LEFT JOIN eng_store_master s ON ouw.StoreID = s.StoreID 
    LEFT JOIN eng_client_master c ON ouw.ClientID = c.ClientID 
    LEFT JOIN eng_employee_profile emp ON ouw.DeliveredBy = emp.UserID
    WHERE ouw.Outward_ID = ?
  `;
  const outwards = await query(outwardSql, [outwardId]);
  if (outwards.length === 0) return null;

  const descSql = `
    SELECT d.*, p.Product_Name, p.Product_Code 
    FROM eng_mm_outdesc d 
    LEFT JOIN eng_product_master p ON d.ProductID = p.ProductID 
    WHERE d.Outward_ID = ?
  `;
  const items = await query(descSql, [outwardId]);
  
  return {
    ...outwards[0],
    items
  };
};

export const createOutwardTransaction = async (outwardData, descriptionsList, createdBy) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert into eng_outward
    const [outwardResult] = await connection.execute(
      `INSERT INTO eng_outward (
         Outward_Number, StoreID, Branch_Name, ClientID, DO_Number, 
         DO_Date, Outward_Type, Delivery_Date, Vehicle_Number, Delivery_Mode, 
         Project_Location, DeliveredBy, CreatedBy, CreatedDate, DraftFlag
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [
        outwardData.Outward_Number || null,
        outwardData.StoreID,
        outwardData.Branch_Name || null,
        outwardData.ClientID,
        outwardData.DO_Number || null,
        outwardData.DO_Date || null,
        outwardData.Outward_Type || null,
        outwardData.Delivery_Date || null,
        outwardData.Vehicle_Number || null,
        outwardData.Delivery_Mode || null,
        outwardData.Project_Location || null,
        outwardData.DeliveredBy || null,
        createdBy,
        outwardData.DraftFlag
      ]
    );
    const outwardId = outwardResult.insertId;

    // 2. Insert outward description list
    for (const desc of descriptionsList) {
      await connection.execute(
        `INSERT INTO eng_mm_outdesc (Outward_ID, ProductID, Quantity, UoM, Remarks)
         VALUES (?, ?, ?, ?, ?)`,
        [
          outwardId,
          desc.ProductID,
          desc.Quantity,
          desc.UoM,
          desc.Remarks || null
        ]
      );
    }

    // 3. Write transaction log (Quantity is negative: Quantity * -1) if DraftFlag === 1
    if (outwardData.DraftFlag === 1) {
      for (const desc of descriptionsList) {
        await connection.execute(
          `INSERT INTO eng_mm_trmaster (inoutadj_ref, ProductID, Quantity, UoM, StoreID, Trn_Date)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            `OUW-${outwardId}`,
            desc.ProductID,
            desc.Quantity * -1,
            desc.UoM,
            outwardData.StoreID,
            outwardData.Delivery_Date || null
          ]
        );
      }
    }

    await connection.commit();
    return outwardId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const updateOutwardTransaction = async (outwardId, outwardData, descriptionsList, updatedBy) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Update eng_outward record
    await connection.execute(
      `UPDATE eng_outward 
       SET 
         Outward_Number = ?, StoreID = ?, Branch_Name = ?, ClientID = ?, 
         DO_Number = ?, DO_Date = ?, Outward_Type = ?, Delivery_Date = ?, 
         Vehicle_Number = ?, Delivery_Mode = ?, Project_Location = ?, DeliveredBy = ?, 
         UpdatedBy = ?, UpdatedDate = NOW(), DraftFlag = ?
       WHERE Outward_ID = ?`,
      [
        outwardData.Outward_Number || null,
        outwardData.StoreID,
        outwardData.Branch_Name || null,
        outwardData.ClientID,
        outwardData.DO_Number || null,
        outwardData.DO_Date || null,
        outwardData.Outward_Type || null,
        outwardData.Delivery_Date || null,
        outwardData.Vehicle_Number || null,
        outwardData.Delivery_Mode || null,
        outwardData.Project_Location || null,
        outwardData.DeliveredBy || null,
        updatedBy,
        outwardData.DraftFlag,
        outwardId
      ]
    );

    // 2. Delete existing items in eng_mm_outdesc
    await connection.execute(`DELETE FROM eng_mm_outdesc WHERE Outward_ID = ?`, [outwardId]);

    // 3. Delete existing ledger entries in eng_mm_trmaster
    await connection.execute(`DELETE FROM eng_mm_trmaster WHERE inoutadj_ref = ?`, [`OUW-${outwardId}`]);

    // 4. Insert new description items
    for (const desc of descriptionsList) {
      await connection.execute(
        `INSERT INTO eng_mm_outdesc (Outward_ID, ProductID, Quantity, UoM, Remarks)
         VALUES (?, ?, ?, ?, ?)`,
        [
          outwardId,
          desc.ProductID,
          desc.Quantity,
          desc.UoM,
          desc.Remarks || null
        ]
      );
    }

    // 5. Insert new ledger entries if approved (DraftFlag === 1)
    if (outwardData.DraftFlag === 1) {
      for (const desc of descriptionsList) {
        await connection.execute(
          `INSERT INTO eng_mm_trmaster (inoutadj_ref, ProductID, Quantity, UoM, StoreID, Trn_Date)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            `OUW-${outwardId}`,
            desc.ProductID,
            desc.Quantity * -1,
            desc.UoM,
            outwardData.StoreID,
            outwardData.Delivery_Date || null
          ]
        );
      }
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};


/**
 * Stock Summary DAO
 */
export const getStockSummary = async () => {
  const sql = `
    SELECT tr.ProductID, p.Product_Code, p.Product_Name, 
           tr.StoreID, s.Store_Name, 
           SUM(tr.Quantity) as Quantity, tr.UoM
    FROM eng_mm_trmaster tr
    INNER JOIN eng_product_master p ON tr.ProductID = p.ProductID
    INNER JOIN eng_store_master s ON tr.StoreID = s.StoreID
    GROUP BY tr.ProductID, tr.StoreID, tr.UoM
    HAVING Quantity > 0
    ORDER BY p.Product_Name ASC
  `;
  return await query(sql);
};

export const getCurrentStock = async (productId, storeId) => {
  const sql = 'SELECT COALESCE(SUM(Quantity), 0) as stockcnt FROM eng_mm_trmaster WHERE ProductID = ? AND StoreID = ?';
  const rows = await query(sql, [productId, storeId]);
  return rows.length > 0 ? rows[0].stockcnt : 0;
};


/**
 * Stock Adjustments DAO
 */
export const getAllStockAdjusts = async () => {
  const sql = `
    SELECT saj.*, s.Store_Name, p.Product_Name, p.Product_Code,
           CONCAT(emp.FirstName, ' ', COALESCE(emp.LastName, '')) as Stock_Taken_By_Name
    FROM eng_mm_stockadj_master saj
    LEFT JOIN eng_store_master s ON saj.StoreID = s.StoreID
    LEFT JOIN eng_product_master p ON saj.ProductID = p.ProductID
    LEFT JOIN eng_employee_profile emp ON saj.Stock_Taken_By = emp.UserID
    ORDER BY saj.StockAdjID DESC
  `;
  return await query(sql);
};

export const getStockAdjustById = async (stockAdjId) => {
  const sql = `
    SELECT saj.*, s.Store_Name, p.Product_Name, p.Product_Code, p.Measuring_Unit as UoM,
           CONCAT(emp.FirstName, ' ', COALESCE(emp.LastName, '')) as Stock_Taken_By_Name
    FROM eng_mm_stockadj_master saj
    LEFT JOIN eng_store_master s ON saj.StoreID = s.StoreID
    LEFT JOIN eng_product_master p ON saj.ProductID = p.ProductID
    LEFT JOIN eng_employee_profile emp ON saj.Stock_Taken_By = emp.UserID
    WHERE saj.StockAdjID = ?
  `;
  const rows = await query(sql, [stockAdjId]);
  return rows.length > 0 ? rows[0] : null;
};

export const createStockAdjustmentTransaction = async (data, createdBy) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert into eng_mm_stockadj_master
    const [result] = await connection.execute(
      `INSERT INTO eng_mm_stockadj_master (
         Stock_Taking_Number, StoreID, Branch_Name, Stock_Taking_Date, 
         Stock_Taken_By, AdjReason, AdjType, Adj_Ref_Number, Adj_Ref_Date, 
         ProductID, Quantity, ActualStock, Remarks, CreatedBy, CreatedDate
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        data.Stock_Taking_Number || null,
        data.StoreID,
        data.Branch_Name || null,
        data.Stock_Taking_Date || null,
        data.Stock_Taken_By,
        data.AdjReason || null,
        data.AdjType,
        data.Adj_Ref_Number || null,
        data.Adj_Ref_Date || null,
        data.ProductID,
        data.Quantity,
        data.ActualStock || null,
        data.Remarks || null,
        createdBy
      ]
    );
    const stockAdjId = result.insertId;

    // 2. Insert ledger entry into eng_mm_trmaster
    // If AdjType === 1 (Decrease), quantity is negative
    const quantity = data.AdjType === 1 ? data.Quantity * -1 : data.Quantity;

    await connection.execute(
      `INSERT INTO eng_mm_trmaster (inoutadj_ref, ProductID, Quantity, UoM, StoreID, Trn_Date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        `SAJ-${stockAdjId}`,
        data.ProductID,
        quantity,
        data.Measuring_Unit || 'Nos',
        data.StoreID,
        data.Stock_Taking_Date || null
      ]
    );

    await connection.commit();
    return stockAdjId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};


/**
 * Dynamic report filters
 */
export const getFilterInwardReports = async (filter) => {
  let sql = `
    SELECT inw.*, s.Store_Name, sup.Company_Name as Supplier_Name, 
           CONCAT(emp.FirstName, ' ', COALESCE(emp.LastName, '')) as Receiver_Name 
    FROM eng_inward inw 
    LEFT JOIN eng_store_master s ON inw.StoreID = s.StoreID 
    LEFT JOIN eng_supplier_master sup ON inw.SupplierID = sup.SupplierID 
    LEFT JOIN eng_employee_profile emp ON inw.ReceivedBy = emp.UserID
    WHERE 1=1
  `;
  const params = [];

  if (filter.dateFrom) {
    sql += ' AND inw.Received_Date >= ?';
    params.push(filter.dateFrom);
  }

  if (filter.dateTo) {
    sql += ' AND inw.Received_Date <= ?';
    params.push(filter.dateTo);
  }

  sql += ' ORDER BY inw.Inward_ID DESC';
  return await query(sql, params);
};

export const getFilterOutwardReports = async (filter) => {
  let sql = `
    SELECT ouw.*, s.Store_Name, c.Company_Name as Client_Name, 
           CONCAT(emp.FirstName, ' ', COALESCE(emp.LastName, '')) as Deliverer_Name 
    FROM eng_outward ouw 
    LEFT JOIN eng_store_master s ON ouw.StoreID = s.StoreID 
    LEFT JOIN eng_client_master c ON ouw.ClientID = c.ClientID 
    LEFT JOIN eng_employee_profile emp ON ouw.DeliveredBy = emp.UserID
    WHERE 1=1
  `;
  const params = [];

  if (filter.dateFrom) {
    sql += ' AND ouw.Delivery_Date >= ?';
    params.push(filter.dateFrom);
  }

  if (filter.dateTo) {
    sql += ' AND ouw.Delivery_Date <= ?';
    params.push(filter.dateTo);
  }

  sql += ' ORDER BY ouw.Outward_ID DESC';
  return await query(sql, params);
};
