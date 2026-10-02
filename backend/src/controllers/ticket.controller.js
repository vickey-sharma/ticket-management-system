import { DateTime } from "luxon";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Ticket } from "../models/ticket.model.js";
import { TicketCounter } from "../models/ticketCounter.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { parseYYYYMMDD } from "../utils/date.js";
import { BUSINESS_TIMEZONE } from "../utils/date.js";


const createTicketController = asyncHandler(async (req, res) => {

    const currentUser = req.user;
    if (!currentUser) {
        throw new ApiError(401, "Unauthorized")
    };

    const currentUserRole = currentUser.role;
         if(!currentUserRole){
            throw new ApiError(400, "Error while fetching user role")
         };
    
    if(!["admin", "customer"].includes(currentUserRole)){
        throw new ApiError(403, "Unauthorized access")
    };


    const { title, description, priority,  assignedToId  } = req.body;

    const filteredTitle = title?.trim();
    const filteredDescription = description?.trim();
    const filteredPriority = priority?.trim().toLowerCase();
    let filteredAssignedToId = assignedToId?.trim() || null;


    if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof priority !== "string"
) {
    throw new ApiError(400, "Invalid input data");
}

    if (
        !filteredTitle || !filteredDescription || !filteredPriority) {
        throw new ApiError(400, "All required fields are mandatory");
    };



     if (filteredTitle.length > 200) {
        throw new ApiError(400, "Title cannot exceed 200 characters");
    };

    if (!["critical", "high", "medium", "low"].includes(filteredPriority)) {
        throw new ApiError(400, "Invalid Priority");
    };

    if(currentUserRole === "customer"){
        filteredAssignedToId = null;
    };

    if ( filteredAssignedToId && !mongoose.Types.ObjectId.isValid(filteredAssignedToId)) {
        throw new ApiError(400, "Invalid or missing assigned agent");
    };

    if(filteredAssignedToId){
     const assignedUser = await User.findOne({
    _id: filteredAssignedToId,
    role: "agent",
    isDeleted: false
});

if (!assignedUser) {
    throw new ApiError(400, "Ticket can only be assigned to an agent");
}
    };



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
    `${year}-${month}-${ticketCounter.sequence}`;


    const createdTicket = await Ticket.create({
ticketNumber: ticketNumber,
title: filteredTitle,
description: filteredDescription,
priority: filteredPriority,
assignedTo: filteredAssignedToId ? filteredAssignedToId : null,
createdBy: currentUser._id,

    });

    if(!createdTicket){
        throw new ApiError(500, "Error while creating ticket")
    };

    return res
    .status(201)
    .json(new ApiResponse(201, createdTicket, "Ticket created successfully"))
});

const buildTicketsFilter = async (query = {}) => {

    const {
        search,
        status,
        priority,
        createdBy,
        assignedTo,
        dateFilter,
        startDate,
        endDate
    } = query;

const filteredSearch = search?.trim();
    const filteredStatus = status?.trim().toLowerCase();
    const filteredPriority = priority?.trim().toLowerCase();
    const filteredCreatedBy = createdBy?.trim();
const filteredAssignedTo = assignedTo?.trim();
const filteredDateFilter = dateFilter?.trim().toLowerCase() || "all";
  let filteredStartDate;
    let filteredEndDate;

    const filter = {
         isDeleted: false
    };

    if(filteredStatus && !["open", "in_progress", "resolved", "closed"].includes(filteredStatus)){
        throw new ApiError(400, "Invalid Ticket Status");
    };

    if(filteredPriority && !["critical", "high", "medium", "low"].includes(filteredPriority)){
 throw new ApiError(400, "Invalid Priority");
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
        { title: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } }
    ];
};

if (filteredStatus) {
    filter.status = filteredStatus;
}

if (filteredPriority) {
    filter.priority = filteredPriority;
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

         
  if(currentUserRole !== "admin"){
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

const getAllTicketsByCustomerController = asyncHandler(async(req, res)=>{

        
        const currentUser = req.user;
    if (!currentUser) {
        throw new ApiError(401, "Unauthorized")
    };

    const currentUserRole = currentUser.role;
         if(!currentUserRole){
            throw new ApiError(400, "Error while fetching user role")
         };

         
  if(!["customer"].includes(currentUserRole)){
        throw new ApiError(403, "Unauthorized access")
    };


const customerQuery = { ...req.query };
delete customerQuery.createdBy;
delete customerQuery.assignedTo;
   
     const filters = await buildTicketsFilter(customerQuery);
filters.createdBy = currentUser._id;
if (!filters.createdBy.equals(currentUser._id)) {
    throw new ApiError(401, "Error while getting current user details");
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

const getAllTicketsByAgentController = asyncHandler(async(req, res)=>{

       
        const currentUser = req.user;
    if (!currentUser) {
        throw new ApiError(401, "Unauthorized")
    };

    const currentUserRole = currentUser.role;
         if(!currentUserRole){
            throw new ApiError(400, "Error while fetching user role")
         };

         
  if(!["agent"].includes(currentUserRole)){
        throw new ApiError(403, "Unauthorized access")
    };


    const agentQuery = { ...req.query };
delete agentQuery.createdBy;
delete agentQuery.assignedTo;
   
     const filters = await buildTicketsFilter(agentQuery);
filters.assignedTo = currentUser._id;
if (!filters.assignedTo.equals(currentUser._id)) {
    throw new ApiError(401, "Error while getting current assigned tickets");
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


const assignTicketController = asyncHandler(async(req,res)=>{
      const currentUser = req.user;
    if (!currentUser) {
        throw new ApiError(401, "Unauthorized")
    };

    const currentUserRole = currentUser.role;
         if(!currentUserRole){
            throw new ApiError(400, "Error while fetching user role")
         };

         
  if(currentUserRole !== "admin"){
        throw new ApiError(403, "Unauthorized access")
    };

    const { ticketId } = req.params;
const { assignedToId } = req.body;

const filteredTicketId = ticketId?.trim();
const filteredAssignedToId = assignedToId?.trim();

if(!filteredAssignedToId || !filteredTicketId){
    throw new ApiError(400, "All fields are required")
};

if (
    !mongoose.Types.ObjectId.isValid(filteredTicketId) ||
    !mongoose.Types.ObjectId.isValid(filteredAssignedToId)
) {
    throw new ApiError(400, "Invalid TicketId or AgentId");
}

const isTicketIdValid = await Ticket.findById(filteredTicketId);
const isAssignedToIdValid = await User.findOne({
    _id: filteredAssignedToId,
    role: "agent",
    isDeleted: false
});

if(!isTicketIdValid || !isAssignedToIdValid ){
    throw new ApiError(400, "Invalid TicketId or AgentId")
};

 isTicketIdValid.assignedTo = filteredAssignedToId;
 await isTicketIdValid.save();

   return res
    .status(200)
    .json(new ApiResponse(200, {ticket: isTicketIdValid}, "Ticket assigned/reassigned successfully"))
});

const updateTicketController = asyncHandler(async(req, res)=>{

      const currentUser = req.user;
    if (!currentUser) {
        throw new ApiError(401, "Unauthorized")
    };

    const currentUserRole = currentUser.role;
         if(!currentUserRole){
            throw new ApiError(400, "Error while fetching user role")
         };

         
  if(!["admin", "agent"].includes(currentUserRole)){
        throw new ApiError(403, "Unauthorized access")
    };


        const { ticketId } = req.params;

const filteredTicketId = ticketId?.trim();

if(!filteredTicketId){
    throw new ApiError(400, "TicketId is required")
};

if (!mongoose.Types.ObjectId.isValid(filteredTicketId)) {
    throw new ApiError(400, "Invalid TicketId");
}

const { title, description, priority, assignedToId, status } = req.body;

const filteredTitle = title?.trim();
const filteredDescription = description?.trim();
const filteredPriority = priority?.trim().toLowerCase();
const filteredAssignedToId = assignedToId?.trim();
const filteredStatus = status?.trim().toLowerCase();

if(!filteredTitle || !filteredDescription || !filteredPriority || !filteredStatus){
    throw new ApiError(400, "All fields are required")
};

if(currentUserRole === "admin" && !filteredAssignedToId){
     throw new ApiError(400, "assigned To User is required")
}

  if (filteredTitle.length > 200) {
        throw new ApiError(400, "Title cannot exceed 200 characters");
    };
    if (!["critical", "high", "medium", "low"].includes(filteredPriority)) {
        throw new ApiError(400, "Invalid Priority");
    };
    if (!["open", "in_progress", "resolved", "closed"].includes(filteredStatus)) {
        throw new ApiError(400, "Invalid Status");
    };
  
    let isAssignedToIdValid = null;
    if(currentUserRole === "admin"){
          if (!mongoose.Types.ObjectId.isValid(filteredAssignedToId)) {
    throw new ApiError(400, "Invalid Assigned To Id");
};


isAssignedToIdValid = await User.findOne({
    _id: filteredAssignedToId,
    role: "agent",
    isDeleted: false
});
if(!isAssignedToIdValid){
    throw new ApiError(400, "Invalid Agent UserId")
};
    }

let isTicketIdValid;
if(currentUserRole === "admin"){
    isTicketIdValid = await Ticket.findById(filteredTicketId);
if(!isTicketIdValid){
   throw new ApiError(404, "Ticket not found");
};
} else{
    isTicketIdValid = await Ticket.findOne({
        _id: filteredTicketId,
        assignedTo: currentUser._id
    });
if(!isTicketIdValid){
   throw new ApiError(404, "Ticket not found or not assigned to you");
};   
}

if(isTicketIdValid){
    isTicketIdValid.title = filteredTitle;
isTicketIdValid.description = filteredDescription;
isTicketIdValid.priority = filteredPriority;
isTicketIdValid.status = filteredStatus;

if(currentUserRole === "admin"){
isTicketIdValid.assignedTo = isAssignedToIdValid._id;
};
await isTicketIdValid.save();
}

 return res
    .status(200)
    .json(new ApiResponse(200, { ticket: isTicketIdValid }, "Ticket updated successfully"))
});

const deleteTicketController = asyncHandler(async(req, res)=>{

      const currentUser = req.user;
    if (!currentUser) {
        throw new ApiError(401, "Unauthorized")
    };

    const currentUserRole = currentUser.role;
         if(!currentUserRole){
            throw new ApiError(400, "Error while fetching user role")
         };

         
  if(currentUserRole !== "admin"){
        throw new ApiError(403, "Unauthorized access")
    };


        const { ticketId } = req.params;

const filteredTicketId = ticketId?.trim();

if(!filteredTicketId){
    throw new ApiError(400, "TicketId is required")
};

if (!mongoose.Types.ObjectId.isValid(filteredTicketId)) {
    throw new ApiError(400, "Invalid TicketId");
}

const isTicketIdValid = await Ticket.findById(filteredTicketId);
if(!isTicketIdValid){
   throw new ApiError(404, "Ticket not found");
};

isTicketIdValid.isDeleted = true;
isTicketIdValid.deletedAt = new Date();
await isTicketIdValid.save();


  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Ticket deleted successfully"))
});



export{

createTicketController,
getAllTicketsByAdminController,
getAllTicketsByCustomerController,
getAllTicketsByAgentController,
assignTicketController,
updateTicketController,
deleteTicketController

};