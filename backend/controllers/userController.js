const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const bcrypt = require('bcrypt');
const jwToken= require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const cloudinaryService = require('../services/Cloudinary')


const generateToken =(user)=>{
    console.log('JWT_Secret from env',process.env.jwt_secret)
return jwToken.sign({user},process.env.jwt_secret,{expiresIn: '1hr'});
};



const registerLoad = async (req, res) => {
    try {
        res.render('register');
    } catch (error) {
        console.log(error.message);
    }
};

const registerSubmit = async (req, res) => {
    try {
        const alreadyExists = await User.findOne({email: req.body.email});
        if (alreadyExists) {
            return res.status(400).json({error: 'Email already exists'});
        }
        // Access password from req.body, not req.params
        const passwordHash = await bcrypt.hash(req.body.password, 10);
        console.log('Data received',req.body);
        let imageUrl = null;
        let public_id = null;
        let image = req.file;
        console.log('image',image);
      if (image) {
        const result = await cloudinaryService.addImage(image);
        imageUrl = result.secure_url;
        public_id = result.public_id;
      }
  
  
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            image: imageUrl,
            public_id,
            password: passwordHash
        });

        await user.save();
        res.status(200).json({message: 'Success registration'});
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
    }
};


const loginLoad = async (req, res) => {
    try {
        res.render('login');
        
    } catch (error) {
        console.log(error.message);
        
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email: email });

        if (!userData) {
             res.status(404).json({error:'User not found'});
             return
        }

        const passwordMatch = await bcrypt.compare(password, userData.password);

        if (passwordMatch) {
            const token = generateToken(userData._id);
            res.status(200).json({msg:'ok',userData,token});
            // return res.redirect('/dashboard');
        } else {
            res.status(401).json({error:'Invalid Credentials'});
            return;
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Internal Server Error');
    }
};

const AllUsers = async (req, res) => {
 try{
    const users = await User.find({});
    res.status(200).json(users);
 }
 catch(error){
     console.log(error.message);
     res.status(500).json(error.message);
 }
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({_id:req.params.id})
        const public_id = user.public_id;
        await cloudinaryService.deleteImage(public_id);
        await user.deleteOne();
        res.status(200).json({message: 'User deleted successfully'});
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
        
    }
};

const updateUser = async (req, res) => {
    try {
        console.log('Request received:', req.body);

        const user = await User.findOne({ _id: req.params.id });
        console.log('Existing user found:', user);

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        const public_id = user.public_id;
        let imageUrl = user.image; // Retain current image URL if no new image is provided
        let public_id_changed = public_id;
        let image = req.file;

        console.log('Image from request:', image);

            if (public_id) {
                console.log('Updating existing image with public_id:', public_id);
                const result = await cloudinaryService.updateImage(public_id, image);
                imageUrl = result.secure_url;
                public_id_changed = result.public_id;
                console.log('Image updated:', result);
            } else {
                console.log('Uploading new image');
                const result = await cloudinaryService.addImage(image);
                imageUrl = result.secure_url;
                public_id_changed = result.public_id;
                console.log('New image uploaded:', result);
            }

        const updateData = {};
        console.log('Preparing update data');

        if (req.body.name) {
            updateData.name = req.body.name;
            console.log('Name to update:', req.body.name);
        }
        if (req.body.email) {
            updateData.email = req.body.email;
            console.log('Email to update:', req.body.email);
        }
        if (req.body.password) {
            updateData.password = await bcrypt.hash(req.body.password, 10);
            console.log('Password hashed and ready to update');
        }
        if (imageUrl) {
            updateData.image = imageUrl;
            console.log('Image URL to update:', imageUrl);
        }
        if (public_id_changed) {
            updateData.public_id = public_id_changed;
            console.log('Public ID to update:', public_id_changed);
        }

        console.log('Final update data:', updateData);

        await User.findOneAndUpdate({ _id: req.params.id }, updateData);
        console.log('User updated successfully with ID:', req.params.id);

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.log('Error during update:', error.message);
        res.status(500).json(error.message);
    }
};





const logout = async (req, res) => {
    try {
        req.session.destroy(() => {
            res.redirect('/');
        });
        
    } catch (error) {
        console.log(error.message);
        
    }
};

const dashboard = async (req, res) => {
    try {
        const users = await User.find({_id: {$nin: [req.session.user._id]}});
        console.log(req.session.user); // Check user details
        console.log(users); // Check users array
        res.render('dashboard', { user: req.session.user, users: users });
    } catch (error) {
        console.log(error.message);
    }
};


const checkingToken = async (req, res) => {
    try {
    const userIdFound = req.user;
    const userData = await User.findOne({_id:userIdFound}).select('-password');
    console.log('User Data in checkingToken',userData);
    return res.status(200).json({msg:'Successfully passed middleware check',userData}); 
    }catch (error) {
        res.status(500).send({success: false, msg:error.message});
    }
}


 const saveChat = async (req, res) => {
    try {
        var chat = new Chat({
            sender_id: req.body.sender_id,
            receiver_id: req.body.receiver_id,
            message: req.body.message
        });
       var newChat = await chat.save();
        res.status(200).send({success: true, msg:'Chat saved successfully',data:newChat});
        
    } catch (error) {
        res.status(404).send({success: false, msg:error.message});
    }
 }

module.exports = {
    registerLoad,
    registerSubmit,
    loginLoad,
    login,
    logout,
    dashboard,
    saveChat,
    checkingToken,
    deleteUser,
    AllUsers,
    updateUser
};
