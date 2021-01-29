const express = require("express");
const Router = express.Router();

const {
  createReview
  , getAllReview
  , getReviewById
  , updateReviewById
} = require("../controllers/reviewControllers");

Router.route("/")
  .get(getAllReview)
  .post(createReview);

Router.route("/:id")
  .get(getReviewById)
  .patch(updateReviewById)
//   .delete(deleteReviewById);

module.exports = Router;
