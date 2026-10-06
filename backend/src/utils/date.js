import { DateTime } from "luxon";

export const BUSINESS_TIMEZONE = "Asia/Kolkata";

// export const parseDDMMYYYY = (value) => {
//     if (typeof value !== "string") {
//         return null;
//     }

//     const trimmedValue = value.trim();

//     if (!trimmedValue) {
//         return null;
//     }

//     const parts = trimmedValue.split("-");

//     if (parts.length !== 3) {
//         return null;
//     }

//     const [dayString, monthString, yearString] = parts;

//     if (
//         dayString.length !== 2 ||
//         monthString.length !== 2 ||
//         yearString.length !== 4
//     ) {
//         return null;
//     }

//     const day = Number(dayString);
//     const month = Number(monthString);
//     const year = Number(yearString);

//     if (
//         !Number.isInteger(day) ||
//         !Number.isInteger(month) ||
//         !Number.isInteger(year)
//     ) {
//         return null;
//     }

//     const dateTime = DateTime.fromObject(
//         {
//             day,
//             month,
//             year,
//         },
//         {
//             zone: BUSINESS_TIMEZONE,
//         }
//     );

//     if (!dateTime.isValid) {
//         return null;
//     }

//     return dateTime.startOf("day");
// };


export const parseYYYYMMDD = (value) => {
    if (typeof value !== "string") {
        return null;
    }

    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return null;
    }

    const parts = trimmedValue.split("-");

    if (parts.length !== 3) {
        return null;
    }

    const [yearString, monthString, dayString] = parts;

    if (
        yearString.length !== 4 ||
        monthString.length !== 2 ||
        dayString.length !== 2
    ) {
        return null;
    }

    const year = Number(yearString);
    const month = Number(monthString);
    const day = Number(dayString);

    if (
        !Number.isInteger(year) ||
        !Number.isInteger(month) ||
        !Number.isInteger(day)
    ) {
        return null;
    }

    const dateTime = DateTime.fromObject(
        {
            day,
            month,
            year,
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