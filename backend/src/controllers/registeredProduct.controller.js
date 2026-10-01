import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { RegisteredProduct } from "../models/registeredProduct.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

import fs from "fs";
import path from "path";

import { DateTime } from "luxon";
import { BUSINESS_TIMEZONE, parseDDMMYYYY, parseYYYYMMDD } from "../utils/date.js";

import { RegisteredProductUpload } from "../models/registeredProductUpload.model.js";
import { readExcelFile, validateExcelHeaders, validateExcelRow, transformExcelRow, generateRegisteredProductsExcel } from "../utils/excel/registeredProductExcel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";



const createRegisteredProduct = asyncHandler(async(req, res)=> {

     const currentUser = req.user;
     if(!currentUser){
        throw new ApiError(401, "Unauthorized");
     };

     const currentUserRole = currentUser.role;
     if(!currentUserRole){
        throw new ApiError(400, "Error while fetching user role")
     };

if(!["superadmin", "admin"].includes(currentUserRole)){
    throw new ApiError(403, "Unauthorized access")
}

const { billNumber, billDate, billCompanyName, endCompanyName, productName, modelNumber, serialNumber, warrantyEndDate  } = req.body;

const filteredBillNumber = billNumber?.trim();

const filteredBillCompanyName = billCompanyName?.trim().toLowerCase();
const filteredEndCompanyName = endCompanyName?.trim().toLowerCase();
const filteredProductName = productName?.trim();
const filteredModelNumber = modelNumber?.trim();
const filteredSerialNumber = serialNumber?.trim();



const formattedBillDate = billDate
    ?.split("-")
    .reverse()
    .join("-");

const formattedWarrantyEndDate = warrantyEndDate
    ?.split("-")
    .reverse()
    .join("-");

console.log("BILL DATE RECEIVED:", formattedBillDate);
console.log("WARRANTY DATE RECEIVED:", formattedWarrantyEndDate);

const filteredBillDate = parseDDMMYYYY(formattedBillDate);
const filteredWarrantyEndDate = parseDDMMYYYY(formattedWarrantyEndDate);

console.log("BILL DATE RECEIVED:", filteredBillDate);
console.log("WARRANTY DATE RECEIVED:", filteredWarrantyEndDate);

// if (isNaN(filteredBillDate.getTime())) {
//     throw new ApiError(400, "Invalid or missing bill date");
// }

// if (isNaN(filteredWarrantyEndDate.getTime())) {
//     throw new ApiError(400, "Invalid or missing warranty end date");
// }

// if (filteredWarrantyEndDate <= filteredBillDate) {
//     throw new ApiError(400, "Warranty end date cannot be before bill date");
// }

if (!filteredBillDate) {
    throw new ApiError(
        400,
        "Invalid or missing bill date. Expected DD-MM-YYYY"
    );
}

if (!filteredWarrantyEndDate) {
    throw new ApiError(
        400,
        "Invalid or missing warranty end date. Expected DD-MM-YYYY"
    );
}



if (
    filteredWarrantyEndDate.toMillis() <=
    filteredBillDate.toMillis()
) {
    throw new ApiError(
        400,
        "Warranty end date must be after bill date"
    );
}

if(!filteredBillNumber || !filteredBillCompanyName || !filteredEndCompanyName || !filteredProductName || !filteredModelNumber || !filteredSerialNumber){
     throw new ApiError(400, "Bill number, bill company name, product name, model number and serial number are required");
};


const existingProduct = await RegisteredProduct.findOne({
        $or: [
        { serialNumber: filteredSerialNumber },
        { "serviceHistory.toSerialNumber": filteredSerialNumber },
         { "serviceHistory.fromSerialNumber": filteredSerialNumber },
        // { billNumber: filteredBillNumber}
    ],
    isDeleted: false,
});

if (existingProduct) {
    throw new ApiError(409, "Serial number already exists");
}

const registeredProduct = await RegisteredProduct.create({
    billNumber: filteredBillNumber,
    //  billDate: filteredBillDate,
       billDate: filteredBillDate
        .toUTC()
        .toJSDate(),
    billCompanyName: filteredBillCompanyName,
    endCompanyName: filteredEndCompanyName,
    productName: filteredProductName,
    modelNumber: filteredModelNumber,
    serialNumber: filteredSerialNumber,
    // warrantyEndDate: filteredWarrantyEndDate,
       warrantyEndDate: filteredWarrantyEndDate
        .toUTC()
        .toJSDate(),
    createdBy: currentUser._id
});

return res
.status(201)
.json(new ApiResponse(201, registeredProduct, "Product has been registered successfully"))
});

// const getAllRegisteredProducts = asyncHandler(async(req, res)=> {

//          const currentUser = req.user;
//      if(!currentUser){
//         throw new ApiError(401, "Unauthorized");
//      };

//      const currentUserRole = currentUser.role;
//      if(!currentUserRole){
//         throw new ApiError(400, "Error while fetching user role")
//      };

// if(!["superadmin", "admin", "engineer", "l1_engineer", "sales_manager"].includes(currentUserRole)){
//     throw new ApiError(403, "Unauthorized access")
// }

// const {
//     page = 1,
//     limit = 10,
//     search,
//     billCompanyName,
//     endCompanyName,
//     productName,
//     modelNumber,
//     serialNumber,
//     billNumber,
//     productStatus,
//     dateFilter,
//     startDate,
//     endDate
// } = req.query;


// const escapeRegex = (value = "") => {
//     return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// };

// const escapedSearch = search?.trim()
//     ? escapeRegex(search.trim())
//     : "";

// const escapedBillCompanyName = billCompanyName?.trim()
//     ? escapeRegex(billCompanyName.trim())
//     : "";

// const escapedEndCompanyName = endCompanyName?.trim()
//     ? escapeRegex(endCompanyName.trim())
//     : "";

// const escapedProductName = productName?.trim()
//     ? escapeRegex(productName.trim())
//     : "";

// const escapedModelNumber = modelNumber?.trim()
//     ? escapeRegex(modelNumber.trim())
//     : "";

// const escapedSerialNumber = serialNumber?.trim()
//     ? escapeRegex(serialNumber.trim())
//     : "";

// const escapedBillNumber = billNumber?.trim()
//     ? escapeRegex(billNumber.trim())
//     : "";

// const filteredProductStatus =
//     typeof productStatus === "string" && productStatus.trim()
//         ? productStatus.trim().toLowerCase()
//         : "all";
// const allowedStatuses = ["all", "new", "repair", "replaced"];

// if(!allowedStatuses.includes(filteredProductStatus)){
//       throw new ApiError(
//         400,
//         "Invalid Product Status"
//     );
// }

// const filteredDateFilter =
//     typeof dateFilter === "string" && dateFilter.trim()
//         ? dateFilter.trim().toLowerCase()
//         : "all";
// const allowedDateFilters = ["all", "daily", "weekly", "monthly", "yearly", "custom"];

// let filteredStartDate;
// let filteredEndDate;


// // const parseDDMMYYYY = (value) => {
// //     if (!value || typeof value !== "string") {
// //         return null;
// //     }

// //     const trimmedValue = value.trim();

// //     const match = trimmedValue.match(
// //         /^(\d{2})-(\d{2})-(\d{4})$/
// //     );

// //     if (!match) {
// //         return null;
// //     }

// //     const day = Number(match[1]);
// //     const month = Number(match[2]);
// //     const year = Number(match[3]);

// //     const dateTime = DateTime.fromObject(
// //         {
// //             year,
// //             month,
// //             day
// //         },
// //         {
// //             zone: BUSINESS_TIMEZONE
// //         }
// //     );

// //     if (!dateTime.isValid) {
// //         return null;
// //     }

// //     return dateTime.startOf("day");
// // };

// if (!allowedDateFilters.includes(filteredDateFilter)) {
//     throw new ApiError(
//         400,
//         "Invalid date filter. Use all, daily, weekly, monthly, yearly, or custom"
//     );
// }

// if (filteredDateFilter !== "custom" && (startDate || endDate)) {
//     throw new ApiError(
//         400,
//         "startDate and endDate can only be used with custom date filter"
//     );
// }

// if (filteredDateFilter === "custom") {
//     if (!startDate || !endDate) {
//         throw new ApiError(
//             400,
//             "startDate and endDate are required for custom date filter"
//         );
//     }

//     filteredStartDate = parseDDMMYYYY(startDate);
//     filteredEndDate = parseDDMMYYYY(endDate);

//     if (!filteredStartDate || !filteredEndDate) {
//         throw new ApiError(
//             400,
//             "Invalid date format. Expected DD-MM-YYYY"
//         );
//     }

//   if (filteredStartDate.toMillis() > filteredEndDate.toMillis()) {
//         throw new ApiError(
//             400,
//             "Start date cannot be greater than end date"
//         );
//     }

//  const rangeInDays =
//     filteredEndDate.diff(filteredStartDate, "days").days + 1;

// if (rangeInDays > 365) {
//     throw new ApiError(
//         400,
//         "Custom date range cannot exceed 365 days"
//     );
// }
// };


// const filter = {
//     isDeleted: false
// };


// if (escapedBillCompanyName) {
//     filter.billCompanyName = {
//         $regex: escapedBillCompanyName,
//         $options: "i"
//     };
// }

// if (escapedEndCompanyName) {
//     filter.endCompanyName = {
//         $regex: escapedEndCompanyName,
//         $options: "i"
//     };
// }

// if (escapedProductName) {
//     filter.productName = {
//         $regex: escapedProductName,
//         $options: "i"
//     };
// }

// if (escapedModelNumber) {
//     filter.modelNumber = {
//         $regex: escapedModelNumber,
//         $options: "i"
//     };
// }

// if (escapedSerialNumber) {
//     filter.serialNumber = {
//         $regex: escapedSerialNumber,
//         $options: "i"
//     };
// }

// if (escapedBillNumber) {
//     filter.billNumber = {
//         $regex: escapedBillNumber,
//         $options: "i",
//     };
// }


// if (filteredDateFilter !== "all") {
//     let start;
//     let end;

//     const now = DateTime.now().setZone(BUSINESS_TIMEZONE);

//     switch (filteredDateFilter) {
//         case "daily": {
//             start = now
//                 .startOf("day")
//                 .toUTC()
//                 .toJSDate();

//             end = now
//                 .startOf("day")
//                 .plus({ days: 1 })
//                 .toUTC()
//                 .toJSDate();

//             break;
//         }

//         case "weekly": {
//             start = now
//                 .startOf("week")
//                 .toUTC()
//                 .toJSDate();

//             end = now
//                 .startOf("week")
//                 .plus({ weeks: 1 })
//                 .toUTC()
//                 .toJSDate();

//             break;
//         }

//         case "monthly": {
//             start = now
//                 .startOf("month")
//                 .toUTC()
//                 .toJSDate();

//             end = now
//                 .startOf("month")
//                 .plus({ months: 1 })
//                 .toUTC()
//                 .toJSDate();

//             break;
//         }

//         case "yearly": {
//             start = now
//                 .startOf("year")
//                 .toUTC()
//                 .toJSDate();

//             end = now
//                 .startOf("year")
//                 .plus({ years: 1 })
//                 .toUTC()
//                 .toJSDate();

//             break;
//         }

//        case "custom": {

//     start = filteredStartDate
//         .toUTC()
//         .toJSDate();

//     end = filteredEndDate
//         .plus({ days: 1 })
//         .toUTC()
//         .toJSDate();

//     break;
// }
//     }

//     filter.billDate = {
//         $gte: start,
//         $lt: end
//     };
// }

// if (escapedSearch) {
//     filter.$or = [
//         {
//             billNumber: {
//                 $regex: escapedSearch,
//                 $options: "i"
//             }
//         },
//         {
//             serialNumber: {
//                 $regex: escapedSearch,
//                 $options: "i"
//             }
//         },
//         {
//             billCompanyName: {
//                 $regex: escapedSearch,
//                 $options: "i"
//             }
//         },
//          {
//             endCompanyName: {
//                 $regex: escapedSearch,
//                 $options: "i"
//             }
//         },
//         {
//             productName: {
//                 $regex: escapedSearch,
//                 $options: "i"
//             }
//         },
//         {
//             modelNumber: {
//                 $regex: escapedSearch,
//                 $options: "i"
//             }
//         }
//     ];
// };


// const parsedPage = Number(page);
// const parsedLimit = Number(limit);

// if (!Number.isInteger(parsedPage) || parsedPage < 1) {
//     throw new ApiError(
//         400,
//         "Page must be a positive integer"
//     );
// }

// if (
//     !Number.isInteger(parsedLimit) ||
//     parsedLimit < 1 ||
//     parsedLimit > 100
// ) {
//     throw new ApiError(
//         400,
//         "Limit must be an integer between 1 and 100"
//     );
// }

// const currentPage = parsedPage;
// const currentLimit = parsedLimit;

// const skip = (currentPage - 1) * currentLimit;


// const [registeredProducts, totalProducts] = await Promise.all([
//     RegisteredProduct.find(filter)
//         .populate({
//             path: "serviceHistory.performedBy",
//             select: {
//                 fullName: 1,
//                 email: 1,
//                 role: 1,
//             },
//         })
//         .populate({
//             path: "serviceHistory.createdBy",
//             select: {
//                 fullName: 1,
//                 email: 1,
//                 role: 1,
//             },
//         })
//         .sort({ createdAt: -1, _id: -1 })
//         .skip(skip)
//         .limit(currentLimit),

//     RegisteredProduct.countDocuments(filter)
// ]);

// return res.status(200).json(
//     new ApiResponse(200, {
//         registeredProducts,

//         pagination: {
//             currentPage,
//             limit: currentLimit,
//             totalProducts,
//             totalPages: Math.ceil(totalProducts / currentLimit)
//         }
//     }, "Products fetched successfully")
// );
// });

const buildRegisteredProductsFilter = ( query={} ) => {

    const {
        search,
        billCompanyName,
        endCompanyName,
        productName,
        modelNumber,
        serialNumber,
        billNumber,
        productStatus,
        dateFilter,
        startDate,
        endDate
    } = query;


const escapeRegex = (value = "") => {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};


    const escapedSearch = search?.trim()
        ? escapeRegex(search.trim())
        : "";

    const escapedBillCompanyName = billCompanyName?.trim()
        ? escapeRegex(billCompanyName.trim())
        : "";

    const escapedEndCompanyName = endCompanyName?.trim()
        ? escapeRegex(endCompanyName.trim())
        : "";

    const escapedProductName = productName?.trim()
        ? escapeRegex(productName.trim())
        : "";

    const escapedModelNumber = modelNumber?.trim()
        ? escapeRegex(modelNumber.trim())
        : "";

    const escapedSerialNumber = serialNumber?.trim()
        ? escapeRegex(serialNumber.trim())
        : "";

    const escapedBillNumber = billNumber?.trim()
        ? escapeRegex(billNumber.trim())
        : "";


    const filteredProductStatus =
        typeof productStatus === "string" && productStatus.trim()
            ? productStatus.trim().toLowerCase()
            : "all";

    const allowedStatuses = [
        "all",
        "new",
        "repaired",
        "replaced"
    ];

    if (!allowedStatuses.includes(filteredProductStatus)) {
        throw new ApiError(
            400,
            "Invalid Product Status"
        );
    }


    const filteredDateFilter =
        typeof dateFilter === "string" && dateFilter.trim()
            ? dateFilter.trim().toLowerCase()
            : "all";

    const allowedDateFilters = [
        "all",
        "daily",
        "weekly",
        "monthly",
        "yearly",
        "custom"
    ];

    if (!allowedDateFilters.includes(filteredDateFilter)) {
        throw new ApiError(
            400,
            "Invalid date filter. Use all, daily, weekly, monthly, yearly, or custom"
        );
    }


    let filteredStartDate;
    let filteredEndDate;


    if (
        filteredDateFilter !== "custom" &&
        (startDate || endDate)
    ) {
        throw new ApiError(
            400,
            "startDate and endDate can only be used with custom date filter"
        );
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


    const filter = {
        isDeleted: false
    };


    if (escapedBillCompanyName) {
        filter.billCompanyName = {
            $regex: escapedBillCompanyName,
            $options: "i"
        };
    }


    if (escapedEndCompanyName) {
        filter.endCompanyName = {
            $regex: escapedEndCompanyName,
            $options: "i"
        };
    }


    if (escapedProductName) {
        filter.productName = {
            $regex: escapedProductName,
            $options: "i"
        };
    }


    if (escapedModelNumber) {
        filter.modelNumber = {
            $regex: escapedModelNumber,
            $options: "i"
        };
    }


    if (escapedSerialNumber) {
        filter.serialNumber = {
            $regex: escapedSerialNumber,
            $options: "i"
        };
    }


    if (escapedBillNumber) {
        filter.billNumber = {
            $regex: escapedBillNumber,
            $options: "i"
        };
    }


    if (filteredProductStatus !== "all") {
        filter.productStatus = filteredProductStatus;
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


        filter.billDate = {
            $gte: start,
            $lt: end
        };
    }


    if (escapedSearch) {

        filter.$or = [

            {
                billNumber: {
                    $regex: escapedSearch,
                    $options: "i"
                }
            },

            {
                serialNumber: {
                    $regex: escapedSearch,
                    $options: "i"
                }
            },

            {
                billCompanyName: {
                    $regex: escapedSearch,
                    $options: "i"
                }
            },

            {
                endCompanyName: {
                    $regex: escapedSearch,
                    $options: "i"
                }
            },

            {
                productName: {
                    $regex: escapedSearch,
                    $options: "i"
                }
            },

            {
                modelNumber: {
                    $regex: escapedSearch,
                    $options: "i"
                }
            }
        ];
    }


    console.log(
    "REGISTERED PRODUCTS FILTER:",
    JSON.stringify(filter, null, 2)
);

console.log(
    "BILL DATE TYPE:",
    filter.billDate?.$gte instanceof Date,
    filter.billDate?.$lt instanceof Date
);

    return filter;
};



const getAllRegisteredProducts = asyncHandler(async (req, res) => {

    const currentUser = req.user;

    if (!currentUser) {
        throw new ApiError(401, "Unauthorized");
    }

    const currentUserRole = currentUser.role;

    if (!currentUserRole) {
        throw new ApiError(
            400,
            "Error while fetching user role"
        );
    }

    if (
        ![
            "superadmin",
            "admin",
            "engineer",
            "l1_engineer",
            "sales_manager"
        ].includes(currentUserRole)
    ) {
        throw new ApiError(403, "Unauthorized access");
    }


    const {
        page = 1,
        limit = 10
    } = req.query;


    const filter = buildRegisteredProductsFilter(req.query);

    console.log(
    "REQ.QUERY FROM FRONTEND:",
    JSON.stringify(req.query, null, 2)
);

console.log(
    "FILTER:",
    JSON.stringify(filter, null, 2)
);

    const parsedPage = Number(page);

    const parsedLimit = Number(limit);


    if (
        !Number.isInteger(parsedPage) ||
        parsedPage < 1
    ) {
        throw new ApiError(
            400,
            "Page must be a positive integer"
        );
    }


    if (
        !Number.isInteger(parsedLimit) ||
        parsedLimit < 1 ||
        parsedLimit > 100
    ) {
        throw new ApiError(
            400,
            "Limit must be an integer between 1 and 100"
        );
    }


    const currentPage = parsedPage;

    const currentLimit = parsedLimit;

    const skip =
        (currentPage - 1) * currentLimit;


        console.log(
    "DATE FILTER RANGE:",
    filter.billDate?.$gte,
    "TO",
    filter.billDate?.$lt
);

const dateTestProducts = await RegisteredProduct.find(
    filter.billDate
        ? { billDate: filter.billDate }
        : {}
)
    .select({
        billNumber: 1,
        billDate: 1,
        productName: 1,
    })
    .limit(20)
    .lean();

console.log(
    "DATE TEST PRODUCTS:",
    JSON.stringify(dateTestProducts, null, 2)
);

    const [
        registeredProducts,
        totalProducts
    ] = await Promise.all([

        RegisteredProduct.find(filter)

            .populate({
                path: "serviceHistory.performedBy",
                select: {
                    fullName: 1,
                    email: 1,
                    role: 1,
                },
            })

            .populate({
                path: "serviceHistory.createdBy",
                select: {
                    fullName: 1,
                    email: 1,
                    role: 1,
                },
            })

            .sort({
                createdAt: -1,
                _id: -1
            })

            .skip(skip)
            .limit(currentLimit),


        RegisteredProduct.countDocuments(filter)

    ]);


    return res.status(200).json(

        new ApiResponse(
            200,
            {
                registeredProducts,

                pagination: {
                    currentPage,
                    limit: currentLimit,
                    totalProducts,
                    totalPages:
                        Math.ceil(
                            totalProducts /
                            currentLimit
                        )
                }
            },

            "Products fetched successfully"
        )

    );

});

const downloadRegisteredProductsExcel = asyncHandler(async (req, res) => {

    const currentUser = req.user;

     console.log("DOWNLOAD REQ.QUERY:", req.query);


    if (!currentUser) {
        throw new ApiError(401, "Unauthorized");
    }

    const currentUserRole = currentUser.role;

    if (!currentUserRole) {
        throw new ApiError(
            400,
            "Error while fetching user role"
        );
    }

    if (
        ![
            "superadmin",
            "admin",
            "engineer",
            "l1_engineer",
            "sales_manager"
        ].includes(currentUserRole)
    ) {
        throw new ApiError(403, "Unauthorized access");
    }


    const filter =
        buildRegisteredProductsFilter(req.query);

  console.log(
        "DOWNLOAD FILTER:",
        JSON.stringify(filter, null, 2)
    );
    // const totalProducts =
    //     await RegisteredProduct.countDocuments(filter);


   


    const registeredProducts =
        await RegisteredProduct.find(filter)
            .sort({
                createdAt: -1,
                _id: -1
            })
            .lean();


             if (registeredProducts.length === 0) {
        throw new ApiError(
            404,
            "No registered products found for the selected filters"
        );
    }


    const workbookBuffer =
       await generateRegisteredProductsExcel(
            registeredProducts
        );


    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
        "Content-Disposition",
        'attachment; filename="registered-products.xlsx"'
    );


    return res.status(200).send(workbookBuffer);

});

const getRegisteredProductBySerialNumber = asyncHandler(async(req, res)=> {
    
         const currentUser = req.user;
     if(!currentUser){
        throw new ApiError(401, "Unauthorized");
     };

     const currentUserRole = currentUser.role;
     if(!currentUserRole){
        throw new ApiError(400, "Error while fetching user role")
     };

if(!["superadmin", "admin", "engineer", "l1_engineer", "sales_manager", "client"].includes(currentUserRole)){
    throw new ApiError(403, "Unauthorized access")
}

const { serialNumber } = req.params;
const filteredSerialNumber = serialNumber?.trim();
if(!filteredSerialNumber){
throw new ApiError(422, "Invalid serial number")
};


const registeredProduct = await RegisteredProduct.findOne({
        $or: [
        { serialNumber: filteredSerialNumber },
        { "serviceHistory.toSerialNumber": filteredSerialNumber },
         { "serviceHistory.fromSerialNumber": filteredSerialNumber },
    ],
    isDeleted: false,
})
.populate({
  path: "createdBy",
  select: {
    fullName: 1,
    email: 1,
    role: 1,
  },
})
.populate({
    path: "updatedBy.user",
    select: {
     fullName: 1,
    email: 1,
    role: 1,   
    }
})
.populate({
    path: "serviceHistory.performedBy",
      select: {
     fullName: 1,
    email: 1,
    role: 1,   
    }
})
.populate({
    path: "serviceHistory.createdBy",
      select: {
     fullName: 1,
    email: 1,
    role: 1,   
    }
});


if(!registeredProduct){
throw new ApiError(404, "Registered Product with this serial number not found")
};

registeredProduct.serviceHistory.sort(
    (a, b) => b.performedAt - a.performedAt
);

return res
.status(200)
.json(new ApiResponse(200, registeredProduct, "Registered product fetched successfully"));
});

const updateRegisteredProduct = asyncHandler(async(req, res)=> {
     
       const currentUser = req.user;
     if(!currentUser){
        throw new ApiError(401, "Unauthorized");
     };

     const currentUserRole = currentUser.role;
     if(!currentUserRole){
        throw new ApiError(400, "Error while fetching user role")
     };

if(!["superadmin", "admin"].includes(currentUserRole)){
    throw new ApiError(403, "Unauthorized access")
}

const currentSerialNumber = req.params.serialNumber?.trim();

if (!currentSerialNumber) {
    throw new ApiError(422, "Invalid serial number");
}

const { billNumber, billDate, billCompanyName, endCompanyName, productName, modelNumber, serialNumber, warrantyEndDate,
 } = req.body;

const filteredBillNumber = billNumber?.trim();
const filteredBillCompanyName = billCompanyName?.trim().toLowerCase();
const filteredEndCompanyName = endCompanyName?.trim().toLowerCase() || null;
const filteredProductName = productName?.trim();
const filteredModelNumber = modelNumber?.trim();
const filteredSerialNumber = serialNumber?.trim();
// const filteredBillDate = new Date(billDate);
// const filteredWarrantyEndDate = new Date(warrantyEndDate);
const filteredBillDate = parseDDMMYYYY(billDate);
const filteredWarrantyEndDate = parseDDMMYYYY(warrantyEndDate);

// if (isNaN(filteredBillDate.getTime())) {
//     throw new ApiError(400, "Invalid bill date");
// }

// if (isNaN(filteredWarrantyEndDate.getTime())) {
//     throw new ApiError(400, "Invalid or missing warranty end date");
// }

// if (filteredWarrantyEndDate < filteredBillDate) {
//     throw new ApiError(400, "Warranty end date cannot be before bill date");
// }

if (!filteredBillDate) {
    throw new ApiError(
        400,
        "Invalid or missing bill date. Expected DD-MM-YYYY"
    );
}

if (!filteredWarrantyEndDate) {
    throw new ApiError(
        400,
        "Invalid or missing warranty end date. Expected DD-MM-YYYY"
    );
}

if (
    filteredWarrantyEndDate.toMillis() <=
    filteredBillDate.toMillis()
) {
    throw new ApiError(
        400,
        "Warranty end date must be after bill date"
    );
}

if(!filteredBillNumber || !filteredBillCompanyName|| !filteredProductName || !filteredModelNumber || !filteredSerialNumber){
     throw new ApiError(400,  "Bill number, bill company name, product name, serial number and model number are required")
};

if (currentSerialNumber !== filteredSerialNumber) {
    const serialNumberAlreadyExists = await RegisteredProduct.findOne({
         $or: [
        { serialNumber: filteredSerialNumber },
        { "serviceHistory.toSerialNumber": filteredSerialNumber },
         { "serviceHistory.fromSerialNumber": filteredSerialNumber },
    ],
    isDeleted: false,
    });

    if (serialNumberAlreadyExists) {
        throw new ApiError(409, "Serial number already exists");
    }
}


const registeredProduct = await RegisteredProduct.findOne({
    serialNumber: currentSerialNumber,
    isDeleted: false,
    
})
.populate({
  path: "createdBy",
  select: {
    fullName: 1,
    email: 1,
    role: 1,
  },
})
.populate({
    path: "updatedBy.user",
    select: {
     fullName: 1,
    email: 1,
    role: 1,   
    }
})
.populate({
    path: "serviceHistory.performedBy",
      select: {
     fullName: 1,
    email: 1,
    role: 1,   
    }
});;

if (!registeredProduct) {
    throw new ApiError(404, "Registered product not found");
}

const isChanged =
    registeredProduct.billNumber !== filteredBillNumber ||
    // registeredProduct.billDate.getTime() !== filteredBillDate.getTime() ||
    registeredProduct.billDate.getTime() !== filteredBillDate.toUTC().toJSDate().getTime() ||
    registeredProduct.billCompanyName !== filteredBillCompanyName ||
    registeredProduct.endCompanyName !== filteredEndCompanyName ||
    registeredProduct.productName !== filteredProductName ||
    registeredProduct.modelNumber !== filteredModelNumber ||
    // registeredProduct.warrantyEndDate.getTime() !== filteredWarrantyEndDate.getTime() ||
    registeredProduct.warrantyEndDate.getTime() !== filteredWarrantyEndDate.toUTC().toJSDate().getTime() ||
    registeredProduct.serialNumber !== filteredSerialNumber;

    if(isChanged){
registeredProduct.billNumber = filteredBillNumber;
registeredProduct.billDate = filteredBillDate.toUTC().toJSDate();
registeredProduct.billCompanyName = filteredBillCompanyName;
registeredProduct.endCompanyName = filteredEndCompanyName;
registeredProduct.productName = filteredProductName;
registeredProduct.modelNumber = filteredModelNumber;
registeredProduct.serialNumber = filteredSerialNumber;
registeredProduct.warrantyEndDate = filteredWarrantyEndDate.toUTC().toJSDate();
registeredProduct.updatedBy.push({
    user: currentUser._id,
});

await registeredProduct.save();
}

const apiResponseMessage = isChanged ?  "Registered product updated successfully" : "No changes detected"


return res.status(200).json(
    new ApiResponse(
        200,
        registeredProduct,
        apiResponseMessage
    )
);
});

const updateRegisteredProductServiceHistory = asyncHandler(async(req, res)=> {

           const currentUser = req.user;
     if(!currentUser){
        throw new ApiError(401, "Unauthorized");
     };

     const currentUserRole = currentUser.role;
     if(!currentUserRole){
        throw new ApiError(400, "Error while fetching user role")
     };

if(!["superadmin", "admin"].includes(currentUserRole)){
    throw new ApiError(403, "Unauthorized access")
};

const { serviceHistoryObjectId, fromSerialNumber, toSerialNumber, remarks, performedBy} = req.body;

const filteredServiceHistoryObjectId = serviceHistoryObjectId?.trim();
// const filteredType = type?.trim().toLowerCase();
const filteredFromSerialNumber = fromSerialNumber?.trim();
const filteredToSerialNumber = toSerialNumber?.trim();
const filteredRemarks = remarks?.trim();
const filteredPerformedByObjectId = performedBy?.trim() || null;


if(!filteredServiceHistoryObjectId || !filteredRemarks || !filteredPerformedByObjectId){
    throw new ApiError(400, "All fields are required");
};



if (!mongoose.Types.ObjectId.isValid(filteredServiceHistoryObjectId)) {
    throw new ApiError(400, "Invalid service history id");
}

if (!mongoose.Types.ObjectId.isValid(filteredPerformedByObjectId)) {
    throw new ApiError(400, "Invalid vendor id");
}

// if(!["repaired", "replaced"].includes(filteredType)){
//     throw new ApiError(400, "Unauthorized request");
// };


    const currentServiceHistoryOfProduct =  await RegisteredProduct.findOne({
  "serviceHistory._id": filteredServiceHistoryObjectId,
    isDeleted: false, 
});

if(!currentServiceHistoryOfProduct){
    throw new ApiError(404, "Error whhile fetching service history details.")
};

const currentProductServiceHistory = currentServiceHistoryOfProduct.serviceHistory.id(filteredServiceHistoryObjectId);

if (!currentProductServiceHistory) {
    throw new ApiError(404, "Service history not found");
};


if(currentProductServiceHistory.type === "replaced"){
    if(!filteredFromSerialNumber || !filteredToSerialNumber){
throw new ApiError(400, "From & To serial Number is required.")
    };
};


if (
    currentProductServiceHistory.type === "replaced" &&
    filteredFromSerialNumber === filteredToSerialNumber
) {
    throw new ApiError(
        400,
        "From and To serial numbers cannot be the same."
    );
}

const vendorObjectIdValid = await User.findById(filteredPerformedByObjectId);

if(!vendorObjectIdValid){
    throw new ApiError(400, "Invalid Vendor")
};

if(vendorObjectIdValid.role !== "vendor"){
throw new ApiError(400, "Invalid user role for service.")
};


if(currentProductServiceHistory.type === "replaced" && filteredFromSerialNumber && filteredToSerialNumber){

    const serialNumberAlreadyExists = await RegisteredProduct.findOne({
  serviceHistory: {
    $elemMatch: {
         _id: { $ne: new mongoose.Types.ObjectId(filteredServiceHistoryObjectId) },
        $or: [
  { fromSerialNumber: filteredFromSerialNumber },
  { toSerialNumber: filteredFromSerialNumber },
  { fromSerialNumber: filteredToSerialNumber },
  { toSerialNumber: filteredToSerialNumber },
],
    
    },
  },
});

if(serialNumberAlreadyExists){
    throw new ApiError(400, "One or both serial numbers already exist.")
}
currentProductServiceHistory.fromSerialNumber = filteredFromSerialNumber;
currentProductServiceHistory.toSerialNumber = filteredToSerialNumber;
};


currentProductServiceHistory.remark = filteredRemarks;
currentProductServiceHistory.performedBy = filteredPerformedByObjectId;
currentServiceHistoryOfProduct.updatedBy.push({
    user: currentUser._id,
});
await currentServiceHistoryOfProduct.save();

return res.status(200).json(
    new ApiResponse(
        200,
        currentServiceHistoryOfProduct,
        "Service History updated successfully"
    )
);







});

const addRegisteredProductService = asyncHandler(async(req, res)=> {

       const currentUser = req.user;
     if(!currentUser){
        throw new ApiError(401, "Unauthorized");
     };

     const currentUserRole = currentUser.role;
     if(!currentUserRole){
        throw new ApiError(400, "Error while fetching user role")
     };

if(!["superadmin", "admin"].includes(currentUserRole)){
    throw new ApiError(403, "Unauthorized access")
}

const currentSerialNumber = req.params.serialNumber?.trim();

if (!currentSerialNumber) {
    throw new ApiError(422, "Invalid serial number");
}

const registeredProduct = await RegisteredProduct.findOne({
    serialNumber: currentSerialNumber,
    isDeleted: false,
});

if (!registeredProduct) {
    throw new ApiError(404, "Registered product not found");
}
const { serviceType, toSerialNumber, remark, performedBy } = req.body;

const filteredServiceType = serviceType?.trim().toLowerCase();
const filteredToSerialNumber = toSerialNumber?.trim() || null;
const filteredRemark = remark?.trim();
const filteredPerformedBy = performedBy?.trim();

if(!filteredRemark || !filteredPerformedBy || !filteredServiceType){
      throw new ApiError(400, "All fields are required")
};

if(!["repaired", "replaced"].includes(filteredServiceType)){
    throw new ApiError(400, "Invalid request")
};

if (filteredServiceType === "replaced" && !filteredToSerialNumber) {
    throw new ApiError(400, "New Serial Number is required");
};

if (filteredRemark.length > 500) {
    throw new ApiError(400, "Remark cannot exceed 500 characters");
}

if(filteredToSerialNumber === currentSerialNumber){
      throw new ApiError(400, "Both serial numbers are same.")
};

if (!mongoose.Types.ObjectId.isValid(filteredPerformedBy)) {
    throw new ApiError(400, "Invalid vendor id");
}

const vendor = await User.findOne({
    _id: filteredPerformedBy,
    role: "vendor",
    isDeleted: false,
});

if (!vendor) {
    throw new ApiError(400, "Invalid vendor");
}

if(filteredServiceType === "replaced"){

 const doesNewSerialNumberAlreadyExists = await RegisteredProduct.findOne({
    isDeleted: false,
    $or: [
        { serialNumber: filteredToSerialNumber },
        { "serviceHistory.fromSerialNumber": filteredToSerialNumber },
        { "serviceHistory.toSerialNumber": filteredToSerialNumber },
    ],
});

 if(doesNewSerialNumberAlreadyExists){
throw new ApiError(409, "New Serial Number already exists.")
};

registeredProduct.serviceHistory.push({
    type: "replaced",
    fromSerialNumber: currentSerialNumber,
    toSerialNumber: filteredToSerialNumber,
    remark: filteredRemark,
    createdBy: currentUser._id,
    performedBy: filteredPerformedBy
});
registeredProduct.updatedBy.push({
    user: currentUser._id,
});
 registeredProduct.serialNumber = filteredToSerialNumber;
  registeredProduct.productStatus = "replaced";

}

if(filteredServiceType === "repaired"){

    registeredProduct.serviceHistory.push({
    type: "repaired",
    remark: filteredRemark,
    createdBy: currentUser._id,
    performedBy: filteredPerformedBy
});
registeredProduct.updatedBy.push({
    user: currentUser._id,
});
  registeredProduct.productStatus = "repaired";

}

 await registeredProduct.save();

const responseMessage =
    filteredServiceType === "replaced"
        ? "Product replaced successfully"
        : "Product repaired successfully";


 return res
 .status(200)
 .json(new ApiResponse(200, registeredProduct, responseMessage))

});

const checkAdminProductWarranty = asyncHandler(async (req, res) => {
   
    
         const currentUser = req?.user;
     if(!currentUser){
        throw new ApiError(401, "Unauthorized");
     };

     const currentUserRole = currentUser.role;
     if(!currentUserRole){
        throw new ApiError(400, "Error while fetching user role")
     };

if(!["superadmin", "admin", "engineer", "l1_engineer", "sales_manager", "inventory_manager"].includes(currentUserRole)){
    throw new ApiError(403, "Unauthorized access")
};

const { serialNumber } = req.params;
const filteredSerialNumber = serialNumber?.trim();
if(!filteredSerialNumber){
throw new ApiError(422, "Invalid serial number")
};

console.log(filteredSerialNumber); 


const registeredProduct = await RegisteredProduct.findOne({
    isDeleted: false,
    $or: [
        { "serialNumber": filteredSerialNumber },
        { "serviceHistory.fromSerialNumber": filteredSerialNumber },
         { "serviceHistory.toSerialNumber": filteredSerialNumber }
    ]
})
.populate({
  path: "serviceHistory.createdBy",
  select: {
    fullName: 1,
    email: 1,
    role: 1,
  },
})
.populate({
    path: "updatedBy.user",
    select: {
     fullName: 1,
    email: 1,
    role: 1,   
    }
})
.populate({
    path: "serviceHistory.performedBy",
      select: {
     fullName: 1,
    email: 1,
    role: 1,   
    }
})
.lean();


if(!registeredProduct){
throw new ApiError(404, "Registered Product with this serial number not found")
};

if (registeredProduct?.serviceHistory?.length) {
  registeredProduct.serviceHistory.sort(
    (a, b) => new Date(b.performedAt) - new Date(a.performedAt)
  );
};

console.log(registeredProduct);

return res
.status(200)
.json(new ApiResponse(200, registeredProduct, "Registered product details fetched successfully"));
});

const checkClientProductWarranty = asyncHandler(async(req, res)=> {

      
         const currentUser = req?.user;
     if(!currentUser){
        throw new ApiError(401, "Unauthorized");
     };

     const currentUserRole = currentUser.role;
     if(!currentUserRole){
        throw new ApiError(400, "Error while fetching user role")
     };

if(!["client"].includes(currentUserRole)){
    throw new ApiError(403, "Unauthorized access")
};

const { serialNumber } = req.params;
const filteredSerialNumber = serialNumber?.trim();
if(!filteredSerialNumber){
throw new ApiError(422, "Invalid serial number")
};


const registeredProduct = await RegisteredProduct.findOne({
    isDeleted: false,
    $or: [
        { "serialNumber": filteredSerialNumber },
         { "serviceHistory.fromSerialNumber": filteredSerialNumber },
         { "serviceHistory.toSerialNumber": filteredSerialNumber }
    ]
})
.lean();

// .populate({
//     path: "updatedBy.user",
//     select: {
//      fullName: 1,
//     email: 1,
//     role: 1,   
//     }
// })
// .populate({
//     path: "serviceHistory.performedBy",
//       select: {
//      fullName: 1,
//     email: 1,
//     role: 1,   
//     }
// })


if(!registeredProduct){
throw new ApiError(404, "Registered Product with this serial number not found");
};

// if (
//     registeredProduct.endCompanyName !==
//     currentUser.companyName?.trim().toLowerCase()
// ) {
//     throw new ApiError(
//         403,
//         "You are not authorized to view this product."
//     );
// };

// const filteredRegisteredProduct = {
//     productName: registeredProduct.productName,
//     modelNumber: registeredProduct.modelNumber,
//     serialNumber: registeredProduct.serialNumber,
//     productStatus: registeredProduct.productStatus,
//     warrantyEndDate: registeredProduct.warrantyEndDate,
//     replacementHistory: registeredProduct.replacementHistory.map(item => ({
//         oldSerialNumber: item.oldSerialNumber,
//         replacedDate: item.replacedDate,
//     })),
// };

return res
.status(200)
.json(new ApiResponse(200, registeredProduct,  "Warranty details fetched successfully"));
});

const checkPublicProductWarranty = asyncHandler(async(req, res)=> {

    const { serialNumber } = req.params;
const filteredSerialNumber = serialNumber?.trim();
if(!filteredSerialNumber){
throw new ApiError(422, "Invalid serial number")
};


const registeredProduct = await RegisteredProduct.findOne({
    isDeleted: false,
    $or: [
        { "serialNumber": filteredSerialNumber },
         { "serviceHistory.fromSerialNumber": filteredSerialNumber },
         { "serviceHistory.toSerialNumber": filteredSerialNumber }
    ]
})
.lean();

// .populate({
//   path: "createdBy",
//   select: {
//     fullName: 1,
//     email: 1,
//     role: 1,
//   },
// })
// .populate({
//     path: "updatedBy.user",
//     select: {
//      fullName: 1,
//     email: 1,
//     role: 1,   
//     }
// })
// .populate({
//     path: "serviceHistory.performedBy",
//       select: {
//      fullName: 1,
//     email: 1,
//     role: 1,   
//     }
// })

if(!registeredProduct){
throw new ApiError(404, "Registered Product with this serial number not found")
};

if (registeredProduct?.serviceHistory?.length) {
  registeredProduct.serviceHistory.sort(
    (a, b) => new Date(b.performedAt) - new Date(a.performedAt)
  );
}
// const filteredRegisteredProduct = {
//     productName: registeredProduct.productName,
//     modelNumber: registeredProduct.modelNumber,
//     serialNumber: registeredProduct.serialNumber,
//     productStatus: registeredProduct.productStatus,
//     warrantyEndDate: registeredProduct.warrantyEndDate,
//     replacementHistory: registeredProduct.replacementHistory.map(item => ({
//         oldSerialNumber: item.oldSerialNumber,
//         replacedDate: item.replacedDate,
//     })),
// };


return res
.status(200)
.json(new ApiResponse(200, registeredProduct,  "Warranty details fetched successfully"));

});

const bulkCreateRegisteredProducts = asyncHandler(async(req, res)=>{

    try {
        
        if(!req.file){
 throw new ApiError(
        400,
        "Excel file is required"
    )
        };

 const currentUser = req.user;
     if(!currentUser){
        throw new ApiError(401, "Unauthorized");
     };

     const currentUserId = currentUser?.id;
  if(!currentUserId){
        throw new ApiError(400, "Error while fetching user Id")
     };


     const currentUserRole = currentUser.role;
     if(!currentUserRole){
        throw new ApiError(400, "Error while fetching user role")
     };

if(!["superadmin", "admin"].includes(currentUserRole)){
    throw new ApiError(403, "Unauthorized access")
};

// 1. READ EXCEL FILE
const rows = readExcelFile(req.file.path);
console.log("========== EXCEL DEBUG ==========");

console.log("TOTAL ROWS:", rows.length);

console.log("FIRST ROW:", rows[0]);

console.log(
    "BILL DATE:",
    rows[0]?.["Bill Date (DD-MM-YYYY)"],
    "TYPE:",
    typeof rows[0]?.["Bill Date (DD-MM-YYYY)"]
);

console.log(
    "WARRANTY DATE:",
    rows[0]?.["Warranty End Date (DD-MM-YYYY)"],
    "TYPE:",
    typeof rows[0]?.["Warranty End Date (DD-MM-YYYY)"]
);

console.log(
    "END COMPANY:",
    rows[0]?.["End Company Name"]
);

console.log("=================================");

if(!rows.length) {
       throw new ApiError(
        400,
        "Excel file contains no data"
    );
};



//2. VALIDATE HEADERS
validateExcelHeaders(rows);



//3. VALIDATE ROWS
const validProducts = [];
const failedData = [];

for(let index = 0; index < rows.length; index++){
    const row = rows[index];

    const validation = validateExcelRow(row);

        console.log(
        `ROW ${index + 2}:`,
        row
    );

    console.log(
        `ROW ${index + 2} VALIDATION:`,
        validation
    );

    if(!validation.isValid){

        failedData.push({
            rowNumber: index + 2,
            data: row,
            errors: validation.errors,
        });
        continue;
    };

    const product = transformExcelRow(
        row,
        validation.billDate,
        validation.warrantyEndDate,
        currentUserId
    );

    validProducts.push({
        rowNumber: index + 2,
        excelRow: row,
        product,
    });
};


console.log(
    "VALID PRODUCTS COUNT:",
    validProducts.length
);

console.log(
    "FAILED DATA COUNT:",
    failedData.length
);

console.log(
    "FAILED DATA:",
    JSON.stringify(failedData, null, 2)
);


//4. CHECK DUPLICATE BILL NUMBER
// const billNumbers = validProducts.map(
//     item => item.product.billNumber
// );

// const existingBillNumbers = await RegisteredProduct.find({
//     billNumber: {
//         $in: billNumbers,
//     },
// }).select("billNumber");

// const existingBillNumberSet = new Set(
//     existingBillNumbers.map(
//         product => product.billNumber
//     )
// );

//5. CHECK DUPLICATE SERIAL NUMBERS
const serialNumbers = validProducts.map(
    item => item.product.serialNumber
);

const existingSerialNumbers = await RegisteredProduct.find({
    serialNumber: {
        $in: serialNumbers
    }
}).select("serialNumber");

const existingSerialNumberSet = new Set(
    existingSerialNumbers.map(
        product => product.serialNumber
    )
);

//6. REMOVE DUPLICATES
const finalProducts = [];

for (const item of validProducts){

    const {
        rowNumber,
        excelRow,
        product
    } = item;

    const errors = [];

    // if(existingBillNumberSet.has(product.billNumber)){
    //     errors.push(
    //         `Bill Number already exists: ${product.billNumber}`
    //     );
    // };

    // if(existingSerialNumberSet.has(product.serialNumber)){
    //     errors.push(
    //         `Serial Number already exists: ${product.serialNumber}`
    //     );
    // };

    if(existingSerialNumberSet.has(product.serialNumber)){ 
    errors.push( 
        `Serial Number already exists: ${product.serialNumber}` 
    ); 
};

    if(errors.length > 0){

        failedData.push({
            rowNumber,
            data: excelRow,
            errors,
        });

        continue;
    };

    finalProducts.push(item);
};


//7. DETECT DUPLICATES INSIDE EXCEL
// const billNumberMap = new Map();
const serialNumberMap = new Map();

const uniqueProducts = [];

for (const item of finalProducts) {

    const {
        rowNumber,
        excelRow,
        product
    } = item;

    const errors = [];

    // if (billNumberMap.has(product.billNumber)) {
    //     errors.push(
    //         `Duplicate Bill Number inside Excel: ${product.billNumber}`
    //     );
    // }

    if (serialNumberMap.has(product.serialNumber)) {
        errors.push(
            `Duplicate Serial Number inside Excel: ${product.serialNumber}`
        );
    }

    if (errors.length > 0) {

        failedData.push({
            rowNumber,
            data: excelRow,
            errors,
        });

        continue;
    }

    // billNumberMap.set(product.billNumber, true);
    serialNumberMap.set(product.serialNumber, true);

    uniqueProducts.push(product);
};


//8. INSERT VALID PRODUCTS
let insertedProducts = [];


    console.log(
    "UNIQUE PRODUCTS COUNT:",
    uniqueProducts.length
);

console.log(
    "UNIQUE PRODUCTS:",
    uniqueProducts
);


if (uniqueProducts.length > 0) {

    insertedProducts = await RegisteredProduct.insertMany(
        uniqueProducts,
        {
            ordered: false,
        }
    );

    console.log(
    "INSERTED PRODUCTS COUNT:",
    insertedProducts.length
);
}



// 9. UPLOAD ORIGINAL EXCEL TO CLOUDINARY

const cloudinaryResponse =
    await uploadOnCloudinary(
        req.file.path,
        {
            resource_type: "raw",
            folder: "crm-helpdesk/registered-products",
            use_filename: true,
            unique_filename: true,
        }
    );

if (!cloudinaryResponse) {
    throw new ApiError(
        500,
        "Failed to upload Excel file to Cloudinary"
    );
}


            //10. SAVE UPLOAD HISTORY
const uploadRecord = await RegisteredProductUpload.create({
    fileName: req.file.originalname,

    uploadedBy: currentUserId,

    totalRows: rows.length,

    insertedRows:
        insertedProducts.length,

    failedRows:
        failedData.length,

    fileUrl:
        cloudinaryResponse?.secure_url,

    cloudinaryPublicId:
        cloudinaryResponse?.public_id,

    failedData,
});


//11 RESPONSE

        return res.status(201).json({
    success: true,
    message:
        insertedProducts.length > 0
            ? "Registered products bulk upload completed"
            : "Bulk upload completed with no products inserted",

            data: {
                uploadId: uploadRecord._id,

                fileName:
                    req.file.originalname,

                totalRows:
                    rows.length,

                insertedRows:
                    insertedProducts.length,

                failedRows:
                    failedData.length,

                failedData,
            },
        });


    } catch (error) {
        
      console.error(
        "BULK REGISTERED PRODUCT UPLOAD ERROR:",
        error
    );

    return res.status(error.statusCode || 500).json({
        success: false,
        message:
            error.message ||
            "Bulk upload failed",
    });
    } finally {
      
        if (
            req.file?.path &&
            fs.existsSync(req.file.path)
        ) {
            fs.unlinkSync(req.file.path);
        }  
    }
});

const downloadRegisteredProductTemplate = asyncHandler(
    async (req, res) => {
        const templatePath = path.join(
            process.cwd(),
            "src",
            "templates",
            "registered-products-template.xlsx"
        );

        // Check if template exists
        if (!fs.existsSync(templatePath)) {
            return res.status(404).json({
                success: false,
                message: "Registered product Excel template not found",
            });
        }

        return res.download(
            templatePath,
            "registered-products-template.xlsx"
        );
    }
);






export{
    createRegisteredProduct,
    getAllRegisteredProducts,
    getRegisteredProductBySerialNumber,
    updateRegisteredProduct,

    updateRegisteredProductServiceHistory,
    addRegisteredProductService,

    checkAdminProductWarranty,
    checkClientProductWarranty,
    checkPublicProductWarranty,

    bulkCreateRegisteredProducts,

    downloadRegisteredProductTemplate, 
    downloadRegisteredProductsExcel
    
}


// addRegisteredProductService      // Add repair or replacement
// updateRegisteredProductService   // Edit repair or replacement
// deleteRegisteredProductService   // Delete service entry (optional)

