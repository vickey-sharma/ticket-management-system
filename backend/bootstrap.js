// bootstrap.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "./src/models/user.model.js";

dotenv.config({ path: "./.env" });

const bootstrap = async () => {

    if (!process.env.BOOTSTRAP_SECRET) {
        console.error("BOOTSTRAP_SECRET is not set in .env. Aborting.");
        process.exit(1);
    }

    if (
        !process.env.ADMIN_FULLNAME ||
        !process.env.ADMIN_EMAIL ||
        !process.env.ADMIN_PASSWORD
    ) {
        console.error("admin credentials missing in .env. Aborting.");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ DB connected");

        
        const existing = await User.findOne({ role: "admin" });
        if (existing) {
            console.log("admin already exists. Bootstrap not needed.");
            await mongoose.disconnect();
            process.exit(0);
        }

        // Create admin
        await User.create({
            fullName: process.env.ADMIN_FULLNAME,
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD, 
            role: "admin",
            createdBy: null,
        });

        console.log(`admin created: ${process.env.ADMIN_EMAIL}`);

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