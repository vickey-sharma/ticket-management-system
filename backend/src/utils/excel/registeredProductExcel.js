import XLSX from "xlsx";
import { DateTime } from "luxon";

const BUSINESS_TIMEZONE = "Asia/Kolkata";

const REQUIRED_HEADERS = [
    "Sr. No.",
    "Bill Number",
    "Bill Date (DD-MM-YYYY)",
    "Bill Company Name",
    "End Company Name",
    "Product Name",
    "Model Number",
    "Serial Number",
    "Warranty End Date (DD-MM-YYYY)",
];

const readExcelFile = (filePath) => {
    const workbook = XLSX.readFile(filePath);

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
        raw: true,
    });

    // Keep only rows where at least one actual product field
    // contains data. Sr. No. alone should NOT count as data.
    const filteredRows = rows.filter((row) => {
        const productFields = [
            "Bill Number",
            "Bill Date (DD-MM-YYYY)",
            "Bill Company Name",
            "End Company Name",
            "Product Name",
            "Model Number",
            "Serial Number",
            "Warranty End Date (DD-MM-YYYY)",
        ];

        return productFields.some(
            (field) => String(row[field] ?? "").trim() !== ""
        );
    });

    return filteredRows;
};

const validateExcelHeaders = (rows) => {
    if (!rows || rows.length === 0) {
        throw new Error("Excel file is empty");
    }

    const headers = Object.keys(rows[0]);

    const missingHeaders = REQUIRED_HEADERS.filter(
        (header) => !headers.includes(header)
    );

    if (missingHeaders.length > 0) {
        throw new Error(
            `Missing required headers: ${missingHeaders.join(", ")}`
        );
    }

    return true;
};

// const parseExcelDate = (value) => {
//     if (
//         value === null ||
//         value === undefined ||
//         String(value).trim() === ""
//     ) {
//         return null;
//     }

//     // --------------------------------
//     // 1. JavaScript Date object
//     // --------------------------------

//     if (value instanceof Date) {
//         if (isNaN(value.getTime())) {
//             return null;
//         }

//         return value;
//     }

//     // --------------------------------
//     // 2. Excel serial number
//     // --------------------------------
//     // Excel may store a date such as
//     // 02-06-2025 internally as 45810

//     if (
//         typeof value === "number" ||
//         (
//             typeof value === "string" &&
//             /^\d+(\.\d+)?$/.test(value.trim())
//         )
//     ) {
//         const serialNumber = Number(value);

//         if (
//             !Number.isFinite(serialNumber) ||
//             serialNumber <= 0
//         ) {
//             return null;
//         }

//         const excelEpoch = new Date(
//             Date.UTC(1899, 11, 30)
//         );

//         const date = new Date(
//             excelEpoch.getTime() +
//             serialNumber *
//                 24 *
//                 60 *
//                 60 *
//                 1000
//         );

//         return isNaN(date.getTime())
//             ? null
//             : date;
//     }

//     // --------------------------------
//     // 3. DD-MM-YYYY ONLY
//     // --------------------------------

//     const stringValue = String(value).trim();

//     const match = stringValue.match(
//         /^(\d{1,2})-(\d{1,2})-(\d{4})$/
//     );

//     if (!match) {
//         return null;
//     }

//     const day = Number(match[1]);
//     const month = Number(match[2]);
//     const year = Number(match[3]);

//     const date = new Date(
//         year,
//         month - 1,
//         day
//     );

//     // Prevent invalid dates such as:
//     // 31-02-2026
//     // 32-01-2026
//     // 15-13-2026

//     if (
//         date.getFullYear() !== year ||
//         date.getMonth() !== month - 1 ||
//         date.getDate() !== day
//     ) {
//         return null;
//     }

//     return date;
// };


const parseExcelDate = (value) => {

    if (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    ) {
        return null;
    }

    // --------------------------------
    // 1. JavaScript Date object
    // --------------------------------

    if (value instanceof Date) {

        if (isNaN(value.getTime())) {
            return null;
        }

        return DateTime.fromJSDate(value, {
            zone: "utc",
        })
        .setZone(BUSINESS_TIMEZONE)
        .startOf("day");
    }

    // --------------------------------
    // 2. Excel serial number
    // --------------------------------

    if (
        typeof value === "number" ||
        (
            typeof value === "string" &&
            /^\d+(\.\d+)?$/.test(value.trim())
        )
    ) {

        const serialNumber = Number(value);

        if (
            !Number.isFinite(serialNumber) ||
            serialNumber <= 0
        ) {
            return null;
        }

        const excelEpoch = DateTime.fromObject(
            {
                year: 1899,
                month: 12,
                day: 30,
            },
            {
                zone: "utc",
            }
        );

        return excelEpoch
            .plus({
                days: serialNumber,
            })
            .setZone(BUSINESS_TIMEZONE)
            .startOf("day");
    }

    // --------------------------------
    // 3. DD-MM-YYYY
    // --------------------------------

    const stringValue = String(value).trim();

    const match = stringValue.match(
        /^(\d{1,2})-(\d{1,2})-(\d{4})$/
    );

    if (!match) {
        return null;
    }

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    const dateTime = DateTime.fromObject(
        {
            year,
            month,
            day,
        },
        {
            zone: BUSINESS_TIMEZONE,
        }
    );

    if (!dateTime.isValid) {
        return null;
    }

    return dateTime.startOf("day");
};

const validateExcelRow = (row) => {
    const errors = [];

    const requiredFields = [
        "Bill Number",
        "Bill Date (DD-MM-YYYY)",
        "Bill Company Name",
        "End Company Name",
        "Product Name",
        "Model Number",
        "Serial Number",
        "Warranty End Date (DD-MM-YYYY)",
    ];


        // --------------------------------
    // DEBUG
    // --------------------------------
    console.log(
        "========== VALIDATOR VERSION 2 =========="
    );

    console.log(
        "END COMPANY REQUIRED?",
        requiredFields.includes("End Company Name")
    );

    console.log(
        "BILL DATE RAW:",
        row["Bill Date (DD-MM-YYYY)"],
        typeof row["Bill Date (DD-MM-YYYY)"]
    );

    console.log(
        "WARRANTY RAW:",
        row["Warranty End Date (DD-MM-YYYY)"],
        typeof row["Warranty End Date (DD-MM-YYYY)"]
    );

    console.log(
        "END COMPANY RAW:",
        row["End Company Name"]
    );

    console.log(
        "=========================================="
    );

    // --------------------------------
    // REQUIRED FIELD VALIDATION
    // --------------------------------

    requiredFields.forEach((field) => {

        if (
            String(row[field] ?? "").trim() === ""
        ) {
            errors.push(`${field} is required`);
        }

    });

    // --------------------------------
    // BILL DATE
    // --------------------------------

    const billDate = parseExcelDate(
        row["Bill Date (DD-MM-YYYY)"]
    );
if (
    String(
        row["Bill Date (DD-MM-YYYY)"] ?? ""
    ).trim() !== "" &&
    !billDate
) {
    errors.push(
        "Invalid Bill Date. Expected DD-MM-YYYY"
    );
}

    const warrantyEndDate = parseExcelDate(
        row["Warranty End Date (DD-MM-YYYY)"]
    );

    if (
    String(
        row["Warranty End Date (DD-MM-YYYY)"] ?? ""
    ).trim() !== "" &&
    !warrantyEndDate
) {
    errors.push(
        "Invalid Warranty End Date. Expected DD-MM-YYYY"
    );
} 
     return {
        isValid: errors.length === 0,
        errors,
        billDate,
        warrantyEndDate,
    };
};

// const transformExcelRow = (
//     row,
//     billDate,
//     warrantyEndDate,
//     userId
// ) => {
//     return {
//         billNumber: String(row["Bill Number"]).trim(),
//         billDate,
//         billCompanyName: String(
//             row["Bill Company Name"]
//         ).trim(),

//         endCompanyName: String(
//     row["End Company Name"] ?? ""
// ).trim(),

//         productName: String(
//             row["Product Name"]
//         ).trim(),

//         modelNumber: String(
//             row["Model Number"]
//         ).trim(),

//         serialNumber: String(
//             row["Serial Number"]
//         ).trim(),

//         warrantyEndDate,

//         productStatus: "new",

//         serviceHistory: [],

//         createdBy: userId,

//         updatedBy: [],
//     };
// };


const transformExcelRow = (
    row,
    billDate,
    warrantyEndDate,
    userId
) => {
    return {
        billNumber: String(row["Bill Number"]).trim(),

        billDate: billDate.toUTC().toJSDate(),

        billCompanyName: String(
            row["Bill Company Name"]
        ).trim(),

        endCompanyName: String(
            row["End Company Name"] ?? ""
        ).trim(),

        productName: String(
            row["Product Name"]
        ).trim(),

        modelNumber: String(
            row["Model Number"]
        ).trim(),

        serialNumber: String(
            row["Serial Number"]
        ).trim(),

        warrantyEndDate: warrantyEndDate
            .toUTC()
            .toJSDate(),

        productStatus: "new",

        serviceHistory: [],

        createdBy: userId,

        updatedBy: [],
    };
};


const generateRegisteredProductsExcel = async (
    registeredProducts
) => {

    const formatExcelDate = (date) => {

        if (!date) {
            return "";
        }

        const dateTime = DateTime
            .fromJSDate(new Date(date), {
                zone: "utc"
            })
            .setZone(BUSINESS_TIMEZONE);

        if (!dateTime.isValid) {
            return "";
        }

        return dateTime.toFormat("dd-MM-yyyy");
    };


    const rows = registeredProducts.map(
        (product, index) => ({
            "Sr. No.": index + 1,

            "Bill Number":
                product.billNumber,

            "Bill Date (DD-MM-YYYY)":
                formatExcelDate(product.billDate),

            "Bill Company Name":
                product.billCompanyName,

            "End Company Name":
                product.endCompanyName,

            "Product Name":
                product.productName,

            "Model Number":
                product.modelNumber,

            "Serial Number":
                product.serialNumber,

            "Warranty End Date (DD-MM-YYYY)":
                formatExcelDate(
                    product.warrantyEndDate
                ),
        })
    );


    const worksheet =
        XLSX.utils.json_to_sheet(rows);


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Registered Products"
    );


    return XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
    });
};

export {
    REQUIRED_HEADERS,
 readExcelFile,
    validateExcelHeaders,
    validateExcelRow,
    parseExcelDate,
    transformExcelRow,

    generateRegisteredProductsExcel
};