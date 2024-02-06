const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const adminLayout = "../views/layouts/admin";

/*
  GET /
  Admin - Check Login
*/
router.get("/admin", async (req ,res) => {
  try {
    const locals = {
      title: "Admin",
      decsription: "A blog template made with NodeJS and ExpressJS",
    }

    res.render("admin/index", {locals, layout: adminLayout});
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

//0.17 first video part 3