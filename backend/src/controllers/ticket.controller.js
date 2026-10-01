import { DateTime } from "luxon";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { sanitizeUserResponse } from "../utils/sanitizeUserResponse.js";
import { Ticket } from "../models/ticket.model.js";
import { TicketCounter } from "../models/ticketCounter.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { RegisteredProduct } from "../models/registeredProduct.model.js";
import { parseYYYYMMDD } from "../utils/date.js";
import { BUSINESS_TIMEZONE } from "../utils/date.js";



const getAllClientForTicketController = asyncHandler(async (req, res)=>{


       const currentUser = req.user;
    if (!currentUser) {
        throw new ApiError(401, "Unauthorized")
    };

    const currentUserRole = currentUser.role;
         if(!currentUserRole){
            throw new ApiError(400, "Error while fetching user role")
         };
    
    if(!["superadmin", "admin", "engineer", "l1_engineer"].includes(currentUserRole)){
        throw new ApiError(403, "Unauthorized access")
    };


    const allClients = await User.find({
        role: "client",
        isDeleted: false,
    }).select("_id companyName fullName");

    return res
    .status(200)
    .json(new ApiResponse(200, allClients, "All clients fetched successfully"))
});

const getClientByIdController = asyncHandler(async (req, res)=> {

      const currentUser = req.user;
    if (!currentUser) {
        throw new ApiError(401, "Unauthorized")
    };

    const currentUserRole = currentUser.role;
         if(!currentUserRole){
            throw new ApiError(400, "Error while fetching user role")
         };
    
    if(!["superadmin", "admin", "engineer", "l1_engineer"].includes(currentUserRole)){
        throw new ApiError(403, "Unauthorized access")
    };

     const { clientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
        throw new ApiError(400, "Invalid client ID");
    }


   const client = await User.findOne({
        _id: clientId,
        role: "client",
        isDeleted: false
    }).select(
        "_id fullName companyName email phoneNumber fullAddress state city pincode"
    );


    if (!client) {
        throw new ApiError(404, "Client not found");
    };

    return res
    .status(200)
    .json(new ApiResponse(200, client, "Current client details fetched successfully"))

});

const getClientsByCompanyName = asyncHandler(async(req, res)=> {

      const currentUser = req.user;
    if (!currentUser) {
        throw new ApiError(401, "Unauthorized")
    };

    const currentUserRole = currentUser.role;
         if(!currentUserRole){
            throw new ApiError(400, "Error while fetching user role")
         };
    
    if(!["superadmin", "admin", "engineer", "l1_engineer"].includes(currentUserRole)){
        throw new ApiError(403, "Unauthorized access")
    };

        const { companyName } = req.params;

    const filteredCompanyName = companyName?.trim().toLowerCase();
if(!filteredCompanyName){
    throw new ApiError(400, "Invalid or missing company Name")
};


   const clients = await User.find({
    companyName: filteredCompanyName,
        role: "client",
        isDeleted: false
    }).select(
        "_id fullName email phoneNumber fullAddress state city pincode"
    );


    // if (!clients|| clients.length === 0) {
    //     throw new ApiError(404, "Clients not found");
    // };

    return res
    .status(200)
    .json(new ApiResponse(200, clients, "Current client details using compamy name fetched successfully"))

});

const getRegisteredProductsByCompanyNameController = asyncHandler(async (req, res)=>{

      const currentUser = req.user;
    if (!currentUser) {
        throw new ApiError(401, "Unauthorized")
    };

    const currentUserRole = currentUser.role;
         if(!currentUserRole){
            throw new ApiError(400, "Error while fetching user role")
         };
    
    if(!["superadmin", "admin", "engineer", "l1_engineer", "client"].includes(currentUserRole)){
        throw new ApiError(403, "Unauthorized access")
    };

    const { companyName } = req.params;

    const filteredCompanyName = companyName?.trim().toLowerCase();
if(!filteredCompanyName){
    throw new ApiError(400, "Invalid or missing company Name")
};

const products = await RegisteredProduct.find({
    endCompanyName: filteredCompanyName,
    isDeleted: false
}).select("billNumber productName modelNumber serialNumber warrantyEndDate");

return res
.status(200)
.json(new ApiResponse(200, products, "Products fetched successfully"))
});

const getAllCompaniesFromRegisteredProducts = asyncHandler(async(req, res)=> {
       
    const currentUser = req.user;
    if (!currentUser) {
        throw new ApiError(401, "Unauthorized")
    };

    const currentUserRole = currentUser.role;
         if(!currentUserRole){
            throw new ApiError(400, "Error while fetching user role")
         };
    
    if(!["superadmin", "admin", "engineer", "l1_engineer"].includes(currentUserRole)){
        throw new ApiError(403, "Unauthorized access")
    };

    const companiesList = await RegisteredProduct.distinct("endCompanyName", {
        isDeleted: false,
          endCompanyName: { $nin: [null, ""] }
    });

    return res
    .status(200)
    .json(new ApiResponse(200, companiesList, "Company names fetched successfully"))
});

const createTicketByAdminController = asyncHandler(async (req, res) => {

    const currentUser = req.user;
    if (!currentUser) {
        throw new ApiError(401, "Unauthorized")
    };

    const currentUserRole = currentUser.role;
         if(!currentUserRole){
            throw new ApiError(400, "Error while fetching user role")
         };
    
    if(!["superadmin", "admin", "engineer", "l1_engineer"].includes(currentUserRole)){
        throw new ApiError(403, "Unauthorized access")
    };

    const { issueTitle, issueDescription, priority, department, companyName, customerName, customerId, contactPerson, contactEmail, contactNumber, fullAddress, state, city, pincode, productName, modelNumber, serialNumber, billNumber, problemCategory, productImage, assignedToId, vendorId, problemDescription, remarks, expiredWarrantyDescription } = req.body;

    const filteredIssueTitle = issueTitle?.trim();
    const filteredIssueDescription = issueDescription?.trim();
    const filteredPriority = priority?.trim().toLowerCase();
    const filteredDepartment = department?.trim().toLowerCase();

    const filteredCompanyName = companyName?.trim();
    const filteredCustomerName = customerName?.trim();
     const filteredCustomerId = customerId?.trim();
    const filteredContactPerson = contactPerson?.trim();
    const filteredContactEmail = contactEmail?.trim().toLowerCase();
    const filteredContactNumber = contactNumber?.trim();
    const filteredFullAddress = fullAddress?.trim();
    const filteredState = state?.trim();
    const filteredCity = city?.trim();
    const filteredPincode = pincode?.trim();

    const filteredProductName = productName?.trim();
    const filteredModelNumber = modelNumber?.trim();
    const filteredSerialNumber = serialNumber?.trim();
    const filteredBillNumber = billNumber?.trim();
   const filteredExpiredWarrantyDescription = expiredWarrantyDescription?.trim();

    
   const filteredProductImage = productImage?.map(url => url.trim()) || [];
    const filteredAssignedToId = assignedToId?.trim();
    const filteredProblemCategory =
        filteredDepartment === "rma"
            ? problemCategory?.trim().toLowerCase()
            : undefined;
    
const filteredVendorId = vendorId?.trim()
const filteredProblemDescription = problemDescription?.trim();
const filteredRemarks = remarks?.trim();

    if (
        !filteredIssueTitle ||
        !filteredIssueDescription ||
        !filteredPriority ||
        !filteredDepartment ||
        !filteredCompanyName ||
        !filteredCustomerName ||
        !filteredCustomerId ||
        !filteredContactPerson ||
        !filteredContactEmail ||
        !filteredContactNumber ||
        !filteredFullAddress ||
        !filteredState ||
        !filteredCity ||
        !filteredPincode ||
        !filteredProductName ||
        !filteredModelNumber ||
        !filteredBillNumber ||
        !filteredSerialNumber
    ) {
        throw new ApiError(400, "All required fields are mandatory");
    }

    if (!["high", "medium", "low"].includes(filteredPriority)) {
        throw new ApiError(400, "Invalid Priority");
    };

    if (!["rma", "technical_support", "general_query"].includes(filteredDepartment)) {
        throw new ApiError(400, "Invalid Department");
    };

    if (
        filteredDepartment === "rma" &&
        !["hw_failure", "sw_failure", "port_issue", "poe_issue","power_issue", "others"]
            .includes(filteredProblemCategory)
    ) {
        throw new ApiError(400, "Invalid Problem Category");
    };


    // if (isNaN(filteredWarrantyEndDate.getTime())) {
    //     throw new ApiError(400, "Invalid warranty end date");
    // }

    if (filteredAssignedToId && !mongoose.Types.ObjectId.isValid(filteredAssignedToId)) {
        throw new ApiError(400, "Invalid or missing assigned engineer");
    };


    if (filteredVendorId && !mongoose.Types.ObjectId.isValid( filteredVendorId)) {
        throw new ApiError(400, "Invalid vendor");
    };
   

    if (!mongoose.Types.ObjectId.isValid(filteredCustomerId)) {
        throw new ApiError(400, "Invalid customer");
    };

    let isFilteredCustomerIdValid = await User.findOne({
       _id: filteredCustomerId,
       companyName: filteredCompanyName,
       role: "client",
       isDeleted: false
    });

      if(!isFilteredCustomerIdValid){
         throw new ApiError(403, "Invalid Customer or Client Id")
    };

  
    const isProductDetailsValid = await RegisteredProduct.findOne({
         billNumber: filteredBillNumber,
         productName: filteredProductName,
         modelNumber: filteredModelNumber,
         serialNumber: filteredSerialNumber,
         isDeleted: false,
         endCompanyName: filteredCompanyName
    });

    if(!isProductDetailsValid){
        throw new ApiError(400, "Invalide Product")
    }

    if(isProductDetailsValid.warrantyEndDate <= new Date()){
        if(!filteredExpiredWarrantyDescription){
            throw new ApiError(400, "Warranty has expired, share Expired Warranty Description")
        }
    }

       let assignedTo = null;
let assignedToHistory = [];
let isFilteredAssignedToIdValid;
if(filteredAssignedToId){
    isFilteredAssignedToIdValid =  await User.findOne({
    _id: filteredAssignedToId,
    role: { $in: ["engineer", "l1_engineer"] },
    isDeleted: false,
    isActive: true
});
if(isFilteredAssignedToIdValid){
   assignedTo = isFilteredAssignedToIdValid._id;

    assignedToHistory = [{
        assignedTo: isFilteredAssignedToIdValid._id,
        assignedBy: currentUser._id,
    }];
};
};


let departmentCode;

if(filteredDepartment === "rma"){
    departmentCode = "rma";
} else if(filteredDepartment === "technical_support"){
    departmentCode = "ts";
} else if(filteredDepartment === "general_query"){
    departmentCode = "gq";
} else{
    departmentCode = undefined
};

if(!departmentCode || departmentCode === null || departmentCode === undefined){
    throw new ApiError(400, "Department code is invalid or missing")
};

if (filteredDepartment !== "rma" && filteredVendorId) {
    throw new ApiError(
        400,
        "Vendor assignment is only allowed for RMA tickets"
    );
};

let vendorDetails = {
    vendor: null,
    assignedAt: null,
    problemDescription: null,
    remarks: null,
};

if(filteredDepartment === "rma" && filteredVendorId){
    const isFilteredVendorIdValid = await User.findOne({
    _id: filteredVendorId,
    role: "vendor",
    isDeleted: false,
    isActive: true
});

if(isFilteredVendorIdValid){
    vendorDetails.vendor = filteredVendorId;
    vendorDetails.assignedAt = Date.now();
    vendorDetails.problemDescription = filteredProblemDescription;
    vendorDetails.remarks = filteredRemarks;
};
}

const existingTicket = await Ticket.findOne({
  serialNumber: filteredSerialNumber,
   ticketStatus: { $ne: "closed" },
    isDeleted: false
});

if (existingTicket) {
  throw new ApiError(400, "A ticket already exists for this serial number");
}

const currentDate = DateTime.now().setZone("Asia/Kolkata");
const year = currentDate.year;
const month = String(currentDate.month).padStart(2, "0");

const ticketCounter = await TicketCounter.findOneAndUpdate(
    { year },
    { $inc: { sequence: 1 }},
    {
        new: true,
        upsert: true,
    }
);

const ticketNumber =
    `${departmentCode}-${year}-${month}-${ticketCounter.sequence}`;


    const createdTicket = await Ticket.create({
ticketNumber: ticketNumber,
issueTitle: filteredIssueTitle,
issueDescription: filteredIssueDescription,
priority: filteredPriority,
department: filteredDepartment,
companyName: isProductDetailsValid.endCompanyName,
customerName: isFilteredCustomerIdValid.fullName,
customerId: isFilteredCustomerIdValid._id,
contactPerson: filteredContactPerson,
contactEmail: filteredContactEmail,
contactNumber: filteredContactNumber,
fullAddress: filteredFullAddress,
state: filteredState,
city: filteredCity,
pincode: filteredPincode,
productName: isProductDetailsValid.productName,
modelNumber: isProductDetailsValid.modelNumber,
serialNumber: isProductDetailsValid.serialNumber,
billNumber: isProductDetailsValid.billNumber,
warrantyEndDate: isProductDetailsValid.warrantyEndDate,
problemCategory: filteredProblemCategory? filteredProblemCategory: null,
expiredWarrantyDescription: filteredExpiredWarrantyDescription? filteredExpiredWarrantyDescription: null,
productImage: filteredProductImage,
assignedTo: assignedTo,
assignedToHistory: assignedToHistory,
createdBy: currentUser._id,
createdByRole: currentUserRole,
vendorDetails: filteredDepartment === "rma"? vendorDetails: null
    });

    if(!createdTicket){
        throw new ApiError(500, "Error while creating ticket")
    };

    console.log(createdTicket)
    return res
    .status(201)
    .json(new ApiResponse(201, createdTicket, "Ticket created successfully"))
});


const createTicketByClientController = asyncHandler(async (req, res) => {

        const currentUser = req.user;
    if (!currentUser) {
        throw new ApiError(401, "Unauthorized")
    };

    const currentUserRole = currentUser.role;
         if(!currentUserRole){
            throw new ApiError(400, "Error while fetching user role")
         };

         

          if(currentUserRole != "client"){
        throw new ApiError(403, "Unauthorized access")
    };

    const  filteredCompanyName = currentUser?.companyName;
     if(!filteredCompanyName){
            throw new ApiError(400, "Error while fetching company name")
         };

    // companyName, customerName, customerId,
    // assignedToId, vendorId, problemDescription, remarks, expiredWarrantyDescription

             const { issueTitle, issueDescription, priority, department, contactPerson, contactEmail, contactNumber, fullAddress, state, city, pincode, productName, modelNumber, serialNumber, billNumber, problemCategory, productImage,  } = req.body;

    const filteredIssueTitle = issueTitle?.trim();
    const filteredIssueDescription = issueDescription?.trim();
    const filteredPriority = priority?.trim().toLowerCase();
    const filteredDepartment = department?.trim().toLowerCase();


    const filteredContactPerson = contactPerson?.trim();
    const filteredContactEmail = contactEmail?.trim().toLowerCase();
    const filteredContactNumber = contactNumber?.trim();
    const filteredFullAddress = fullAddress?.trim();
    const filteredState = state?.trim();
    const filteredCity = city?.trim();
    const filteredPincode = pincode?.trim();

    const filteredProductName = productName?.trim();
    const filteredModelNumber = modelNumber?.trim();
    const filteredSerialNumber = serialNumber?.trim();
    const filteredBillNumber = billNumber?.trim();

    
   const filteredProductImage = productImage?.map(url => url.trim()) || [];
    const filteredProblemCategory =
        filteredDepartment === "rma"
            ? problemCategory?.trim().toLowerCase()
            : undefined;
    

    if (
        !filteredIssueTitle ||
        !filteredIssueDescription ||
        !filteredPriority ||
        !filteredDepartment ||
        !filteredContactPerson ||
        !filteredContactEmail ||
        !filteredContactNumber ||
        !filteredFullAddress ||
        !filteredState ||
        !filteredCity ||
        !filteredPincode ||
        !filteredProductName ||
        !filteredModelNumber ||
        !filteredBillNumber ||
        !filteredSerialNumber
    ) {
        throw new ApiError(400, "All required fields are mandatory");
    };

 if (!["high", "medium", "low"].includes(filteredPriority)) {
        throw new ApiError(400, "Invalid Priority");
    };

    if (!["rma", "technical_support", "general_query"].includes(filteredDepartment)) {
        throw new ApiError(400, "Invalid Department");
    };

    if (
        filteredDepartment === "rma" &&
        !["hw_failure", "sw_failure", "port_issue", "poe_issue","power_issue", "others"]
            .includes(filteredProblemCategory)
    ) {
        throw new ApiError(400, "Invalid Problem Category");
    };

      const isProductDetailsValid = await RegisteredProduct.findOne({
         billNumber: filteredBillNumber,
         productName: filteredProductName,
         modelNumber: filteredModelNumber,
         serialNumber: filteredSerialNumber,
         isDeleted: false,
         endCompanyName: filteredCompanyName
    });

    if(!isProductDetailsValid){
        throw new ApiError(400, "Invalid Product")
    }

    if(isProductDetailsValid.warrantyEndDate <= new Date()){
            throw new ApiError(400, "Product is out of warranty")
        
    };

    let departmentCode;

if(filteredDepartment === "rma"){
    departmentCode = "rma";
} else if(filteredDepartment === "technical_support"){
    departmentCode = "ts";
} else if(filteredDepartment === "general_query"){
    departmentCode = "gq";
} else{
    departmentCode = undefined
};

if(!departmentCode || departmentCode === null || departmentCode === undefined){
    throw new ApiError(400, "Department code is invalid or missing")
};


const existingTicket = await Ticket.findOne({
  serialNumber: filteredSerialNumber,
   ticketStatus: { $ne: "closed" },
    isDeleted: false
});

if (existingTicket) {
  throw new ApiError(400, "A ticket already exists for this serial number");
}

const currentDate = DateTime.now().setZone("Asia/Kolkata");
const year = currentDate.year;
const month = String(currentDate.month).padStart(2, "0");

const ticketCounter = await TicketCounter.findOneAndUpdate(
    { year },
    { $inc: { sequence: 1 }},
    {
        new: true,
        upsert: true,
    }
);

const ticketNumber =
    `${departmentCode}-${year}-${month}-${ticketCounter.sequence}`;


        const createdTicket = await Ticket.create({
ticketNumber: ticketNumber,
issueTitle: filteredIssueTitle,
issueDescription: filteredIssueDescription,
priority: filteredPriority,
department: filteredDepartment,
companyName: isProductDetailsValid.endCompanyName,
customerName: currentUser.fullName,
customerId: currentUser._id,
contactPerson: filteredContactPerson,
contactEmail: filteredContactEmail,
contactNumber: filteredContactNumber,
fullAddress: filteredFullAddress,
state: filteredState,
city: filteredCity,
pincode: filteredPincode,
productName: isProductDetailsValid.productName,
modelNumber: isProductDetailsValid.modelNumber,
serialNumber: isProductDetailsValid.serialNumber,
billNumber: isProductDetailsValid.billNumber,
warrantyEndDate: isProductDetailsValid.warrantyEndDate,
problemCategory: filteredProblemCategory? filteredProblemCategory: null,
productImage: filteredProductImage,
createdBy: currentUser._id,
createdByRole :currentUserRole,
    });

    if(!createdTicket){
        throw new ApiError(500, "Error while creating ticket")
    };

    console.log(createdTicket)
    return res
    .status(201)
    .json(new ApiResponse(201, createdTicket, "Ticket created successfully"))



});


const getAssignableUsersForTicket = asyncHandler(async (req, res)=> {

   const currentUser = req.user;
    if (!currentUser) {
        throw new ApiError(401, "Unauthorized")
    };

    const currentUserRole = currentUser.role;
         if(!currentUserRole){
            throw new ApiError(400, "Error while fetching user role")
         };

          if(!["superadmin", "admin", "engineer", "l1_engineer"].includes(currentUserRole)){
        throw new ApiError(403, "Unauthorized access")
    };

    
     const availableRoles = {
  superadmin: ["admin", "engineer", "l1_engineer"],
  admin: ["admin", "engineer", "l1_engineer"],
};

let assignToUsers;
if(currentUserRole === "superadmin" || currentUserRole === "admin"){
assignToUsers = await User.find({
    role: { $in: availableRoles[currentUserRole] } ,
    isDeleted: false
}).select(
            "_id fullName email phoneNumber companyName"
        )
};


if(currentUserRole === "engineer" || currentUserRole === "l1_engineer"){
    assignToUsers = [{
    _id: currentUser._id,
    fullName: currentUser.fullName,
    email: currentUser.email,
    phoneNumber: currentUser.phoneNumber,
    companyName: currentUser.companyName
}];
};

if(!assignToUsers || assignToUsers.length === 0){
            throw new ApiError(404, "No assignable users found")
};

console.log(assignToUsers);

return res.status(200).json(
        new ApiResponse(
            200,
            assignToUsers,
            "Users fetched successfully"
        )
    );

});


const buildTicketsFilter = async (query = {}) => {

    const {
        search,
        ticketStatus,
        priority,
        department,
        companyName,
        createdBy,
        createdByRole,
        assignedTo,
        serialNumber,
        productName,
        modelNumber,
        billNumber,
        dateFilter,
        startDate,
        endDate
    } = query;

const filteredSearch = search?.trim();
    const filteredTicketStatus = ticketStatus?.trim().toLowerCase();
    const filteredPriority = priority?.trim().toLowerCase();
    const filteredDepartment = department?.trim().toLowerCase();
    const filteredCompanyName = companyName?.trim().toLowerCase();
    const filteredCreatedByRole = createdByRole?.trim().toLowerCase();
    const filteredSerialNumber = serialNumber?.trim().toLowerCase();
    const filteredProductName = productName?.trim().toLowerCase();
    const filteredModelNumber = modelNumber?.trim().toLowerCase();
    const filteredBillNumber = billNumber?.trim().toLowerCase();
    const filteredCreatedBy = createdBy?.trim();
const filteredAssignedTo = assignedTo?.trim();
const filteredDateFilter = dateFilter?.trim().toLowerCase() || "all";
  let filteredStartDate;
    let filteredEndDate;

    const filter = {
         isDeleted: false
    };

    if(filteredTicketStatus && !["open", "in_progress", "resolved", "closed"].includes(filteredTicketStatus)){
        throw new ApiError(400, "Invalid Ticket Status");
    };

    if(filteredPriority && !["high", "medium", "low"].includes(filteredPriority)){
 throw new ApiError(400, "Invalid Priority");
    };

    if(filteredDepartment && !["rma", "technical_support", "general_query"].includes(filteredDepartment)){
         throw new ApiError(400, "Invalid Department");
    };

    if(filteredCreatedByRole && !["superadmin", "admin", "engineer", "l1_engineer", "client"].includes(filteredCreatedByRole)){
 throw new ApiError(400, "Invalid Created by role filter");
    };

    if(filteredDateFilter && !["all", "daily", "weekly", "monthly", "yearly", "custom"].includes(filteredDateFilter)){
  throw new ApiError(400, "Invalid Date Filter");
    };

    if (
    filteredDateFilter !== "custom" &&
    (startDate || endDate)
) {
    throw new ApiError(
        400,
        "startDate and endDate can only be used with custom date filter"
    );
}


if (filteredAssignedTo) {
    if (filteredAssignedTo === "unassigned" || filteredAssignedTo.toLowerCase() === "unassigned") {
        filter.assignedTo = null;
    } else {
        if (!mongoose.Types.ObjectId.isValid(filteredAssignedTo)) {
            throw new ApiError(400, "Invalid assignedToId");
        }

        filter.assignedTo = filteredAssignedTo;
    }
}


if (filteredDateFilter === "custom") {
    if (!startDate || !endDate) {
        throw new ApiError(
            400,
            "startDate and endDate are required for custom date filter"
        );
    }

    filteredStartDate = parseYYYYMMDD(startDate);
    filteredEndDate = parseYYYYMMDD(endDate);

    if (!filteredStartDate || !filteredEndDate) {
        throw new ApiError(
            400,
            "Invalid date format. Expected YYYY-MM-DD"
        );
    }

    if (
        filteredStartDate.toMillis() >
        filteredEndDate.toMillis()
    ) {
        throw new ApiError(
            400,
            "Start date cannot be greater than end date"
        );
    }

    const rangeInDays =
        filteredEndDate.diff(
            filteredStartDate,
            "days"
        ).days + 1;

    if (rangeInDays > 365) {
        throw new ApiError(
            400,
            "Custom date range cannot exceed 365 days"
        );
    }
}

if (filteredSearch) {

    const escapedSearch = filteredSearch.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

    filter.$or = [
        { ticketNumber: { $regex: escapedSearch, $options: "i" } },
        { issueTitle: { $regex: escapedSearch, $options: "i" } },
        { serialNumber: { $regex: escapedSearch, $options: "i" } }
    ];
};

if (filteredTicketStatus) {
    filter.ticketStatus = filteredTicketStatus;
}

if (filteredPriority) {
    filter.priority = filteredPriority;
}

if (filteredDepartment) {
    filter.department = filteredDepartment;
}

if (filteredCompanyName) {
    filter.companyName = filteredCompanyName;
}

if (filteredCreatedByRole) {
    const users = await User.find({
        role: filteredCreatedByRole,
        isDeleted: false,
    }).select("_id");

    const roleUserIds = users.map((user) => user._id);

    filter.$and = [
        ...(filter.$and || []),
        {
            createdBy: {
                $in: roleUserIds,
            },
        },
    ];
}

if (filteredCreatedBy) {
    if (!mongoose.Types.ObjectId.isValid(filteredCreatedBy)) {
        throw new ApiError(400, "Invalid createdById");
    }

    filter.$and = [
        ...(filter.$and || []),
        {
            createdBy: filteredCreatedBy,
        },
    ];
}

if (filteredSerialNumber) {
    filter.serialNumber = filteredSerialNumber;
}

if (filteredProductName) {
    filter.productName = filteredProductName;
}

if (filteredModelNumber) {
    filter.modelNumber = filteredModelNumber;
}

if (filteredBillNumber) {
    filter.billNumber = filteredBillNumber;
}


if (filteredDateFilter !== "all") {
    let start;
    let end;

    const now = DateTime
        .now()
        .setZone(BUSINESS_TIMEZONE);

    switch (filteredDateFilter) {

        case "daily": {
            start = now
                .startOf("day")
                .toUTC()
                .toJSDate();

            end = now
                .startOf("day")
                .plus({ days: 1 })
                .toUTC()
                .toJSDate();

            break;
        }

        case "weekly": {
            start = now
                .startOf("week")
                .toUTC()
                .toJSDate();

            end = now
                .startOf("week")
                .plus({ weeks: 1 })
                .toUTC()
                .toJSDate();

            break;
        }

        case "monthly": {
            start = now
                .startOf("month")
                .toUTC()
                .toJSDate();

            end = now
                .startOf("month")
                .plus({ months: 1 })
                .toUTC()
                .toJSDate();

            break;
        }

        case "yearly": {
            start = now
                .startOf("year")
                .toUTC()
                .toJSDate();

            end = now
                .startOf("year")
                .plus({ years: 1 })
                .toUTC()
                .toJSDate();

            break;
        }

        case "custom": {
            start = filteredStartDate
                .toUTC()
                .toJSDate();

            end = filteredEndDate
                .plus({ days: 1 })
                .toUTC()
                .toJSDate();

            break;
        }
    }

    filter.createdAt = {
        $gte: start,
        $lt: end
    };
}

console.log("FILTERED ASSIGNED TO:", filteredAssignedTo);
console.log("FINAL TICKET FILTER:", filter);

return filter
};

const getAllTicketsByAdminController = asyncHandler(async(req, res)=>{
    
        const currentUser = req.user;
    if (!currentUser) {
        throw new ApiError(401, "Unauthorized")
    };

    const currentUserRole = currentUser.role;
         if(!currentUserRole){
            throw new ApiError(400, "Error while fetching user role")
         };

         
  if(!["superadmin", "admin", "engineer", "l1_engineer"].includes(currentUserRole)){
        throw new ApiError(403, "Unauthorized access")
    };

     const filters = await buildTicketsFilter(req.query);

const page = Math.max(Number(req.query.page) || 1, 1);

const limit = Math.min(
    Math.max(Number(req.query.limit) || 20, 1),
    100
);

const skip = (page - 1) * limit;


const tickets = await Ticket.find(filters)
    .populate("createdBy", "fullName email role")
    .populate("assignedTo", "fullName email role")
    .sort({ createdAt: -1, _id: -1 })
    .skip(skip)
    .limit(limit);

    const totalTickets = await Ticket.countDocuments(filters);
    const totalPages = Math.ceil(totalTickets / limit);

    console.log(tickets);
    
return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
    tickets,
    pagination: {
        page,
        limit,
        totalTickets,
        totalPages
    }
},
            "Tickets fetched successfully"
        ))
});

const getAllTicketsByClientController = asyncHandler(async(req, res)=>{

        
        const currentUser = req.user;
    if (!currentUser) {
        throw new ApiError(401, "Unauthorized")
    };

    const currentUserRole = currentUser.role;
         if(!currentUserRole){
            throw new ApiError(400, "Error while fetching user role")
         };

         const currentUserCompanyName = currentUser?.companyName;
         if(!currentUserCompanyName){
            throw new ApiError(400, "Error while fetching current user's company name")
         };

         const filteredCurrentUserCompanyName = currentUserCompanyName?.trim().toLowerCase();
         if(!filteredCurrentUserCompanyName){
            throw new ApiError(400, "Error while fetching current user's filtered company name")
         };
         
  if(!["client"].includes(currentUserRole)){
        throw new ApiError(403, "Unauthorized access")
    };


const clientQuery = { ...req.query };

delete clientQuery.companyName;
delete clientQuery.createdBy;
delete clientQuery.createdByRole;
delete clientQuery.assignedTo;
   
     const filters = await buildTicketsFilter(clientQuery);
   filters.companyName = filteredCurrentUserCompanyName;

     if(filters.companyName != filteredCurrentUserCompanyName){
        throw new ApiError(400, "Company name dosen't match")
     };

const page = Math.max(Number(req.query.page) || 1, 1);

const limit = Math.min(
    Math.max(Number(req.query.limit) || 20, 1),
    100
);

const skip = (page - 1) * limit;


const tickets = await Ticket.find(filters)
    .sort({ createdAt: -1, _id: -1 })
    .skip(skip)
    .limit(limit);

    const totalTickets = await Ticket.countDocuments(filters);
    const totalPages = Math.ceil(totalTickets / limit);

return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
    tickets,
    pagination: {
        page,
        limit,
        totalTickets,
        totalPages
    }
},
            "Tickets fetched successfully"
        ))

});


export{
getAllClientForTicketController,
getClientByIdController,
getClientsByCompanyName,
getAssignableUsersForTicket,

getRegisteredProductsByCompanyNameController,
getAllCompaniesFromRegisteredProducts,

createTicketByAdminController,
createTicketByClientController,

getAllTicketsByAdminController,
getAllTicketsByClientController,

};