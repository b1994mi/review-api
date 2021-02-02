const { Reviews, Images } = require("../models")
const { Op } = require("sequelize");

const sendResponse = (res, statusCode, data) => {
  res.status(statusCode).json({
    status: statusCode
    , message: statusCode === 200 ? "ok" : "internal_server_error"
    , data
  });
  res.end();
}

/**
 * TO DO: REFACTOR ALL VALIDATIONS INTO SEPERATE FILES 
 */

/** All non-get controller will send response of the affected data id only
 *  to minimize the data sent from the server to the client. DONE!
 */

exports.createReview = async (req, res) => {
  try {

    // Make sure there isn't id in req.body to prevent changing column id.
    if (req.body.id) {
      throw "Don't use id in the body!"
    }

    // review_star must be a number and between 1-5
    // if (review_star && review_star < 1 && review_star > 5) {
    //   throw "review_star must be between 1-5!"
    // }

    // Execute the INSERT INTO query.
    const data = await Reviews.create(req.body)

    // If there is a file in the req.body
    if (req.files.length > 0) {
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
    console.log(error)
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

exports.getReviewById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Reviews.findByPk(id, { include: Images })
    // If not found, just throw an error.
    if (!data) throw `Review with id ${id} is not found`
    sendResponse(res, 200, data);
  } catch (error) {
    sendResponse(res, 500, error)
  }
}

exports.updateReviewById = async (req, res) => {

  // Put commonly used properties inside variables using destructuring.
  const id = req.params.id
  const { name, review_comment, review_star } = req.body
  let { images_toBeDeleted } = req.body // Use let because it will be mutated.
  let data = {}

  try {

    // Make sure that there is no id in the request body to prevent
    // change in the id column!
    if (req.body.id) {
      throw "Don't use id in the body!"
    }

    // review_star must be a number and between 1-5
    if (review_star <= 0 && review_star > 5) {
      throw "review_star must be between 1-5!"
    }

    // A query for validation purposes;
    const review = await Reviews.findByPk(id, { include: Images })
    // if not found, just throw an error;
    if (!review) throw `Review with id ${id} is not found`
    // put review inside data variable
    data = review.dataValues
    // and then put the Images array to a reviewImgs variable.
    const reviewImgs = review.Images

    // This will make sure that images_toBeDeleted is an array.
    if (images_toBeDeleted && !Array.isArray(images_toBeDeleted)) {
      images_toBeDeleted = [images_toBeDeleted]
    }

    // Check whether req.images_toBeDeleted is present in reviewImgs
    const testArr = data.Images = reviewImgs.map(({ dataValues: { id } }) => images_toBeDeleted.includes(`${id}`))
    if (!testArr.includes(true)) {
      throw "None of images_toBeDeleted is found in database"
    }

    // Simple validator, it will throw error if sum of images > 4.
    let toDelLeng = images_toBeDeleted ? images_toBeDeleted.length : 0
    const sumLeng = reviewImgs.length + req.files.length - toDelLeng
    if (sumLeng > 4) {
      throw "Only 4 images max per review!"
    }

    // Delete images in db if params images_toBeDeleted is present.
    if (images_toBeDeleted) {
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

    // Either one of these variables must be present to do an UPDATE query
    // so that it will skip UPDATE query for efficiency.
    if (name || review_comment || review_star) {
      // Create newObj just to make sure the update() uses only these properties.
      const newObj = { name, review_comment, review_star }
      await Reviews.update(newObj, { where: { id: id } })
    }

    // Only select id property (and originalname for Images)
    // for response payload.
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