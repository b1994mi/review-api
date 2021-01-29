'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Images extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Images.init({
    review_id: {
      type: DataTypes.INTEGER
      , allowNull: false
    }
    , originalname: {
      type: DataTypes.STRING
      , allowNull: false
    }
    , size: {
      type: DataTypes.INTEGER
      , allowNull: false
    }
    , buffer: {
      type: DataTypes.BLOB
      , allowNull: false
    }
  }, {
    sequelize
    , modelName: 'Images'
  });
  return Images;
};