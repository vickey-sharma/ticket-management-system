// bootstrap.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "./src/models/user.model.js";

dotenv.config({ path: "./.env" });

const bootstrap = async () => {

    // 🔒 Lock 1: Bootstrap secret must exist
    if (!process.env.BOOTSTRAP_SECRET) {
        console.error("BOOTSTRAP_SECRET is not set in .env. Aborting.");
        process.exit(1);
    }

    // 🔒 Lock 2: All credentials must be present
    if (
        !process.env.SUPERADMIN_FULLNAME ||
        !process.env.SUPERADMIN_EMAIL ||
        !process.env.SUPERADMIN_PASSWORD ||
        !process.env.SUPERADMIN_PHONE
    ) {
        console.error("Superadmin credentials missing in .env. Aborting.");
        process.exit(1);
    }

    try {
        // Connect to DB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ DB connected");

        // 🔒 Lock 3: Idempotency check
        const existing = await User.findOne({ role: "superadmin" });
        if (existing) {
            console.log("✅ Superadmin already exists. Bootstrap not needed.");
            await mongoose.disconnect();
            process.exit(0);
        }

        // Create superadmin
        await User.create({
            fullName: process.env.SUPERADMIN_FULLNAME,
            email: process.env.SUPERADMIN_EMAIL,
            password: process.env.SUPERADMIN_PASSWORD, 
            phoneNumber: process.env.SUPERADMIN_PHONE,
            role: "superadmin",
            isActive: true,
            isVerified: true,
            isRegistrationComplete: true,
            createdBy: null,
        });

        console.log(` Superadmin created: ${process.env.SUPERADMIN_EMAIL}`);

    } catch (error) {
        console.error("Bootstrap failed:", error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("DB disconnected. Bootstrap complete.");
        process.exit(0);
    }
};

bootstrap();