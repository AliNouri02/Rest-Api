const { Router } = require("express");

const blogController = require("../controllers/blogController");

const router = new Router();

//  @desc   Weblog Index Page
//  @route  GET /
router.get("/", blogController.getIndex);

//  @desc   Weblog Post Page
//  @route  GET /post/:id
router.get("/post/:id", blogController.getSinglePost);

//  @desc   Weblog Numric Captcha
//  @route  GET /captcha.png
router.get("/captcha.png", blogController.getCaptcha);

//  @desc   Handle Contact Page
//  @route  POST /contact
router.post("/contact", blogController.handleContactPage);

module.exports = router;
