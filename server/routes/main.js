const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// leftoff on the 2:12 video, search bar wont work for some reason

// Home page
router.get("/", async (req,res)=>{
    const locals = {
        title: "NodeJS Blog",
        description: "A Blog Template application that will be used for your own use.",
    };

    try {
        const data = await Post.find().sort({title: "desc"});
        res.render("index",{locals, data});
    } catch (error) {
        console.log(error);
    }
})

// Get Post by Id
router.get("/post/:id", async (req,res)=>{
    try {
        let slug = req.params.id;
        const data = await Post.findById({_id: slug});

        const locals = {
            title: data.title,
            description: "A Blog Template application that will be used for your own use.",
        };
        res.render("post", {locals, data})
    } catch (error) {
        console.log(error)
    }
})

// Search Route
router.post("/search", async (req,res) =>{
    try {
        const locals = {
            title: "Search",
            description: "A blog templade made with NODE JS AND EXPRESS"
        };

    let searchTerm = req.body.SearchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z ]/g,"");

    const data = await Post.find({
        $or: [
            {title: {$regex: new RegExp(searchNoSpecialChar,"i")}},
            {body: {$regex: new RegExp(searchNoSpecialChar,"i")}}
        ],
    })
    
    res.render("search", {locals, data});
    } catch (error) {
        console.log(error);
    }
})
module.exports = router;