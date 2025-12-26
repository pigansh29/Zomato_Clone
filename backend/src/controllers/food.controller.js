const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require("../models/likes.model")
const saveModel = require("../models/save.model")
const { v4: uuid } = require("uuid")


async function createFood(req, res) {
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id
    })

    res.status(201).json({
        message: "food created successfully",
        food: foodItem
    })

}

async function getFoodItems(req, res) {
    const foodItems = await foodModel.find({}).lean(); // Use lean to modify the objects

    if (req.user) {
        const likedFoods = await likeModel.find({ user: req.user._id, food: { $in: foodItems.map(f => f._id) } });
        const likedFoodIds = new Set(likedFoods.map(l => l.food.toString()));

        const savedFoods = await saveModel.find({ user: req.user._id, food: { $in: foodItems.map(f => f._id) } });
        const savedFoodIds = new Set(savedFoods.map(s => s.food.toString()));

        foodItems.forEach(item => {
            item.isLiked = likedFoodIds.has(item._id.toString());
            item.isSaved = savedFoodIds.has(item._id.toString());
        });
    }

    // Fix for mixed content errors on deployment: replace localhost URLs with Render URL
    let BASE_URL = process.env.BASE_URL;

    // Fallback if BASE_URL is missing or incorrectly set to localhost in production
    if (!BASE_URL || BASE_URL.includes("localhost")) {
        BASE_URL = "https://zomato-clone-1-rb6k.onrender.com";
    }

    foodItems.forEach(item => {
        if (item.video && item.video.includes("http://localhost:3000")) {
            item.video = item.video.replace("http://localhost:3000", BASE_URL);
        }
    });

    res.status(200).json({
        message: "Food items fetched successfully",
        foodItems
    })
}


async function likeFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadyLiked = await likeModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadyLiked) {
        await likeModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }
        })

        return res.status(200).json({
            message: "Food unliked successfully"
        })
    }

    const like = await likeModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 }
    })

    res.status(201).json({
        message: "Food liked successfully",
        like
    })

}

async function saveFood(req, res) {

    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadySaved) {
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: -1 }
        })

        return res.status(200).json({
            message: "Food unsaved successfully"
        })
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { savesCount: 1 }
    })

    res.status(201).json({
        message: "Food saved successfully",
        save
    })

}

async function getSaveFood(req, res) {

    const user = req.user;

    const savedFoods = await saveModel.find({ user: user._id }).populate('food').lean();

    if (!savedFoods || savedFoods.length === 0) {
        return res.status(404).json({ message: "No saved foods found" });
    }

    // Fix for mixed content errors on deployment
    let BASE_URL = process.env.BASE_URL;
    if (!BASE_URL || BASE_URL.includes("localhost")) {
        BASE_URL = "https://zomato-clone-1-rb6k.onrender.com";
    }

    savedFoods.forEach(item => {
        if (item.food && item.food.video && item.food.video.includes("http://localhost:3000")) {
            item.food.video = item.food.video.replace("http://localhost:3000", BASE_URL);
        }
    });

    res.status(200).json({
        message: "Saved foods retrieved successfully",
        savedFoods
    });

}


module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSaveFood
}