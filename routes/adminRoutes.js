const router = require('express').Router();
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const purchaseController = require('../controllers/purchaseController');
const {isPrivate} = require('../middlewares/checkAuth');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({storage: storage});

/*
 *  GET METHOD: Add new item 
 */
router.get('/add_new_item', isPrivate, (req, res) => {
  res.render('addItem', {
    title: 'Lipay | Administrator',
    name: 'Admin Name',
    layout: 'main-admin'
  });
});

/*
 *  POST METHOD: Add new item 
 */
router.post('/add_new_item', isPrivate, upload.single('image'), productController.addProduct);

/*
 *  GET METHOD: View all orders (in the dashboard)
 */
router.get('/view_all_orders', isPrivate, purchaseController.getAllPurchases);

/*
 *  GET METHOD: View all items 
 */
router.get('/view_all_items', isPrivate, productController.viewAllProducts);

/*
 *  GET METHOD: Delete an item
*/
router.get('/delete_item/:_id', isPrivate, productController.deleteProduct);

/*
 *  GET METHOD: Edit an item
 */
router.get('/edit_item/:_id', isPrivate, productController.getProduct);

/*
 *  POST METHOD: Edit an item
 */
router.post('/edit_item/:_id', isPrivate, upload.single('image'), productController.editProduct);

/*
 *  GET METHOD: Archived items
 */
router.get('/archived_items', isPrivate, productController.getArchivedItems);

/*
 *  GET METHOD: Archive an item
 */
router.get('/archive_item/:_id', isPrivate, productController.archiveItem);

/*
 *  GET METHOD: Unarchive an item
 */
router.get('/unarchive_item/:_id', isPrivate, productController.unarchiveItem);

/*
 *  GET METHOD: Edit order status
 */
router.get('/edit_status/:_id', isPrivate, purchaseController.getOrder);

/*
 *  POST METHOD: Edit order status
 */
router.post('/edit_status/:_id', isPrivate, purchaseController.editStatus);

/*
 *  GET METHOD: View order details
 */
router.get('/view_order/:_id', isPrivate, purchaseController.getOneOrder);

/*
 *  GET METHOD: Featured items
 */
router.get('/featured_items', isPrivate, productController.getFeaturedItems);

/*
 *  GET METHOD: Feature an item
 */
router.get('/feature_item/:_id', isPrivate, productController.featureItem);

/*
 *  GET METHOD: Unfeature an item
 */
router.get('/unfeature_item/:_id', isPrivate, productController.unfeatureItem);

router.get('/dashboard', isPrivate, (req, res) => {
  res.render('dash-1', {
    title: 'Lipay | Administrator',
    layout: 'main-admin'
  });
});

module.exports = router;