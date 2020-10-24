import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async (req, res, next) => {
    var token ;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        console.log('token found');
        try{
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_TOKEN);
            console.log('decoded token', decoded);

            req.user = await User.findById(decoded.id).select('-password');

            next();
        }catch(err){
            console.log(err.message);
            res.status(401).json({ error: err.message});
        }
    }

    if( !token ){
        res.status(401).json({ error: 'Not Authorized, try logout and Login again!' })
    }

}

export { protect };