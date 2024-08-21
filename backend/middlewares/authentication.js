const jwToken= require('jsonwebtoken');

const isLogin = async (req, res,next) => {

try {
    if (req.session.user) {
         
    } 
    else
     {
        res.render('login') ;
    }
    next();
} catch (error) {
    console.log(error.message);
    
}

};

const verifyToken =async(req,res,next)=>{
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({message: 'No token provided'});
        }
        console.log('Authorization',req.headers.authorization);
        const token = req.headers.authorization
        console.log('Token',token);
        const decoded = jwToken.verify(token, process.env.jwt_secret);
        console.log('Decoded',decoded);
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({message: error.message});
    }
}

const isLogout = async (req, res,next) => {

    try {
        if (req.session.user) {
            res.redirect('/dashboard') ;
            
        } 
       
        next();
    } catch (error) {
        console.log(error.message);
        
    }
    
    }
    module.exports = { isLogin, isLogout,verifyToken }