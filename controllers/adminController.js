const Product = require('../models/product');

exports.getAddProduct = (req, res) =>{
    res.render('admin/edit-product.ejs', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postAddProduct = (req, res) => {
    const product = new Product({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        userId: req.user._id
    });
    
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
            product: product,
            isAuthenticated: req.session.isLoggedIn
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

    Product.findById(productId).then(product => {
        product.title = updateTitle;
        product.description = updatedDescription;
        Product.imageUrl = updatedImageUrl;
        product.price = updatedPrice;

        return product.save();
    })
    .then(result =>{
        console.log('Product data updated');
        res.redirect('/admin/products');
    })
    .catch(error => {
        console.log(error);
    });

    res.redirect('/admin/products');

}


exports.getProducts = (req, res) => {
    Product.find()
    .then(products => {
        res.render('admin/products.ejs',
            {
                products: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                isAuthenticated: req.session.isLoggedIn
            }
        );
    })
    .catch(error => {
        console.log('Failed to fetch all for admin controller');
    });
};

exports.postDeleteProduct = (req, res) => {
    const productId = req.body.productId;
    Product.findByIdAndDelete(productId)
    .then(()=>{
        res.redirect('/admin/products');
    });
    
}