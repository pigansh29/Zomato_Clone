const mongoose = require('mongoose');
const foodPartnerModel = require('../src/models/foodpartner.model');
require('dotenv').config();

const connectDB = require('../src/db/db');

async function revertPartner() {
    try {
        await connectDB();
        console.log("Connected to DB");

        // Search for "FlavorFeed"
        const partner = await foodPartnerModel.findOne({ name: "FlavorFeed" });

        if (!partner) {
            console.log("Partner 'FlavorFeed' not found.");
        } else {
            console.log(`Found partner: ${partner.name}`);
            partner.name = "Tasty Bites";
            // Reverting phone to the default placeholder as original was not logged
            partner.phone = "+1 555 123 4567";
            await partner.save();
            console.log("Successfully reverted partner details to Tasty Bites.");
        }

    } catch (err) {
        console.error("Error reverting partner:", err);
    } finally {
        await mongoose.connection.close();
        console.log("Disconnected from DB");
        process.exit(0);
    }
}

revertPartner();
