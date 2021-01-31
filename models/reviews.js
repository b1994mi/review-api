'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Images}) {
      this.hasMany(Images, {
        foreignKey: "review_id"
        , onDelete: 'CASCADE'
      });
    }
  };
  Reviews.init({
    name: {
      type: DataTypes.STRING
      , allowNull: false
    }
    , review_comment: {
      type: DataTypes.STRING
      , allowNull: false
    }
    , review_star: {
      type: DataTypes.INTEGER
      , allowNull: false
    }
  }, {
    sequelize
    , modelName: 'Reviews'
  });
  return Reviews;
};