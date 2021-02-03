const { body, param, validationResult } = require('express-validator')
const { sendResponse } = require('./sendResponse')
const { Reviews } = require('../models')

exports.validate = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const e = errors.errors.map(({ msg }) => msg).join(", ")
        return sendResponse(res, 500, e)
    }
    return next()
}

exports.createReviewValidator = [
    body().exists().withMessage("You didn't provide formdata!")
    , body("id", "Don't use id in the body!").isEmpty()
    , body("name", "Please fill in name").notEmpty().trim().escape()
    , body("review_comment", "Please write your review").notEmpty().trim().escape()
    , body("review_star").notEmpty().withMessage("Please provide review_star").toInt().isInt({ min: 1, max: 5 }).withMessage("Only between 1 - 5")
]

exports.updateReviewByIdValidator = [
    body().exists().withMessage("You didn't provide formdata!")
    , body("id", "Don't use id in the body!").isEmpty()
    , body("name", "Please fill in name").optional().trim().escape()
    , body("review_comment", "Please write your review").optional().trim().escape()
    , body("review_star", "Only between 1 - 5").optional().toInt().isInt({ min: 1, max: 5 })
    , body("images_toBeDeleted").toArray().customSanitizer(value => {
        return value.map(el => parseInt(el))
    })
]

exports.getReviewByIdValidator = [
    param("id", "Please provide integer id!").isInt()
]

exports.deleteReviewByIdValidator = [
    param("id", "Please provide integer id!").isInt().custom(async (val) => {
        const rev = await Reviews.findByPk(val);
        return rev ? true : Promise.reject(`The id ${val} is not found!`)
    })
]