const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const productController = require('../controllers/product-controller');
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const categoryController = require('../controllers/category-controller');
const postController = require('../controllers/post-controller');

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);
router.post('/new/product', productController.createProduct);
router.get('/user/me', authMiddleware, userController.getUserId);
router.get('/products', productController.getProducts);
router.get('/category', categoryController.getCategory);
router.post('/new/category', categoryController.createCategory);
router.put('/review', authMiddleware, productController.createReview)

router.post('/posts', authMiddleware, postController.create);
router.get('/posts', postController.getAll);
router.get('/post/:id', postController.getOne);
router.delete('/post/:id', authMiddleware, postController.remove);
router.patch('/post/:id', authMiddleware, postController.update);

module.exports = router
