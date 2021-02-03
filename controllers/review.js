const { sendResponse } = require('../middlewares/sendResponse')
const { Reviews, Images } = require("../models")
const { Op } = require("sequelize")

exports.createReview = async (req, res) => {
  try {

    // Execute the INSERT INTO query.
    const data = await Reviews.create(req.body)

    // If there is a file in the req.body,
    if (req.files.length > 0) {
      // add review_id field to it,
      req.files.forEach(element => {
        element.review_id = data.id
      });
      // then execute multiple INSERT INTO
      const q = await Images.bulkCreate(req.files)
      // and append it into data object in the form of Images property.
      data.dataValues.Images = q.map(({ dataValues }) => dataValues)
    }

    // Only select id property for response payload;
    let toBeReturned = {
      id: data.dataValues.id
    }

    // and if there is a File of images, return the id and originalname.
    if (req.files.length > 0) {
      toBeReturned.Images = data.dataValues.Images.map(el => {
        return {
          id: el.id
          , originalname: el.originalname
        }
      })
    }

    sendResponse(res, 200, toBeReturned)
  } catch (error) {
    sendResponse(res, 500, error)
  }
}

exports.getAllReview = async (req, res) => {
  try {
    const data = await Reviews.findAll({ include: { model: Images } })
    sendResponse(res, 200, data)
  } catch (error) {
    sendResponse(res, 500, error)
  }
}

exports.getReviewById = async ({ params: { id } }, res) => {
  try {
    const data = await Reviews.findByPk(id, { include: Images })
    // Validation is done here, otherwise it needs to query twice.
    if (!data) throw `Review with id ${id} is not found`
    sendResponse(res, 200, data);
  } catch (error) {
    sendResponse(res, 500, error)
  }
}

exports.updateReviewById = async (req, res) => {

  // Put commonly used properties inside variables using destructuring.
  const id = req.params.id
  const { name, review_comment, review_star, images_toBeDeleted } = req.body

  try {
    
    // A query for validation and response purposes;
    const review = await Reviews.findByPk(id, { include: Images })
    // if not found, just throw an error;
    if (!review) throw `Review with id ${id} is not found`
    // put review inside data variable
    let data = review.dataValues
    // and then put the Images array to a reviewImgs variable.
    const reviewImgs = review.Images
    
    // Check whether req.images_toBeDeleted is present in reviewImgs
    const testArr = reviewImgs.map(({ id }) => {
      return images_toBeDeleted.includes(id)
    })
    if (images_toBeDeleted.length > 0 && !testArr.includes(true)) {
      throw "None of images_toBeDeleted of this review is found in database"
    }
    
    // Simple validator, it will throw error if sum of images > 4.
    let toDelLeng = images_toBeDeleted.length
    const sumLeng = reviewImgs.length + req.files.length - toDelLeng
    if (sumLeng > 4) {
      throw "Only 4 images max per review!"
    }
    
    // Delete images in db if params images_toBeDeleted is present.
    if (images_toBeDeleted.length > 0) {
      data.Images = reviewImgs.filter(({ dataValues: { id } }) => !images_toBeDeleted.includes(`${id}`))
      await Images.destroy({
        where: {
          id: {
            [Op.or]: images_toBeDeleted // images_toBeDeleted must be an Array!
          }
          , review_id: id
        }
      })
    }
    
    // Add images to db if files are present in request body.
    if (req.files.length > 0) {
      req.files.forEach(element => {
        element.review_id = id
      });
      const dataimg = await Images.bulkCreate(req.files)
      const mappedDataimg = dataimg.map(({ dataValues }) => dataValues)
      data.Images = [...data.Images, ...mappedDataimg]
    }

    // Atleast one must be present for UPDATE query, otherwise skip for efficiency.
    if (name || review_comment || review_star) {
      await Reviews.update(req.body, { where: { id: id } })
    }

    // Only select id property (and originalname for Images) for response payload.
    const toBeReturned = {
      id: data.id
      , Images: data.Images.map(el => {
        return {
          id: el.id
          , originalname: el.originalname
        }
      })
    }

    sendResponse(res, 200, toBeReturned)
  } catch (error) {
    sendResponse(res, 500, error)
  }
}

exports.deleteReviewById = async ({ params: { id } }, res) => {
  try {
    const data = await Reviews.destroy({ where: { id: id } })
    sendResponse(res, 200, data)
  } catch (error) {
    sendResponse(res, 500, error)
  }
}