const { Router } = require("express");
const { authenticated } = require("../middlewares/auth");

const adminController = require("../controllers/adminController");

const router = new Router();

//  @desc   Dashboard Delete Post
//  @route  GET /dashboard/delete-post/:id
router.delete("/delete-post/:id", authenticated, adminController.deletePost);

//  @desc   DashBoard Handle Post Creation
//  @route  POST /dashboard/add-post
router.post("/add-post", authenticated, adminController.createPost);

//  @desc   Dashboard Handle Post Edit
//  @route  POST /dashboard/edit-post/:id
router.put("/edit-post/:id", authenticated, adminController.editPost);

//  @desc   Dashboard Handle Image Upload
//  @route  POST /dashboard/image-upload
router.post("/image-upload", authenticated, adminController.uploadImage);

module.exports = router;
