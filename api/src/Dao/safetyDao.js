import { query } from '../models/dbModel.js';
import db from '../config/db.js';

/**
 * Safety Master (Hazards & PPE List)
 */
export const getAllHazards = async () => {
  return await query('SELECT * FROM eng_sys_safety_hazard ORDER BY HazardID ASC');
};

export const getAllPPEs = async () => {
  return await query('SELECT * FROM eng_sys_safety_ppelist ORDER BY PPEID ASC');
};

export const getAllSafetyInspectionItems = async () => {
  return await query('SELECT * FROM eng_sys_safety_insp_items ORDER BY SIItemID ASC');
};

/**
 * Safety Master Declarations
 */
export const getAllSafetys = async () => {
  return await query(`
    SELECT sm.*, 
           CONCAT(emp.FirstName, ' ', COALESCE(emp.LastName, '')) as SubmittedByName
    FROM eng_safety_master sm
    LEFT JOIN eng_employee_profile emp ON sm.SubmittedBy = emp.UserID
    ORDER BY sm.SafetyID DESC
  `);
};

export const getSafetyById = async (safetyId) => {
  const master = await query('SELECT * FROM eng_safety_master WHERE SafetyID = ?', [safetyId]);
  if (master.length === 0) return null;

  const hazards = await query('SELECT HazardID FROM eng_safety_hazard_list WHERE SafetyID = ?', [safetyId]);
  const ppes = await query('SELECT PPEID FROM eng_safety_ppe_list WHERE SafetyID = ?', [safetyId]);
  const workers = await query(`
    SELECT swl.EmpID as UserID, CONCAT(emp.FirstName, ' ', COALESCE(emp.LastName, '')) as FullName
    FROM eng_safety_worker_list swl
    JOIN eng_employee_profile emp ON swl.EmpID = emp.UserID
    WHERE swl.SafetyID = ?
  `, [safetyId]);

  return {
    ...master[0],
    hazardList: hazards.map(h => h.HazardID),
    ppeList: ppes.map(p => p.PPEID),
    workerList: workers
  };
};

export const createSafetyTransaction = async (data, submittedBy) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `INSERT INTO eng_safety_master (
         CompanyName, ProjectTitle, RepDate, RepTime, LocationOfWork, 
         OtherHazard, SubmittedBy, ASHMeasures, Status, CreatedDate
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        data.CompanyName || 'City Construction Eng Pte Ltd',
        data.ProjectTitle || null,
        data.RepDate || null,
        data.RepTime || null,
        data.LocationOfWork || null,
        data.OtherHazard || null,
        submittedBy,
        data.ASHMeasures || null,
        data.Status || 1
      ]
    );
    const safetyId = result.insertId;

    if (data.hazardList && Array.isArray(data.hazardList)) {
      for (const hazardId of data.hazardList) {
        await connection.execute(
          'INSERT INTO eng_safety_hazard_list (SafetyID, HazardID) VALUES (?, ?)',
          [safetyId, hazardId]
        );
      }
    }

    if (data.ppeList && Array.isArray(data.ppeList)) {
      for (const ppeId of data.ppeList) {
        await connection.execute(
          'INSERT INTO eng_safety_ppe_list (SafetyID, PPEID) VALUES (?, ?)',
          [safetyId, ppeId]
        );
      }
    }

    if (data.workerList && Array.isArray(data.workerList)) {
      for (const empId of data.workerList) {
        await connection.execute(
          'INSERT INTO eng_safety_worker_list (SafetyID, EmpID) VALUES (?, ?)',
          [safetyId, empId]
        );
      }
    }

    await connection.commit();
    return safetyId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const updateSafetyTransaction = async (safetyId, data, updatedBy) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    await connection.execute(
      `UPDATE eng_safety_master 
       SET CompanyName = ?, ProjectTitle = ?, RepDate = ?, RepTime = ?, 
           LocationOfWork = ?, OtherHazard = ?, ASHMeasures = ?, Status = ?, 
           UpdatedBy = ?, UpdatedDate = NOW()
       WHERE SafetyID = ?`,
      [
        data.CompanyName || 'City Construction Eng Pte Ltd',
        data.ProjectTitle || null,
        data.RepDate || null,
        data.RepTime || null,
        data.LocationOfWork || null,
        data.OtherHazard || null,
        data.ASHMeasures || null,
        data.Status || 1,
        updatedBy,
        safetyId
      ]
    );

    // Delete existing records
    await connection.execute('DELETE FROM eng_safety_hazard_list WHERE SafetyID = ?', [safetyId]);
    await connection.execute('DELETE FROM eng_safety_ppe_list WHERE SafetyID = ?', [safetyId]);
    await connection.execute('DELETE FROM eng_safety_worker_list WHERE SafetyID = ?', [safetyId]);

    // Insert updated lists
    if (data.hazardList && Array.isArray(data.hazardList)) {
      for (const hazardId of data.hazardList) {
        await connection.execute(
          'INSERT INTO eng_safety_hazard_list (SafetyID, HazardID) VALUES (?, ?)',
          [safetyId, hazardId]
        );
      }
    }

    if (data.ppeList && Array.isArray(data.ppeList)) {
      for (const ppeId of data.ppeList) {
        await connection.execute(
          'INSERT INTO eng_safety_ppe_list (SafetyID, PPEID) VALUES (?, ?)',
          [safetyId, ppeId]
        );
      }
    }

    if (data.workerList && Array.isArray(data.workerList)) {
      for (const empId of data.workerList) {
        await connection.execute(
          'INSERT INTO eng_safety_worker_list (SafetyID, EmpID) VALUES (?, ?)',
          [safetyId, empId]
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

export const deleteSafetyTransaction = async (safetyId) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    await connection.execute('DELETE FROM eng_safety_hazard_list WHERE SafetyID = ?', [safetyId]);
    await connection.execute('DELETE FROM eng_safety_ppe_list WHERE SafetyID = ?', [safetyId]);
    await connection.execute('DELETE FROM eng_safety_worker_list WHERE SafetyID = ?', [safetyId]);
    await connection.execute('DELETE FROM eng_safety_master WHERE SafetyID = ?', [safetyId]);

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
 * Safety Inspections (SI)
 */
export const getAllSafetyInspections = async () => {
  return await query(`
    SELECT sim.*, p.ProjectName
    FROM eng_safety_insp_master sim
    LEFT JOIN eng_project_master p ON sim.ProjectID = p.ProjectID
    ORDER BY sim.SAFINSID DESC
  `);
};

export const getSafetyInspectionById = async (safInsId) => {
  const master = await query(`
    SELECT sim.*, p.ProjectName
    FROM eng_safety_insp_master sim
    LEFT JOIN eng_project_master p ON sim.ProjectID = p.ProjectID
    WHERE sim.SAFINSID = ?
  `, [safInsId]);
  if (master.length === 0) return null;

  const details = await query(`
    SELECT sid.*, sii.SIItemDesc, sii.SectionName
    FROM eng_safety_insp_detail sid
    LEFT JOIN eng_sys_safety_insp_items sii ON sid.SIItemID = sii.SIItemID
    WHERE sid.SAFINSID = ?
  `, [safInsId]);

  return {
    ...master[0],
    details
  };
};

export const createSafetyInspectionTransaction = async (data, createdBy) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `INSERT INTO eng_safety_insp_master (
         SafetyRefNum, ProjectID, SIDate, ProjectLocation, InspectedBy, Address,
         Safety_Cert_Info, Senior_Construction_Manager, Project_Manager, 
         Site_Manager, Zone_Construction_Manager, Safety_Manager, Safety_Officer,
         CreatedBy, CreatedDate
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        data.SafetyRefNum || null,
        data.ProjectID || null,
        data.SIDate || null,
        data.ProjectLocation || null,
        data.InspectedBy || null,
        data.Address || null,
        data.Safety_Cert_Info || null,
        data.Senior_Construction_Manager || null,
        data.Project_Manager || null,
        data.Site_Manager || null,
        data.Zone_Construction_Manager || null,
        data.Safety_Manager || null,
        data.Safety_Officer || null,
        createdBy
      ]
    );
    const safInsId = result.insertId;

    if (data.details && Array.isArray(data.details)) {
      for (const item of data.details) {
        await connection.execute(
          `INSERT INTO eng_safety_insp_detail (
             SAFINSID, SIItemID, Is_Applicable, Recommendation, ResponsiblePerson, ACDate
           ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            safInsId,
            item.SIItemID,
            item.Is_Applicable || null,
            item.Recommendation || null,
            item.ResponsiblePerson || null,
            item.ACDate || null
          ]
        );
      }
    }

    await connection.commit();
    return safInsId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const updateSafetyInspectionTransaction = async (safInsId, data, updatedBy) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    await connection.execute(
      `UPDATE eng_safety_insp_master
       SET SafetyRefNum = ?, ProjectID = ?, SIDate = ?, ProjectLocation = ?, 
           InspectedBy = ?, Address = ?, Safety_Cert_Info = ?, 
           Senior_Construction_Manager = ?, Project_Manager = ?, Site_Manager = ?, 
           Zone_Construction_Manager = ?, Safety_Manager = ?, Safety_Officer = ?,
           UpdatedBy = ?, UpdatedDate = NOW()
       WHERE SAFINSID = ?`,
      [
        data.SafetyRefNum || null,
        data.ProjectID || null,
        data.SIDate || null,
        data.ProjectLocation || null,
        data.InspectedBy || null,
        data.Address || null,
        data.Safety_Cert_Info || null,
        data.Senior_Construction_Manager || null,
        data.Project_Manager || null,
        data.Site_Manager || null,
        data.Zone_Construction_Manager || null,
        data.Safety_Manager || null,
        data.Safety_Officer || null,
        updatedBy,
        safInsId
      ]
    );

    // Delete existing details
    await connection.execute('DELETE FROM eng_safety_insp_detail WHERE SAFINSID = ?', [safInsId]);

    // Insert updated details
    if (data.details && Array.isArray(data.details)) {
      for (const item of data.details) {
        await connection.execute(
          `INSERT INTO eng_safety_insp_detail (
             SAFINSID, SIItemID, Is_Applicable, Recommendation, ResponsiblePerson, ACDate
           ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            safInsId,
            item.SIItemID,
            item.Is_Applicable || null,
            item.Recommendation || null,
            item.ResponsiblePerson || null,
            item.ACDate || null
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
 * ESH Safety Inspections (New SI)
 */
export const getAllEhsInspections = async () => {
  return await query(`
    SELECT esh.*, p.ProjectName, 
           CONCAT(emp.FirstName, ' ', COALESCE(emp.LastName, '')) as InspectedByName
    FROM eng_safety_esh esh
    LEFT JOIN eng_project_master p ON esh.ProjectID = p.ProjectID
    LEFT JOIN eng_employee_profile emp ON esh.InspectedBy = emp.UserID
    ORDER BY esh.NSIID DESC
  `);
};

export const getEhsInspectionById = async (nsiId) => {
  const row = await query(`
    SELECT esh.*, p.ProjectName
    FROM eng_safety_esh esh
    LEFT JOIN eng_project_master p ON esh.ProjectID = p.ProjectID
    WHERE esh.NSIID = ?
  `, [nsiId]);
  return row.length > 0 ? row[0] : null;
};

export const createEhsInspection = async (data, createdBy) => {
  const [result] = await db.execute(
    `INSERT INTO eng_safety_esh (
       ProjectID, InspectionDate, ProjectLocation, InspectedBy, Observation, 
       RemedialAction, ActionBy_Deadline, Rectification_Remarks, Status, 
       EHSName, AcknowlegeBy, FileCaption, FileName, FilePath, CreatedBy, CreatedDate
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [
      data.ProjectID || null,
      data.InspectionDate || null,
      data.ProjectLocation || null,
      data.InspectedBy || null,
      data.Observation || null,
      data.RemedialAction || null,
      data.ActionBy_Deadline || null,
      data.Rectification_Remarks || null,
      data.Status || 'Pending',
      data.EHSName || null,
      data.AcknowlegeBy || null,
      data.FileCaption || null,
      data.FileName || null,
      data.FilePath || null,
      createdBy
    ]
  );
  return result.insertId;
};

export const updateEhsInspection = async (nsiId, data, updatedBy) => {
  await db.execute(
    `UPDATE eng_safety_esh 
     SET ProjectID = ?, InspectionDate = ?, ProjectLocation = ?, InspectedBy = ?, 
         Observation = ?, RemedialAction = ?, ActionBy_Deadline = ?, 
         Rectification_Remarks = ?, Status = ?, EHSName = ?, AcknowlegeBy = ?, 
         FileCaption = COALESCE(?, FileCaption), FileName = COALESCE(?, FileName), FilePath = COALESCE(?, FilePath), 
         UpdatedBy = ?, UpdatedDate = NOW()
     WHERE NSIID = ?`,
     [
       data.ProjectID || null,
       data.InspectionDate || null,
       data.ProjectLocation || null,
       data.InspectedBy || null,
       data.Observation || null,
       data.RemedialAction || null,
       data.ActionBy_Deadline || null,
       data.Rectification_Remarks || null,
       data.Status || 'Pending',
       data.EHSName || null,
       data.AcknowlegeBy || null,
       data.FileCaption || null,
       data.FileName || null,
       data.FilePath || null,
       updatedBy,
       nsiId
     ]
  );
  return true;
};

export const getAllProjects = async () => {
  const [rows] = await db.execute('SELECT ProjectID, ProjectName FROM eng_project_master ORDER BY ProjectName ASC');
  return rows;
};

export const getAllPtws = async () => {
  const [rows] = await db.execute(`
    SELECT 
      PTW_master_ID, CompanyName as CompanyName, ProjectTitle, NameOfApplicant, Start_Date_Time, End_Date_Time, PTW_type, CompletedStage, Created_Date
    FROM eng_ptw_master
    UNION ALL
    SELECT 
      PTW_master_ID, ContractorName as CompanyName, (SELECT ProjectName FROM eng_project_master WHERE ProjectID = c.ProjectID) as ProjectTitle, Applicant_Name as NameOfApplicant, Start_Date_Time, End_Date_Time, PTW_type, CompletedStage, Created_Date
    FROM eng_ptw_conspc_master c
    ORDER BY Created_Date DESC
  `);
  return rows;
};

export const getPtwChecklistConfig = async (ptwType) => {
  const [rows] = await db.execute(
    'SELECT PTW_Stage_One_ID, PTW_Type, PTW_Title, Item, Order_By FROM eng_sys_ptw_stage1_config WHERE PTW_Type = ? OR PTW_Title = ? ORDER BY Order_By ASC',
    [ptwType, ptwType]
  );
  return rows;
};

export const getPtwDetails = async (ptwId, ptwType) => {
  if (ptwType === 'PTWCONSPC' || ptwType === 'Confined Space Permit') {
    const [rows] = await db.execute(
      'SELECT c.*, p.ProjectName as ProjectTitle FROM eng_ptw_conspc_master c LEFT JOIN eng_project_master p ON c.ProjectID = p.ProjectID WHERE c.PTW_master_ID = ?',
      [ptwId]
    );
    if (rows.length === 0) return null;
    const ptw = rows[0];

    const [details] = await db.execute(
      'SELECT * FROM eng_PTW_Conspc_Detail_Stage1 WHERE PTW_Master_ID = ?',
      [ptwId]
    );
    ptw.details = details;

    const [workers] = await db.execute(
      'SELECT w.*, e.FirstName, e.LastName, e.ID_Number FROM eng_PTW_Conspc_Employee_Details w LEFT JOIN eng_employee_profile e ON w.EmployeeID = e.UserID WHERE w.PTW_Master_ID = ?',
      [ptwId]
    );
    ptw.workers = workers;

    const [gasChecks] = await db.execute(
      'SELECT * FROM eng_PTW_Conspc_Detail_Stage5 WHERE PTW_Master_ID = ? ORDER BY Stage5_Date_Time DESC',
      [ptwId]
    );
    ptw.gasChecks = gasChecks;

    return ptw;
  } else {
    const [rows] = await db.execute(
      'SELECT m.*, p.ProjectName as ProjectTitleName FROM eng_ptw_master m LEFT JOIN eng_project_master p ON m.ProjectID = p.ProjectID WHERE m.PTW_master_ID = ?',
      [ptwId]
    );
    if (rows.length === 0) return null;
    const ptw = rows[0];
    if (!ptw.ProjectTitle) ptw.ProjectTitle = ptw.ProjectTitleName;

    const [details] = await db.execute(
      'SELECT * FROM eng_PTW_Detail_Satge1 WHERE PTW_Master_ID = ?',
      [ptwId]
    );
    ptw.details = details;

    const [workers] = await db.execute(
      'SELECT w.*, e.FirstName, e.LastName, e.ID_Number FROM eng_PTW_Employee_Details w LEFT JOIN eng_employee_profile e ON w.EmployeeID = e.UserID WHERE w.PTW_Master_ID = ?',
      [ptwId]
    );
    ptw.workers = workers;

    const [dailyChecks] = await db.execute(
      'SELECT * FROM eng_PTW_Detail_Satge4 WHERE PTW_Master_ID = ? ORDER BY DayDate DESC',
      [ptwId]
    );
    ptw.dailyChecks = dailyChecks;

    return ptw;
  }
};

export const createPtw = async (data, createdBy) => {
  const isConspc = data.PTW_type === 'PTWCONSPC' || data.PTW_type === 'Confined Space Permit';
  if (isConspc) {
    const [result] = await db.execute(
      `INSERT INTO eng_ptw_conspc_master (
        ContractorName, Work_Description, Applicant_Name, Applicant_Desig, Applicant_Date_Time,
        LocationOfWork, Start_Date_Time, End_Date_Time, No_of_workers_involved,
        Stage1_Watchman_Name, Stage1_Watchman_ID, Stage1_Watchman_Company,
        ProjectID, PTW_type, CompletedStage, Created_By, Created_Date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        data.CompanyName || '',
        data.Work_Description || '',
        data.NameOfApplicant || '',
        data.Applicant_Desig || '',
        data.Date_Time || null,
        data.Loc_or_GridLineNo || '',
        data.Start_Date_Time || null,
        data.End_Date_Time || null,
        data.workers ? data.workers.length : 0,
        data.Stage1_Watchman_Name || '',
        data.Stage1_Watchman_ID || '',
        data.Stage1_Watchman_Company || '',
        data.ProjectID || null,
        data.PTW_type,
        1,
        createdBy
      ]
    );
    const ptwId = result.insertId;

    if (data.details && data.details.length > 0) {
      for (const item of data.details) {
        await db.execute(
          'INSERT INTO eng_PTW_Conspc_Detail_Stage1 (PTW_Master_ID, PTW_Stage_One_ID, Is_Applicable_Applicant) VALUES (?, ?, ?)',
          [ptwId, item.PTW_Stage_One_ID, item.Is_Applicable]
        );
      }
    }

    if (data.workers && data.workers.length > 0) {
      for (const empId of data.workers) {
        await db.execute(
          'INSERT INTO eng_PTW_Conspc_Employee_Details (PTW_Master_ID, EmployeeID) VALUES (?, ?)',
          [ptwId, empId]
        );
      }
    }
    return ptwId;
  } else {
    const [result] = await db.execute(
      `INSERT INTO eng_ptw_master (
        CompanyName, ProjectTitle, NameOfApplicant, Date_Time, Sub_con_Name,
        Loc_or_GridLineNo, Start_Date_Time, End_Date_Time, No_of_workers_involved,
        Stage1_Person_Name, Stage1_Date_Time, ProjectID, PTW_type, CompletedStage,
        Created_By, Created_Date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        data.CompanyName || '',
        data.ProjectTitle || '',
        data.NameOfApplicant || '',
        data.Date_Time || null,
        data.Sub_con_Name || '',
        data.Loc_or_GridLineNo || '',
        data.Start_Date_Time || null,
        data.End_Date_Time || null,
        data.workers ? data.workers.length : 0,
        data.Stage1_Person_Name || '',
        data.Stage1_Date_Time || null,
        data.ProjectID || null,
        data.PTW_type,
        1,
        createdBy
      ]
    );
    const ptwId = result.insertId;

    if (data.details && data.details.length > 0) {
      for (const item of data.details) {
        await db.execute(
          'INSERT INTO eng_PTW_Detail_Satge1 (PTW_Master_ID, PTW_Stage_One_ID, Is_Applicable) VALUES (?, ?, ?)',
          [ptwId, item.PTW_Stage_One_ID, item.Is_Applicable]
        );
      }
    }

    if (data.workers && data.workers.length > 0) {
      for (const empId of data.workers) {
        await db.execute(
          'INSERT INTO eng_PTW_Employee_Details (PTW_Master_ID, EmployeeID) VALUES (?, ?)',
          [ptwId, empId]
        );
      }
    }
    return ptwId;
  }
};

export const updatePtw = async (ptwId, data, updatedBy) => {
  const isConspc = data.PTW_type === 'PTWCONSPC' || data.PTW_type === 'Confined Space Permit';
  if (isConspc) {
    await db.execute(
      `UPDATE eng_ptw_conspc_master 
       SET ContractorName = ?, Work_Description = ?, Applicant_Name = ?, Applicant_Desig = ?,
           Applicant_Date_Time = ?, LocationOfWork = ?, Start_Date_Time = ?, End_Date_Time = ?,
           No_of_workers_involved = ?, Stage1_Watchman_Name = ?, Stage1_Watchman_ID = ?, Stage1_Watchman_Company = ?,
           Stage2_O2 = ?, Stage2_CO2 = ?, Stage2_LEL = ?, Stage2_H2S = ?, Safe_for_Entry = ?,
           Stage2_Assessor_Name = ?, Stage2_Assessor_Desig = ?, Stage2_Assessor_Date_Time = ?, Stage2_Comments = ?,
           Stage3_WSH_Name = ?, Stage3_WSH_Desig = ?, Stage3_WSH_Date_Time = ?, Stage3_Comments = ?,
           Stage4_Mng_Name = ?, Stage4_Mng_Desig = ?, Stage4_Date_Time = ?, Stage4_Comments = ?,
           Stage6_Person_Name = ?, Stage6_Person_Desig = ?, Stage6_Date_Time = ?,
           CompletedStage = ?, Updated_By = ?, Updated_Date = NOW()
       WHERE PTW_master_ID = ?`,
      [
        data.CompanyName || '',
        data.Work_Description || '',
        data.NameOfApplicant || '',
        data.Applicant_Desig || '',
        data.Date_Time || null,
        data.Loc_or_GridLineNo || '',
        data.Start_Date_Time || null,
        data.End_Date_Time || null,
        data.workers ? data.workers.length : 0,
        data.Stage1_Watchman_Name || '',
        data.Stage1_Watchman_ID || '',
        data.Stage1_Watchman_Company || '',
        data.Stage2_O2 || null,
        data.Stage2_CO2 || null,
        data.Stage2_LEL || null,
        data.Stage2_H2S || null,
        data.Safe_for_Entry || null,
        data.Stage2_Assessor_Name || null,
        data.Stage2_Assessor_Desig || null,
        data.Stage2_Assessor_Date_Time || null,
        data.Stage2_Comments || null,
        data.Stage3_WSH_Name || null,
        data.Stage3_WSH_Desig || null,
        data.Stage3_WSH_Date_Time || null,
        data.Stage3_Comments || null,
        data.Stage4_Mng_Name || null,
        data.Stage4_Mng_Desig || null,
        data.Stage4_Date_Time || null,
        data.Stage4_Comments || null,
        data.Stage6_Person_Name || null,
        data.Stage6_Person_Desig || null,
        data.Stage6_Date_Time || null,
        data.CompletedStage || 1,
        updatedBy,
        ptwId
      ]
    );

    if (data.details) {
      await db.execute('DELETE FROM eng_PTW_Conspc_Detail_Stage1 WHERE PTW_Master_ID = ?', [ptwId]);
      for (const item of data.details) {
        await db.execute(
          'INSERT INTO eng_PTW_Conspc_Detail_Stage1 (PTW_Master_ID, PTW_Stage_One_ID, Is_Applicable_Applicant) VALUES (?, ?, ?)',
          [ptwId, item.PTW_Stage_One_ID, item.Is_Applicable]
        );
      }
    }

    if (data.workers) {
      await db.execute('DELETE FROM eng_PTW_Conspc_Employee_Details WHERE PTW_Master_ID = ?', [ptwId]);
      for (const empId of data.workers) {
        await db.execute(
          'INSERT INTO eng_PTW_Conspc_Employee_Details (PTW_Master_ID, EmployeeID) VALUES (?, ?)',
          [ptwId, empId]
        );
      }
    }

    // Insert CS Gas Check
    if (data.CompletedStage >= 5 && data.Stage5_Assessor_Name) {
      await db.execute(
        `INSERT INTO eng_PTW_Conspc_Detail_Stage5 (
          PTW_Master_ID, Stage5_Date_Time, O2, CO2, LEL, H2S, Safe_for_Entry,
          Stage5_Assessor_Name, Assessor_Comments
        ) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?)`,
        [
          ptwId,
          data.Stage2_O2 || data.Stage5_O2 || '',
          data.Stage2_CO2 || data.Stage5_CO2 || '',
          data.Stage2_LEL || data.Stage5_LEL || '',
          data.Stage2_H2S || data.Stage5_H2S || '',
          data.Safe_for_Entry || data.Stage5_Safe_for_Entry || 'Yes',
          data.Stage5_Assessor_Name || '',
          data.Stage5_Comments || ''
        ]
      );
    }
  } else {
    await db.execute(
      `UPDATE eng_ptw_master 
       SET CompanyName = ?, ProjectTitle = ?, NameOfApplicant = ?, Date_Time = ?, Sub_con_Name = ?,
           Loc_or_GridLineNo = ?, Start_Date_Time = ?, End_Date_Time = ?, No_of_workers_involved = ?,
           Stage1_Person_Name = ?, Stage1_Date_Time = ?,
           Stage2_Person_Name = ?, Stage2_Date_Time = ?,
           Stage3_Person_Name = ?, Stage3_Date_Time = ?,
           Stage4_Sup_Name = ?, Stage4_Sup_Date_Time = ?, Stage4_WSH_Name = ?, Stage4_WSH_Date_Time = ?,
           Stage5_Sup_Person_Name = ?, Stage5_Sup_Date_Time = ?, Stage5_Mng_Person_Name = ?, Stage5_Mng_Date_Time = ?,
           CompletedStage = ?, Updated_By = ?, Updated_Date = NOW()
       WHERE PTW_master_ID = ?`,
      [
        data.CompanyName || '',
        data.ProjectTitle || '',
        data.NameOfApplicant || '',
        data.Date_Time || null,
        data.Sub_con_Name || '',
        data.Loc_or_GridLineNo || '',
        data.Start_Date_Time || null,
        data.End_Date_Time || null,
        data.workers ? data.workers.length : 0,
        data.Stage1_Person_Name || '',
        data.Stage1_Date_Time || null,
        data.Stage2_Person_Name || null,
        data.Stage2_Date_Time || null,
        data.Stage3_Person_Name || null,
        data.Stage3_Date_Time || null,
        data.Stage4_Sup_Name || null,
        data.Stage4_Sup_Date_Time || null,
        data.Stage4_WSH_Name || null,
        data.Stage4_WSH_Date_Time || null,
        data.Stage5_Sup_Person_Name || null,
        data.Stage5_Sup_Date_Time || null,
        data.Stage5_Mng_Person_Name || null,
        data.Stage5_Mng_Date_Time || null,
        data.CompletedStage || 1,
        updatedBy,
        ptwId
      ]
    );

    if (data.details) {
      await db.execute('DELETE FROM eng_PTW_Detail_Satge1 WHERE PTW_Master_ID = ?', [ptwId]);
      for (const item of data.details) {
        await db.execute(
          'INSERT INTO eng_PTW_Detail_Satge1 (PTW_Master_ID, PTW_Stage_One_ID, Is_Applicable) VALUES (?, ?, ?)',
          [ptwId, item.PTW_Stage_One_ID, item.Is_Applicable]
        );
      }
    }

    if (data.workers) {
      await db.execute('DELETE FROM eng_PTW_Employee_Details WHERE PTW_Master_ID = ?', [ptwId]);
      for (const empId of data.workers) {
        await db.execute(
          'INSERT INTO eng_PTW_Employee_Details (PTW_Master_ID, EmployeeID) VALUES (?, ?)',
          [ptwId, empId]
        );
      }
    }

    // Insert Standard Daily Check Signatures
    if (data.CompletedStage >= 4 && data.Stage4_Sup_Name) {
      const strDay = new Date().toLocaleString('en-US', { weekday: 'short' });
      const [existing] = await db.execute(
        'SELECT * FROM eng_PTW_Detail_Satge4 WHERE PTW_Master_ID = ? AND Day = ? AND DATE(DayDate) = CURDATE()',
        [ptwId, strDay]
      );
      if (existing.length === 0) {
        await db.execute(
          `INSERT INTO eng_PTW_Detail_Satge4 (
            PTW_Master_ID, Day, DayDate, Sup_Signature, Sup_Sig_Date, Mng_Signature, Mng_Sig_Date
          ) VALUES (?, ?, CURDATE(), ?, NOW(), ?, NOW())`,
          [
            ptwId,
            strDay,
            data.Stage4_Sup_Name || '',
            data.Stage4_WSH_Name || ''
          ]
        );
      }
    }
  }
  return true;
};

export const deletePtw = async (ptwId, ptwType) => {
  const isConspc = ptwType === 'PTWCONSPC' || ptwType === 'Confined Space Permit';
  if (isConspc) {
    await db.execute('DELETE FROM eng_PTW_Conspc_Detail_Stage1 WHERE PTW_Master_ID = ?', [ptwId]);
    await db.execute('DELETE FROM eng_PTW_Conspc_Employee_Details WHERE PTW_Master_ID = ?', [ptwId]);
    await db.execute('DELETE FROM eng_ptw_conspc_master WHERE PTW_master_ID = ?', [ptwId]);
  } else {
    await db.execute('DELETE FROM eng_PTW_Detail_Satge1 WHERE PTW_Master_ID = ?', [ptwId]);
    await db.execute('DELETE FROM eng_PTW_Employee_Details WHERE PTW_Master_ID = ?', [ptwId]);
    await db.execute('DELETE FROM eng_ptw_master WHERE PTW_master_ID = ?', [ptwId]);
  }
  return true;
};
