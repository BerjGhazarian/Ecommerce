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
router.get('/:id', async (req, res) => {
   try {
      const productData = await Product.findByPk(req.params.id, {
        include: [
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
  
      if (!productData) {
        res.status(404).json({ message: "No product found with that id" });
        return;
      }
      res.status(200).json(productData)
    } catch (err) {
      res.status(500).json(err)
    }
  });
  router.post('/', (req, res) => {
     Product.create(req.body)
      .then((product) => {
        if (req.body.tagIds.length) {
          const productTagIdArr = req.body.tagIds.map((tag_id) => {
            return {
              product_id: product.id,
              tag_id,
            };
          });
          return ProductTag.bulkCreate(productTagIdArr);
        }
       res.status(200).json(product);
      })
      .then((productTagIds) => res.status(200).json(productTagIds))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  });