const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// get all products
router.get('/', async (req, res) => {
  // find all products
try {
    const productData = await Product.findAll({
      include:  [
        { 
          model: Category
        }, 
        { 
          model: Tag, 
          through: ProductTag, 
          as: 'tag_products',
        }
      ]
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});