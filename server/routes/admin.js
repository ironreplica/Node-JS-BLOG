const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const adminLayout = "../views/layouts/admin";

/**
 * Check login middleware
 */
const authMiddleware = (req,res,next) => {
  const token = req.cookies.token;

  if(!token){
    return res.status(401).json({message : "Unauthorized"});
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({message : "Unauthorized"});
  }
}

/**
 * GET /
 * admin - check login
 */
router.get("/admin", async ( req ,res)=>{
  try {
    const locals = {
      title: "Admin",
      decsription: "A blog template made with NodeJS and ExpressJS"
    };
    
    res.render("admin/index",{locals,layout:adminLayout});
  } catch (error) {
    console.log(error);
  }
})
/**
 * POST /login
 * Admin - Login Account
 */
router.post("/admin", async (req,res)=>{
  try {
    const {username,password} = req.body;

    const user = await User.findOne({username});

    if(!user){
      return res.status(401).json({message: "Invalid credentials"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
      return res.status(401).json({message: "Invalid credentials"});
    }

    const token = jwt.sign({userId: user._id}, jwtSecret);
    res.cookie("token", token, {httpOnly:true});
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});
/**
 * GET /register
 * Admin - Dashboard
 */
router.get("/dashboard", authMiddleware, async (req,res) => {
  try {
    const locals = {
      title : "Dashboard",
      decsription : "A blog template made with NODEJS and EXPRESSJS",
    };

    const data = await Post.find();
    res.render("admin/dashboard", {locals,data,layout:adminLayout});
  } catch (error) {
    console.log(error);
  }
});
/**
 * POST /register
 * Admin - register account
 */
router.post("/register", async (req,res)=> {
  try {
    const {username,password} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    
    try {
      const user = await User.create({
        username,
        password: hashedPassword,
      })
      res.status(201).json({message: "User created successfully.", user});
    } catch (error) {
      if (error === 11000){
        return res.status(500).json({message: "User already exists!"});
      } else {
        return res
          .status(500)
          .json({message: "Something went wrong with the server!"});
      }
    }
  } catch (error) {
    console.log(error);
  }
})
/**
 * GET /logout
 * admin - logout
 */
router.get("/logout", authMiddleware, async (req,res) => {
  try {
    res.clearCookie("token");
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

/**
 * Get /add-post
 * admin - create new post
 */
router.get("/add-post", authMiddleware, async (req,res)=>{
  try {
    const locals = {
      title: "Create Post",
      decsription: "A blog template made with NodeJS and ExpressJS and EJS",
    };

    const data = await Post.find();
    res.render("admin/add-post", {locals, data, layout: adminLayout});
  } catch (error) {
    console.log(error);
  }
})

/**
 * Post /add-post
 * admin - create new post
 */
router.post("/add-post/", authMiddleware, async (req,res)=>{
  try {
    console.log(req.body);
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
      });
      await Post.create(newPost);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
})

/**
 * Get /edit-post
 * Admin - update post
 */
router.get("/edit-post/:id", authMiddleware, async (req,res)=>{
  try {
    const locals = {
      title: "Edit Post",
      decsription: "A blog template made with NodeJS and ExpressJS and EJS"
    };

    const data = await Post.findOne({ _id: req.params.id});
    res.render("admin/edit-post", {locals, data, layout: adminLayout});
  } catch (error) {
    console.log(error);
  }
})

/**
 * PUT /edit-post
 * Admin - edit post
 */
router.put("/edit-post/:id", authMiddleware, async (req,res)=>{
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });
    res.redirect(`/dashboard`);
  } catch (error) {
    console.log(error);
  }
});

/**
 * DELETE /delete-post
 * Admin - Delete Post
 */
router.delete("/delete-post/:id", authMiddleware, async (req,res) =>{
  try {
    await Post.deleteOne({ _id: req.params.id});
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
})
module.exports = router;

