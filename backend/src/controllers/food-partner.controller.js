const foodPartnerModel = require('../models/foodpartner.model');
const foodModel = require('../models/food.model');

async function getFoodPartnerById(req, res) {

    const foodPartnerId = req.params.id;

    const foodPartner = await foodPartnerModel.findById(foodPartnerId).lean();
    const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId }).lean();

    if (!foodPartner) {
        return res.status(404).json({ message: "Food partner not found" });
    }

    // Fix for mixed content errors on deployment
    let BASE_URL = process.env.BASE_URL;
    if (!BASE_URL || BASE_URL.includes("localhost")) {
        BASE_URL = "https://zomato-clone-1-rb6k.onrender.com";
    }

    if (foodItemsByFoodPartner) {
        foodItemsByFoodPartner.forEach(item => {
            if (item.video && item.video.includes("http://localhost:3000")) {
                item.video = item.video.replace("http://localhost:3000", BASE_URL);
            }
        });
    }

    res.status(200).json({
        message: "Food partner retrieved successfully",
        foodPartner: {
            ...foodPartner,
            foodItems: foodItemsByFoodPartner
        }

    });
}

module.exports = {
    getFoodPartnerById
};