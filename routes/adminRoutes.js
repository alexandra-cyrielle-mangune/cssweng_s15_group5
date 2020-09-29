const router = require('express').Router();
const productController = require('../controllers/productController');
const purchaseController = require('../controllers/purchaseController');
const {productValidation} = require('../validators');
const {isPublic} = require('../middlewares/checkAuth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

var temp = [
  {
    pName: 'Pink Flowers Tote Bag',
    slug: 'pink-flowers-tote-bag',
    desc: 'XL-sized tote bag with pink flowers design.',
    price: '₱450.00'
  },
  {
    pName: 'Green Leaves Tote Bag',
    slug: 'green-leaves-tote-bag',
    desc: 'L-sized tote bag with green leaves design.',
    price: '₱250.00'
  },
  {
    pName: 'Assorted Flowers Tote Bag',
    slug: 'assorted-flowers-tote-bag',
    desc: 'M-sized tote bag with assorted flowers design.',
    price: '₱150.00'
  },
  {
    pName: 'Assorted Leaves Tote Bag',
    slug: 'assorted-leaves-tote-bag',
    desc: 'XL-sized tote bag with assorted leaves design.',
    price: '₱450.00'
  },
  {
    pName: 'Pink Flowers Tote Bag',
    slug: 'pink-flowers-tote-bag',
    desc: 'XL-sized tote bag with pink flowers design.',
    price: '₱450.00'
  },
];

/*
 *  GET METHOD: View all orders (in the dashboard)
 */
router.get('/dashboard', isPublic, purchaseController.getAllPurchases);

/*
 *  GET METHOD: View all items 
 */
router.get('/view_all_items', isPublic, productController.viewAllProducts);

/*
 *  GET METHOD: Add new item 
 */
router.get('/add_new_item', isPublic, (req, res) => {
  res.render('addItem', {
    title: 'Lipay | Administrator',
    name: 'Admin Name',
    layout: 'main-admin'
  });
});

/*
 *  POST METHOD: Add new item 
 */
router.post('/add_new_item', isPublic, upload.single('prodImg'), productValidation, productController.addProduct);

/*
 *  GET METHOD: Delete an item
*/
router.get('/delete_item/:_id', isPublic, productController.deleteProduct);

/*
 *  GET METHOD: Edit an item
 */
router.get('/edit_item/:_id', isPublic, productController.getProduct);

/*
 *  POST METHOD: Edit an item
 */
router.post('/edit_item/:_id', isPublic, productController.editProduct);

/*
 *  GET METHOD: Archived items
 */
router.get('/archived_items', isPublic, productController.getArchivedItems);

/*
 *  GET METHOD: Archive an item
 */
router.get('/archive_item/:_id', isPublic, productController.archiveItem);

/*
 *  GET METHOD: Unarchive an item
 */
router.get('/unarchive_item/:_id', isPublic, productController.unarchiveItem);

/*
 *  GET METHOD: Edit order status
 */
router.get('/edit_status/:_id', isPublic, purchaseController.getOrder);

/*
 *  POST METHOD: Edit order status
 */
router.post('/edit_status/:_id', isPublic, purchaseController.editStatus);

/*
 *  GET METHOD: View order details
 */
router.get('/view_order/:_id', isPublic, purchaseController.getOneOrder);

/*
 *  GET METHOD: Featured items
 */
router.get('/featured_items', isPublic, (req, res) => {
  res.render('featuredItems', {
    title: 'Lipay | Administrator',
    name: 'Admin Name',
    layout: 'main-admin',
    products: temp
  });
});

module.exports = router;