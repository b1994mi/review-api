const { Reviews, Images } = require("../models")
const { Op } = require("sequelize");

const sendResponse = (res, statusCode, data) => {
  res.status(statusCode).json({
    status: statusCode,
    message: statusCode === 200 ? "ok" : "internal_server_error",
    data
  });
  res.end();
}

exports.createReview = async (req, res) => {
  try {

    // Di sini jelas bahwa validator akan cek apakah request punya files
    // berupa array dan apakah array lebih dari 4 isinya.

    const data = await Reviews.create(req.body)
    let dataimg;
    if (req.files.length > 0) {
      req.files.forEach(element => {
        element.review_id = data.id
      });
      dataimg = await Images.bulkCreate(req.files)
    }

    sendResponse(res, 200, [data, dataimg])
  } catch (error) {
    sendResponse(res, 500, { error });
  }
},

exports.getAllReview = async (req, res) => {
  try {
    const data = await Reviews.findAll({
      include: { model: Images }
    })
    sendResponse(res, 200, data)
  } catch (error) {
    sendResponse(res, 500, { error });
  }
},

exports.getReviewById = async (req, res) => {

  // Di sini perlu validator sederhana apakah review dgn id tsb ada
  // di db atau tidak

  try {
    const id = req.params.id;
    const data = await Reviews.findByPk(id, { include: Images })
    sendResponse(res, 200, data);
  } catch (error) {
    sendResponse(res, 500, { error });
  }
},

exports.updateReviewById = async (req, res) => {

  // Ini perlu validator yang cek Reviews.findAll({include: { model: Images }})
  // supaya tau apakah review itu total image akan melebihi 4 atau tidak

  try {
    const id = req.params.id
    const data = await Reviews.update(req.body, {
      where: {
        id: id
      }
    })
    if (req.body.images_toBeDeleted) {
      const hasil = await Images.destroy({
        where: {
          id: { [Op.or]: req.body.images_toBeDeleted }
          , review_id: id
        }
      })
      console.log(hasil)
    }
    if (req.files.length > 0) {
      req.files.forEach(element => {
        element.review_id = id
      });
      const dataimg = await Images.bulkCreate(req.files)
      console.log(dataimg)
    }
    sendResponse(res, 200, data)
  } catch (error) {
    sendResponse(res, 500, { error });
  }
},

exports.deleteReviewById = async (req, res) => {
  try {
    const id = req.params.id;
    // INGAT, REVIEW HARUS DIHAPUS BARENGAN DGN IMAGES JUGA
    sendResponse(res, 200, data)
  } catch (error) {
    sendResponse(res, 500, { error });
  }
}