const mongoose = require('mongoose');
const foodPartnerModel = require('../src/models/foodpartner.model');
require('dotenv').config();

const connectDB = require('../src/db/db');

async function updatePartner() {
    try {
        await connectDB();
        console.log("Connected to DB");

        // Case-insensitive search for "Tasty Bites"
        const partner = await foodPartnerModel.findOne({ name: { $regex: new RegExp("^Tasty Bites$", "i") } });

        if (!partner) {
            console.log("Partner 'Tasty Bites' not found.");
        } else {
            console.log(`Found partner: ${partner.name}`);
            partner.name = "FlavorFeed";
            partner.phone = "22348383444";
            await partner.save();
            console.log("Successfully updated partner details to FlavorFeed and 22348383444.");
        }

    } catch (err) {
        console.error("Error updating partner:", err);
    } finally {
        await mongoose.connection.close();
        console.log("Disconnected from DB");
        process.exit(0);
    }
}

updatePartner();
