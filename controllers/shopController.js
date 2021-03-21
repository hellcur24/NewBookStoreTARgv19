const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res)=> {
    Product.find()
    .then(products => {
        res.render('shop/product-list.ejs', {
        products: products,
        pageTitle: 'All Products',
        path: '/products'
        }); 
    })
    .catch(error => {
        console.log('Failed to fetch for shop controller');
    });
};

exports.getProduct = (req, res) => {
    const productId = req.params.productId;
        
    Product.findById(productId)
    .then(product => {
        res.render('shop/product-detail.ejs', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    });  
};

exports.getCart = (req, res) => {
    req.user.getCart()
    .then(products =>{
        res.render('shop/cart.ejs', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
        });
    })
    .catch(error => {
        console.log('Failed to fetch the cart');
    });
}

exports.postCart = (req, res) => {
    const productId = req.body.productId;
    Product.findById(productId)
    .then(product =>{
       return req.user.addToCart(product);
    })
    .then(result => {
        console.log("Product saved to cart");
        res.redirect('/cart');
    });   
}

exports.postDeleteFromCart = (req, res) => {
    const productId = req.body.productId;
    req.user.deleteItemFromCart(productId)
    .then(result => {
        res.redirect('/cart');
    })
    .catch(error=>{
        console.log('Failed to delete an item from cart.');        
    });
}

exports.postOrder = (req, res) => {
    req.user.addOrder()
    .then(result => {
        res.redirect('/orders');
    })
    .catch(error => {
        console.log(error);
    });
}

exports.getOrders = (req,res) => {
    req.user.getOrders()
    .then(orders => {
        res.render('shop/orders.ejs', {
            path: '/orders',
            pageTitle: 'Your Orders',
            orders: orders
        });
    })
    .catch(error => {
        console.log(error);
    });
}