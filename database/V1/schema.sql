CREATE DATABASE IF NOT EXISTS `SBS360`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;
 
USE `SBS360`;
 
SET FOREIGN_KEY_CHECKS = 0;
 
-- Tables 
-- ============================================================
-- SECTION 1: CREATE TABLES WITH CORRECTED DEFINITIONS
-- ============================================================

CREATE TABLE `eng_address_master` (
  `AddressID`   INT           NOT NULL AUTO_INCREMENT,
  `Email`       VARCHAR(150)  NULL,
  `Mobile`      VARCHAR(18)   NULL,
  `Tel`         VARCHAR(18)   NULL,
  `Web`         VARCHAR(50)   NULL,
  `Address1`    VARCHAR(150)  NULL,
  `Address2`    VARCHAR(150)  NULL,
  `City`        VARCHAR(150)  NULL,
  `Country`     VARCHAR(50)   NULL,
  `Postal_Code` VARCHAR(10)   NULL,
  `Fax1`        VARCHAR(18)   NULL,
  `SkypeID`     VARCHAR(50)   NULL,
  `Remarks`     LONGTEXT      NULL,
  CONSTRAINT `PK_eng_address_master` PRIMARY KEY (`AddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_module` (
  `ModuleID`   INT          NOT NULL AUTO_INCREMENT,
  `AccessType` INT          NOT NULL,
  `ModuleName` VARCHAR(50)  NOT NULL,
  `Order_By`   INT          NOT NULL,
  `Icon`       VARCHAR(50)  NULL,
  CONSTRAINT `PK_eng_module` PRIMARY KEY (`ModuleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_usergroup` (
  `GroupID`   INT          NOT NULL AUTO_INCREMENT,
  `GroupName` VARCHAR(50)  NULL,
  CONSTRAINT `PK_eng_usergroup` PRIMARY KEY (`GroupID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_sys_claimtype` (
  `ClaimTypeID` INT          NOT NULL AUTO_INCREMENT,
  `ClaimType`   VARCHAR(150) NULL,
  CONSTRAINT `PK_eng_sys_claimtype` PRIMARY KEY (`ClaimTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_sys_country` (
  `Id`          INT         NOT NULL AUTO_INCREMENT,
  `CountryCode` VARCHAR(3)  NULL,
  `Country`     VARCHAR(50) NULL,
  CONSTRAINT `PK_eng_sys_country` PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_sys_function` (
  `Id`       INT          NOT NULL AUTO_INCREMENT,
  `Fn_code`  VARCHAR(16)  NULL,
  `Fn_Title` VARCHAR(100) NULL,
  `Fn_Value` INT          NULL,
  CONSTRAINT `PK_eng_sys_function` PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_sys_industry` (
  `Id`             INT          NOT NULL AUTO_INCREMENT,
  `Industry_Code`  VARCHAR(10)  NULL,
  `Industry_Title` VARCHAR(100) NULL,
  CONSTRAINT `PK_eng_sys_industry` PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_sys_location` (
  `LocationId`   INT          NOT NULL AUTO_INCREMENT,
  `LocationName` VARCHAR(150) NULL,
  CONSTRAINT `PK_eng_sys_location` PRIMARY KEY (`LocationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_sys_project_status` (
  `ProjectStatusID` INT         NOT NULL AUTO_INCREMENT,
  `ProjectStatus`   VARCHAR(50) NULL,
  CONSTRAINT `PK_eng_sys_project_status` PRIMARY KEY (`ProjectStatusID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_sys_ptw_stage1_config` (
  `PTW_Stage_One_ID` INT          NOT NULL AUTO_INCREMENT,
  `PTW_Type`         VARCHAR(50)  NULL,
  `PTW_Title`        VARCHAR(150) NULL,
  `Item`             VARCHAR(500) NULL,
  `Order_By`         INT          NULL,
  CONSTRAINT `PK_eng_sys_ptw_stage1_config` PRIMARY KEY (`PTW_Stage_One_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_sys_ptw_stages` (
  `StageCofigID` INT          NOT NULL AUTO_INCREMENT,
  `Stage_Type`   VARCHAR(50)  NULL,
  `Stages`       VARCHAR(500) NULL,
  CONSTRAINT `PK_eng_sys_ptw_stages` PRIMARY KEY (`StageCofigID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_sys_pymt_status` (
  `Id`         INT         NOT NULL AUTO_INCREMENT,
  `PymtStatus` VARCHAR(50) NULL,
  CONSTRAINT `PK_eng_sys_pymt_status` PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_sys_quotestatus` (
  `StatusID`    INT         NOT NULL AUTO_INCREMENT,
  `QuoteStatus` VARCHAR(50) NULL,
  `Selection`   INT         NULL,
  CONSTRAINT `PK_eng_sys_quotestatus` PRIMARY KEY (`StatusID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_sys_riskmatrix` (
  `RMID`             INT         NOT NULL AUTO_INCREMENT,
  `Severity_Value`   INT         NULL,
  `Likelihood_Value` INT         NULL,
  `Risk_Value`       INT         NULL,
  `Risk_Type`        VARCHAR(50) NULL,
  CONSTRAINT `PK_eng_sys_riskmatrix` PRIMARY KEY (`RMID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_sys_rm_likelihood` (
  `RMLHID`                  INT          NOT NULL AUTO_INCREMENT,
  `Likelihood_Value`        INT          NULL,
  `Likelihood_Type`         VARCHAR(50)  NULL,
  `Likelihood_Description`  VARCHAR(100) NULL,
  CONSTRAINT `PK_eng_sys_rm_likelihood` PRIMARY KEY (`RMLHID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_sys_rm_severity` (
  `RMSVID`               INT          NOT NULL AUTO_INCREMENT,
  `Severity_Value`       INT          NULL,
  `Severity_Type`        VARCHAR(50)  NULL,
  `Severity_Description` VARCHAR(250) NULL,
  CONSTRAINT `PK_eng_sys_rm_severity` PRIMARY KEY (`RMSVID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_sys_safety_hazard` (
  `HazardID`   INT          NOT NULL AUTO_INCREMENT,
  `HazardDesc` VARCHAR(150) NULL,
  CONSTRAINT `PK_eng_sys_safety_hazard` PRIMARY KEY (`HazardID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_sys_safety_insp_items` (
  `SIItemID`          INT          NOT NULL AUTO_INCREMENT,
  `SIHeaderID`        VARCHAR(10)  NULL,
  `SITitle`           VARCHAR(80)  NULL,
  `SIItemDescription` VARCHAR(250) NULL,
  `OrderBy`           INT          NULL,
  CONSTRAINT `PK_eng_sys_safety_insp_items` PRIMARY KEY (`SIItemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_sys_safety_ppelist` (
  `PPEID`    INT          NOT NULL AUTO_INCREMENT,
  `PPE_Desc` VARCHAR(150) NULL,
  CONSTRAINT `PK_eng_sys_safety_ppelist` PRIMARY KEY (`PPEID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_sys_task_status` (
  `TaskStatusID` INT         NOT NULL AUTO_INCREMENT,
  `TaskStatus`   VARCHAR(50) NULL,
  CONSTRAINT `PK_eng_sys_task_status` PRIMARY KEY (`TaskStatusID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_company` (
  `CompanyID`           INT            NOT NULL AUTO_INCREMENT,
  `CompanyName`         LONGTEXT       NULL,
  `Auth_InvoiceName`    LONGTEXT       NULL,
  `InvoiceTerms`        LONGTEXT       NULL,
  `Address1`            VARCHAR(150)   NULL,
  `Address2`            VARCHAR(150)   NULL,
  `City`                VARCHAR(150)   NULL,
  `Country`             VARCHAR(80)    NULL,
  `Pincode`             VARCHAR(10)    NULL,
  `Tel`                 VARCHAR(20)    NULL,
  `Fax`                 VARCHAR(20)    NULL,
  `Email`               VARCHAR(80)    NULL,
  `RegNo`               VARCHAR(50)    NULL,
  `GstRegNo`            VARCHAR(50)    NULL,
  `LogoPath`            VARCHAR(250)   NULL,
  `Normal_Work_Hours`   DECIMAL(6,2)   NULL,
  `Weekend_Work_Hours`  DECIMAL(6,2)   NULL,
  `Lunch_Break_Hours`   DECIMAL(6,2)   NULL,
  `GST`                 DECIMAL(5,2)   NULL,
  CONSTRAINT `PK_eng_company` PRIMARY KEY (`CompanyID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_company_cert` (
  `ID`                  INT           NOT NULL AUTO_INCREMENT,
  `Company_ID`          VARCHAR(50)   NULL,
  `Company_Name`        VARCHAR(100)  NULL,
  `Cert_License_Name`   VARCHAR(80)   NULL,
  `BoardName`           VARCHAR(50)   NULL,
  `Policy_Cert_Number`  VARCHAR(80)   NULL,
  `Issue_Date`          DATE          NULL,
  `Expiry_Date`         DATE          NULL,
  `Document_Name`       VARCHAR(80)   NULL,
  `UploadPath`          VARCHAR(150)  NULL,
  CONSTRAINT `PK_eng_company_cert` PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_do_seqnum` (
  `DoID`   INT         NOT NULL AUTO_INCREMENT,
  `DoNo`   VARCHAR(50) NULL,
  `DoType` VARCHAR(10) NULL,
  `id`     INT         NULL,
  CONSTRAINT `PK_eng_do_seqnum` PRIMARY KEY (`DoID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_inv_seqnum` (
  `InvoiceID`   INT         NOT NULL AUTO_INCREMENT,
  `InvoiceNo`   VARCHAR(50) NULL,
  `InvoiceType` VARCHAR(10) NULL,
  `id`          INT         NULL,
  CONSTRAINT `PK_eng_inv_seqnum` PRIMARY KEY (`InvoiceID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_store_master` (
  `StoreID`           INT          NOT NULL AUTO_INCREMENT,
  `Store_Code`        VARCHAR(50)  NULL,
  `Branch_Name`       VARCHAR(50)  NULL,
  `Start_Date`        DATE         NULL,
  `Store_Name`        VARCHAR(150) NULL,
  `Address1`          VARCHAR(150) NULL,
  `Address2`          VARCHAR(150) NULL,
  `City`              VARCHAR(50)  NULL,
  `Country`           VARCHAR(50)  NULL,
  `Store_Description` VARCHAR(250) NULL,
  `Incharge_Name`     VARCHAR(80)  NULL,
  `Remarks`           VARCHAR(250) NULL,
  `CreatedDate`       DATE         NULL,
  `UpdatedDate`       DATE         NULL,
  `CreatedBy`         INT          NULL,
  `UpdatedBy`         INT          NULL,
  CONSTRAINT `PK_eng_store_master` PRIMARY KEY (`StoreID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_product_master` (
  `ProductID`            INT           NOT NULL AUTO_INCREMENT,
  `Product_Name`         VARCHAR(150)  NULL,
  `Product_Type`         VARCHAR(100)  NULL,
  `Product_Company_Name` VARCHAR(150)  NULL,
  `Product_Description`  VARCHAR(250)  NULL,
  `Dimension`            VARCHAR(50)   NULL,
  `Measuring_Unit`       VARCHAR(50)   NULL,
  `Unit_Price`           DECIMAL(10,2) NULL,
  `Product_Code`         VARCHAR(50)   NULL,
  `CreatedDate`          DATE          NULL,
  `UpdatedDate`          DATE          NULL,
  `CreatedBy`            INT           NULL,
  `UpdatedBy`            INT           NULL,
  `IsActive`             INT           NULL,
  `Barcode1`             VARCHAR(250)  NULL,
  `Barcode2`             VARCHAR(250)  NULL,
  CONSTRAINT `PK_eng_product_master` PRIMARY KEY (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_employee_profile` (
  `UserID`                       INT           NOT NULL AUTO_INCREMENT,
  `EmpID`                        VARCHAR(50)   NULL,
  `OpBranch`                     VARCHAR(50)   NULL,
  `FirstName`                    VARCHAR(50)   NULL,
  `LastName`                     VARCHAR(50)   NULL,
  `AddressID`                    INT           NULL,
  `Nationality`                  VARCHAR(50)   NULL,
  `DoB`                          DATE          NULL,
  `SOC_number`                   VARCHAR(50)   NULL,
  `SOC_Issue_Date`               DATE          NULL,
  `SOC_Expiry_Date`              DATE          NULL,
  `Salary`                       DECIMAL(10,2) NULL,
  `Levy`                         DECIMAL(10,2) NULL,
  `DoJ`                          DATE          NULL,
  `DoR`                          DATE          NULL,
  `Gender`                       VARCHAR(10)   NULL,
  `Designation`                  VARCHAR(150)  NULL,
  `ID_Type`                      VARCHAR(50)   NULL,
  `ID_Number`                    VARCHAR(50)   NULL,
  `Profile_Desc`                 VARCHAR(150)  NULL,
  `Profile_Photo_Path`           VARCHAR(150)  NULL,
  `llevel`                       INT           NULL,
  `CreatedDate`                  DATE          NULL,
  `UpdatedDate`                  DATE          NULL,
  `CreatedBy`                    INT           NULL,
  `UpdatedBy`                    INT           NULL,
  `Passport_Number`              VARCHAR(50)   NULL,
  `Passport_Valid_Till`          DATE          NULL,
  `Permit_Number`                VARCHAR(50)   NULL,
  `Permit_Valid_From`            DATE          NULL,
  `Permit_Valid_To`              DATE          NULL,
  `Licence_Number`               VARCHAR(50)   NULL,
  `Licence_Valid_Till`           DATE          NULL,
  `Insurance_Number`             VARCHAR(50)   NULL,
  `Insurance_Valid_Till`         DATE          NULL,
  `IsActive`                     INT           NULL,
  `License_Scissor_Lift_Number`  VARCHAR(50)   NULL,
  `License_Scissor_Lift_ExpiryDate` DATE       NULL,
  `License_Boom_Lift_Number`     VARCHAR(50)   NULL,
  `License_Boom_Lift_ExpiryDate` DATE          NULL,
  `License_WorkatHeight_Number`  VARCHAR(50)   NULL,
  `License_WorkatHeight_ExpiryDate` DATE       NULL,
  `License_IslandPass_Number`    VARCHAR(50)   NULL,
  `License_IslandPass_ExpiryDate` DATE         NULL,
  `Skilled_Level`                INT           NULL,
  `Safety_Supervisor_Name`       VARCHAR(80)   NULL,
  `License_Course`               VARCHAR(250)  NULL,
  `License_Course_Expiry_Date`   DATE          NULL,
  `GroupID`                      INT           NULL,
  CONSTRAINT `PK_eng_employee_profile` PRIMARY KEY (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_users` (
  `UserID`      INT          NOT NULL AUTO_INCREMENT,
  `UserName`    VARCHAR(80)  NULL,
  `Password`    VARCHAR(255) NULL,
  `EmpID`       INT          NULL,
  `GroupID`     INT          NULL,
  `DisplayName` VARCHAR(80)  NULL,
  `LastLogin`   DATETIME     NULL,
  `UID`         VARCHAR(50)  NULL,
  `IsActive`    INT          NULL,
  `CreatedBy`   INT          NULL,
  `CreatedDate` DATE         NULL,
  `UpdatedBy`   INT          NULL,
  `UpdatedDate` DATE         NULL,
  CONSTRAINT `PK_eng_users` PRIMARY KEY (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_supplier_master` (
  `SupplierID`           INT          NOT NULL AUTO_INCREMENT,
  `SupplierDisplayID`    VARCHAR(50)  NULL,
  `Company_Name`         VARCHAR(150) NULL,
  `IndustryID`           INT          NULL,
  `Spoc_Name`            VARCHAR(100) NULL,
  `Supplier_Description` VARCHAR(100) NULL,
  `AddressID`            INT          NULL,
  `CreatedDate`          DATE         NULL,
  `UpdatedDate`          DATE         NULL,
  `CreatedBy`            INT          NULL,
  `UpdatedBy`            INT          NULL,
  `IsActive`             INT          NULL,
  CONSTRAINT `PK_eng_supplier_master` PRIMARY KEY (`SupplierID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_client_master` (
  `ClientID`        INT          NOT NULL AUTO_INCREMENT,
  `ClientDisplayID` VARCHAR(50)  NULL,
  `Company_Name`    VARCHAR(150) NULL,
  `IndustryID`      INT          NULL,
  `FunctionalityID` INT          NULL,
  `Reference`       VARCHAR(150) NULL,
  `AddressID`       INT          NULL,
  `CreatedDate`     DATE         NULL,
  `UpdatedDate`     DATE         NULL,
  `CreatedBy`       INT          NULL,
  `UpdatedBy`       INT          NULL,
  `IsActive`        INT          NULL,
  CONSTRAINT `PK_eng_client_master` PRIMARY KEY (`ClientID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_client_contact` (
  `CCID`       INT          NOT NULL AUTO_INCREMENT,
  `ClientID`   INT          NULL,
  `NamePrefix` VARCHAR(10)  NULL,
  `SPOCName`   VARCHAR(150) NULL,
  `Email`      VARCHAR(150) NULL,
  `Mobile`     VARCHAR(18)  NULL,
  `Tel`        VARCHAR(18)  NULL,
  `Remarks`    VARCHAR(155) NULL,
  CONSTRAINT `PK_eng_client_contact` PRIMARY KEY (`CCID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_quote_master` (
  `QuoteID`              INT           NOT NULL AUTO_INCREMENT,
  `QuoteRefNum`          VARCHAR(50)   NULL,
  `QuoteDate`            DATE          NULL,
  `ClientID`             INT           NULL,
  `Attention_CCID`       INT           NULL,
  `Branch_code`          VARCHAR(10)   NULL,
  `QuoteCategory`        VARCHAR(8)    NULL,
  `ValidTill`            VARCHAR(128)  NULL,
  `YourRef`              VARCHAR(250)  NULL,
  `PaymentTerms`         VARCHAR(250)  NULL,
  `TermsAndCond`         LONGTEXT      NULL,
  `GTAX`                 VARCHAR(3)    NULL,
  `Currency`             VARCHAR(5)    NULL,
  `QuoteStatusID`        INT           NULL,
  `CreatedDate`          DATE          NULL,
  `UpdatedDate`          DATE          NULL,
  `CreatedBy`            INT           NULL,
  `UpdatedBy`            INT           NULL,
  `IsAutoApproved`       INT           NULL,
  `IsProjectCreated`     INT           NULL,
  `InvoiceNo`            VARCHAR(50)   NULL,
  `DoNo`                 VARCHAR(50)   NULL,
  `InvoiceDate`          DATE          NULL,
  `DODate`               DATE          NULL,
  `QuoteTitle`           LONGTEXT      NULL,
  `RvFlag`               INT           NULL,
  `ProjectTitle`         LONGTEXT      NULL,
  `Is_invoice_released`  INT           NULL,
  `Is_Quote_level_inv`   INT           NULL,
  `Is_Project_level_inv` INT           NULL,
  `Is_Custom_level_inv`  INT           NULL,
  `Discount`             DECIMAL(10,2) NULL,
  `isFullyPaid`          INT           NULL,
  `FinalAmount`          DECIMAL(10,2) NULL,
  `Is_do_released`       INT           NULL,
  `Is_Quote_level_do`    INT           NULL,
  `InvoiceFlag`          INT           NULL,
  CONSTRAINT `PK_eng_quote_master` PRIMARY KEY (`QuoteID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_project_master` (
  `ProjectID`                INT           NOT NULL AUTO_INCREMENT,
  `ProjectNo`                VARCHAR(50)   NULL,
  `ProjectName`              VARCHAR(150)  NULL,
  `LocationId`               INT           NULL,
  `QuotationID`              INT           NULL,
  `DoNo`                     VARCHAR(50)   NULL,
  `Start_Date`               DATE          NULL,
  `End_Date`                 DATE          NULL,
  `Key_Milestones`           LONGTEXT      NULL,
  `Service_Desc`             LONGTEXT      NULL,
  `Project_Status_ID`        INT           NULL,
  `Payment_Status`           VARCHAR(50)   NULL,
  `Client_Acceptance_Status` CHAR(10)      NULL,
  `Project_Cost`             DECIMAL(10,2) NULL,
  `CreatedDate`              DATE          NULL,
  `UpdatedDate`              DATE          NULL,
  `CreatedBy`                INT           NULL,
  `UpdatedBy`                INT           NULL,
  `InvoiceNo`                VARCHAR(50)   NULL,
  `InvoiceDate`              DATE          NULL,
  `DoDate`                   DATE          NULL,
  `Is_Project_level_inv`     INT           NULL,
  `Is_Custom_level_inv`      INT           NULL,
  `isFullyPaid`              INT           NULL,
  `Is_Project_level_do`      INT           NULL,
  CONSTRAINT `PK_eng_project_master` PRIMARY KEY (`ProjectID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_project_report` (
  `ProjectReportID`    INT           NOT NULL AUTO_INCREMENT,
  `ProjectID`          INT           NULL,
  `ReportDate`         DATETIME      NULL,
  `Start_Date_Time`    TIME          NULL,
  `End_Date_Time`      TIME          NULL,
  `Task_Description`   LONGTEXT      NULL,
  `Quantity`           INT           NULL,
  `TaskStatusID`       INT           NULL,
  `Remarks`            VARCHAR(500)  NULL,
  `Resource_name`      LONGTEXT      NULL,
  `CreatedDate`        DATE          NULL,
  `UpdatedDate`        DATE          NULL,
  `CreatedBy`          INT           NULL,
  `UpdatedBy`          INT           NULL,
  `ProgressPercentage` VARCHAR(50)   NULL,
  CONSTRAINT `PK_eng_project_report` PRIMARY KEY (`ProjectReportID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_project_report_files` (
  `ProjectSupportFileID` INT          NOT NULL AUTO_INCREMENT,
  `ProjectReportID`      INT          NULL,
  `FIleCaption`          VARCHAR(250) NULL,
  `FileName`             VARCHAR(300) NULL,
  `FilePath`             VARCHAR(300) NULL,
  CONSTRAINT `PK_eng_project_report_files` PRIMARY KEY (`ProjectSupportFileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_claim` (
  `ClaimID`          INT           NOT NULL AUTO_INCREMENT,
  `ClaimDisplayID`   VARCHAR(50)   NULL,
  `UserID`           INT           NULL,
  `ProjectID`        INT           NULL,
  `ClaimAgainst`     VARCHAR(50)   NULL,
  `Status`           INT           NULL,
  `SVRemarks`        VARCHAR(250)  NULL,
  `ApprovalRemarks`  VARCHAR(250)  NULL,
  `RejectRemarks`    VARCHAR(250)  NULL,
  `ApprovedBy`       INT           NULL,
  `ApprovedDate`     DATE          NULL,
  `SubmittedBy`      INT           NULL,
  `SubmittedDate`    DATE          NULL,
  `isFullyPaid`      INT           NULL,
  `TotalClaim`       DECIMAL(10,2) NULL,
  `PaymentSource`    VARCHAR(50)   NULL,
  CONSTRAINT `PK_eng_claim` PRIMARY KEY (`ClaimID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_claim_description` (
  `ClaimDescID`      INT           NOT NULL AUTO_INCREMENT,
  `ClaimID`          INT           NULL,
  `ClaimTypeID`      INT           NULL,
  `RecpDate`         DATE          NULL,
  `ClaimDescription` LONGTEXT      NULL,
  `RecpAmount`       DECIMAL(7,2)  NULL,
  `GST`              VARCHAR(3)    NULL,
  CONSTRAINT `PK_eng_claim_description` PRIMARY KEY (`ClaimDescID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_claim_files` (
  `ClaimFileID` INT          NOT NULL AUTO_INCREMENT,
  `ClaimID`     INT          NULL,
  `FIleCaption` VARCHAR(250) NULL,
  `FileName`    VARCHAR(300) NULL,
  `FilePath`    VARCHAR(300) NULL,
  CONSTRAINT `PK_eng_claim_files` PRIMARY KEY (`ClaimFileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_custom_invoice` (
  `InvoiceID`          INT           NOT NULL AUTO_INCREMENT,
  `InvoiceDate`        DATE          NULL,
  `ProjectID`          INT           NULL,
  `QuotationID`        INT           NULL,
  `InvoiceNo`          VARCHAR(50)   NULL,
  `DoNo`               VARCHAR(50)   NULL,
  `DODate`             DATE          NULL,
  `isFullyPaid`        INT           NULL,
  `FinalInvoiceAmount` DECIMAL(10,2) NULL,
  CONSTRAINT `PK_eng_custom_invoice` PRIMARY KEY (`InvoiceID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_custom_invoice_details` (
  `InvoiceDetailsID` INT           NOT NULL AUTO_INCREMENT,
  `InvoiceID`        INT           NULL,
  `Quantity`         DECIMAL(12,4) NULL,
  `QuoteDescription` LONGTEXT      NULL,
  `UnitOfMeasure`    VARCHAR(50)   NULL,
  `QuotePrice`       DECIMAL(10,2) NULL,
  `AddedDate`        DATE          NULL,
  `UpdatedDate`      DATE          NULL,
  `AddedBy`          INT           NULL,
  `UpdatedBy`        INT           NULL,
  CONSTRAINT `PK_eng_custom_invoice_details` PRIMARY KEY (`InvoiceDetailsID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_invoice_master` (
  `InvoiceID`          INT           NOT NULL AUTO_INCREMENT,
  `InvoiceNum`         VARCHAR(50)   NULL,
  `InvoiceDate`        DATE          NULL,
  `QuoteID`            INT           NULL,
  `ClientID`           INT           NULL,
  `DoNo`               VARCHAR(50)   NULL,
  `DoDate`             DATE          NULL,
  `AttentionTo`        VARCHAR(80)   NULL,
  `isFullyPaid`        INT           NULL,
  `GST`                VARCHAR(10)   NULL,
  `TotalInvoiceAmount` DECIMAL(10,2) NULL,
  `InvoiceType`        VARCHAR(50)   NULL,
  `InvCategory`        VARCHAR(50)   NULL,
  `InvTermandCond`     VARCHAR(350)  NULL,
  `CreatedBy`          INT           NULL,
  `CreatedDate`        DATE          NULL,
  `UpdatedBy`          INT           NULL,
  `UpdatedDate`        DATE          NULL,
  `ClientOthers`       VARCHAR(250)  NULL,
  `ServicesFor`        VARCHAR(350)  NULL,
  CONSTRAINT `PK_eng_invoice_master` PRIMARY KEY (`InvoiceID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_invoice_details` (
  `InvoiceDescID` INT           NOT NULL AUTO_INCREMENT,
  `InvoiceID`     INT           NULL,
  `Quantity`      DECIMAL(12,4) NULL,
  `Description`   LONGTEXT      NULL,
  `UnitOfMeasure` VARCHAR(50)   NULL,
  `Price`         DECIMAL(10,2) NULL,
  CONSTRAINT `PK_eng_invoice_details` PRIMARY KEY (`InvoiceDescID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_inward` (
  `Inward_ID`            INT          NOT NULL AUTO_INCREMENT,
  `Inward_Number`        VARCHAR(50)  NULL,
  `StoreID`              INT          NULL,
  `Branch_Name`          VARCHAR(50)  NULL,
  `SupplierID`           INT          NULL,
  `Invoice_or_DO_Number` VARCHAR(150) NULL,
  `Invoice_or_DO_Date`   DATE         NULL,
  `Receipt_Type`         INT          NULL,
  `Received_Date`        DATE         NULL,
  `ReceivedBy`           INT          NULL,
  `CreatedBy`            INT          NULL,
  `CreatedDate`          DATE         NULL,
  `UpdatedBy`            INT          NULL,
  `UpdatedDate`          DATE         NULL,
  `DraftFlag`            INT          NULL,
  CONSTRAINT `PK_eng_inward` PRIMARY KEY (`Inward_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_mm_inwdesc` (
  `InDescID`  INT          NOT NULL AUTO_INCREMENT,
  `Inward_ID` INT          NULL,
  `ProductID` INT          NULL,
  `Quantity`  INT          NULL,
  `UoM`       VARCHAR(50)  NULL,
  `Remarks`   VARCHAR(250) NULL,
  CONSTRAINT `PK_eng_mm_inwdesc` PRIMARY KEY (`InDescID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_outward` (
  `Outward_ID`       INT          NOT NULL AUTO_INCREMENT,
  `Outward_Number`   VARCHAR(50)  NULL,
  `StoreID`          INT          NULL,
  `Branch_Name`      VARCHAR(50)  NULL,
  `ClientID`         INT          NULL,
  `DO_Number`        VARCHAR(150) NULL,
  `DO_Date`          DATE         NULL,
  `Outward_Type`     INT          NULL,
  `Delivery_Date`    DATE         NULL,
  `Vehicle_Number`   VARCHAR(50)  NULL,
  `Delivery_Mode`    VARCHAR(80)  NULL,
  `Project_Location` VARCHAR(80)  NULL,
  `DeliveredBy`      INT          NULL,
  `CreatedBy`        INT          NULL,
  `CreatedDate`      DATE         NULL,
  `UpdatedBy`        INT          NULL,
  `UpdatedDate`      DATE         NULL,
  `DraftFlag`        INT          NULL,
  CONSTRAINT `PK_eng_outward` PRIMARY KEY (`Outward_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_mm_outdesc` (
  `OutDescID`  INT          NOT NULL AUTO_INCREMENT,
  `Outward_ID` INT          NULL,
  `ProductID`  INT          NULL,
  `Quantity`   INT          NULL,
  `UoM`        VARCHAR(50)  NULL,
  `Remarks`    VARCHAR(250) NULL,
  CONSTRAINT `PK_eng_mm_outdesc` PRIMARY KEY (`OutDescID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_mm_stockadj_master` (
  `StockAdjID`          INT          NOT NULL AUTO_INCREMENT,
  `Stock_Taking_Number` VARCHAR(50)  NULL,
  `StoreID`             INT          NULL,
  `Branch_Name`         VARCHAR(80)  NULL,
  `Stock_Taking_Date`   DATE         NULL,
  `Stock_Taken_By`      INT          NULL,
  `AdjReason`           INT          NULL,
  `AdjType`             INT          NULL,
  `Adj_Ref_Number`      VARCHAR(50)  NULL,
  `Adj_Ref_Date`        DATE         NULL,
  `ProductID`           INT          NULL,
  `Quantity`            INT          NULL,
  `ActualStock`         INT          NULL,
  `Remarks`             LONGTEXT     NULL,
  `CreatedBy`           INT          NULL,
  `CreatedDate`         DATE         NULL,
  CONSTRAINT `PK_eng_mm_stockadj_master` PRIMARY KEY (`StockAdjID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_mm_trmaster` (
  `MMTRID`       INT         NOT NULL AUTO_INCREMENT,
  `inoutadj_ref` VARCHAR(50) NULL,
  `ProductID`    INT         NULL,
  `Quantity`     INT         NULL,
  `UoM`          VARCHAR(50) NULL,
  `StoreID`      INT         NULL,
  `Trn_Date`     DATE        NULL,
  CONSTRAINT `PK_eng_mm_trmaster` PRIMARY KEY (`MMTRID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_permission` (
  `PermissionID` INT NOT NULL AUTO_INCREMENT,
  `GroupID`      INT NULL,
  `ModuleID`     INT NULL,
  `Access`       INT NULL,
  CONSTRAINT `PK_eng_permission` PRIMARY KEY (`PermissionID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_po_master` (
  `PoID`            INT           NOT NULL AUTO_INCREMENT,
  `PoRefNum`        VARCHAR(50)   NULL,
  `PoDate`          DATE          NULL,
  `SupplierID`      INT           NULL,
  `Attention`       VARCHAR(100)  NULL,
  `Branch_code`     VARCHAR(10)   NULL,
  `YourRef`         VARCHAR(250)  NULL,
  `PaymentTerms`    VARCHAR(250)  NULL,
  `DeliveryAddress` VARCHAR(250)  NULL,
  `GTAX`            VARCHAR(3)    NULL,
  `OrderStatusID`   INT           NULL,
  `CreatedDate`     DATE          NULL,
  `UpdatedDate`     DATE          NULL,
  `CreatedBy`       INT           NULL,
  `UpdatedBy`       INT           NULL,
  `FinalAmount`     DECIMAL(10,2) NULL,
  `isFullyPaid`     INT           NULL,
  CONSTRAINT `PK_eng_po_master` PRIMARY KEY (`PoID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_po_description` (
  `PDID`          INT           NOT NULL AUTO_INCREMENT,
  `PoID`          INT           NULL,
  `Quantity`      INT           NULL,
  `PODescription` LONGTEXT      NULL,
  `UnitOfMeasure` VARCHAR(50)   NULL,
  `PoPrice`       DECIMAL(10,2) NULL,
  `AddedDate`     DATE          NULL,
  `UpdatedDate`   DATE          NULL,
  `AddedBy`       INT           NULL,
  `UpdatedBy`     INT           NULL,
  CONSTRAINT `PK_eng_po_description` PRIMARY KEY (`PDID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_quote_description` (
  `QDID`             INT           NOT NULL AUTO_INCREMENT,
  `QuoteID`          INT           NULL,
  `Quantity`         DECIMAL(12,4) NULL,
  `QuoteDescription` LONGTEXT      NULL,
  `UnitOfMeasure`    VARCHAR(50)   NULL,
  `QuotePrice`       DECIMAL(10,2) NULL,
  `AddedDate`        DATE          NULL,
  `UpdatedDate`      DATE          NULL,
  `AddedBy`          INT           NULL,
  `UpdatedBy`        INT           NULL,
  `ProjectID`        INT           NULL,
  CONSTRAINT `PK_eng_quote_description` PRIMARY KEY (`QDID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_pymt_payable` (
  `PymtID`       INT           NOT NULL AUTO_INCREMENT,
  `VoucherNo`    VARCHAR(50)   NULL,
  `SupplierID`   INT           NULL,
  `Tr_date`      DATE          NULL,
  `Due_date`     DATE          NULL,
  `PoNo`         VARCHAR(50)   NULL,
  `Tr_status`    INT           NULL,
  `reference`    VARCHAR(250)  NULL,
  `FY`           VARCHAR(50)   NULL,
  `Particulars`  VARCHAR(250)  NULL,
  `Amount`       DECIMAL(10,2) NULL,
  `GTAX`         VARCHAR(50)   NULL,
  `PreparedBy`   VARCHAR(150)  NULL,
  `ApprovedBy`   VARCHAR(150)  NULL,
  `ReceivedBy`   VARCHAR(150)  NULL,
  `CreatedBy`    INT           NULL,
  `UpdatedBy`    INT           NULL,
  `CreatedDate`  DATE          NULL,
  `UpdatedDate`  DATE          NULL,
  `ExpenseFlag`  INT           NULL,
  `EmpID`        INT           NULL,
  `ClaimID`      INT           NULL,
  `PayableType`  VARCHAR(50)   NULL,
  `ClaimNo`      VARCHAR(80)   NULL,
  `PoID`         INT           NULL,
  CONSTRAINT `PK_eng_pymt_payable` PRIMARY KEY (`PymtID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_pymt_receivable` (
  `PymtID`         INT           NOT NULL AUTO_INCREMENT,
  `VoucherNo`      VARCHAR(50)   NULL,
  `ClientID`       INT           NULL,
  `Tr_date`        DATE          NULL,
  `Due_date`       DATE          NULL,
  `InvoiceNo`      VARCHAR(50)   NULL,
  `Tr_status`      INT           NULL,
  `reference`      VARCHAR(250)  NULL,
  `FY`             VARCHAR(50)   NULL,
  `Particulars`    VARCHAR(250)  NULL,
  `Amount`         DECIMAL(10,2) NULL,
  `GTAX`           VARCHAR(50)   NULL,
  `CreatedBy`      INT           NULL,
  `UpdatedBy`      INT           NULL,
  `CreatedDate`    DATE          NULL,
  `UpdatedDate`    DATE          NULL,
  `ReceivableType` INT           NULL,
  `QuoteID`        INT           NULL,
  `InvoiceType`    VARCHAR(50)   NULL,
  `InvoiceID`      INT           NULL,
  CONSTRAINT `PK_eng_pymt_receivable` PRIMARY KEY (`PymtID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_qa_defect` (
  `DefectID`         INT          NOT NULL AUTO_INCREMENT,
  `DefectDisplayID`  VARCHAR(50)  NULL,
  `ProjectID`        INT          NULL,
  `Location`         VARCHAR(80)  NULL,
  `DrawingRecordNo`  VARCHAR(80)  NULL,
  `InspectionArea`   VARCHAR(150) NULL,
  `SupplierFlag`     INT          NULL,
  `SupplierID`       INT          NULL,
  `Remarks`          VARCHAR(250) NULL,
  `DefStatus`        VARCHAR(50)  NULL,
  `InspectedBy`      INT          NULL,
  `InspectedDate`    DATE         NULL,
  `PM_Incharge`      INT          NULL,
  `CreatedBy`        INT          NULL,
  `CreatedDate`      DATE         NULL,
  `UpdatedBy`        INT          NULL,
  `UpdatedDate`      DATE         NULL,
  `InspectionType`   VARCHAR(50)  NULL,
  `Ext_AuditedBy`    VARCHAR(80)  NULL,
  `Ext_Auditor_Desig` VARCHAR(50) NULL,
  CONSTRAINT `PK_eng_qa_defect` PRIMARY KEY (`DefectID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_qa_defect_detail` (
  `DefectDetailID`      INT          NOT NULL AUTO_INCREMENT,
  `DefectTrackNum`      VARCHAR(50)  NULL,
  `DefectID`            INT          NULL,
  `DefectTitle`         VARCHAR(250) NULL,
  `DefectImpactDetails` LONGTEXT     NULL,
  `DefectStatus`        VARCHAR(50)  NULL,
  CONSTRAINT `PK_eng_qa_defect_detail` PRIMARY KEY (`DefectDetailID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_qa_defect_cpa` (
  `DPCID`            INT          NOT NULL AUTO_INCREMENT,
  `DefectDetailID`   INT          NULL,
  `PAflag`           INT          NULL,
  `CAflag`           INT          NULL,
  `rfp_ncps`         INT          NULL,
  `rfp_mgmtreview`   INT          NULL,
  `rfp_cc`           INT          NULL,
  `rfp_ea`           INT          NULL,
  `rfp_other`        INT          NULL,
  `rfp_other_remarks` VARCHAR(250) NULL,
  `ipt_envmt`        INT          NULL,
  `ipt_safety`       INT          NULL,
  `ipt_health`       INT          NULL,
  `ipt_insandops`    INT          NULL,
  `ipt_suggestion`   INT          NULL,
  `ActionTaken`      LONGTEXT     NULL,
  `ActionBy`         VARCHAR(50)  NULL,
  `DoI`              DATE         NULL,
  `FollowupAction`   LONGTEXT     NULL,
  `Remarks`          LONGTEXT     NULL,
  `ReviewedBy`       VARCHAR(50)  NULL,
  `TrackStatus`      VARCHAR(50)  NULL,
  `UpdatedBy`        INT          NULL,
  `UpdatedDate`      DATE         NULL,
  CONSTRAINT `PK_eng_qa_defect_cpa` PRIMARY KEY (`DPCID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_qa_defect_cpa_files` (
  `CpaFileID`   INT          NOT NULL AUTO_INCREMENT,
  `DPCID`       INT          NULL,
  `FIleCaption` VARCHAR(250) NULL,
  `FileName`    VARCHAR(300) NULL,
  `FilePath`    VARCHAR(300) NULL,
  CONSTRAINT `PK_eng_qa_defect_cpa_files` PRIMARY KEY (`CpaFileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_qa_defect_files` (
  `DefectFileID` INT          NOT NULL AUTO_INCREMENT,
  `DefectID`     INT          NULL,
  `FIleCaption`  VARCHAR(250) NULL,
  `FileName`     VARCHAR(300) NULL,
  `FilePath`     VARCHAR(300) NULL,
  `DefectType`   INT          NULL,
  CONSTRAINT `PK_eng_qa_defect_files` PRIMARY KEY (`DefectFileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_ra_control_measures` (
  `ItemID`          INT       NOT NULL AUTO_INCREMENT,
  `ItemDescription` LONGTEXT  NULL,
  `CreatedBy`       INT       NULL,
  `CreatedDate`     DATETIME  NULL,
  `UpdatedBy`       INT       NULL,
  `UpdatedDate`     DATETIME  NULL,
  CONSTRAINT `PK_eng_ra_control_measures` PRIMARY KEY (`ItemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_ra_hazardlist` (
  `ItemID`          INT       NOT NULL AUTO_INCREMENT,
  `ItemDescription` LONGTEXT  NULL,
  `CreatedBy`       INT       NULL,
  `CreatedDate`     DATETIME  NULL,
  `UpdatedBy`       INT       NULL,
  `UpdatedDate`     DATETIME  NULL,
  CONSTRAINT `PK_eng_ra_hazardlist` PRIMARY KEY (`ItemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_ra_location` (
  `ItemID`          INT       NOT NULL AUTO_INCREMENT,
  `ItemDescription` LONGTEXT  NULL,
  `CreatedBy`       INT       NULL,
  `CreatedDate`     DATETIME  NULL,
  `UpdatedBy`       INT       NULL,
  `UpdatedDate`     DATETIME  NULL,
  CONSTRAINT `PK_eng_ra_location` PRIMARY KEY (`ItemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_ra_possible_accident_health` (
  `ItemID`          INT       NOT NULL AUTO_INCREMENT,
  `ItemDescription` LONGTEXT  NULL,
  `CreatedBy`       INT       NULL,
  `CreatedDate`     DATETIME  NULL,
  `UpdatedBy`       INT       NULL,
  `UpdatedDate`     DATETIME  NULL,
  CONSTRAINT `PK_eng_ra_possible_accident_health` PRIMARY KEY (`ItemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_ra_process` (
  `ItemID`          INT       NOT NULL AUTO_INCREMENT,
  `ItemDescription` LONGTEXT  NULL,
  `CreatedBy`       INT       NULL,
  `CreatedDate`     DATETIME  NULL,
  `UpdatedBy`       INT       NULL,
  `UpdatedDate`     DATETIME  NULL,
  CONSTRAINT `PK_eng_ra_process` PRIMARY KEY (`ItemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_ra_trans_master` (
  `RAID`               INT          NOT NULL AUTO_INCREMENT,
  `RARefNum`           VARCHAR(50)  NULL,
  `ProjectID`          INT          NULL,
  `CompanyName`        VARCHAR(80)  NULL,
  `ContractNumber`     VARCHAR(150) NULL,
  `Process`            LONGTEXT     NULL,
  `ActivityLocation`   VARCHAR(150) NULL,
  `AssessmentDate`     DATETIME     NULL,
  `LastReviewDate`     DATE         NULL,
  `NextReviewDate`     DATE         NULL,
  `RALeader`           VARCHAR(100) NULL,
  `RAMember1`          VARCHAR(100) NULL,
  `RAMember2`          VARCHAR(100) NULL,
  `RAMember3`          VARCHAR(100) NULL,
  `RAMember4`          VARCHAR(100) NULL,
  `RAMember5`          VARCHAR(100) NULL,
  `ApprovedBy`         VARCHAR(100) NULL,
  `ApprovedDesig`      VARCHAR(80)  NULL,
  `ApprovedDate`       DATETIME     NULL,
  `Reference_Number`   VARCHAR(80)  NULL,
  `PreparedBy`         VARCHAR(100) NULL,
  `CreatedBy`          INT          NULL,
  `CreatedDate`        DATETIME     NULL,
  `UpdatedBy`          INT          NULL,
  `UpdatedDate`        DATETIME     NULL,
  CONSTRAINT `PK_eng_ra_trans_master` PRIMARY KEY (`RAID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_ra_trans_detail1` (
  `RAWADetID`      INT          NOT NULL AUTO_INCREMENT,
  `RAID`           INT          NULL,
  `Locations`      VARCHAR(250) NULL,
  `Process`        LONGTEXT     NULL,
  `WorkActivities` LONGTEXT     NULL,
  CONSTRAINT `PK_eng_ra_trans_detail1` PRIMARY KEY (`RAWADetID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_ra_trans_racm` (
  `RACMID`      INT          NOT NULL AUTO_INCREMENT,
  `RAID`        INT          NULL,
  `RAWADetID`   INT          NULL,
  `RAWADetail`  LONGTEXT     NULL,
  `HazardID`    LONGTEXT     NULL,
  `PAHID`       LONGTEXT     NULL,
  `REvExRCID`   LONGTEXT     NULL,
  `REvRMLHID`   INT          NULL,
  `REvRMSVID`   INT          NULL,
  `REvRPN`      INT          NULL,
  `RCAdRCID`    LONGTEXT     NULL,
  `RCRMLHID`    INT          NULL,
  `RCRMSVID`    INT          NULL,
  `RCRPN`       INT          NULL,
  `ImpOfficer`  VARCHAR(100) NULL,
  `DueDate`     DATETIME     NULL,
  `Remarks`     LONGTEXT     NULL,
  `PreparedBy`  VARCHAR(100) NULL,
  `UpdatedBy`   INT          NULL,
  `UpdatedDate` DATETIME     NULL,
  CONSTRAINT `PK_eng_ra_trans_racm` PRIMARY KEY (`RACMID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_ra_work_activity` (
  `ItemID`          INT       NOT NULL AUTO_INCREMENT,
  `ItemDescription` LONGTEXT  NULL,
  `CreatedBy`       INT       NULL,
  `CreatedDate`     DATETIME  NULL,
  `UpdatedBy`       INT       NULL,
  `UpdtaedDate`     DATETIME  NULL,
  CONSTRAINT `PK_eng_ra_work_activity` PRIMARY KEY (`ItemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_safety_master` (
  `SafetyID`      INT          NOT NULL AUTO_INCREMENT,
  `CompanyName`   VARCHAR(100) NULL,
  `ProjectTitle`  VARCHAR(250) NULL,
  `RepDate`       DATE         NULL,
  `RepTime`       TIME         NULL,
  `LocationOfWork` LONGTEXT    NULL,
  `OtherHazard`   VARCHAR(150) NULL,
  `SubmittedBy`   INT          NULL,
  `ASHMeasures`   LONGTEXT     NULL,
  `Status`        INT          NULL,
  `CreatedDate`   DATE         NULL,
  `UpdatedBy`     INT          NULL,
  `UpdatedDate`   DATE         NULL,
  `SignaturePath` VARCHAR(350) NULL,
  CONSTRAINT `PK_eng_safety_master` PRIMARY KEY (`SafetyID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_safety_esh` (
  `NSIID`                  INT          NOT NULL AUTO_INCREMENT,
  `ProjectID`              INT          NULL,
  `InspectionDate`         DATE         NULL,
  `ProjectLocation`        VARCHAR(80)  NULL,
  `InspectedBy`            VARCHAR(80)  NULL,
  `Observation`            LONGTEXT     NULL,
  `RemedialAction`         VARCHAR(350) NULL,
  `ActionBy_Deadline`      VARCHAR(150) NULL,
  `Rectification_Remarks`  VARCHAR(350) NULL,
  `Status`                 VARCHAR(150) NULL,
  `EHSName`                VARCHAR(80)  NULL,
  `AcknowlegeBy`           VARCHAR(80)  NULL,
  `CreatedBy`              INT          NULL,
  `CreatedDate`            DATE         NULL,
  `UpdatedBy`              INT          NOT NULL DEFAULT 0,
  `UpdatedDate`            DATE         NULL,
  `FileCaption`            VARCHAR(250) NULL,
  `FileName`               VARCHAR(350) NULL,
  `FilePath`               VARCHAR(450) NULL,
  CONSTRAINT `PK_eng_safety_esh` PRIMARY KEY (`NSIID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_safety_esh_files` (
  `NSIFileID`             INT          NOT NULL AUTO_INCREMENT,
  `NSIID`                 INT          NULL,
  `FileCaption`           VARCHAR(250) NULL,
  `FileName`              VARCHAR(300) NULL,
  `FilePath`              VARCHAR(350) NULL,
  `Observation`           LONGTEXT     NULL,
  `RemedialAction`        VARCHAR(350) NULL,
  `ActionBy_Deadline`     VARCHAR(150) NULL,
  `Rectification_Remarks` VARCHAR(350) NULL,
  `Status`                VARCHAR(150) NULL,
  `InspectionDate`        DATE         NULL,
  `ProjectID`             INT          NULL,
  CONSTRAINT `PK_eng_safety_esh_files` PRIMARY KEY (`NSIFileID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_safety_hazard_list` (
  `HLID`     INT NOT NULL AUTO_INCREMENT,
  `SafetyID` INT NULL,
  `HazardID` INT NULL,
  CONSTRAINT `PK_eng_safety_hazard_list` PRIMARY KEY (`HLID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_safety_insp_master` (
  `SAFINSID`                    INT          NOT NULL AUTO_INCREMENT,
  `SafetyRefNum`                VARCHAR(50)  NULL,
  `ProjectID`                   INT          NULL,
  `SIDate`                      DATETIME     NULL,
  `ProjectLocation`             VARCHAR(150) NULL,
  `InspectedBy`                 VARCHAR(80)  NULL,
  `Address`                     VARCHAR(250) NULL,
  `Safety_Cert_Info`            VARCHAR(80)  NULL,
  `Others1`                     VARCHAR(250) NULL,
  `Others2`                     VARCHAR(250) NULL,
  `Others3`                     VARCHAR(250) NULL,
  `Others4`                     VARCHAR(250) NULL,
  `Others5`                     VARCHAR(250) NULL,
  `Others6`                     VARCHAR(250) NULL,
  `Others7`                     VARCHAR(250) NULL,
  `Others8`                     VARCHAR(250) NULL,
  `Others9`                     VARCHAR(250) NULL,
  `Others10`                    VARCHAR(250) NULL,
  `RP1`                         VARCHAR(80)  NULL,
  `RP2`                         VARCHAR(80)  NULL,
  `RP3`                         VARCHAR(80)  NULL,
  `RP4`                         VARCHAR(80)  NULL,
  `RP5`                         VARCHAR(80)  NULL,
  `RP6`                         VARCHAR(80)  NULL,
  `RP7`                         VARCHAR(80)  NULL,
  `RP8`                         VARCHAR(80)  NULL,
  `RP9`                         VARCHAR(80)  NULL,
  `RP10`                        VARCHAR(80)  NULL,
  `ACDate1`                     DATETIME     NULL,
  `ACDate2`                     DATETIME     NULL,
  `ACDate3`                     DATETIME     NULL,
  `ACDate4`                     DATETIME     NULL,
  `ACDate5`                     DATETIME     NULL,
  `ACDate6`                     DATETIME     NULL,
  `ACDate7`                     DATETIME     NULL,
  `ACDate8`                     DATETIME     NULL,
  `ACDate9`                     DATETIME     NULL,
  `ACDate10`                    DATETIME     NULL,
  `Senior_Construction_Manager` VARCHAR(80)  NULL,
  `Project_Manager`             VARCHAR(80)  NULL,
  `Site_Manager`                VARCHAR(80)  NULL,
  `Zone_Construction_Manager`   VARCHAR(80)  NULL,
  `Safety_Manager`              VARCHAR(80)  NULL,
  `Safety_Officer`              VARCHAR(80)  NULL,
  `CreatedBy`                   INT          NULL,
  `CreatedDate`                 DATETIME     NULL,
  `UpdatedBy`                   INT          NULL,
  `UpdatedDate`                 DATETIME     NULL,
  CONSTRAINT `PK_eng_safety_insp_master` PRIMARY KEY (`SAFINSID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_safety_insp_detail` (
  `SIDetailID`         INT          NOT NULL AUTO_INCREMENT,
  `SAFINSID`           INT          NULL,
  `SIItemID`           INT          NULL,
  `Is_Applicable`      INT          NULL,
  `Recommendation`     LONGTEXT     NULL,
  `ResponsiblePerson`  VARCHAR(80)  NULL,
  `ACDate`             DATETIME     NULL,
  CONSTRAINT `PK_eng_safety_insp_detail` PRIMARY KEY (`SIDetailID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_safety_ppe_list` (
  `PPELID`   INT NOT NULL AUTO_INCREMENT,
  `SafetyID` INT NULL,
  `PPEID`    INT NULL,
  CONSTRAINT `PK_eng_safety_ppe_list` PRIMARY KEY (`PPELID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_safety_worker_list` (
  `WLID`     INT NOT NULL AUTO_INCREMENT,
  `SafetyID` INT NULL,
  `EmpID`    INT NULL,
  CONSTRAINT `PK_eng_safety_worker_list` PRIMARY KEY (`WLID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_screens` (
  `SCREEN_ID`         INT          NOT NULL AUTO_INCREMENT,
  `MODULEID`          INT          NOT NULL,
  `SCREEN_NAME`       VARCHAR(50)  NOT NULL,
  `SCREEN_CLASS_NAME` VARCHAR(50)  NULL,
  `SCREEN_URL`        VARCHAR(200) NOT NULL,
  `ORDER_BY`          INT          NOT NULL,
  CONSTRAINT `PK_eng_screens` PRIMARY KEY (`SCREEN_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_time_entry` (
  `TEID`            INT           NOT NULL AUTO_INCREMENT,
  `EmpID`           INT           NULL,
  `ProjectID`       INT           NULL,
  `ReportDate`      DATE          NULL,
  `Work_Start_Time` TIME          NULL,
  `Work_End_Time`   TIME          NULL,
  `Ot_Start_Time`   TIME          NULL,
  `Ot_End_Time`     TIME          NULL,
  `No_of_WorkHours` DECIMAL(5,2)  NULL,
  `No_of_OtHours`   DECIMAL(5,2)  NULL,
  `Remarks`         VARCHAR(250)  NULL,
  `SubmittedBy`     INT           NULL,
  `SubmittedDate`   DATE          NULL,
  `UpdatedBy`       INT           NULL,
  `UpdatedDate`     DATE          NULL,
  `WEHflag`         INT           NULL,
  `LBflag`          INT           NULL,
  `Leave`           INT           NULL,
  `ReportEndDate`   DATE          NULL,
  CONSTRAINT `PK_eng_time_entry` PRIMARY KEY (`TEID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_transport_master` (
  `TransportID`                INT          NOT NULL AUTO_INCREMENT,
  `Vehicle_Name`               VARCHAR(50)  NULL,
  `Vehicle_Company`            VARCHAR(50)  NULL,
  `Vehicle_Model`              VARCHAR(50)  NULL,
  `Vehicle_Type`               VARCHAR(50)  NULL,
  `Vehicle_Number`             VARCHAR(50)  NULL,
  `COE_Regn_Number`            VARCHAR(100) NULL,
  `COE_Issue_Date`             DATE         NULL,
  `COE_Expiry_Date`            DATE         NULL,
  `RoadTax_Regn_Number`        VARCHAR(100) NULL,
  `RoadTax_Iussue_Date`        DATE         NULL,
  `RoadTax_Expiry_Date`        DATE         NULL,
  `Insurance_Policy_Number`    VARCHAR(100) NULL,
  `Insurance_Issue_Date`       DATE         NULL,
  `Insurance_Expiry_Date`      DATE         NULL,
  `Insurance_Company`          VARCHAR(80)  NULL,
  `Last_Insurance_Renew_Date`  DATE         NULL,
  `Vehicle_Inspection_Date`    DATE         NULL,
  `Inspection_Due_Date`        DATE         NULL,
  `Remarks`                    LONGTEXT     NULL,
  `CreatedDate`                DATE         NULL,
  `UpdatedDate`                DATE         NULL,
  `CreatedBy`                  INT          NULL,
  `UpdatedBy`                  INT          NULL,
  `IsActive`                   INT          NULL,
  `AgreementNumber`            VARCHAR(150) NULL,
  CONSTRAINT `PK_eng_transport_master` PRIMARY KEY (`TransportID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_ptw_master` (
  `PTW_master_ID`           INT          NOT NULL AUTO_INCREMENT,
  `CompanyName`             VARCHAR(250) NULL,
  `ProjectTitle`            VARCHAR(250) NULL,
  `NameOfApplicant`         VARCHAR(150) NULL,
  `Date_Time`               DATETIME     NULL,
  `Sub_con_Name`            VARCHAR(250) NULL,
  `Loc_or_GridLineNo`       VARCHAR(250) NULL,
  `Start_Date_Time`         DATETIME     NULL,
  `End_Date_Time`           DATETIME     NULL,
  `No_of_workers_involved`  INT          NULL,
  `Stage1_Person_Name`      VARCHAR(100) NULL,
  `Stage1_Date_Time`        DATETIME     NULL,
  `Stage2_Person_Name`      VARCHAR(100) NULL,
  `Stage2_Date_Time`        DATETIME     NULL,
  `Stage3_Person_Name`      VARCHAR(100) NULL,
  `Stage3_Date_Time`        DATETIME     NULL,
  `Stage4_Sup_Name`         VARCHAR(100) NULL,
  `Stage4_Sup_Date_Time`    DATETIME     NULL,
  `Stage4_WSH_Name`         VARCHAR(100) NULL,
  `Stage4_WSH_Date_Time`    DATETIME     NULL,
  `Stage5_Sup_Person_Name`  VARCHAR(100) NULL,
  `Stage5_Sup_Date_Time`    DATETIME     NULL,
  `Stage5_Mng_Person_Name`  VARCHAR(100) NULL,
  `Stage5_Mng_Date_Time`    DATETIME     NULL,
  `Revoke_Desc`             VARCHAR(250) NULL,
  `Revoke_Sup_Name`         VARCHAR(100) NULL,
  `Revoke_Mng_Name`         VARCHAR(100) NULL,
  `ProjectID`               INT          NULL,
  `PTW_type`                VARCHAR(50)  NULL,
  `Created_By`              INT          NULL,
  `Created_Date`            DATETIME     NULL,
  `Updated_By`              INT          NULL,
  `Updated_Date`            DATETIME     NULL,
  `CompletedStage`          INT          NULL,
  CONSTRAINT `PK_eng_ptw_master` PRIMARY KEY (`PTW_master_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_PTW_Detail_Satge1` (
  `PTW_Detail_Satge1_ID` INT NOT NULL AUTO_INCREMENT,
  `PTW_Master_ID`        INT NULL,
  `PTW_Stage_One_ID`     INT NULL,
  `Is_Applicable`        INT NULL,
  CONSTRAINT `PK_eng_PTW_Detail_Satge1` PRIMARY KEY (`PTW_Detail_Satge1_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_PTW_Detail_Satge4` (
  `PTW_Detail_Satge4` INT          NOT NULL AUTO_INCREMENT,
  `PTW_Master_ID`     INT          NULL,
  `Day`               VARCHAR(3)   NULL,
  `DayDate`           DATE         NULL,
  `Sup_Signature`     VARCHAR(100) NULL,
  `Sup_Sig_Date`      DATETIME     NULL,
  `Mng_Signature`     VARCHAR(100) NULL,
  `Mng_Sig_Date`      DATETIME     NULL,
  CONSTRAINT `PK_eng_PTW_Detail_Satge4` PRIMARY KEY (`PTW_Detail_Satge4`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_PTW_Employee_Details` (
  `PTWEmployeeID` INT NOT NULL AUTO_INCREMENT,
  `PTW_Master_ID` INT NULL,
  `EmployeeID`    INT NULL,
  CONSTRAINT `PK_eng_PTW_Employee_Details` PRIMARY KEY (`PTWEmployeeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_ptw_conspc_master` (
  `PTW_master_ID`              INT          NOT NULL AUTO_INCREMENT,
  `ContractorName`             VARCHAR(250) NULL,
  `Work_Description`           VARCHAR(250) NULL,
  `Applicant_Name`             VARCHAR(150) NULL,
  `Applicant_Desig`            VARCHAR(150) NULL,
  `Applicant_Date_Time`        DATETIME     NULL,
  `LocationOfWork`             VARCHAR(250) NULL,
  `Start_Date_Time`            DATETIME     NULL,
  `End_Date_Time`              DATETIME     NULL,
  `No_of_workers_involved`     INT          NULL,
  `Stage1_Watchman_Name`       VARCHAR(100) NULL,
  `Stage1_Watchman_ID`         VARCHAR(100) NULL,
  `Stage1_Watchman_Company`    VARCHAR(100) NULL,
  `Stage2_O2`                  VARCHAR(20)  NULL,
  `Stage2_CO2`                 VARCHAR(20)  NULL,
  `Stage2_LEL`                 VARCHAR(20)  NULL,
  `Stage2_H2S`                 VARCHAR(20)  NULL,
  `Safe_for_Entry`             VARCHAR(10)  NULL,
  `Stage2_Assessor_Name`       VARCHAR(100) NULL,
  `Stage2_Assessor_Desig`      VARCHAR(100) NULL,
  `Stage2_Assessor_Date_Time`  DATETIME     NULL,
  `Stage2_Comments`            VARCHAR(250) NULL,
  `Stage3_WSH_Name`            VARCHAR(100) NULL,
  `Stage3_WSH_Desig`           VARCHAR(100) NULL,
  `Stage3_WSH_Date_Time`       DATETIME     NULL,
  `Stage3_Comments`            VARCHAR(250) NULL,
  `Stage4_Mng_Name`            VARCHAR(100) NULL,
  `Stage4_Mng_Desig`           VARCHAR(100) NULL,
  `Stage4_Date_Time`           DATETIME     NULL,
  `Stage4_Comments`            VARCHAR(250) NULL,
  `Stage6_Person_Name`         VARCHAR(100) NULL,
  `Stage6_Person_Desig`        VARCHAR(100) NULL,
  `Stage6_Date_Time`           DATETIME     NULL,
  `Revoke_Desc`                VARCHAR(250) NULL,
  `Revoke_WSH_Name`            VARCHAR(100) NULL,
  `Revoke_PM_Name`             VARCHAR(100) NULL,
  `Revoke_Date_Time`           DATETIME     NULL,
  `ProjectID`                  INT          NULL,
  `PTW_type`                   VARCHAR(50)  NULL,
  `Created_By`                 INT          NULL,
  `Created_Date`               DATETIME     NULL,
  `Updated_By`                 INT          NULL,
  `Updated_Date`               DATETIME     NULL,
  `CompletedStage`             INT          NULL,
  CONSTRAINT `PK_eng_ptw_conspc_master` PRIMARY KEY (`PTW_master_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_PTW_Conspc_Detail_Stage1` (
  `PTW_Conspc_Stage1_ID`      INT          NOT NULL AUTO_INCREMENT,
  `PTW_Master_ID`             INT          NULL,
  `PTW_Stage_One_ID`          INT          NULL,
  `Is_Applicable_Applicant`   INT          NULL,
  `Is_Applicable_Assessor`    INT          NULL,
  `Assessor_Remarks`          VARCHAR(250) NULL,
  CONSTRAINT `PK_eng_PTW_Conspc_Detail_Stage1` PRIMARY KEY (`PTW_Conspc_Stage1_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_PTW_Conspc_Detail_Stage5` (
  `PTW_Conspc_Stage5_ID`   INT          NOT NULL AUTO_INCREMENT,
  `PTW_Master_ID`          INT          NULL,
  `Stage5_Date_Time`       DATETIME     NULL,
  `O2`                     VARCHAR(20)  NULL,
  `CO2`                    VARCHAR(20)  NULL,
  `LEL`                    VARCHAR(20)  NULL,
  `H2S`                    VARCHAR(20)  NULL,
  `Safe_for_Entry`         VARCHAR(10)  NULL,
  `Stage5_Assessor_Name`   VARCHAR(100) NULL,
  `Assessor_Comments`      VARCHAR(250) NULL,
  CONSTRAINT `PK_eng_PTW_Conspc_Detail_Stage5` PRIMARY KEY (`PTW_Conspc_Stage5_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eng_PTW_Conspc_Employee_Details` (
  `PTWEmployeeID` INT NOT NULL AUTO_INCREMENT,
  `PTW_Master_ID` INT NULL,
  `EmployeeID`    INT NULL,
  CONSTRAINT `PK_eng_PTW_Conspc_Employee_Details` PRIMARY KEY (`PTWEmployeeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================================
-- SECTION 2: FOREIGN KEYS (ALL FIXED)
-- ============================================================

ALTER TABLE `eng_claim`
  ADD CONSTRAINT `FK_eng_claim_eng_employee_profile`
    FOREIGN KEY (`UserID`) REFERENCES `eng_employee_profile` (`UserID`),
  ADD CONSTRAINT `FK_eng_claim_eng_project_master`
    FOREIGN KEY (`ProjectID`) REFERENCES `eng_project_master` (`ProjectID`),
  ADD CONSTRAINT `FK_eng_claim_eng_users`
    FOREIGN KEY (`ApprovedBy`) REFERENCES `eng_users` (`UserID`),
  ADD CONSTRAINT `FK_eng_claim_eng_users_submitted`
    FOREIGN KEY (`SubmittedBy`) REFERENCES `eng_users` (`UserID`),
  -- FIXED: Added missing FK for Status column
  ADD CONSTRAINT `FK_eng_claim_eng_sys_claimtype`
    FOREIGN KEY (`Status`) REFERENCES `eng_sys_claimtype` (`ClaimTypeID`);

ALTER TABLE `eng_claim_description`
  ADD CONSTRAINT `FK_eng_claim_description_eng_claim`
    FOREIGN KEY (`ClaimID`) REFERENCES `eng_claim` (`ClaimID`),
  ADD CONSTRAINT `FK_eng_claim_description_eng_sys_claimtype`
    FOREIGN KEY (`ClaimTypeID`) REFERENCES `eng_sys_claimtype` (`ClaimTypeID`);

ALTER TABLE `eng_claim_files`
  ADD CONSTRAINT `FK_eng_claim_files_eng_claim`
    FOREIGN KEY (`ClaimID`) REFERENCES `eng_claim` (`ClaimID`);

ALTER TABLE `eng_client_contact`
  ADD CONSTRAINT `FK_eng_client_contact_eng_client_master`
    FOREIGN KEY (`ClientID`) REFERENCES `eng_client_master` (`ClientID`)
    ON DELETE CASCADE;

ALTER TABLE `eng_client_master`
  ADD CONSTRAINT `FK_eng_client_master_eng_address_master`
    FOREIGN KEY (`AddressID`) REFERENCES `eng_address_master` (`AddressID`),
  ADD CONSTRAINT `FK_eng_client_master_eng_sys_function`
    FOREIGN KEY (`FunctionalityID`) REFERENCES `eng_sys_function` (`Id`),
  ADD CONSTRAINT `FK_eng_client_master_eng_sys_industry`
    FOREIGN KEY (`IndustryID`) REFERENCES `eng_sys_industry` (`Id`);

ALTER TABLE `eng_custom_invoice`
  ADD CONSTRAINT `FK_eng_custom_invoice_eng_project_master`
    FOREIGN KEY (`ProjectID`) REFERENCES `eng_project_master` (`ProjectID`),
  ADD CONSTRAINT `FK_eng_custom_invoice_eng_quote_master`
    FOREIGN KEY (`QuotationID`) REFERENCES `eng_quote_master` (`QuoteID`);

ALTER TABLE `eng_custom_invoice_details`
  ADD CONSTRAINT `FK_eng_custom_invoice_details_eng_custom_invoice`
    FOREIGN KEY (`InvoiceID`) REFERENCES `eng_custom_invoice` (`InvoiceID`)
    ON DELETE CASCADE;

ALTER TABLE `eng_employee_profile`
  ADD CONSTRAINT `FK_eng_employee_profile_eng_address_master`
    FOREIGN KEY (`AddressID`) REFERENCES `eng_address_master` (`AddressID`),
  ADD CONSTRAINT `FK_eng_employee_profile_eng_usergroup`
    FOREIGN KEY (`GroupID`) REFERENCES `eng_usergroup` (`GroupID`);

ALTER TABLE `eng_invoice_details`
  ADD CONSTRAINT `FK_eng_invoice_details_eng_invoice_master`
    FOREIGN KEY (`InvoiceID`) REFERENCES `eng_invoice_master` (`InvoiceID`);

ALTER TABLE `eng_invoice_master`
  ADD CONSTRAINT `FK_eng_invoice_master_eng_quote_master`
    FOREIGN KEY (`QuoteID`) REFERENCES `eng_quote_master` (`QuoteID`);

ALTER TABLE `eng_inward`
  ADD CONSTRAINT `FK_eng_inward_eng_employee_profile`
    FOREIGN KEY (`ReceivedBy`) REFERENCES `eng_employee_profile` (`UserID`),
  ADD CONSTRAINT `FK_eng_inward_eng_store_master`
    FOREIGN KEY (`StoreID`) REFERENCES `eng_store_master` (`StoreID`),
  ADD CONSTRAINT `FK_eng_inward_eng_supplier_master`
    FOREIGN KEY (`SupplierID`) REFERENCES `eng_supplier_master` (`SupplierID`);

ALTER TABLE `eng_mm_inwdesc`
  ADD CONSTRAINT `FK_eng_mm_inwdesc_eng_inward`
    FOREIGN KEY (`Inward_ID`) REFERENCES `eng_inward` (`Inward_ID`),
  ADD CONSTRAINT `FK_eng_mm_inwdesc_eng_product_master`
    FOREIGN KEY (`ProductID`) REFERENCES `eng_product_master` (`ProductID`);

ALTER TABLE `eng_mm_outdesc`
  ADD CONSTRAINT `FK_eng_mm_outdesc_eng_outward`
    FOREIGN KEY (`Outward_ID`) REFERENCES `eng_outward` (`Outward_ID`),
  ADD CONSTRAINT `FK_eng_mm_outdesc_eng_product_master`
    FOREIGN KEY (`ProductID`) REFERENCES `eng_product_master` (`ProductID`);

ALTER TABLE `eng_mm_stockadj_master`
  ADD CONSTRAINT `FK_eng_mm_stockadj_master_eng_employee_profile`
    FOREIGN KEY (`Stock_Taken_By`) REFERENCES `eng_employee_profile` (`UserID`),
  ADD CONSTRAINT `FK_eng_mm_stockadj_master_eng_product_master`
    FOREIGN KEY (`ProductID`) REFERENCES `eng_product_master` (`ProductID`),
  ADD CONSTRAINT `FK_eng_mm_stockadj_master_eng_store_master`
    FOREIGN KEY (`StoreID`) REFERENCES `eng_store_master` (`StoreID`);

ALTER TABLE `eng_mm_trmaster`
  ADD CONSTRAINT `FK_eng_mm_trmaster_eng_product_master`
    FOREIGN KEY (`ProductID`) REFERENCES `eng_product_master` (`ProductID`);

ALTER TABLE `eng_outward`
  ADD CONSTRAINT `FK_eng_outward_eng_client_master`
    FOREIGN KEY (`ClientID`) REFERENCES `eng_client_master` (`ClientID`),
  ADD CONSTRAINT `FK_eng_outward_eng_employee_profile`
    FOREIGN KEY (`DeliveredBy`) REFERENCES `eng_employee_profile` (`UserID`),
  ADD CONSTRAINT `FK_eng_outward_eng_store_master`
    FOREIGN KEY (`StoreID`) REFERENCES `eng_store_master` (`StoreID`);

ALTER TABLE `eng_permission`
  ADD CONSTRAINT `FK_eng_permission_eng_module`
    FOREIGN KEY (`ModuleID`) REFERENCES `eng_module` (`ModuleID`),
  ADD CONSTRAINT `FK_eng_permission_eng_usergroup`
    FOREIGN KEY (`GroupID`) REFERENCES `eng_usergroup` (`GroupID`);

ALTER TABLE `eng_po_description`
  ADD CONSTRAINT `FK_eng_po_description_eng_po_master`
    FOREIGN KEY (`PoID`) REFERENCES `eng_po_master` (`PoID`)
    ON DELETE CASCADE;

ALTER TABLE `eng_po_master`
  ADD CONSTRAINT `FK_eng_po_master_eng_supplier_master`
    FOREIGN KEY (`SupplierID`) REFERENCES `eng_supplier_master` (`SupplierID`),
  ADD CONSTRAINT `FK_eng_po_master_eng_sys_quotestatus`
    FOREIGN KEY (`OrderStatusID`) REFERENCES `eng_sys_quotestatus` (`StatusID`);

ALTER TABLE `eng_project_master`
  ADD CONSTRAINT `FK_eng_project_master_eng_quote_master`
    FOREIGN KEY (`QuotationID`) REFERENCES `eng_quote_master` (`QuoteID`),
  ADD CONSTRAINT `FK_eng_project_master_eng_sys_location`
    FOREIGN KEY (`LocationId`) REFERENCES `eng_sys_location` (`LocationId`),
  ADD CONSTRAINT `FK_eng_project_master_eng_sys_project_status`
    FOREIGN KEY (`Project_Status_ID`) REFERENCES `eng_sys_project_status` (`ProjectStatusID`);

ALTER TABLE `eng_project_report`
  ADD CONSTRAINT `FK_eng_project_report_eng_project_master`
    FOREIGN KEY (`ProjectID`) REFERENCES `eng_project_master` (`ProjectID`),
  ADD CONSTRAINT `FK_eng_project_report_eng_sys_task_status`
    FOREIGN KEY (`TaskStatusID`) REFERENCES `eng_sys_task_status` (`TaskStatusID`);

ALTER TABLE `eng_project_report_files`
  ADD CONSTRAINT `FK_eng_project_report_files_eng_project_report`
    FOREIGN KEY (`ProjectReportID`) REFERENCES `eng_project_report` (`ProjectReportID`)
    ON DELETE CASCADE;

ALTER TABLE `eng_PTW_Conspc_Detail_Stage1`
  ADD CONSTRAINT `FK_eng_PTW_Conspc_Detail_Stage1_eng_ptw_conspc_master`
    FOREIGN KEY (`PTW_Master_ID`) REFERENCES `eng_ptw_conspc_master` (`PTW_master_ID`),
  ADD CONSTRAINT `FK_eng_PTW_Conspc_Detail_Stage1_eng_sys_ptw_stage1_config`
    FOREIGN KEY (`PTW_Stage_One_ID`) REFERENCES `eng_sys_ptw_stage1_config` (`PTW_Stage_One_ID`);

ALTER TABLE `eng_PTW_Conspc_Detail_Stage5`
  ADD CONSTRAINT `FK_eng_PTW_Conspc_Detail_Stage5_eng_ptw_conspc_master`
    FOREIGN KEY (`PTW_Master_ID`) REFERENCES `eng_ptw_conspc_master` (`PTW_master_ID`);

ALTER TABLE `eng_PTW_Conspc_Employee_Details`
  ADD CONSTRAINT `FK_eng_PTW_Conspc_Employee_Details_eng_ptw_conspc_master`
    FOREIGN KEY (`PTW_Master_ID`) REFERENCES `eng_ptw_conspc_master` (`PTW_master_ID`);

ALTER TABLE `eng_PTW_Detail_Satge1`
  ADD CONSTRAINT `FK_eng_PTW_Detail_Satge1_eng_ptw_master`
    FOREIGN KEY (`PTW_Master_ID`) REFERENCES `eng_ptw_master` (`PTW_master_ID`),
  ADD CONSTRAINT `FK_eng_PTW_Detail_Satge1_eng_sys_ptw_stage1_config`
    FOREIGN KEY (`PTW_Stage_One_ID`) REFERENCES `eng_sys_ptw_stage1_config` (`PTW_Stage_One_ID`);

ALTER TABLE `eng_PTW_Detail_Satge4`
  ADD CONSTRAINT `FK_eng_PTW_Detail_Satge4_eng_ptw_master`
    FOREIGN KEY (`PTW_Master_ID`) REFERENCES `eng_ptw_master` (`PTW_master_ID`);

ALTER TABLE `eng_PTW_Employee_Details`
  ADD CONSTRAINT `FK_eng_PTW_Employee_Details_eng_ptw_master`
    FOREIGN KEY (`PTW_Master_ID`) REFERENCES `eng_ptw_master` (`PTW_master_ID`);

ALTER TABLE `eng_pymt_payable`
  ADD CONSTRAINT `FK_eng_pymt_payable_eng_claim`
    FOREIGN KEY (`ClaimID`) REFERENCES `eng_claim` (`ClaimID`),
  ADD CONSTRAINT `FK_eng_pymt_payable_eng_employee_profile`
    FOREIGN KEY (`EmpID`) REFERENCES `eng_employee_profile` (`UserID`),
  ADD CONSTRAINT `FK_eng_pymt_payable_eng_po_master`
    FOREIGN KEY (`PoID`) REFERENCES `eng_po_master` (`PoID`),
  -- FIXED: Correct FK referencing eng_sys_pymt_status.Id
  ADD CONSTRAINT `FK_eng_pymt_payable_eng_sys_pymt_status`
    FOREIGN KEY (`Tr_status`) REFERENCES `eng_sys_pymt_status` (`Id`);

ALTER TABLE `eng_pymt_receivable`
  ADD CONSTRAINT `FK_eng_pymt_receivable_eng_client_master`
    FOREIGN KEY (`ClientID`) REFERENCES `eng_client_master` (`ClientID`),
  ADD CONSTRAINT `FK_eng_pymt_receivable_eng_sys_pymt_status`
    FOREIGN KEY (`Tr_status`) REFERENCES `eng_sys_pymt_status` (`Id`);

ALTER TABLE `eng_qa_defect`
  ADD CONSTRAINT `FK_eng_qa_defect_eng_employee_profile`
    FOREIGN KEY (`InspectedBy`) REFERENCES `eng_employee_profile` (`UserID`),
  ADD CONSTRAINT `FK_eng_qa_defect_eng_employee_profile1`
    FOREIGN KEY (`PM_Incharge`) REFERENCES `eng_employee_profile` (`UserID`),
  ADD CONSTRAINT `FK_eng_qa_defect_eng_project_master`
    FOREIGN KEY (`ProjectID`) REFERENCES `eng_project_master` (`ProjectID`),
  ADD CONSTRAINT `FK_eng_qa_defect_eng_supplier_master`
    FOREIGN KEY (`SupplierID`) REFERENCES `eng_supplier_master` (`SupplierID`);

ALTER TABLE `eng_qa_defect_cpa`
  ADD CONSTRAINT `FK_eng_qa_defect_cpa_eng_qa_defect_detail`
    FOREIGN KEY (`DefectDetailID`) REFERENCES `eng_qa_defect_detail` (`DefectDetailID`);

ALTER TABLE `eng_qa_defect_cpa_files`
  ADD CONSTRAINT `FK_eng_qa_defect_cpa_files_eng_qa_defect_cpa`
    FOREIGN KEY (`DPCID`) REFERENCES `eng_qa_defect_cpa` (`DPCID`)
    ON DELETE CASCADE;

ALTER TABLE `eng_qa_defect_detail`
  ADD CONSTRAINT `FK_eng_qa_defect_detail_eng_qa_defect`
    FOREIGN KEY (`DefectID`) REFERENCES `eng_qa_defect` (`DefectID`)
    ON DELETE CASCADE;

ALTER TABLE `eng_qa_defect_files`
  ADD CONSTRAINT `FK_eng_qa_defect_files_eng_qa_defect`
    FOREIGN KEY (`DefectID`) REFERENCES `eng_qa_defect` (`DefectID`)
    ON DELETE CASCADE;

ALTER TABLE `eng_quote_description`
  ADD CONSTRAINT `FK_eng_quote_description_eng_project_master`
    FOREIGN KEY (`ProjectID`) REFERENCES `eng_project_master` (`ProjectID`),
  ADD CONSTRAINT `FK_eng_quote_description_eng_quote_master`
    FOREIGN KEY (`QuoteID`) REFERENCES `eng_quote_master` (`QuoteID`)
    ON DELETE CASCADE;

ALTER TABLE `eng_quote_master`
  ADD CONSTRAINT `FK_eng_quote_master_eng_client_master`
    FOREIGN KEY (`ClientID`) REFERENCES `eng_client_master` (`ClientID`),
  ADD CONSTRAINT `FK_eng_quote_master_eng_sys_quotestatus`
    FOREIGN KEY (`QuoteStatusID`) REFERENCES `eng_sys_quotestatus` (`StatusID`);

ALTER TABLE `eng_ra_trans_detail1`
  ADD CONSTRAINT `FK_eng_ra_trans_detail1_eng_ra_trans_master`
    FOREIGN KEY (`RAID`) REFERENCES `eng_ra_trans_master` (`RAID`);

ALTER TABLE `eng_ra_trans_master`
  ADD CONSTRAINT `FK_eng_ra_trans_master_eng_project_master`
    FOREIGN KEY (`ProjectID`) REFERENCES `eng_project_master` (`ProjectID`);

ALTER TABLE `eng_ra_trans_racm`
  ADD CONSTRAINT `FK_eng_ra_trans_racm_eng_ra_trans_master`
    FOREIGN KEY (`RAID`) REFERENCES `eng_ra_trans_master` (`RAID`);

ALTER TABLE `eng_safety_esh`
  ADD CONSTRAINT `FK_eng_safety_esh_eng_project_master`
    FOREIGN KEY (`ProjectID`) REFERENCES `eng_project_master` (`ProjectID`);

ALTER TABLE `eng_safety_esh_files`
  ADD CONSTRAINT `FK_eng_safety_esh_files_eng_safety_esh`
    FOREIGN KEY (`NSIID`) REFERENCES `eng_safety_esh` (`NSIID`);

ALTER TABLE `eng_safety_hazard_list`
  ADD CONSTRAINT `FK_eng_safety_hazard_list_eng_safety_master`
    FOREIGN KEY (`SafetyID`) REFERENCES `eng_safety_master` (`SafetyID`)
    ON DELETE CASCADE,
  ADD CONSTRAINT `FK_eng_safety_hazard_list_eng_sys_safety_hazard`
    FOREIGN KEY (`HazardID`) REFERENCES `eng_sys_safety_hazard` (`HazardID`);

ALTER TABLE `eng_safety_insp_detail`
  ADD CONSTRAINT `FK_eng_safety_insp_detail_eng_safety_insp_master`
    FOREIGN KEY (`SAFINSID`) REFERENCES `eng_safety_insp_master` (`SAFINSID`),
  ADD CONSTRAINT `FK_eng_safety_insp_detail_eng_sys_safety_insp_items`
    FOREIGN KEY (`SIItemID`) REFERENCES `eng_sys_safety_insp_items` (`SIItemID`);

ALTER TABLE `eng_safety_insp_master`
  ADD CONSTRAINT `FK_eng_safety_insp_master_eng_project_master`
    FOREIGN KEY (`ProjectID`) REFERENCES `eng_project_master` (`ProjectID`);

ALTER TABLE `eng_safety_master`
  ADD CONSTRAINT `FK_eng_safety_master_eng_users`
    FOREIGN KEY (`SubmittedBy`) REFERENCES `eng_users` (`UserID`);

ALTER TABLE `eng_safety_ppe_list`
  ADD CONSTRAINT `FK_eng_safety_ppe_list_eng_safety_master`
    FOREIGN KEY (`SafetyID`) REFERENCES `eng_safety_master` (`SafetyID`)
    ON DELETE CASCADE,
  ADD CONSTRAINT `FK_eng_safety_ppe_list_eng_sys_safety_ppelist`
    FOREIGN KEY (`PPEID`) REFERENCES `eng_sys_safety_ppelist` (`PPEID`);

ALTER TABLE `eng_safety_worker_list`
  ADD CONSTRAINT `FK_eng_safety_worker_list_eng_employee_profile`
    FOREIGN KEY (`EmpID`) REFERENCES `eng_employee_profile` (`UserID`),
  ADD CONSTRAINT `FK_eng_safety_worker_list_eng_safety_master`
    FOREIGN KEY (`SafetyID`) REFERENCES `eng_safety_master` (`SafetyID`)
    ON DELETE CASCADE;

ALTER TABLE `eng_screens`
  ADD CONSTRAINT `FK_eng_screens_eng_module`
    FOREIGN KEY (`MODULEID`) REFERENCES `eng_module` (`ModuleID`);

ALTER TABLE `eng_supplier_master`
  ADD CONSTRAINT `FK_eng_supplier_master_eng_address_master`
    FOREIGN KEY (`AddressID`) REFERENCES `eng_address_master` (`AddressID`),
  ADD CONSTRAINT `FK_eng_supplier_master_eng_sys_industry`
    FOREIGN KEY (`IndustryID`) REFERENCES `eng_sys_industry` (`Id`);

ALTER TABLE `eng_time_entry`
  ADD CONSTRAINT `FK_eng_time_entry_eng_employee_profile`
    FOREIGN KEY (`EmpID`) REFERENCES `eng_employee_profile` (`UserID`),
  ADD CONSTRAINT `FK_eng_time_entry_eng_project_master`
    FOREIGN KEY (`ProjectID`) REFERENCES `eng_project_master` (`ProjectID`),
  ADD CONSTRAINT `FK_eng_time_entry_eng_users`
    FOREIGN KEY (`SubmittedBy`) REFERENCES `eng_users` (`UserID`);

ALTER TABLE `eng_users`
  ADD CONSTRAINT `FK_eng_users_eng_employee_profile`
    FOREIGN KEY (`EmpID`) REFERENCES `eng_employee_profile` (`UserID`),
  ADD CONSTRAINT `FK_eng_users_eng_usergroup`
    FOREIGN KEY (`GroupID`) REFERENCES `eng_usergroup` (`GroupID`);

-- ============================================================
-- SECTION 3: INDEXES (WITH UNIQUE NAMES)
-- ============================================================

CREATE INDEX `idx_claim_projectid` ON `eng_claim` (`ProjectID`);
CREATE INDEX `idx_claim_userid` ON `eng_claim` (`UserID`);
CREATE INDEX `idx_claim_status` ON `eng_claim` (`Status`);

CREATE INDEX `idx_project_report_projectid` ON `eng_project_report` (`ProjectID`);
CREATE INDEX `idx_project_report_taskstatus` ON `eng_project_report` (`TaskStatusID`);

CREATE INDEX `idx_time_entry_empid` ON `eng_time_entry` (`EmpID`);
CREATE INDEX `idx_time_entry_projectid` ON `eng_time_entry` (`ProjectID`);

CREATE INDEX `idx_quote_master_clientid` ON `eng_quote_master` (`ClientID`);
CREATE INDEX `idx_quote_master_statusid` ON `eng_quote_master` (`QuoteStatusID`);

CREATE INDEX `idx_invoice_master_clientid` ON `eng_invoice_master` (`ClientID`);
CREATE INDEX `idx_invoice_master_quoteid` ON `eng_invoice_master` (`QuoteID`);

CREATE INDEX `idx_mm_trmaster_productid` ON `eng_mm_trmaster` (`ProductID`);
CREATE INDEX `idx_mm_trmaster_storeid` ON `eng_mm_trmaster` (`StoreID`);

CREATE INDEX `idx_client_master_industryid` ON `eng_client_master` (`IndustryID`);
CREATE INDEX `idx_client_master_addressid` ON `eng_client_master` (`AddressID`);

CREATE INDEX `idx_supplier_master_industryid` ON `eng_supplier_master` (`IndustryID`);
CREATE INDEX `idx_supplier_master_addressid` ON `eng_supplier_master` (`AddressID`);

CREATE INDEX `idx_employee_profile_addressid` ON `eng_employee_profile` (`AddressID`);
CREATE INDEX `idx_employee_profile_groupid` ON `eng_employee_profile` (`GroupID`);

CREATE INDEX `idx_users_empid` ON `eng_users` (`EmpID`);
CREATE INDEX `idx_users_groupid` ON `eng_users` (`GroupID`);

CREATE INDEX `idx_inward_storeid` ON `eng_inward` (`StoreID`);
CREATE INDEX `idx_inward_supplierid` ON `eng_inward` (`SupplierID`);

CREATE INDEX `idx_outward_storeid` ON `eng_outward` (`StoreID`);
CREATE INDEX `idx_outward_clientid` ON `eng_outward` (`ClientID`);

CREATE INDEX `idx_project_master_quotationid` ON `eng_project_master` (`QuotationID`);
CREATE INDEX `idx_project_master_locationid` ON `eng_project_master` (`LocationId`);
CREATE INDEX `idx_project_master_statusid` ON `eng_project_master` (`Project_Status_ID`);

CREATE INDEX `idx_po_master_supplierid` ON `eng_po_master` (`SupplierID`);
CREATE INDEX `idx_po_master_orderstatusid` ON `eng_po_master` (`OrderStatusID`);

CREATE INDEX `idx_pymt_payable_supplierid` ON `eng_pymt_payable` (`SupplierID`);
CREATE INDEX `idx_pymt_payable_transtatus` ON `eng_pymt_payable` (`Tr_status`);
CREATE INDEX `idx_pymt_payable_claimid` ON `eng_pymt_payable` (`ClaimID`);
CREATE INDEX `idx_pymt_payable_poid` ON `eng_pymt_payable` (`PoID`);

CREATE INDEX `idx_pymt_receivable_clientid` ON `eng_pymt_receivable` (`ClientID`);
CREATE INDEX `idx_pymt_receivable_transtatus` ON `eng_pymt_receivable` (`Tr_status`);

CREATE INDEX `idx_qa_defect_projectid` ON `eng_qa_defect` (`ProjectID`);
CREATE INDEX `idx_qa_defect_supplierid` ON `eng_qa_defect` (`SupplierID`);
CREATE INDEX `idx_qa_defect_inspectedby` ON `eng_qa_defect` (`InspectedBy`);

CREATE INDEX `idx_qa_defect_detail_defectid` ON `eng_qa_defect_detail` (`DefectID`);
CREATE INDEX `idx_qa_defect_cpa_defectdetailid` ON `eng_qa_defect_cpa` (`DefectDetailID`);

CREATE INDEX `idx_ra_trans_master_projectid` ON `eng_ra_trans_master` (`ProjectID`);
CREATE INDEX `idx_ra_trans_racm_raid` ON `eng_ra_trans_racm` (`RAID`);

CREATE INDEX `idx_safety_master_submittedby` ON `eng_safety_master` (`SubmittedBy`);
CREATE INDEX `idx_safety_esh_projectid` ON `eng_safety_esh` (`ProjectID`);
CREATE INDEX `idx_safety_insp_master_projectid` ON `eng_safety_insp_master` (`ProjectID`);

CREATE INDEX `idx_safety_hazard_list_safetyid` ON `eng_safety_hazard_list` (`SafetyID`);
CREATE INDEX `idx_safety_ppe_list_safetyid` ON `eng_safety_ppe_list` (`SafetyID`);
CREATE INDEX `idx_safety_worker_list_safetyid` ON `eng_safety_worker_list` (`SafetyID`);

CREATE INDEX `idx_ptw_master_projectid` ON `eng_ptw_master` (`ProjectID`);
CREATE INDEX `idx_ptw_conspc_master_projectid` ON `eng_ptw_conspc_master` (`ProjectID`);

CREATE INDEX `idx_custom_invoice_projectid` ON `eng_custom_invoice` (`ProjectID`);
CREATE INDEX `idx_custom_invoice_quotationid` ON `eng_custom_invoice` (`QuotationID`);

CREATE INDEX `idx_quote_description_quoteid` ON `eng_quote_description` (`QuoteID`);
CREATE INDEX `idx_quote_description_projectid` ON `eng_quote_description` (`ProjectID`);

-- Added missing FK for eng_safety_master.Status
ALTER TABLE `eng_safety_master`
  ADD CONSTRAINT `FK_eng_safety_master_status`
    FOREIGN KEY (`Status`) REFERENCES `eng_sys_claimtype` (`ClaimTypeID`);

--Table Data
-- =============================================
-- Database: SBS360
-- =============================================

CREATE DATABASE IF NOT EXISTS `SBS360`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE `SBS360`;

SET FOREIGN_KEY_CHECKS = 0;

-- =============================================
-- Table: eng_sys_location
-- =============================================
INSERT INTO `eng_sys_location` (`LocationId`, `LocationName`) VALUES 
(1, 'Bedok'),
(2, 'Shengkong');

-- =============================================
-- Table: eng_sys_project_status
-- =============================================
INSERT INTO `eng_sys_project_status` (`ProjectStatusID`, `ProjectStatus`) VALUES 
(1, 'Started'),
(2, 'In-Process'),
(3, 'Completed'),
(4, 'Pending'),
(5, 'Cancelled');

-- =============================================
-- Table: eng_address_master
-- =============================================
INSERT INTO `eng_address_master` (`AddressID`, `Email`, `Mobile`, `Tel`, `Web`, `Address1`, `Address2`, `City`, `Country`, `Postal_Code`, `Fax1`, `SkypeID`, `Remarks`) VALUES 
(1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Singapore', NULL, NULL, NULL, NULL),
(2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Singapore', NULL, NULL, NULL, NULL),
(3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Singapore', NULL, NULL, NULL, NULL),
(4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Singapore', NULL, NULL, NULL, NULL),
(5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Singapore', NULL, NULL, NULL, NULL),
(6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Singapore', NULL, NULL, NULL, NULL),
(7, 'anandh@email.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 'bitcoin@email.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- =============================================
-- Table: eng_sys_function
-- =============================================
INSERT INTO `eng_sys_function` (`Id`, `Fn_code`, `Fn_Title`, `Fn_Value`) VALUES 
(1, ' JF0_01', ' Accounting', 0),
(2, ' JF0_02', ' Accountant', 1),
(3, ' JF0_03', ' Accounting Clerk / Supervisor', 1),
(4, ' JF0_04', ' Audit', 1),
(5, ' JF0_05', ' Chief Accountant', 1),
(6, ' JF0_06', ' Consulting', 1),
(7, ' JF0_07', ' Credit Control', 1),
(8, ' JF0_08', ' Finance / Accounting Manager', 1),
(9, ' JF0_09', ' Financial Analyst', 1),
(10, ' JF0_10', ' Financial Controller', 1),
(11, ' JF0_11', ' Taxation', 1),
(12, ' JF0_12', ' Treasurer', 1),
(13, ' JF0_13', ' Others', 1),
(14, ' JF1_01', ' Admin / Human Resources', 0),
(15, ' JF1_02', ' Administration / Operation Manager', 1),
(16, ' JF1_03', ' Clerical / Admin Staff', 1),
(17, ' JF1_04', ' Compensation & Benefits', 1),
(18, ' JF1_05', ' HR Director / Manager', 1),
(19, ' JF1_06', ' HR Officer / Executive', 1),
(20, ' JF1_07', ' Receptionist', 1),
(21, ' JF1_08', ' Recruitment / Executive Search', 1),
(22, ' JF1_09', ' Secretary / Personal Assistant', 1),
(23, ' JF1_10', ' Training & Development', 1),
(24, ' JF1_11', ' Others', 1),
(25, ' JF2_01', ' Banking / Finance', 0),
(26, ' JF2_02', ' Analyst', 1),
(27, ' JF2_03', ' Corporate Banking', 1),
(28, ' JF2_04', ' Corporate Finance', 1),
(29, ' JF2_05', ' Analysis / Credit Analysis / Approval', 1),
(30, ' JF2_06', ' Credit Collection', 1),
(31, ' JF2_07', ' Dealing & Trading', 1),
(32, ' JF2_08', ' Equities / Capital Markets / Securites', 1),
(33, ' JF2_09', ' Financial Services', 1),
(34, ' JF2_10', ' Fund Management', 1),
(35, ' JF2_11', ' Investment', 1),
(36, ' JF2_12', ' Loan / Mortgage', 1),
(37, ' JF2_13', ' Order Processing & Operation / Settlement', 1),
(38, ' JF2_14', ' Private Banking', 1),
(39, ' JF2_15', ' Project Finance', 1),
(40, ' JF2_16', ' Retail Banking', 1),
(41, ' JF2_17', ' Treasury', 1),
(42, ' JF2_18', ' Others', 1),
(43, ' JF3_01', ' Beauty & Wellness / Health & Fitness', 0),
(44, ' JF3_02', ' Athletics / Fitness / Sports & Recreation', 1),
(45, ' JF3_03', ' Beautician', 1),
(46, ' JF3_04', ' Nutritionist', 1),
(47, ' JF3_05', ' Therapist', 1),
(48, ' JF3_06', ' Others', 1),
(49, ' JF4_01', ' Building / Construction', 0),
(50, ' JF4_02', ' Architectural Services', 1),
(51, ' JF4_03', ' Building / Construction / QS', 1),
(52, ' JF4_04', ' Civil / Structural', 1),
(53, ' JF4_05', ' Others', 1),
(54, ' JF5_01', ' Design', 0),
(55, ' JF5_02', ' Fashion', 1),
(56, ' JF5_03', ' Graphics', 1),
(57, ' JF5_04', ' Industrial / Product', 1),
(58, ' JF5_05', ' Interior', 1),
(59, ' JF5_06', ' Multi-media', 1),
(60, ' JF5_07', ' Visual Merchandising', 1),
(61, ' JF5_08', ' Web Designer', 1),
(62, ' JF5_09', ' Others', 1),
(63, ' JF6_01', ' Education', 0),
(64, ' JF6_02', ' Early Childhood', 1),
(65, ' JF6_03', ' Lecturer / Professor', 1),
(66, ' JF6_04', ' Librarian', 1),
(67, ' JF6_05', ' Teacher', 1),
(68, ' JF6_06', ' Tutor / Instructor', 1),
(69, ' JF6_07', ' Others', 1),
(70, ' JF7_01', ' Engineering', 0),
(71, ' JF7_02', ' Chemical', 1),
(72, ' JF7_03', ' Drafter / Draftsman', 1),
(73, ' JF7_04', ' Electrical / Electronics', 1),
(74, ' JF7_05', ' Energy / Natural Resources', 1),
(75, ' JF7_06', ' Engineering Project Management', 1),
(76, ' JF7_07', ' Health / Safety / Environmental', 1),
(77, ' JF7_08', ' Industrial', 1),
(78, ' JF7_09', ' Maintenance', 1),
(79, ' JF7_10', ' Manufacturing & Production', 1),
(80, ' JF7_11', ' Marine / Oil & Gas', 1),
(81, ' JF7_12', ' Mechanical', 1),
(82, ' JF7_13', ' Telecommunication / Wireless / Radio', 1),
(83, ' JF7_14', ' Others', 1),
(84, ' JF8_01', ' Hospitality / F & B', 0),
(85, ' JF8_02', ' Food & Beverage', 1),
(86, ' JF8_03', ' Hospitality / Hotel Services', 1),
(87, ' JF8_04', ' Integrated Resort / Casino', 1),
(88, ' JF8_05', ' Management', 1),
(89, ' JF8_06', ' Operation', 1),
(90, ' JF8_07', ' Tourism / Travel Agency', 1),
(91, ' JF8_08', ' Others', 1),
(92, ' JF9_01', ' Information Technology (IT)', 0),
(93, ' JF9_02', ' SAP / Oracle', 1),
(94, ' JF9_03', ' Application Specialist', 1),
(95, ' JF9_04', ' DBA', 1),
(96, ' JF9_05', ' Hardware', 1),
(97, ' JF9_06', ' IT - Webmaster / SEO', 1),
(98, ' JF9_07', ' IT Auditing', 1),
(99, ' JF9_08', ' IT Management', 1),
(100, ' JF9_09', ' IT Project Management / Team Lead', 1),
(101, ' JF9_10', ' Mobile / Wireless Communications', 1),
(102, ' JF9_11', ' Network & System', 1),
(103, ' JF9_12', ' Product Management / Business Analyst', 1),
(104, ' JF9_13', ' Security', 1),
(105, ' JF9_14', ' Software Development / Programming', 1),
(106, ' JF9_15', ' Support', 1),
(107, ' JF9_16', ' Technical / Functional Consulting', 1),
(108, ' JF9_17', ' Technical Writing', 1),
(109, ' JF9_18', ' Testing / QA', 1),
(110, ' JF9_19', ' Others', 1),
(111, ' JF10_01', ' Insurance', 0),
(112, ' JF10_02', ' Actuarial', 1),
(113, ' JF10_03', ' Claims Officer', 1),
(114, ' JF10_04', ' Insurance Agent / Broker', 1),
(115, ' JF10_05', ' Underwriter', 1),
(116, ' JF10_06', ' Others', 1),
(117, ' JF11_01', ' Management', 0),
(118, ' JF11_02', ' Top Executives (CEO', NULL),
(119, ' JF12_01', ' Manufacturing', 0),
(120, ' JF12_02', ' Garment/ Textile', 1),
(121, ' JF12_03', ' General / Production Workers', 1),
(122, ' JF12_04', ' Gems & Jewelry', 1),
(123, ' JF12_05', ' Manufacturing Management', 1),
(124, ' JF12_06', ' Printing / Publishing', 1),
(125, ' JF12_07', ' Product Development / Management', 1),
(126, ' JF12_08', ' Production Planning / Control', 1),
(127, ' JF12_09', ' Quality Assurance', NULL),
(128, ' JF12_10', ' Others', 1),
(129, ' JF13_01', ' Marketing / Public Relations', 0),
(130, ' JF13_02', ' Management', 1),
(131, ' JF13_03', ' Brand / Product Management', 1),
(132, ' JF13_04', ' Direct Marketing', 1),
(133, ' JF13_05', ' Marketing General', 1),
(134, ' JF13_06', ' Research / Survey Services', 1),
(135, ' JF13_07', ' Marketing Communication', 1),
(136, ' JF13_08', ' Copy-writing', 1),
(137, ' JF13_09', ' Event Management', 1),
(138, ' JF13_10', ' PR General', 1),
(139, ' JF13_11', ' Others', 1),
(140, ' JF14_01', ' Media & Advertising', 0),
(141, ' JF14_02', ' Editorial / Journalism', 1),
(142, ' JF14_03', ' Account Servicing', 1),
(143, ' JF14_04', ' TV Broadcasting', 1),
(144, ' JF14_05', ' Creative / Design', 1),
(145, ' JF14_06', ' Media Buying', 1),
(146, ' JF14_07', ' Photography / Video', 1),
(147, ' JF14_08', ' Print Media', 1),
(148, ' JF14_09', ' Production', 1),
(149, ' JF14_10', ' Strategic Planning', 1),
(150, ' JF14_11', ' Others', 1),
(151, ' JF15_01', ' Medical Services', 0),
(152, ' JF15_02', ' Doctor / Practitioner / Surgeon', 1),
(153, ' JF15_03', ' Medical Services Technician', 1),
(154, ' JF15_04', ' Nursing', 1),
(155, ' JF15_05', ' Pharmaceutical', 1),
(156, ' JF15_06', ' Specialist', 1),
(157, ' JF15_07', ' Therapist', 1),
(158, ' JF15_08', ' Veterinarian', 1),
(159, ' JF15_09', ' Others', 1),
(160, ' JF16_01', ' Merchandising & Purchasing', 0),
(161, ' JF16_02', ' Apparels', 1),
(162, ' JF16_03', ' Household', 1),
(163, ' JF16_04', ' Procurement / Purchasing / Sourcing', 1),
(164, ' JF16_05', ' Industrial', 1),
(165, ' JF17_01', ' Professional Services', 0),
(166, ' JF17_02', ' Business Analysis / Data Analysis', 1),
(167, ' JF17_03', ' Business Consultancy', 1),
(168, ' JF17_04', ' Company Secretary', 1),
(169, ' JF17_05', ' Legal & Compliance', 1),
(170, ' JF17_06', ' Translation / Interpretation', 1),
(171, ' JF18_01', ' Property', 0),
(172, ' JF18_02', ' Property Consultancy', 1),
(173, ' JF18_03', ' Property Management', 1),
(174, ' JF18_04', ' Others', 1),
(175, ' JF19_01', ' Public Sector / Civil Service', 0),
(176, ' JF19_02', ' Civil Service / Public Sector Jobs', 1),
(177, ' JF19_03', ' Counseling', 1),
(178, ' JF19_04', ' Foreign Affairs', 1),
(179, ' JF19_05', ' Military / defense', 1),
(180, ' JF19_06', ' Social Services - Community / Non-profit Organization', 1),
(181, ' JF19_07', ' Utilities', 1),
(182, ' JF20_01', ' Sales / Customer Service / Business Development', 0),
(183, ' JF20_02', ' Account Servicing', 1),
(184, ' JF20_03', ' Business Development', 1),
(185, ' JF20_04', ' Call Centre', 1),
(186, ' JF20_05', ' Channel / Distribution', 1),
(187, ' JF20_06', ' Customer Service - Supervisor / Manager', 1),
(188, ' JF20_07', ' Customer Service - Officer / Executive', 1),
(189, ' JF20_08', ' Direct Sales', 1),
(190, ' JF20_09', ' Retail Sales', 1),
(191, ' JF20_10', ' Sales - Real Estate', 1),
(192, ' JF20_11', ' Sales - Sales Management', 1),
(193, ' JF20_12', ' Technical Sales / Sales Engineer', 1),
(194, ' JF20_13', ' Tele-sales (Telemarketing)', 1),
(195, ' JF20_14', ' Wholesales', 1),
(196, ' JF20_15', ' Others', 1),
(197, ' JF21_01', ' Sciences / Laboratory / R&D', 0),
(198, ' JF21_02', ' Biotechnology', 1),
(199, ' JF21_03', ' Chemical', 1),
(200, ' JF21_04', ' Energy / Natural Resources / Oil & Gas', 1),
(201, ' JF21_05', ' Environmental Science / Waste Management', 1),
(202, ' JF21_06', ' Food Science', 1),
(203, ' JF21_07', ' Laboratory', 1),
(204, ' JF21_08', ' Life Science', 1),
(205, ' JF21_09', ' Research & Development (R&D)', 1),
(206, ' JF22_01', ' Telecommunications', 0),
(207, ' JF22_02', ' GSM Engineering', 1),
(208, ' JF22_03', ' Network Administration', 1),
(209, ' JF22_04', ' O & M Engineering', 1),
(210, ' JF22_05', ' RF - Planning / Installation / Administration', 1),
(211, ' JF22_06', ' Switching Engineering', 1),
(212, ' JF22_07', ' System Administration', 1),
(213, ' JF22_08', ' System Engineering', 1),
(214, ' JF22_09', ' Systems Security', 1),
(215, ' JF22_10', ' Telecommunications Technical support', 1),
(216, ' JF22_11', ' Others', 1),
(217, ' JF23_01', ' Transportation / Logistics', 0),
(218, ' JF23_02', ' Aerospace', 1),
(219, ' JF23_03', ' Automotive', 1),
(220, ' JF23_04', ' Aviation Services', 1),
(221, ' JF23_05', ' Documentary Credit / Bills Processing', 1),
(222, ' JF23_06', ' Export Import', 1),
(223, ' JF23_07', ' Freight Forwarding', 1),
(224, ' JF23_08', ' Fulfillment', 1),
(225, ' JF23_09', ' Inventory / Warehousing', 1),
(226, ' JF23_10', ' Maritime - General', 1),
(227, ' JF23_11', ' Private Transportation', 1),
(228, ' JF23_12', ' Public Transportation', 1),
(229, ' JF23_13', ' Shipping', 1),
(230, ' JF23_14', ' Supply Chain', 1),
(231, ' JF23_15', ' Others', 1),
(232, ' JF24_01', ' Others', 0),
(233, ' JF24_02', ' Agriculture / Forestry / Fishing', 1),
(234, ' JF24_03', ' Entertainment - Artists / Singers / Musicians', 1),
(235, ' JF24_04', ' Junior Executive', 1),
(236, ' JF24_05', ' Mining / Geologist', 1),
(237, ' JF24_06', ' Security / Safety Control', 1),
(238, ' JF24_07', ' Skill worker', 1),
(239, ' JF24_08', ' Student / Fresh Graduate / No Experience', 1),
(240, ' JF24_09', ' Technician Jobs', 1),
(241, ' JF24_10', ' Trading', 1),
(242, ' JF24_11', ' Others', 1);

-- =============================================
-- Table: eng_sys_industry
-- =============================================
INSERT INTO `eng_sys_industry` (`Id`, `Industry_Code`, `Industry_Title`) VALUES 
(1, 'JI_01', 'Accounting/Audit/Tax Services'),
(2, 'JI_02', 'Advertising/Public Relations/Marketing Services'),
(3, 'JI_03', 'Aerospace/Aviation'),
(4, 'JI_04', 'Agriculture/Forestry/Fishing'),
(5, 'JI_05', 'Architecture/Building/Construction'),
(6, 'JI_06', 'Arts'),
(7, 'JI_07', 'Athletics/Sports'),
(8, 'JI_08', 'Banking & Financial Services'),
(9, 'JI_09', 'Charity/Social Services/Non-Profit Organisation'),
(10, 'JI_10', 'Chemical/Plastic/Paper/Petrochemical'),
(11, 'JI_11', 'Civil Services (Government, Armed Forces)'),
(12, 'JI_12', 'Clothing/Garment/Textile'),
(13, 'JI_13', 'Education'),
(14, 'JI_14', 'Electronics/Electrical Equipment'),
(15, 'JI_15', 'Energy/Power/Water/Oil & Gas/Waste Management'),
(16, 'JI_16', 'Engineering - Building, Civil, Construction / Quantity Survey'),
(17, 'JI_17', 'Engineering - Electrical/Electronic/Mechanical'),
(18, 'JI_18', 'Engineering - Others'),
(19, 'JI_19', 'Entertainment/Recreation'),
(20, 'JI_20', 'Environmental Science'),
(21, 'JI_21', 'Food and Beverage / Catering'),
(22, 'JI_22', 'Freight Forwarding/Delivery/Shipping'),
(23, 'JI_23', 'General Management/Business Analysis'),
(24, 'JI_24', 'Health & Beauty Care'),
(25, 'JI_25', 'Hospitality/Catering'),
(26, 'JI_26', 'Human Resources Management/Consultancy'),
(27, 'JI_27', 'Industrial Machinery/Automation Equipment'),
(28, 'JI_28', 'Information Technology'),
(29, 'JI_29', 'Insurance/Pension Funding'),
(30, 'JI_30', 'Interior Design/Graphic Design'),
(31, 'JI_31', 'Jewellery/Gems/Watches'),
(32, 'JI_32', 'Legal Services'),
(33, 'JI_33', 'Life Sciences'),
(34, 'JI_34', 'Logistics'),
(35, 'JI_35', 'Management Consultancy/Service'),
(36, 'JI_36', 'Manufacturing'),
(37, 'JI_37', 'Mass Transportation'),
(38, 'JI_38', 'Media/Publishing/Printing'),
(39, 'JI_39', 'Medical/Pharmaceutical'),
(40, 'JI_40', 'Mixed Industry Group'),
(41, 'JI_41', 'Motor Vehicles'),
(42, 'JI_42', 'Others'),
(43, 'JI_43', 'Performance/Musical/Artistic'),
(44, 'JI_44', 'Petroleum'),
(45, 'JI_45', 'Property Development'),
(46, 'JI_46', 'Property Management/Consultancy'),
(47, 'JI_47', 'Public Sector / Stat Board'),
(48, 'JI_48', 'Public Utilities'),
(49, 'JI_49', 'Research/Survey'),
(50, 'JI_50', 'Security Escort'),
(51, 'JI_51', 'Security/Fire/Electronic Access Controls'),
(52, 'JI_52', 'Telecommunication'),
(53, 'JI_53', 'Tourism/Travel Agency'),
(54, 'JI_54', 'Toys'),
(55, 'JI_55', 'Trading and Distribution'),
(56, 'JI_56', 'Wholesale / Retail'),
(57, NULL, NULL);

-- =============================================
-- Table: eng_client_master
-- =============================================
INSERT INTO `eng_client_master` (`ClientID`, `ClientDisplayID`, `Company_Name`, `IndustryID`, `FunctionalityID`, `Reference`, `AddressID`, `CreatedDate`, `UpdatedDate`, `CreatedBy`, `UpdatedBy`, `IsActive`) VALUES 
(1, 'CLT00001', 'Sowdambbika infotech', NULL, NULL, NULL, 5, '2021-06-26', '0001-01-01', 1, NULL, 1),
(2, 'CLT00002', 'crypto', NULL, NULL, NULL, 6, '2021-06-26', '0001-01-01', 1, NULL, 1);

-- =============================================
-- Table: eng_sys_quotestatus
-- =============================================
INSERT INTO `eng_sys_quotestatus` (`StatusID`, `QuoteStatus`, `Selection`) VALUES 
(1, 'Pending', 0),
(2, 'Approved', 0),
(3, 'In Progress', 0),
(4, 'Cancelled', 0),
(5, 'Completed', 0),
(6, 'In Progress', 1),
(7, 'Confirmed', 1),
(8, 'Cancelled', 1);

-- =============================================
-- Table: eng_quote_master
-- =============================================
INSERT INTO `eng_quote_master` (`QuoteID`, `QuoteRefNum`, `QuoteDate`, `ClientID`, `Attention_CCID`, `Branch_code`, `QuoteCategory`, `ValidTill`, `YourRef`, `PaymentTerms`, `TermsAndCond`, `GTAX`, `Currency`, `QuoteStatusID`, `CreatedDate`, `UpdatedDate`, `CreatedBy`, `UpdatedBy`, `IsAutoApproved`, `IsProjectCreated`, `InvoiceNo`, `DoNo`, `InvoiceDate`, `DODate`, `QuoteTitle`, `RvFlag`, `ProjectTitle`, `Is_invoice_released`, `Is_Quote_level_inv`, `Is_Project_level_inv`, `Is_Custom_level_inv`, `Discount`, `isFullyPaid`, `FinalAmount`, `Is_do_released`, `Is_Quote_level_do`, `InvoiceFlag`) VALUES 
(1, 'CITI-CQ-21-001', '2021-06-26', 2, 13, NULL, 'N', 'COD', NULL, 'COD', NULL, '0', NULL, 5, NULL, '2021-06-26', NULL, 1, 0, 0, 'DEMO-INV-21-001', 'DEMO-CQ-WC-21-001', '2021-06-26', '2021-06-26', 'sowdambbika software services', 0, 'sowdambbika software', NULL, NULL, NULL, NULL, 0.00, NULL, 21.40, NULL, NULL, 0);

-- =============================================
-- Table: eng_project_master
-- =============================================
INSERT INTO `eng_project_master` (`ProjectID`, `ProjectNo`, `ProjectName`, `LocationId`, `QuotationID`, `DoNo`, `Start_Date`, `End_Date`, `Key_Milestones`, `Service_Desc`, `Project_Status_ID`, `Payment_Status`, `Client_Acceptance_Status`, `Project_Cost`, `CreatedDate`, `UpdatedDate`, `CreatedBy`, `UpdatedBy`, `InvoiceNo`, `InvoiceDate`, `DoDate`, `Is_Project_level_inv`, `Is_Custom_level_inv`, `isFullyPaid`, `Is_Project_level_do`) VALUES 
(1, 'P126062021', 'Sow Project', 2, 1, 'DEMO-CQ-WCP-21-001', '2021-06-26', '2021-08-26', NULL, NULL, 1, NULL, NULL, 21.40, '2021-06-26', NULL, 1, NULL, 'DEMO-INVP-21-001', '2021-06-26', '2021-06-26', NULL, NULL, NULL, NULL);

-- =============================================
-- Table: eng_sys_safety_insp_items
-- =============================================
INSERT INTO `eng_sys_safety_insp_items` (`SIItemID`, `SIHeaderID`, `SITitle`, `SIItemDescription`, `OrderBy`) VALUES 
(1, 'H1', 'HOUSEKEEPING', '1. Have all entrance, passages and stairs been kept clear at all time?
', 1),
(2, 'H1', 'HOUSEKEEPING', '2. Have appropriate signboards been displayed to warn and prevent the public from entering and trespassing?
', 2),
(3, 'H1', 'HOUSEKEEPING', '3. Has suitable and adequate lighting been provided at all places?
', 3),
(4, 'H1', 'HOUSEKEEPING', '4. Have materials and equipment been stored and stacked safely?
', 4),
(5, 'H2', 'ELECTRICAL EQUIPMENT', '1. Have proper safety guard and riving knife been provided for the circular saw?
', 1),
(6, 'H2', 'ELECTRICAL EQUIPMENT', '2. Has emergency stop button been provided for the circular saw?
', 2),
(7, 'H2', 'ELECTRICAL EQUIPMENT', '3. Are fire extinguisher provided at areas where circular saw is being used due to fire hazard?', 3),
(8, 'H3', 'HIGHLY FLAMMABLE LIQUIDS & GASES', '1. Have ''No Smoking'' signs been displayed on locations storing combustible or flammable materials?
', 1),
(9, 'H3', 'HIGHLY FLAMMABLE LIQUIDS & GASES', '2. Have proper labels been displayed on cylinders containing flammable liquids or gases?
', 2),
(10, 'H3', 'HIGHLY FLAMMABLE LIQUIDS & GASES', '3. Have gas cylinders been stored in ventilated areas?
', 3),
(11, 'H3', 'HIGHLY FLAMMABLE LIQUIDS & GASES', '4. Is hot work prohibited from being carried out near storage of flammable?
', 4),
(12, 'H3', 'HIGHLY FLAMMABLE LIQUIDS & GASES', '5. Have quantities of flammable goods stored at designated areas not exceeded the exempted quantities?
', 5),
(13, 'H4', 'SLOPE WORK', '1. Has a suitable structure been erected so as to prevent worker from being endanger by a fall or displacement of earth, rock, or other material?
', 1),
(14, 'H4', 'SLOPE WORK', '2. Have suitable barriers been provided at the edge from which a person is liable to fall > 2M?
', 2),
(15, 'H4', 'SLOPE WORK', '3. Have material load or plants been placed or moved near the edge of slope if it is likely to induce excessive stress onto the slope thereby endangering any person?
', 3),
(16, 'H4', 'SLOPE WORK', '4. Have safety measures been provided during adverse weather?
', 4),
(17, 'H5', 'FIRE ARRANGEMENTS', '1. Are the appropriate fire extinguishers in position at places of high risk?
', 1),
(18, 'H5', 'FIRE ARRANGEMENTS', '2. Have fire extinguishers been maintained in serviceable condition and not expired?
', 2),
(19, 'H5', 'FIRE ARRANGEMENTS', '3. Is there a safe means of escape from all sections of the site premises? 
', 3),
(20, 'H5', 'FIRE ARRANGEMENTS', '4. Is there a means of raising the fire alarm?
', 4),
(21, 'H5', 'FIRE ARRANGEMENTS', '5. Have all the fire exits and routes been clearly marked?
', 5),
(22, 'H6', 'WORKING AT HEIGHTS', '1. Is a safe means of access provided?
', 1),
(23, 'H6', 'WORKING AT HEIGHTS', '2. Have proper working platforms been provided to workers for overhead activities?
', 2),
(24, 'H6', 'WORKING AT HEIGHTS', '3. Is every worker ensured to use safety devices when the provision of proper working platforms is not practicable?
', 3),
(25, 'H7', 'PROTECTION AGAINST A FALLING OBJECTS', '1. Do all workers properly wear suitable safety helmets?
', 1),
(26, 'H7', 'PROTECTION AGAINST A FALLING OBJECTS', '2. Have working platforms and floor edges been provided with toe-boards?
', 2),
(27, 'H8', 'EXCAVATION', '1. Have suitable barriers been provided to prevent people falling into holes?
', 1),
(28, 'H8', 'EXCAVATION', '2. Has lifting appliances been inspected by a competent person at appropriate intervals and the results entered in the prescribed form?
', 2),
(29, 'H8', 'EXCAVATION', '3. Has lifting appliances been inspected by a competent person at appropriate intervals and the results entered in the prescribed form?
', 3),
(30, 'H8', 'EXCAVATION', '4. Has reinforcement cages been properly secured to prevent collapse during lifting?
', 4),
(31, 'H8', 'EXCAVATION', '5. Has proper safety devices provided to piling operatives working at high level?
', 5),
(32, 'H8', 'EXCAVATION', '6. Has inspections and examinations been carried out by a competent person at appropriate intervals and the results entered in the prescribed form?
', 6),
(33, 'H9', 'LIFTING OPERATIONS', '1. Have lifting appliances and lifting gear been tested and examined by a competent examiner and valid certificates kept on site?
', 1),
(34, 'H9', 'LIFTING OPERATIONS', '2. Have lifting appliances and lifting gear been tested and examined by a competent examiner and valid certificates kept on site?
', 2),
(35, 'H9', 'LIFTING OPERATIONS', '3. Has lifting appliances been inspected by a competent person at appropriate intervals and the results entered in the prescribed form? 
', 3),
(36, 'H9', 'LIFTING OPERATIONS', '4. Has a safe latch been fixed to hooks of cranes?
', 4),
(37, 'H9', 'LIFTING OPERATIONS', '5. Is worn out lifting gear being used?
', 5),
(38, 'H9', 'LIFTING OPERATIONS', '6. Have materials been secured during lifting?
', 6),
(39, 'H9', 'LIFTING OPERATIONS', '7. Are lifting receptacles being overloaded?
', 7),
(40, 'H9', 'LIFTING OPERATIONS', '8. Have the SWL and the serial numbers been clearly marked on lifting receptacles?
', 8),
(41, 'H10', 'WELDING/ CUTTING OPERATIONS & EQUIPMENT', '1. Have appropriated flashed back arresters been fixed to gas gauges?
', 1),
(42, 'H10', 'WELDING/ CUTTING OPERATIONS & EQUIPMENT', '2. Have purpose-built trolleys/ carries been provided for moving cylinders?
', 2),
(43, 'H10', 'WELDING/ CUTTING OPERATIONS & EQUIPMENT', '3. Have gas cylinders been kept in an upright position and properly secured to an anchor point?
', 3),
(44, 'H10', 'WELDING/ CUTTING OPERATIONS & EQUIPMENT', '4. Have welding/ cutting equipment including hose, cables and gauges been kept in good condition?
', 4),
(45, 'H10', 'WELDING/ CUTTING OPERATIONS & EQUIPMENT', '5. Have welding operatives been provided with adequate protective clothing/ equipment and are they being used?
', 5),
(46, 'H10', 'WELDING/ CUTTING OPERATIONS & EQUIPMENT', '6. Have welding operations been adequately screened or isolated from workers/ passers-by?
', 6),
(47, 'H10', 'WELDING/ CUTTING OPERATIONS & EQUIPMENT', '7. Have welding machines been properly earthed?
', 7),
(48, 'H10', 'WELDING/ CUTTING OPERATIONS & EQUIPMENT', '8. Have standard welding princers been used as returned and properly connected to the workpiece?
', 8),
(49, 'H10', 'WELDING/ CUTTING OPERATIONS & EQUIPMENT', '9. Have serviceable fire extinguishers been provided at the welding spot?
', 9),
(50, 'H10', 'WELDING/ CUTTING OPERATIONS & EQUIPMENT', '10. Have combustible materials been removed from the area before proceeding with welding/ cutting operations?
', 10),
(51, 'H11', 'SITE TRAFFIC', '1. Has an appropriate speed limit been established onsite and observed?
', 1),
(52, 'H11', 'SITE TRAFFIC', '2. Have vehicles been parked in designated areas?
', 2),
(53, 'H11', 'SITE TRAFFIC', '3. Has a sprinkling facility been provided to restrict dust from spreading on traffic routes?
', 3),
(54, 'H11', 'SITE TRAFFIC', '4. Have all drivers of site transport vehicles been licensed for the class of vehicle irrespective whether the vehicles have to go onto public roads?
', 4),
(55, 'H11', 'SITE TRAFFIC', '5. Have overheaded cables been erected at height of 5.8m above traffic routes and a warning signboard displayed?
', 5),
(56, 'H11', 'SITE TRAFFIC', '6. Have banksmen wearing high visibility clothing been assigned to directed vehicles, in particular when reversing?
', 6),
(57, 'H12', 'SCAFFOLD', '1. Are the structures of the scaffold in good condition?
', 1),
(58, 'H12', 'SCAFFOLD', '2. Are the safety nets of the scaffold in good condition?
', 2),
(59, 'H12', 'SCAFFOLD', '3. Has any waste material accumulated at the net?
', 3),
(60, 'H12', 'SCAFFOLD', '4. Has the prescribed F5 signed by the competent person?
', 4),
(61, 'H12', 'SCAFFOLD', '5. Have the working platforms been properly boarded?
', 5),
(62, 'H13', 'ELECTRICITY', '1. Have electricity distribution boards been securely locked with appropriate warning signs displayed?
', 1),
(63, 'H13', 'ELECTRICITY', '2. Is the electric voltage reduced to 110V for lighting and portable tools?
', 2),
(64, 'H13', 'ELECTRICITY', '3. Have generators been earthed and exhausted fumes discharged in a direction so as not to cause harm?
', 3),
(65, 'H13', 'ELECTRICITY', '4. When suspension of electric cables is not practicable, have they been properly protected lying on ground?
', 4),
(66, 'H13', 'ELECTRICITY', '5. Are weatherproof connections adopted for electric appliances?
', 5),
(67, 'H13', 'ELECTRICITY', '6. Does all electric equipment possess an earthing wire?
', 6),
(68, 'H13', 'ELECTRICITY', '7. Are proper adapters and plugs used as connections to the power supply?
', 7),
(69, 'H14', 'COMPRESSED AIR TOOLS', '1. Have air receivers been examined at statutory intervals by a competent examiner and valid certificates kept on site?
', 1),
(70, 'H14', 'COMPRESSED AIR TOOLS', '2. Have noise labels issued by the EPD been displayed on air receivers?
', 2),
(71, 'H14', 'COMPRESSED AIR TOOLS', '3. Have hand-held pneumatic rocker breakers been equipped with silencer muffs?
', 3),
(72, 'H14', 'COMPRESSED AIR TOOLS', '4. Have operators been provided with suitable PPE and are they being used?
', 4),
(73, 'H14', 'COMPRESSED AIR TOOLS', '5. Has a noise assessment been carried out for concrete breaking to specify the hearing protection distance and a warning notice displayed?
', 5);

-- =============================================
-- Table: eng_usergroup
-- =============================================
INSERT INTO `eng_usergroup` (`GroupID`, `GroupName`) VALUES 
(1, 'SuperAdmin'),
(2, 'Manager'),
(3, 'Supervisor'),
(4, 'Director'),
(5, 'Admin'),
(6, 'Engineer'),
(7, 'QS'),
(8, 'Safety Coordinator'),
(9, 'Safety Officer'),
(10, 'Worker'),
(11, 'Driver'),
(12, 'Others');

-- =============================================
-- Table: eng_employee_profile
-- =============================================
INSERT INTO `eng_employee_profile` (`UserID`, `EmpID`, `OpBranch`, `FirstName`, `LastName`, `AddressID`, `Nationality`, `DoB`, `SOC_number`, `SOC_Issue_Date`, `SOC_Expiry_Date`, `Salary`, `Levy`, `DoJ`, `DoR`, `Gender`, `Designation`, `ID_Type`, `ID_Number`, `Profile_Desc`, `Profile_Photo_Path`, `llevel`, `CreatedDate`, `UpdatedDate`, `CreatedBy`, `UpdatedBy`, `Passport_Number`, `Passport_Valid_Till`, `Permit_Number`, `Permit_Valid_From`, `Permit_Valid_To`, `Licence_Number`, `Licence_Valid_Till`, `Insurance_Number`, `Insurance_Valid_Till`, `IsActive`, `License_Scissor_Lift_Number`, `License_Scissor_Lift_ExpiryDate`, `License_Boom_Lift_Number`, `License_Boom_Lift_ExpiryDate`, `License_WorkatHeight_Number`, `License_WorkatHeight_ExpiryDate`, `License_IslandPass_Number`, `License_IslandPass_ExpiryDate`, `Skilled_Level`, `Safety_Supervisor_Name`, `License_Course`, `License_Course_Expiry_Date`, `GroupID`) VALUES 
(1, 'EMP00001', NULL, 'MG-Emp1', NULL, 1, NULL, '1995-07-12', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'M', 'MANAGER', 'NRIC', '2323', NULL, NULL, NULL, '2021-06-26', '0001-01-01', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2),
(2, 'EMP00002', NULL, 'SUP-EMP2', NULL, 2, NULL, '1995-06-10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'M', 'SUPERVISOR', 'NRIC', '2525', NULL, NULL, NULL, '2021-06-26', '0001-01-01', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3),
(3, 'EMP00003', NULL, 'WORK-EMP3', NULL, 3, NULL, '2021-06-26', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'M', 'WORKER', 'NRIC', '2424', NULL, NULL, NULL, '2021-06-26', '0001-01-01', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 10),
(4, 'EMP00004', NULL, 'WORK-EMP4', NULL, 4, NULL, '2021-06-26', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'M', 'WORKER', 'NRIC', '2626', NULL, NULL, NULL, '2021-06-26', '0001-01-01', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 10);

-- =============================================
-- Table: eng_users
-- =============================================
INSERT INTO `eng_users` (`UserID`, `UserName`, `Password`, `EmpID`, `GroupID`, `DisplayName`, `LastLogin`, `UID`, `IsActive`, `CreatedBy`, `CreatedDate`, `UpdatedBy`, `UpdatedDate`) VALUES 
(1, 'admin', '$2b$10$ucD04ylMnave42Yk48cZdeDkNd/x78gqx4Q1JIDFNw.amdiaWvC2W', NULL, 1, 'Super Admin', NULL, 'UID18001', 1, 1, '2017-11-19', NULL, NULL),
(2, 'mgemp1', '$2b$10$ucD04ylMnave42Yk48cZdeDkNd/x78gqx4Q1JIDFNw.amdiaWvC2W', 1, 2, 'Manager', NULL, 'UID21001', 1, 1, '2021-06-26', NULL, '0001-01-01'),
(3, 'supemp2', '$2b$10$ucD04ylMnave42Yk48cZdeDkNd/x78gqx4Q1JIDFNw.amdiaWvC2W', 2, 3, 'Supervisor', NULL, 'UID21002', 1, 1, '2021-06-26', NULL, '0001-01-01'),
(4, 'workemp3', '$2b$10$ucD04ylMnave42Yk48cZdeDkNd/x78gqx4Q1JIDFNw.amdiaWvC2W', 3, 10, 'Worker 1', NULL, 'UID21003', 1, 1, '2021-06-26', NULL, '0001-01-01');

-- =============================================
-- Table: eng_sys_safety_hazard
-- =============================================
INSERT INTO `eng_sys_safety_hazard` (`HazardID`, `HazardDesc`) VALUES 
(1, 'Work at Height'),
(2, 'Electrical'),
(3, 'Slips Trips & Falls'),
(4, 'Moving / Rotating Parts & Machinery'),
(5, 'Manual Handling'),
(6, 'Noise'),
(7, 'Dust / Smoke'),
(8, 'Lifting Operation'),
(9, 'Excavation / Trenching'),
(10, 'Shoring'),
(11, 'Fire & Explosion'),
(12, 'Hand Arm Vibration Syndrome'),
(13, 'House Keeping'),
(14, 'Hot Works'),
(15, 'Confined Space / Manholes > 2m'),
(16, 'Emergency Preparedness'),
(17, 'Storage of Material'),
(18, 'Hazards to Public'),
(19, 'Renovation'),
(20, 'Hacking'),
(21, 'Any Other Hazard');

-- =============================================
-- Table: eng_sys_safety_ppelist
-- =============================================
INSERT INTO `eng_sys_safety_ppelist` (`PPEID`, `PPE_Desc`) VALUES 
(1, 'Safety Helmet'),
(2, 'Safety Shoes'),
(3, 'Safety Harness'),
(4, 'Hand Gloves'),
(5, 'Safety Goggle'),
(6, 'Welding Shield'),
(7, 'Dust Mask'),
(8, 'Ear Plug'),
(9, 'Reflective Vest'),
(10, 'Gas Detection Device');

-- =============================================
-- Table: eng_store_master
-- =============================================
INSERT INTO `eng_store_master` (`StoreID`, `Store_Code`, `Branch_Name`, `Start_Date`, `Store_Name`, `Address1`, `Address2`, `City`, `Country`, `Store_Description`, `Incharge_Name`, `Remarks`, `CreatedDate`, `UpdatedDate`, `CreatedBy`, `UpdatedBy`) VALUES 
(1, 'CITI-ST001', 'City Construction Eng Pte Ltd', '2018-04-03', 'bedok', '21 tuas south', NULL, 'Singapore', 'Singapore', 'warehouse', 'rajendran', NULL, '2018-04-09', NULL, 1, NULL),
(2, 'CITI-ST002', 'City Construction Eng Pte Ltd', '2018-04-10', 'Warehouse 2', '21 kallang singapore', NULL, 'Singapore', 'Singapore', 'Kallang', 'Rajendran', NULL, '2018-04-10', NULL, 1, NULL);

-- =============================================
-- Table: eng_supplier_master
-- =============================================
INSERT INTO `eng_supplier_master` (`SupplierID`, `SupplierDisplayID`, `Company_Name`, `IndustryID`, `Spoc_Name`, `Supplier_Description`, `AddressID`, `CreatedDate`, `UpdatedDate`, `CreatedBy`, `UpdatedBy`, `IsActive`) VALUES 
(1, 'SPR00001', 'sowdammbika infotech', NULL, NULL, 'software services', 7, '2021-06-26', '0001-01-01', 1, NULL, 1),
(2, 'SPR00002', 'crptyo', NULL, NULL, 'bitcoin supplier', 8, '2021-06-26', '0001-01-01', 1, NULL, 1);

-- =============================================
-- Table: eng_product_master
-- =============================================
INSERT INTO `eng_product_master` (`ProductID`, `Product_Name`, `Product_Type`, `Product_Company_Name`, `Product_Description`, `Dimension`, `Measuring_Unit`, `Unit_Price`, `Product_Code`, `CreatedDate`, `UpdatedDate`, `CreatedBy`, `UpdatedBy`, `IsActive`, `Barcode1`, `Barcode2`) VALUES 
(1, 'Pipe', 'Plastic Items', 'XYZ', 'Pipe for Plumping work', '100x50', 'mm', 200.00, 'PDT00001', '2018-03-10', '0001-01-01', 1, NULL, 1, NULL, NULL),
(2, 'Pen', NULL, 'Pen	Popular Book Co pte Ltd', 'Pen', NULL, 'mm', 60.00, 'PDT00002', '2018-04-06', '0001-01-01', 1, NULL, 1, NULL, NULL),
(3, 'Thinner', NULL, 'Aik Chin Hin Machinery Co', 'Thinner', NULL, 'mm', 100.00, 'PDT00003', '2018-04-06', '0001-01-01', 1, NULL, 1, NULL, NULL),
(4, 'Gloves', NULL, 'Rockwell Engineering & Equipment Pte Ltd', 'Gloves', NULL, 'mm', 125.00, 'PDT00004', '2018-04-06', '0001-01-01', 1, NULL, 1, NULL, NULL),
(5, 'Wall Putty', NULL, 'Builder station Pte Ltd', 'Wall Putty', NULL, 'mm', 200.00, 'PDT00005', '2018-04-06', '0001-01-01', 1, NULL, 1, NULL, NULL),
(6, 'Primer', NULL, 'Ardex Singapore Pte Ltd', 'Primer', NULL, 'mm', 120.00, 'PDT00006', '2018-04-06', '0001-01-01', 1, NULL, 1, NULL, NULL),
(7, 'VC Socket', NULL, 'BILCON INDUSTRIES (PRVATE) LIMITED', 'VC Socket', NULL, 'mm', 70.00, 'PDT00007', '2018-04-06', '0001-01-01', 1, NULL, 1, NULL, NULL),
(8, 'Flywood', NULL, 'JS Timber Pte Ltd', 'Flywood', NULL, 'mm', 128.00, 'PDT00008', '2018-04-06', '0001-01-01', 1, NULL, 1, NULL, NULL),
(9, 'VPC Pipe', NULL, 'VicPlas Holdings Pte Ltd', 'VPC Pipe', NULL, 'mm', 120.00, 'PDT00009', '2018-04-06', '0001-01-01', 1, NULL, 1, NULL, NULL),
(10, 'Conrete Sand', NULL, 'Lian xing Sand & Granite Pte Ltd', 'Conrete Sand', NULL, 'mm', 1000.00, 'PDT00010', '2018-04-06', '0001-01-01', 1, NULL, 1, NULL, NULL),
(11, 'ggdsgdsgstest', 'test', 'test', NULL, NULL, 'mm', 100.00, 'PDT00011', '2019-04-17', '0001-01-01', 1, NULL, 1, NULL, NULL);

-- =============================================
-- Table: eng_sys_claimtype
-- =============================================
INSERT INTO `eng_sys_claimtype` (`ClaimTypeID`, `ClaimType`) VALUES 
(1, 'Transport'),
(2, 'Meals'),
(3, 'Medical'),
(4, 'Miscellaneous');

-- =============================================
-- Table: eng_claim
-- =============================================
INSERT INTO `eng_claim` (`ClaimID`, `ClaimDisplayID`, `UserID`, `ProjectID`, `ClaimAgainst`, `Status`, `SVRemarks`, `ApprovalRemarks`, `RejectRemarks`, `ApprovedBy`, `ApprovedDate`, `SubmittedBy`, `SubmittedDate`, `isFullyPaid`, `TotalClaim`, `PaymentSource`) VALUES 
(1, 'CLM00001', 1, 1, 'Project', 0, 'test expense entry', NULL, NULL, NULL, NULL, 3, '2021-07-03', NULL, 53.50, 'Self');

-- =============================================
-- Table: eng_claim_description
-- =============================================
INSERT INTO `eng_claim_description` (`ClaimDescID`, `ClaimID`, `ClaimTypeID`, `RecpDate`, `ClaimDescription`, `RecpAmount`, `GST`) VALUES 
(1, 1, 3, '2021-07-02', 'During work', 50.00, 'YES');

-- =============================================
-- Table: eng_sys_pymt_status
-- =============================================
INSERT INTO `eng_sys_pymt_status` (`Id`, `PymtStatus`) VALUES 
(1, 'Part Payment'),
(2, 'Full Payment'),
(3, 'Discount'),
(4, 'Expense Return'),
(5, 'Cash Advance'),
(6, 'Others');

-- =============================================
-- Table: eng_sys_ptw_stage1_config
-- =============================================
INSERT INTO `eng_sys_ptw_stage1_config` (`PTW_Stage_One_ID`, `PTW_Type`, `PTW_Title`, `Item`, `Order_By`) VALUES 
(1, 'PTWWAH', 'PERMIT TO WORK FOR WORK AT HEIGHT', '1. Proper & secure work platforms with toe boards are provided (Min.500 mm and 90 mm width respectively). ', 1),
(2, 'PTWWAH', 'PERMIT TO WORK FOR WORK AT HEIGHT', '2. Full body safety harness with double lanyard, rope grab and independent lifeline to secure or other rigid anchoring points provided.', 2),
(3, 'PTWWAH', 'PERMIT TO WORK FOR WORK AT HEIGHT', '3. Standing supervision by the supervisor for workers while working at height', 3),
(4, 'PTWWAH', 'PERMIT TO WORK FOR WORK AT HEIGHT', '4. Safe access for workers to reach the work area and proper barricades provided. Ladders used are safe & sound.', 4),
(5, 'PTWWAH', 'PERMIT TO WORK FOR WORK AT HEIGHT', '5. SWL signboards, scaffold access sign and other warning signboards (if necessary) are displayed', 5),
(6, 'PTWWAH', 'PERMIT TO WORK FOR WORK AT HEIGHT', '6. Valid inspection conducted by competent supervisor and records maintained (for lifelines, Gondolas, MEWP, MCWP, Scaffolds)', 6),
(7, 'PTWWAH', 'PERMIT TO WORK FOR WORK AT HEIGHT', '7. All the adjacent activities are properly coordinated & ensured no incompatible works', 7),
(8, 'PTWWAH', 'PERMIT TO WORK FOR WORK AT HEIGHT', '8. Working area cordoned off at below to prevent unauthorized entry', 8),
(9, 'PTWWAH', 'PERMIT TO WORK FOR WORK AT HEIGHT', '9. Ensure no falling of objects / loose materials', 9),
(10, 'PTWWAH', 'PERMIT TO WORK FOR WORK AT HEIGHT', '10. Hand tools / loose materials carried by workers are secured so as to avoid falling.', 10),
(11, 'PTWWAH', 'PERMIT TO WORK FOR WORK AT HEIGHT', '11. Approved Scaffold contractors erected the scaffold if the height of scaffold is 4 meter or above & tag provided', 11),
(12, 'PTWWAH', 'PERMIT TO WORK FOR WORK AT HEIGHT', '12. Safe work method statement / Safe work procedure established & available on site.', 12),
(13, 'PTWWAH', 'PERMIT TO WORK FOR WORK AT HEIGHT', '13. Ensure workers are briefed on the RA & safety precautionary requirements for working at height', 13),
(14, 'PTWWAH', 'PERMIT TO WORK FOR WORK AT HEIGHT', '14. Tool box meeting conducted and records are maintained', 14),
(15, 'PTWWAH', 'PERMIT TO WORK FOR WORK AT HEIGHT', '15. Good housekeeping at working platform maintained', 15),
(16, 'PTWWAH', 'PERMIT TO WORK FOR WORK AT HEIGHT', '16. PE Design and calculation available for the working platforms / lifelines as required ', 16),
(17, 'PTWWAH', 'PERMIT TO WORK FOR WORK AT HEIGHT', '17. Lighting arrangements for work after 07.00 p.m', 17),
(18, 'PTWWAH', 'PERMIT TO WORK FOR WORK AT HEIGHT', '18. Others __________________________________', 18),
(19, 'PTWWFEX', 'PERMIT TO WORK FOR / IN EXCAVATION', '1. Personal protective equipment worn by all employees', 1),
(20, 'PTWWFEX', 'PERMIT TO WORK FOR / IN EXCAVATION', '2. Open sides of excavation are guarded by effective barriers (min. 1.10 high) with toe board (or full height debris netting)', 2),
(21, 'PTWWFEX', 'PERMIT TO WORK FOR / IN EXCAVATION', '3. Adequate danger signage placed at strategic locations ', 3),
(22, 'PTWWFEX', 'PERMIT TO WORK FOR / IN EXCAVATION', '4. Shoring to excavated trenches if exceed 1.5 m depth or other measures to prevent cave-in, e.g safe slope/ step cutting', 4),
(23, 'PTWWFEX', 'PERMIT TO WORK FOR / IN EXCAVATION', '5. Dewatering system and pumps are available ，Accumulation of water is taken care of ', 5),
(24, 'PTWWFEX', 'PERMIT TO WORK FOR / IN EXCAVATION', '6. Materials are kept safe distance away from the edge of excavation (min. 600mm away)', 6),
(25, 'PTWWFEX', 'PERMIT TO WORK FOR / IN EXCAVATION', '7. Excavation with more than 4 m deep are provided with shoring as per PE design ', 7),
(26, 'PTWWFEX', 'PERMIT TO WORK FOR / IN EXCAVATION', '8. Exposed sides / Slopes are properly protected to avoid erosion', 8),
(27, 'PTWWFEX', 'PERMIT TO WORK FOR / IN EXCAVATION', '9. Safe access provided and maintained e.g. ladders, steps, etc', 9),
(28, 'PTWWFEX', 'PERMIT TO WORK FOR / IN EXCAVATION', '10. Power grid licensed Excavator Operators only are employed and Excavator operator comply with checklist', 10),
(29, 'PTWWFEX', 'PERMIT TO WORK FOR / IN EXCAVATION', '11. The excavators are maintained periodically with records', 11),
(30, 'PTWWFEX', 'PERMIT TO WORK FOR / IN EXCAVATION', '12. Operators, workers and other trade working around the vicinity are briefed on the hazards associated and to stand safely', 12),
(31, 'PTWWFEX', 'PERMIT TO WORK FOR / IN EXCAVATION', '13. The excavators are provided with necessary safety components, like rear side mirror, blinker lights, warning system.', 13),
(32, 'PTWWFEX', 'PERMIT TO WORK FOR / IN EXCAVATION', '14. Overhead protection for the excavation cabin', 14),
(33, 'PTWWFEX', 'PERMIT TO WORK FOR / IN EXCAVATION', '15. All control measures are in place as per RA & SWP which are briefed to all the team', 15),
(34, 'PTWWFEX', 'PERMIT TO WORK FOR / IN EXCAVATION', '16. Others ………………………………………………………………………', 16),
(35, 'PTWHOT', 'PERMIT TO WORK FOR HOT WORKS', '1. All the adjacent activities are properly coordinated and no faulty m/c or tools used for works', 1),
(36, 'PTWHOT', 'PERMIT TO WORK FOR HOT WORKS', '2. Only Qualified Welders and trained workers engaged for hot work', 2),
(37, 'PTWHOT', 'PERMIT TO WORK FOR HOT WORKS', '3. Proper ventilations provided and maintained at works area (to avoid inhalation of welding fumes)', 3),
(38, 'PTWHOT', 'PERMIT TO WORK FOR HOT WORKS', '4. Fire blankets and valid Fire Extinguishers are available and used.', 4),
(39, 'PTWHOT', 'PERMIT TO WORK FOR HOT WORKS', '5. Fire Watcher & Emergency Preparedness complied', 5),
(40, 'PTWHOT', 'PERMIT TO WORK FOR HOT WORKS', '6. All Flammable & Combustible hazards are cleared away from hot works (at least 6m). ', 6),
(41, 'PTWHOT', 'PERMIT TO WORK FOR HOT WORKS', '7. When hot works carried out at height, the work area directly below cordoned to prevent unauthorized entry', 7),
(42, 'PTWHOT', 'PERMIT TO WORK FOR HOT WORKS', '8. Gas cylinders kept in upright and secured position. Gas leak test with soap water conducted.', 8),
(43, 'PTWHOT', 'PERMIT TO WORK FOR HOT WORKS', '9. Warning / safety signs are displayed adequately at conspicuous locations.', 9),
(44, 'PTWHOT', 'PERMIT TO WORK FOR HOT WORKS', '10. SWP, RA and tool box meeting conducted/ briefed to all workers.', 10),
(45, 'PTWHOT', 'PERMIT TO WORK FOR HOT WORKS', '11. All necessary PPE Provided to work personnel e.g, safety goggles / welding shield, hand gloves etc.', 11),
(46, 'PTWHOT', 'PERMIT TO WORK FOR HOT WORKS', '12. Maintained good housekeeping at working area / hang up cables / hoses.', 12),
(47, 'PTWHOT', 'PERMIT TO WORK FOR HOT WORKS', '13. Valid monthly LEW inspection tag available for welding.', 13),
(48, 'PTWHOT', 'PERMIT TO WORK FOR HOT WORKS', '14. Safety devices (earth for welding, electrode holders / shock prevention device) are in safe & good condition.', 14),
(49, 'PTWHOT', 'PERMIT TO WORK FOR HOT WORKS', '15. Daily checklist by welder complied & available. ', 15),
(50, 'PTWHOT', 'PERMIT TO WORK FOR HOT WORKS', '16. Others: _________________________________________', 16),
(51, 'PTWLOPT', 'PERMIT TO WORK FOR LIFTING OPERATIONS', '1. LM Certificate with valid expiry date available ', 1),
(52, 'PTWLOPT', 'PERMIT TO WORK FOR LIFTING OPERATIONS', '2. Lifting Supervisor / Rigger / Signalman in proper attire as per MOM''s requirement.', 2),
(53, 'PTWLOPT', 'PERMIT TO WORK FOR LIFTING OPERATIONS', '3. Licensed crane operator available ', 3),
(54, 'PTWLOPT', 'PERMIT TO WORK FOR LIFTING OPERATIONS', '4. Qualified Rigger and Signalman available', 4),
(55, 'PTWLOPT', 'PERMIT TO WORK FOR LIFTING OPERATIONS', '5. Lifting Gears / Appliances are in good condition', 5),
(56, 'PTWLOPT', 'PERMIT TO WORK FOR LIFTING OPERATIONS', '6. Inspection checklist by crane operator & Lifting Supervisor done daily before start work.', 6),
(57, 'PTWLOPT', 'PERMIT TO WORK FOR LIFTING OPERATIONS', '7. Crane Access/ parking spot is safe to prevent topple', 7),
(58, 'PTWLOPT', 'PERMIT TO WORK FOR LIFTING OPERATIONS', '8. Safety / warning devices are in good working order', 8),
(59, 'PTWLOPT', 'PERMIT TO WORK FOR LIFTING OPERATIONS', '9. Communications accessories are available & good', 9),
(60, 'PTWLOPT', 'PERMIT TO WORK FOR LIFTING OPERATIONS', '10. Lifting area cordoned off with danger signage.', 10),
(61, 'PTWLOPT', 'PERMIT TO WORK FOR LIFTING OPERATIONS', '11. Lifting Plan, SWP & RA and tool box meeting conducted / briefed to the lifting team', 11),
(62, 'PTWLOPT', 'PERMIT TO WORK FOR LIFTING OPERATIONS', '12. All necessary PPE Provided to work personnel ', 12),
(63, 'PTWLOPT', 'PERMIT TO WORK FOR LIFTING OPERATIONS', '13. Qualified Lifting Supervisor available', 13),
(64, 'PTWLOPT', 'PERMIT TO WORK FOR LIFTING OPERATIONS', '14. Valid Lifting Gears certs and tags available', 14),
(65, 'PTWLOPT', 'PERMIT TO WORK FOR LIFTING OPERATIONS', '15. Sitting distance from any overhead electrical cable Min 3 meters and roped off with warning sign', 15),
(66, 'PTWLOPT', 'PERMIT TO WORK FOR LIFTING OPERATIONS', '16. Safe Working Radius identified and briefed to Lifting Crew', 16),
(67, 'PTWLOPT', 'PERMIT TO WORK FOR LIFTING OPERATIONS', '17. Lighting arrangements etc if work after 07.00 p.m', 17),
(68, 'PTWLOPT', 'PERMIT TO WORK FOR LIFTING OPERATIONS', '18. Others__________________________________________', 18),
(69, 'PTWCONSPC', 'CONFINED SPACE PERMIT', 'All energy sources de-energized', 1),
(70, 'PTWCONSPC', 'CONFINED SPACE PERMIT', 'Lines purged, flushed and vented', 2),
(71, 'PTWCONSPC', 'CONFINED SPACE PERMIT', 'Secure area (Barricaded and Warning Signage)', 3),
(72, 'PTWCONSPC', 'CONFINED SPACE PERMIT', 'Forced ventilation and Exhaust system provided (one hour before)', 4),
(73, 'PTWCONSPC', 'CONFINED SPACE PERMIT', 'Smoking, naked lights prohibited', 5),
(74, 'PTWCONSPC', 'CONFINED SPACE PERMIT', 'Explosion proof electrical apparatus/tools', 6),
(75, 'PTWCONSPC', 'CONFINED SPACE PERMIT', 'Essential PPE & gas alarm device issued to all personnel as per the task.', 7),
(76, 'PTWCONSPC', 'CONFINED SPACE PERMIT', 'Escape Harness and life line available. Tripod available. ', 8),
(77, 'PTWCONSPC', 'CONFINED SPACE PERMIT', 'Self-Contained Breathing Apparatus available (SCBA)', 9),
(78, 'PTWCONSPC', 'CONFINED SPACE PERMIT', 'Adequate Safe Access and Emergency Escape', 10),
(79, 'PTWCONSPC', 'CONFINED SPACE PERMIT', 'Emergency rescue procedure explained to all concerned', 11),
(80, 'PTWCONSPC', 'CONFINED SPACE PERMIT', 'No incompatible Works ', 12),
(81, 'PTWCONSPC', 'CONFINED SPACE PERMIT', 'RA and Safe Work procedure available', 13),
(82, 'PTWCONSPC', 'CONFINED SPACE PERMIT', 'RA and SWP communicated to all personnel involved in this work.', 14);

-- =============================================
-- Table: eng_client_contact
-- =============================================
INSERT INTO `eng_client_contact` (`CCID`, `ClientID`, `NamePrefix`, `SPOCName`, `Email`, `Mobile`, `Tel`, `Remarks`) VALUES 
(12, 1, 'Mr.', 'anandh', NULL, NULL, NULL, NULL),
(13, 2, 'Mr.', 'Bitcoin', NULL, NULL, NULL, NULL);

-- =============================================
-- Table: eng_time_entry
-- =============================================
INSERT INTO `eng_time_entry` (`TEID`, `EmpID`, `ProjectID`, `ReportDate`, `Work_Start_Time`, `Work_End_Time`, `Ot_Start_Time`, `Ot_End_Time`, `No_of_WorkHours`, `No_of_OtHours`, `Remarks`, `SubmittedBy`, `SubmittedDate`, `UpdatedBy`, `UpdatedDate`, `WEHflag`, `LBflag`, `Leave`, `ReportEndDate`) VALUES 
(1, 1, 1, '2021-06-08', '13:41:00', '19:41:00', NULL, NULL, 0.00, 0.00, 'sasas', 1, '2021-06-26', NULL, NULL, 0, 1, 3, '2021-06-08'),
(2, 2, 1, '2021-06-08', '13:41:00', '19:41:00', NULL, NULL, 0.00, 0.00, 'sasas', 1, '2021-06-26', NULL, NULL, 0, 1, 3, '2021-06-08'),
(3, 3, 1, '2021-06-28', '09:00:00', '18:30:00', NULL, NULL, 8.00, 0.50, NULL, 3, '2021-07-03', 3, '2021-07-03', 0, 1, 0, '2021-06-28'),
(4, 4, 1, '2021-06-28', '09:00:00', '18:30:00', NULL, NULL, 8.00, 0.50, NULL, 3, '2021-07-03', 3, '2021-07-03', 0, 1, 0, '2021-06-28');

-- =============================================
-- Table: eng_sys_task_status
-- =============================================
INSERT INTO `eng_sys_task_status` (`TaskStatusID`, `TaskStatus`) VALUES 
(1, 'Pending'),
(2, 'In Process'),
(3, 'Completed');

-- =============================================
-- Table: eng_project_report
-- =============================================
INSERT INTO `eng_project_report` (`ProjectReportID`, `ProjectID`, `ReportDate`, `Start_Date_Time`, `End_Date_Time`, `Task_Description`, `Quantity`, `TaskStatusID`, `Remarks`, `Resource_name`, `CreatedDate`, `UpdatedDate`, `CreatedBy`, `UpdatedBy`, `ProgressPercentage`) VALUES 
(1, 1, '2021-07-01 00:00:00', '10:42:00', '19:42:00', 'Testing project', 1, 2, 'in prog', 'MG-Emp1', '2021-07-03', '0001-01-01', 1, NULL, '12'),
(2, 1, '2021-07-02 00:00:00', '09:48:00', '19:25:00', 'tesing', 1, 3, 'in prog', 'SUP-EMP2', '2021-07-03', '0001-01-01', 3, NULL, '15');

-- =============================================
-- Table: eng_module
-- =============================================
INSERT INTO `eng_module` (`ModuleID`, `AccessType`, `ModuleName`, `Order_By`, `Icon`) VALUES 
(1, 1, 'DashBoard', 1, NULL),
(2, 1, 'ERP Master', 2, 'fa fa-modx'),
(3, 1, 'ERP Transaction', 3, 'fa fa-buysellads'),
(4, 1, 'ERP Reports', 4, 'fa fa-file-text'),
(5, 1, 'Project Mgmt Transaction', 5, 'fa fa-building-o'),
(6, 1, 'Project Mgmt Reports', 6, 'fa fa-stumbleupon'),
(7, 1, 'Material Mgmt Transaction', 7, 'fa fa-gears'),
(8, 1, 'Material Mgmt Reports', 8, 'fa fa-bar-chart-o'),
(9, 1, 'Quality', 9, 'fa fa-eye'),
(10, 1, 'Safety', 10, 'fa fa-life-saver'),
(11, 1, 'Setup', 12, 'fa fa-maxcdn'),
(12, 1, 'Risk Assessment', 11, 'fa fa-group');

-- =============================================
-- Table: eng_permission
-- =============================================
INSERT INTO `eng_permission` (`PermissionID`, `GroupID`, `ModuleID`, `Access`) VALUES 
(1, 1, 1, 1),
(2, 1, 2, 1),
(3, 1, 3, 1),
(4, 1, 4, 1),
(5, 1, 5, 1),
(6, 1, 6, 1),
(7, 1, 7, 1),
(8, 1, 9, 1),
(9, 1, 10, 1),
(10, 1, 11, 1),
(1042, 1, 12, 1),
(2064, 3, 1, 1),
(2065, 3, 5, 1),
(2066, 3, 6, 1),
(2067, 3, 9, 1),
(2068, 3, 10, 1),
(2069, 5, 1, 1),
(2070, 5, 2, 1),
(2071, 5, 3, 1),
(2072, 5, 4, 1),
(2073, 5, 5, 1),
(2074, 5, 6, 1),
(2075, 5, 7, 1),
(2076, 5, 8, 1),
(2077, 5, 9, 1),
(2078, 5, 10, 1),
(2079, 5, 11, 1),
(2080, 5, 12, 1),
(2115, 2, 1, 1),
(2116, 2, 2, 1),
(2117, 2, 3, 1),
(2118, 2, 4, 1),
(2119, 2, 5, 1),
(2120, 2, 6, 1),
(2121, 2, 7, 1),
(2122, 2, 8, 1),
(2123, 2, 9, 1),
(2124, 2, 10, 1),
(2125, 2, 11, 1),
(2126, 4, 1, 1),
(2127, 4, 2, 1),
(2128, 4, 3, 1),
(2129, 4, 4, 1),
(2130, 4, 7, 1),
(2131, 4, 8, 1),
(2132, 4, 11, 1),
(2151, 7, 5, 1),
(2152, 7, 6, 1),
(2153, 7, 9, 1),
(2154, 7, 10, 1),
(2155, 12, 1, 1),
(2156, 12, 2, 1),
(2157, 12, 3, 1),
(2158, 12, 4, 1),
(2159, 12, 5, 1),
(2160, 12, 6, 1),
(2161, 12, 7, 1),
(2162, 12, 8, 1),
(2163, 12, 9, 1),
(2164, 12, 10, 1),
(2165, 12, 12, 1);

-- =============================================
-- Table: eng_screens
-- =============================================
INSERT INTO `eng_screens` (`SCREEN_ID`, `MODULEID`, `SCREEN_NAME`, `SCREEN_CLASS_NAME`, `SCREEN_URL`, `ORDER_BY`) VALUES 
(1, 2, 'Employee', 'Employee', 'Employee', 1),
(2, 2, 'Client', 'Client', 'Client', 2),
(4, 2, 'Product', 'Product', 'Product', 3),
(5, 2, 'Supplier', 'Supplier', 'Supplier', 4),
(6, 3, 'Quotation', 'Quotation', 'Quotation', 1),
(7, 3, 'Purchase Order', 'PurchaseOrder', 'PO', 2),
(8, 3, 'Payable', 'Payable', 'Payable', 3),
(9, 3, 'Receivable', 'Receivable', 'Receivable', 4),
(10, 4, 'Employee', 'Employees', 'EmployeeRep', 1),
(11, 4, 'Client', 'Clients', 'ClientRep', 2),
(12, 4, 'Product', 'Products', 'ProductRep', 3),
(13, 4, 'Supplier', 'Suppliers', 'SupplierRep', 4),
(15, 4, 'Quotation', 'Quotations', 'QuoteRep', 5),
(16, 4, 'Purchase Order', 'PurchaseOrders', 'PORep', 6),
(17, 4, 'Invoice', 'Invoice-Report', 'InvoiceRep', 7),
(20, 4, 'Work Completion(DO)', 'WorkCompletion', 'DORep', 10),
(21, 5, 'Project', 'Project', 'Project', 1),
(22, 5, 'Expense Entry', 'ExpenseEntry', 'ExpenceEntry', 2),
(23, 5, 'Time Entry', 'TimeEntry', 'TimeEntry', 3),
(24, 6, 'Project', 'Projects', 'ProjRep', 1),
(25, 6, 'Project Report', 'ProjectReports', 'ProjRepRep', 2),
(26, 6, 'Expense Entry', 'Expenses', 'ExpenseRep', 3),
(27, 6, 'Time Entry', 'TimeEntries', 'TERep', 4),
(28, 7, 'Store', 'Store', 'StoreMaster', 1),
(29, 7, 'Inward', 'Inward', 'Inward', 2),
(30, 7, 'Outward', 'Outward', 'Outward', 3),
(31, 7, 'Stock', 'Stock', 'Stock', 4),
(32, 7, 'Stock Taking', 'StockTaking', 'StockAdj', 5),
(33, 9, 'Quality Inspection', 'QualityInspection', 'QIns', 1),
(34, 9, 'Defect Tracking', 'DefectTracking', 'DefTrack', 2),
(35, 10, 'DTTR', 'DTTR', 'Dttr', 1),
(36, 11, 'Company', 'Company', 'Company', 1),
(37, 11, 'Users', 'Users', 'Users', 2),
(38, 10, 'PTW', 'PTW', 'Ptw', 2),
(39, 10, 'Safety Inspection', 'SafIns', 'SafIns', 3),
(40, 12, 'Work Activity', 'RAWA', 'RAWA', 1),
(41, 12, 'Process', 'RAPS', 'RAProcess', 2),
(42, 12, 'Location', 'RALN', 'RALoc', 3),
(43, 12, 'Hazard', 'RAHZ', 'RAHaz', 4),
(44, 12, 'Possible Accidents', 'RAPA', 'RAPAH', 5),
(45, 12, 'Control Measures', 'RACM', 'RACM', 6),
(46, 12, 'Risk Assessment', 'RA', 'RA', 7),
(47, 10, 'Safety Inspection New', 'SafInsNew', 'SafInsNew', 4),
(48, 3, 'Invoice', 'Invoice', 'Invoice', 5),
(49, 11, 'Menu Mapping', 'Menu', 'Menu', 3),
(50, 2, 'Vehicle', 'Vehicle', 'Vehicle', 5);

-- =============================================
-- Table: eng_mm_trmaster
-- =============================================
INSERT INTO `eng_mm_trmaster` (`MMTRID`, `inoutadj_ref`, `ProductID`, `Quantity`, `UoM`, `StoreID`, `Trn_Date`) VALUES 
(1, 'INW-1', 1, 2, 'mm', 1, '2018-04-10'),
(2, 'OUW-1', 1, -5, 'mm', 1, '2018-04-10'),
(3, 'INW-2', 2, 5, 'mm', 1, '2018-04-10'),
(4, 'INW-3', 3, 4, 'mm', 1, '2018-04-10'),
(5, 'INW-4', 4, 4, 'mm', 1, '2018-04-10'),
(6, 'INW-5', 5, 2, 'mm', 1, '2018-04-10'),
(7, 'INW-6', 9, 2, 'mm', 1, '2018-04-10'),
(8, 'OUW-2', 9, -1, 'mm', 1, '2018-04-10'),
(9, 'OUW-3', 3, -2, 'mm', 1, '2018-04-10'),
(10, 'SAJ-1', 1, -4, 'mm', 1, '2018-04-10'),
(11, 'SAJ-2', 2, 2, 'mm', 1, '2018-04-10'),
(12, 'SAJ-3', 4, -1, 'mm', 1, '2018-04-10'),
(13, 'INW-7', 8, 4, 'mm', 2, '2018-04-10'),
(14, 'OUW-4', 8, -3, 'mm', 2, '2018-04-10'),
(15, 'SAJ-4', 8, 1, 'mm', 2, '2018-04-10');

-- =============================================
-- Table: eng_quote_description
-- =============================================
INSERT INTO `eng_quote_description` (`QDID`, `QuoteID`, `Quantity`, `QuoteDescription`, `UnitOfMeasure`, `QuotePrice`, `AddedDate`, `UpdatedDate`, `AddedBy`, `UpdatedBy`, `ProjectID`) VALUES 
(1, 1, 2.0000, 'sowdambbika software services', 'mm', 10.00, '2021-06-26', NULL, 2, NULL, 1);

-- =============================================
-- Table: eng_company
-- =============================================
INSERT INTO `eng_company` (`CompanyID`, `CompanyName`, `Auth_InvoiceName`, `InvoiceTerms`, `Address1`, `Address2`, `City`, `Country`, `Pincode`, `Tel`, `Fax`, `Email`, `RegNo`, `GstRegNo`, `LogoPath`, `Normal_Work_Hours`, `Weekend_Work_Hours`, `Lunch_Break_Hours`, `GST`) VALUES 
(1, 'JM Information Systems (S) Pte Ltd', 'Pandees', 'As per norms', '39 Robinson Raod ', '#11-01 Robinson Point', 'Singapore', 'Singapore', '068911', '65123456', '65654321', 'project@eng360.com', '2012YYXXXY', '2012YYXXXY', 'C:\Inetpub\vhosts\smartdigitalprojects.com\eng360demo.smartdigitalprojects.com\images\CompanyLogo\logo.png', 8.00, 4.00, 1.00, 7.00);

-- =============================================
-- Table: eng_company_cert
-- =============================================
INSERT INTO `eng_company_cert` (`ID`, `Company_ID`, `Company_Name`, `Cert_License_Name`, `BoardName`, `Policy_Cert_Number`, `Issue_Date`, `Expiry_Date`, `Document_Name`, `UploadPath`) VALUES 
(1, 'CITICONS', 'CITI CONSTRUCTION  ENGINEERING PTE. LTD.
', 'Biz Safe
', 'BCA', 'BS12345
', '2017-03-01', '2018-02-28', NULL, NULL),
(2, 'CITICONS', 'CITI CONSTRUCTION  ENGINEERING PTE. LTD.
', 'ISO 9001:2008
', 'ISO', 'I5342567
', '2017-01-01', '2017-12-31', NULL, NULL);

-- =============================================
-- Table: eng_ra_control_measures
-- =============================================
INSERT INTO `eng_ra_control_measures` (`ItemID`, `ItemDescription`, `CreatedBy`, `CreatedDate`, `UpdatedBy`, `UpdatedDate`) VALUES 
(1, 'Traffic Controller to control traffic and pedestrian. All signage, barricade, TMA, etc as per LTA Reg put in place in advance of work progress.
RA, SWP and MOS for work on public roads briefed to all employees before work commences. In house Rules on Dos and Don''ts & consequences for failure to obey highlighted.
', 1, '2018-04-09 22:52:21', NULL, NULL);

-- =============================================
-- Table: eng_ra_hazardlist
-- =============================================
INSERT INTO `eng_ra_hazardlist` (`ItemID`, `ItemDescription`, `CreatedBy`, `CreatedDate`, `UpdatedBy`, `UpdatedDate`) VALUES 
(1, 'A)Failure to comply with LTA rules and regulations.
B)Pedestrian and vehicle safety.
C)Falling of materials / equipment / machinery from lorry crane.
', 1, '2018-04-09 22:49:50', 1, '2018-04-09 22:49:58');

-- =============================================
-- Table: eng_ra_location
-- =============================================
INSERT INTO `eng_ra_location` (`ItemID`, `ItemDescription`, `CreatedBy`, `CreatedDate`, `UpdatedBy`, `UpdatedDate`) VALUES 
(1, 'Workshop/Tuas', 1, '2018-04-09 22:48:17', NULL, NULL);

-- =============================================
-- Table: eng_ra_possible_accident_health
-- =============================================
INSERT INTO `eng_ra_possible_accident_health` (`ItemID`, `ItemDescription`, `CreatedBy`, `CreatedDate`, `UpdatedBy`, `UpdatedDate`) VALUES 
(1, 'A)Traffic Accident resulting in fatality / serious injuries to pedestrian, road users and / or damages to properties.
B)Serious injuries to pedestrian and /or damage to properties. ', 1, '2018-04-09 22:51:54', NULL, NULL);

-- =============================================
-- Table: eng_ra_process
-- =============================================
INSERT INTO `eng_ra_process` (`ItemID`, `ItemDescription`, `CreatedBy`, `CreatedDate`, `UpdatedBy`, `UpdatedDate`) VALUES 
(1, 'Trenching Work', 1, '2018-04-09 22:47:38', NULL, NULL);

-- =============================================
-- Table: eng_ra_work_activity
-- =============================================
INSERT INTO `eng_ra_work_activity` (`ItemID`, `ItemDescription`, `CreatedBy`, `CreatedDate`, `UpdatedBy`, `UpdtaedDate`) VALUES 
(1, 'Movement of lorry / truck (transport vehicles) and lorry crane to / from intended project area on public roads', 1, '2018-04-09 22:46:31', NULL, NULL),
(2, 'Lifting operation of materials with Lorry Crane', 1, '2018-04-09 22:46:59', NULL, NULL);

-- =============================================
-- Table: eng_sys_country
-- =============================================
INSERT INTO `eng_sys_country` (`Id`, `CountryCode`, `Country`) VALUES 
(1, ' sg', ' Singapore'),
(2, ' hk', ' Hong Kong'),
(3, ' af', ' Afghanistan'),
(4, ' ax', ' Aland Islands'),
(5, ' al', ' Albania'),
(6, ' dz', ' Algeria'),
(7, ' as', ' American Samoa'),
(8, ' ad', ' Andorra'),
(9, ' ao', ' Angola'),
(10, ' ai', ' Anguilla'),
(11, ' aq', ' Antarctica'),
(12, ' ag', ' Antigua and Barbuda'),
(13, ' ar', ' Argentina'),
(14, ' am', ' Armenia'),
(15, ' aw', ' Aruba'),
(16, ' au', ' Australia'),
(17, ' at', ' Austria'),
(18, ' az', ' Azerbaijan'),
(19, ' bs', ' Bahamas'),
(20, ' bh', ' Bahrain'),
(21, ' bd', ' Bangladesh'),
(22, ' bb', ' Barbados'),
(23, ' by', ' Belarus'),
(24, ' be', ' Belgium'),
(25, ' bz', ' Belize'),
(26, ' bj', ' Benin'),
(27, ' bm', ' Bermuda'),
(28, ' bt', ' Bhutan'),
(29, ' bo', ' Bolivia'),
(30, ' ba', ' Bosnia and Herzegovina'),
(31, ' bw', ' Botswana'),
(32, ' br', ' Brazil'),
(33, ' io', ' British Indian Ocean Territory'),
(34, ' bn', ' Brunei Darussalam'),
(35, ' bg', ' Bulgaria'),
(36, ' bf', ' Burkina Faso'),
(37, ' bi', ' Burundi'),
(38, ' kh', ' Cambodia'),
(39, ' cm', ' Cameroon'),
(40, ' ca', ' Canada'),
(41, ' cv', ' Cape Verde'),
(42, ' cb', ' Caribbean Nations'),
(43, ' ky', ' Cayman Islands'),
(44, ' cf', ' Central African Republic'),
(45, ' td', ' Chad'),
(46, ' cl', ' Chile'),
(47, ' cn', ' China'),
(48, ' cx', ' Christmas Island'),
(49, ' cc', ' Cocos (Keeling) Islands'),
(50, ' co', ' Colombia'),
(51, ' km', ' Comoros'),
(52, ' cg', ' Congo'),
(53, ' ck', ' Cook Islands'),
(54, ' cr', ' Costa Rica'),
(55, ' ci', ' Cote D''Ivoire (Ivory Coast)'),
(56, ' hr', ' Croatia'),
(57, ' cu', ' Cuba'),
(58, ' cy', ' Cyprus'),
(59, ' cz', ' Czech Republic'),
(60, ' cd', ' Democratic Republic of the Congo'),
(61, ' dk', ' Denmark'),
(62, ' dj', ' Djibouti'),
(63, ' dm', ' Dominica'),
(64, ' do', ' Dominican Republic'),
(65, ' tp', ' East Timor'),
(66, ' ec', ' Ecuador'),
(67, ' eg', ' Egypt'),
(68, ' sv', ' El Salvador'),
(69, ' gq', ' Equatorial Guinea'),
(70, ' er', ' Eritrea'),
(71, ' ee', ' Estonia'),
(72, ' et', ' Ethiopia'),
(73, ' fk', ' Falkland Islands (Malvinas)'),
(74, ' fo', ' Faroe Islands'),
(75, ' fm', ' Federated States of Micronesia'),
(76, ' fj', ' Fiji'),
(77, ' fi', ' Finland'),
(78, ' fr', ' France'),
(79, ' gf', ' French Guiana'),
(80, ' pf', ' French Polynesia'),
(81, ' tf', ' French Southern Territories'),
(82, ' ga', ' Gabon'),
(83, ' gm', ' Gambia'),
(84, ' ge', ' Georgia'),
(85, ' de', ' Germany'),
(86, ' gh', ' Ghana'),
(87, ' gi', ' Gibraltar'),
(88, ' gr', ' Greece'),
(89, ' gl', ' Greenland'),
(90, ' gd', ' Grenada'),
(91, ' gp', ' Guadeloupe'),
(92, ' gu', ' Guam'),
(93, ' gt', ' Guatemala'),
(94, ' gg', ' Guernsey'),
(95, ' gn', ' Guinea'),
(96, ' gw', ' Guinea-Bissau'),
(97, ' gy', ' Guyana'),
(98, ' ht', ' Haiti'),
(99, ' hn', ' Honduras'),
(100, ' hu', ' Hungary'),
(101, ' is', ' Iceland'),
(102, ' in', ' India'),
(103, ' id', ' Indonesia'),
(104, ' ir', ' Iran'),
(105, ' iq', ' Iraq'),
(106, ' ie', ' Ireland'),
(107, ' im', ' Isle of Man'),
(108, ' il', ' Israel'),
(109, ' it', ' Italy'),
(110, ' jm', ' Jamaica'),
(111, ' jp', ' Japan'),
(112, ' je', ' Jersey'),
(113, ' jo', ' Jordan'),
(114, ' kz', ' Kazakhstan'),
(115, ' ke', ' Kenya'),
(116, ' ki', ' Kiribati'),
(117, ' kr', ' Korea'),
(118, ' kp', ' Korea (North)'),
(119, ' ko', ' Kosovo'),
(120, ' kw', ' Kuwait'),
(121, ' kg', ' Kyrgyzstan'),
(122, ' la', ' Laos'),
(123, ' lv', ' Latvia'),
(124, ' lb', ' Lebanon'),
(125, ' ls', ' Lesotho'),
(126, ' lr', ' Liberia'),
(127, ' ly', ' Libya'),
(128, ' li', ' Liechtenstein'),
(129, ' lt', ' Lithuania'),
(130, ' lu', ' Luxembourg'),
(131, ' mo', ' Macao'),
(132, ' mk', ' Macedonia'),
(133, ' mg', ' Madagascar'),
(134, ' mw', ' Malawi'),
(135, ' my', ' Malaysia'),
(136, ' mv', ' Maldives'),
(137, ' ml', ' Mali'),
(138, ' mt', ' Malta'),
(139, ' mh', ' Marshall Islands'),
(140, ' mq', ' Martinique'),
(141, ' mr', ' Mauritania'),
(142, ' mu', ' Mauritius'),
(143, ' yt', ' Mayotte'),
(144, ' mx', ' Mexico'),
(145, ' md', ' Moldova'),
(146, ' mc', ' Monaco'),
(147, ' mn', ' Mongolia'),
(148, ' me', ' Montenegro'),
(149, ' ms', ' Montserrat'),
(150, ' ma', ' Morocco'),
(151, ' mz', ' Mozambique'),
(152, ' mm', ' Myanmar'),
(153, ' na', ' Namibia'),
(154, ' nr', ' Nauru'),
(155, ' np', ' Nepal'),
(156, ' nl', ' Netherlands'),
(157, ' an', ' Netherlands Antilles'),
(158, ' nc', ' New Caledonia'),
(159, ' nz', ' New Zealand'),
(160, ' ni', ' Nicaragua'),
(161, ' ne', ' Niger'),
(162, ' ng', ' Nigeria'),
(163, ' nu', ' Niue'),
(164, ' nf', ' Norfolk Island'),
(165, ' mp', ' Northern Mariana Islands'),
(166, ' no', ' Norway'),
(167, ' om', ' Oman'),
(168, ' pk', ' Pakistan'),
(169, ' pw', ' Palau'),
(170, ' ps', ' Palestinian Territory'),
(171, ' pa', ' Panama'),
(172, ' pg', ' Papua New Guinea'),
(173, ' py', ' Paraguay'),
(174, ' pe', ' Peru'),
(175, ' ph', ' Philippines'),
(176, ' pn', ' Pitcairn'),
(177, ' pl', ' Poland'),
(178, ' pt', ' Portugal'),
(179, ' pr', ' Puerto Rico'),
(180, ' qa', ' Qatar'),
(181, ' re', ' Reunion'),
(182, ' ro', ' Romania'),
(183, ' ru', ' Russian Federation'),
(184, ' rw', ' Rwanda'),
(185, ' sh', ' Saint Helena'),
(186, ' kn', ' Saint Kitts and Nevis'),
(187, ' lc', ' Saint Lucia'),
(188, ' pm', ' Saint Pierre and Miquelon'),
(189, ' vc', ' Saint Vincent and the Grenadines'),
(190, ' ws', ' Samoa'),
(191, ' sm', ' San Marino'),
(192, ' st', ' Sao Tome and Principe'),
(193, ' sa', ' Saudi Arabia'),
(194, ' sn', ' Senegal'),
(195, ' rs', ' Serbia'),
(196, ' sc', ' Seychelles'),
(197, ' sl', ' Sierra Leone'),
(198, ' sk', ' Slovak Republic'),
(199, ' si', ' Slovenia'),
(200, ' sb', ' Solomon Islands'),
(201, ' so', ' Somalia'),
(202, ' za', ' South Africa'),
(203, ' es', ' Spain'),
(204, ' lk', ' Sri Lanka'),
(205, ' sd', ' Sudan'),
(206, ' sr', ' Suriname'),
(207, ' sj', ' Svalbard and Jan Mayen'),
(208, ' sz', ' Swaziland'),
(209, ' se', ' Sweden'),
(210, ' ch', ' Switzerland'),
(211, ' sy', ' Syria'),
(212, ' tw', ' Taiwan'),
(213, ' tj', ' Tajikistan'),
(214, ' tz', ' Tanzania'),
(215, ' th', ' Thailand'),
(216, ' tl', ' Timor-Leste'),
(217, ' tg', ' Togo'),
(218, ' tk', ' Tokelau'),
(219, ' to', ' Tonga'),
(220, ' tt', ' Trinidad and Tobago'),
(221, ' tn', ' Tunisia'),
(222, ' tr', ' Turkey'),
(223, ' tm', ' Turkmenistan'),
(224, ' tc', ' Turks and Caicos Islands'),
(225, ' tv', ' Tuvalu'),
(226, ' ug', ' Uganda'),
(227, ' ua', ' Ukraine'),
(228, ' ae', ' United Arab Emirates'),
(229, ' gb', ' United Kingdom'),
(230, ' us', ' United States'),
(231, ' uy', ' Uruguay'),
(232, ' uz', ' Uzbekistan'),
(233, ' vu', ' Vanuatu'),
(234, ' va', ' Vatican City State (Holy See)'),
(235, ' ve', ' Venezuela'),
(236, ' vn', ' Vietnam'),
(237, ' vg', ' Virgin Islands (British)'),
(238, ' vi', ' Virgin Islands (U.S.)'),
(239, ' wf', ' Wallis and Futuna'),
(240, ' eh', ' Western Sahara'),
(241, ' ye', ' Yemen'),
(242, ' zm', ' Zambia'),
(243, ' zw', ' Zimbabwe'),
(244, ' oo', ' Other');

-- =============================================
-- Table: eng_sys_ptw_stages
-- =============================================
INSERT INTO `eng_sys_ptw_stages` (`StageCofigID`, `Stage_Type`, `Stages`) VALUES 
(1, 'PTWWAH', 'STAGE 1: APPLICATION BY SUPERVISOR IN-CHARGE
'),
(2, 'PTWWAH', 'STAGE 2: Endorsement by WSH Personnel / Assessor
'),
(3, 'PTWWAH', 'STAGE 3: Approval by Project Manager / Authorized Manager
'),
(4, 'PTWWAH', 'STAGE 4: Daily checks on implementation as per above checklist
'),
(5, 'PTWWAH', 'STAGE 5: Permit Closure:
'),
(6, 'PTWWFEX', 'STAGE 1:  APPLICATION BY SUPERVISOR IN-CHARGE
'),
(7, 'PTWWFEX', 'STAGE 2 – Endorsement by Main-con WSH Personnel / Assessor
'),
(8, 'PTWWFEX', 'STAGE 3 – Approval by Project Manager / Assistant Project Manager/ Site Manager 
'),
(9, 'PTWWFEX', 'STAGE 4: Daily checks on implementation as per above checklist
'),
(10, 'PTWWFEX', 'STAGE 5: Permit Closure:
'),
(11, 'PTWHOT
', 'STAGE 1:  APPLICATION BY SUPERVISOR IN-CHARGE
'),
(12, 'PTWHOT
', 'STAGE 2 – Endorsement by EHS Personnel / Assessor
'),
(13, 'PTWHOT
', 'STAGE 3 – Approval by Project Manager / Authorized Manager 
'),
(14, 'PTWHOT
', 'STAGE 4: Daily checks on implementation as per above checklist
'),
(15, 'PTWHOT
', 'STAGE 5: Permit Closure:
'),
(16, 'PTWLOPT
', 'STAGE 1:  APPLICATION BY SUPERVISOR IN-CHARGE / WSH PERSONNEL
'),
(17, 'PTWLOPT
', 'STAGE 2 – Endorsement by Main-con WSH Personnel / Assessor
'),
(18, 'PTWLOPT
', 'STAGE 3 – Approval by Project Manager / Assistant Project Manager/ Site Manager 
'),
(19, 'PTWLOPT
', 'STAGE 4: Daily checks on implementation as per above checklist
'),
(20, 'PTWLOPT
', 'STAGE 5: Permit Closure:
'),
(21, 'PTWCONSPC', 'STAGE 1: Requested by Supervisor (To Be Filled Up By Applicant / Supervisor In-Charge'),
(22, 'PTWCONSPC', 'STAGE 2:  Evaluation by Confined Space Safety Assessor'),
(23, 'PTWCONSPC', 'STAGE 3:  Acknowledgement by WSHO / WSHC'),
(24, 'PTWCONSPC', 'STAGE 4: Approval by Project Manager'),
(25, 'PTWCONSPC', 'STAGE 5: Daily Gas Checking Checklist by Confined Space Assessor'),
(26, 'PTWCONSPC', 'STAGE 6: Notification of Completion of Work by Supervisor in charge');

-- =============================================
-- Table: eng_sys_riskmatrix
-- =============================================
INSERT INTO `eng_sys_riskmatrix` (`RMID`, `Severity_Value`, `Likelihood_Value`, `Risk_Value`, `Risk_Type`) VALUES 
(1, 1, 1, 1, 'Low Risk'),
(2, 1, 2, 2, 'Low Risk'),
(3, 1, 3, 3, 'Low Risk'),
(4, 1, 4, 4, 'Medium Risk'),
(5, 1, 5, 5, 'Medium Risk'),
(6, 2, 1, 2, 'Low Risk'),
(7, 2, 2, 4, 'Medium Risk'),
(8, 2, 3, 6, 'Medium Risk'),
(9, 2, 4, 8, 'Medium Risk'),
(10, 2, 5, 10, 'Medium Risk'),
(11, 3, 1, 3, 'Low Risk'),
(12, 3, 2, 6, 'Medium Risk'),
(13, 3, 3, 9, 'Medium Risk'),
(14, 3, 4, 12, 'Medium Risk'),
(15, 3, 5, 15, 'High Risk'),
(16, 4, 1, 4, 'Medium Risk'),
(17, 4, 2, 8, 'Medium Risk'),
(18, 4, 3, 12, 'Medium Risk'),
(19, 4, 4, 16, 'High Risk'),
(20, 4, 5, 20, 'High Risk'),
(21, 5, 1, 5, 'Medium Risk'),
(22, 5, 2, 10, 'Medium Risk'),
(23, 5, 3, 15, 'High Risk'),
(24, 5, 4, 20, 'High Risk'),
(25, 5, 5, 25, 'High Risk');

-- =============================================
-- Table: eng_sys_rm_likelihood
-- =============================================
INSERT INTO `eng_sys_rm_likelihood` (`RMLHID`, `Likelihood_Value`, `Likelihood_Type`, `Likelihood_Description`) VALUES 
(1, 1, 'Rare', 'Not expected to occur but still possible.'),
(2, 2, 'Remote', 'Not likely to occur under normal circumstances.'),
(3, 3, 'Occasional', 'Possible or known to occur.'),
(4, 4, 'Frequent', 'Common occurrence.'),
(5, 5, 'Almost Certain', 'Continual or repeating experience.');

-- =============================================
-- Table: eng_sys_rm_severity
-- =============================================
INSERT INTO `eng_sys_rm_severity` (`RMSVID`, `Severity_Value`, `Severity_Type`, `Severity_Description`) VALUES 
(1, 5, 'Catastrophic', 'Fatality, fatal diseases or multiple major injuries.'),
(2, 4, 'Major', 'Serious injuries or life-threatening occupational disease (including amputations, major fractures, multiple injuries, occupational cancer, acute poisoning).'),
(3, 3, 'Moderate', 'Injury requiring medical treatment or ill-health leading to disability (includes lacerations, burns, sprains, minor fractures, dermatitis, deafness, work-related upper limb disorders).'),
(4, 2, 'Minor', 'Injury or ill-health requiring first-aid only (includes minor cuts and bruises, irritation, ill-health with temporary discomfort).'),
(5, 1, 'Negligible', 'Not likely to cause injury or ill-health');

-- =============================================
-- Table: eng_transport_master
-- =============================================
INSERT INTO `eng_transport_master` (`TransportID`, `Vehicle_Name`, `Vehicle_Company`, `Vehicle_Model`, `Vehicle_Type`, `Vehicle_Number`, `COE_Regn_Number`, `COE_Issue_Date`, `COE_Expiry_Date`, `RoadTax_Regn_Number`, `RoadTax_Iussue_Date`, `RoadTax_Expiry_Date`, `Insurance_Policy_Number`, `Insurance_Issue_Date`, `Insurance_Expiry_Date`, `Insurance_Company`, `Last_Insurance_Renew_Date`, `Vehicle_Inspection_Date`, `Inspection_Due_Date`, `Remarks`, `CreatedDate`, `UpdatedDate`, `CreatedBy`, `UpdatedBy`, `IsActive`, `AgreementNumber`) VALUES 
(1, 'TOYOTA', 'TOYOTA
', 'TOYOTA
', 'B31-Goods Lorry
', 'GBF8821P
', NULL, '2017-04-03', '2027-04-02', NULL, '2017-04-08', '2018-04-02', 'AVCPSB0085581700
', '2017-04-03', '2018-04-02', NULL, '2017-04-03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(2, 'TOYOTA
', 'TOYOTA
', 'TOYOTA
', 'B31-Goods Lorry
', 'GBF8799X
', NULL, '2017-04-03', '2027-04-02', NULL, '2017-04-08', '2018-04-02', 'AVCPSB0085591700
', '2017-04-03', '2018-04-02', NULL, '2017-04-03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(3, 'NISSAN', 'NISSAN', 'NISSAN', 'Goods Lorry
', 'GBD3506T
', NULL, '2017-06-14', '2024-09-17', NULL, '2017-09-11', '2018-03-10', 'M0000666
', '2017-09-18', '2018-09-17', NULL, '2017-09-18', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL),
(4, 'Mitsubishi', 'Mitsubishi', 'Mitsubishi', 'B31-Goods Lorry', 'YM6443B', 'A12345', '2017-06-15', '2022-06-14', NULL, NULL, NULL, 'VCA/P1622685', '2017-07-05', '2018-07-04', NULL, NULL, NULL, '2015-12-13', 'kdkd', NULL, '2018-05-14', 0, 1, 1, '#13-9809/12/18'),
(5, 'toyata ', 'XYLO', NULL, 'goods van', 'yz1245', NULL, NULL, NULL, NULL, NULL, '2018-05-30', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2018-05-13', NULL, 1, 0, 1, NULL);

SET FOREIGN_KEY_CHECKS = 1;

-- Store Procedures
