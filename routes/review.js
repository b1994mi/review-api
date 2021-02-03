const express = require("express");
const Router = express.Router();

const {
  validate
  , createReviewValidator
  , updateReviewByIdValidator
  , getReviewByIdValidator
  , deleteReviewByIdValidator
} = require('../middlewares/reviewValidator')

const {
  createReview
  , getAllReview
  , getReviewById
  , updateReviewById
  , deleteReviewById
} = require("../controllers/review");

Router.route("/")
  .get(getAllReview)
  .post(createReviewValidator, validate, createReview);

Router.route("/:id")
  .get(getReviewByIdValidator, validate, getReviewById)
  .patch(updateReviewByIdValidator, validate, updateReviewById)
  .delete(deleteReviewByIdValidator, validate, deleteReviewById);

module.exports = Router;
