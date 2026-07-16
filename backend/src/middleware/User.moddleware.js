


const authmiddleware =(req,res,next)=>{
   try {
      const token = req.headers.authorization.split(' ')[1]; 
      if(!token){
         return res.status(401).json({ message: 'Unauthorized' });
      }
        const session = jwt.verify(token, process.env.JWT_SECRET);
        req.session = session;
        next();
   } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
   }

}


const adminmiddleware =(req,res,next)=>{
   if(req.session.role !== 'admin'){
      return res.status(403).json({ message: 'Admin access  required' });
   }
   next();
}

exports.authmiddleware = authmiddleware;
exports.adminmiddleware = adminmiddleware;