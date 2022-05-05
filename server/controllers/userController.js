const User=require('../model/userModel');
const bcrypt=require('bcrypt');

module.exports.register=async(req,res)=>{
try {
    const {username, email, password}=req.body;
const usernameCheck=await User.findOne({username})
if(usernameCheck){
   return res.json({msg:'Username already used',status:false})}
   const emailCheck=await User.findOne({email});
   if(emailCheck){
       return res.json({msg:'Email already used', status:false})
   }
   const hashedPassword=await bcrypt.hash(password,10);
   const user=await User.create({
       email,
       username,
       password:hashedPassword,

   });
   delete user.password;
   return res.json({status:true,user})
    
} catch (error) {
    next(error);
}

};

module.exports.login=async(req,res)=>{
    try {
        const {username, password}=req.body;
    const user=await User.findOne({username})
   
    if(!user){
       return res.json({msg:'Incorrect username or password',status:false})}
       const isPasswordValid=await bcrypt.compare(password,user.password);
       if(!isPasswordValid){
        return res.json({msg:'Incorrect username or password',status:false})}
        delete user.password
      return res.json({status:true,user})
        
    } catch (error) {
        next(error);
    }
    
    };

    module.exports.setProfilePicture=async(req,res)=>{
        try {
            const userId=req.params.id;
            const profilePicture=req.body.image;
            const userData=await User.findByIdAndUpdate(userId,{
                isProfilePictureSet:true,
                profilePicture,
            },
            {new:true});
            return res.json({isSet:userData.isProfilePictureSet,  image:userData.profilePicture})
        } catch (error) {
            next(error)
        }
    }

    module.exports.getAllUsers=async(req,res)=>{
        try {
            const users=await User.find({_id:{$ne:req.params.id}}).select([
                "email",
                "username",
                "profilePicture",
                "_id",
            ]);
            return res.json(users);
        } catch (error) {
            next(error);
        }
    }
