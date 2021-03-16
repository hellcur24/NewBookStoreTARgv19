const Product = require('../models/product');

exports.getAddProduct = (req, res) =>{
    res.render('admin/edit-product.ejs', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res) => {
    const product = new Product(req.body.title, req.body.imageUrl, req.body.price, req.body.description);
    product.save()
    .then(result => {
        console.log("Product saved");
        res.redirect('/admin/products');
    })
    .catch(error => {
        console.log("Failed to save");
        res.redirect('/');
    });
    
};


exports.getEditProduct = (req, res) =>{
    const editMode = req.query.edit;
    const productId = req.params.productId;

    Product.findById(productId)
    .then(product => {
        if(!product){
            return res.redirect('/');
        }
        res.render('admin/edit-product.ejs',{
            pageTitle: 'Edit Product',
            path: 'admin/edit-product',
            editing: editMode,
            product: product
        });
    })
    .catch(error => {
        console.log(error);
    });
};

exports.postEditProduct = (req, res) => {
    const productId = req.body.productId;
    const updateTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;

    const updatedProduct = new Product(updateTitle, updatedImageUrl, updatedPrice, updatedDescription, productId);
    updatedProduct.save();
    res.redirect('/admin/products');

}


exports.getProducts = (req, res) => {
    Product.fetchAll()
    .then(products => {
        res.render('admin/products.ejs',
            {
                products: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            }
        );
    })
    .catch(error => {
        console.log('Failed to fetch all for admin controller');
    });
};

exports.postDeleteProduct = (req, res) => {
    const productId = req.body.productId;
    Product.deleteById(productId)
    .then(()=>{
        res.redirect('/admin/products');
    });
    
}