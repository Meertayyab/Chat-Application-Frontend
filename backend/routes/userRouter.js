const express = require('express');
const path = require('path');
const multer = require('multer');
const userController = require('../controllers/userController');
const auth = require('../middlewares/authentication');
const router = express.Router(); // Use express.Router()

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '_' + file.originalname;
        cb(null, name);
    }
});

const upload = multer({ storage: storage });

// Routes
router.get('/register', auth.isLogout, userController.registerLoad);

router.post('/register', upload.single('image'), userController.registerSubmit);

router.get('/', auth.isLogout, userController.loginLoad);

router.delete('/delete/:id', userController.deleteUser);

router.put('/update/:id', upload.single('image'), userController.updateUser);

router.get('/all-users', userController.AllUsers);


router.post('/login', userController.login);

router.get('/logout', auth.isLogin, userController.logout);

router.get('/dashboard', auth.isLogin, userController.dashboard);

router.post('/save-chat', userController.saveChat);

router.get('/check',auth.verifyToken ,userController.checkingToken);

router.get('*', function(req, res){
    res.redirect('/');
});

module.exports = router;
