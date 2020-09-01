const router = require('express').Router();
const {isPublic} = require('../middlewares/checkAuth');

var temp = [
  {
    id: '11648',
    name: 'Pink Flowers Tote Bag',
    description: 'XL-sized tote bag with pink flowers design.',
    price: '₱450.00'
  },
  {
    id: '11834',
    name: 'Green Leaves Tote Bag',
    description: 'L-sized tote bag with green leaves design.',
    price: '₱250.00'
  },
  {
    id: '11675',
    name: 'Assorted Flowers Tote Bag',
    description: 'M-sized tote bag with assorted flowers design.',
    price: '₱150.00'
  },
  {
    id: '11212',
    name: 'Assorted Leaves Tote Bag',
    description: 'XL-sized tote bag with assorted leaves design.',
    price: '₱450.00'
  },
  {
    id: '11828',
    name: 'Pink Flowers Tote Bag',
    description: 'XL-sized tote bag with pink flowers design.',
    price: '₱450.00'
  },
];

router.get('/dashboard', isPublic, (req, res) => {
  res.render('dashboard', {
    title: 'Lipay',
    name: 'Admin Name',
    layout: 'main-admin',
    products: temp
  });
});

router.get('/view_all_items', isPublic, (req, res) => {
  res.render('viewItems', {
    title: 'Lipay',
    name: 'Admin Name',
    layout: 'main-admin',
    products: temp
  });
});

router.get('/add_new_item', isPublic, (req, res) => {
  res.render('addItem', {
    title: 'Lipay',
    name: 'Admin Name',
    layout: 'main-admin',
    products: temp
  });
});

router.get('/delete_items', isPublic, (req, res) => {
  res.render('deleteItems', {
    title: 'Lipay',
    name: 'Admin Name',
    layout: 'main-admin',
    products: temp
  });
});

router.get('/featured_items', isPublic, (req, res) => {
  res.render('featuredItems', {
    title: 'Lipay',
    name: 'Admin Name',
    layout: 'main-admin',
    products: temp
  });
});

router.get('/edit_item_details', isPublic, (req, res) => {
  res.render('editItemDetails', {
    title: 'Lipay',
    name: 'Admin Name',
    layout: 'main-admin',
    products: temp
  });
});

module.exports = router;