const userService = require('../services/userService');

exports.getUserProfile = async (req, res, next)=>{
    try {
        const user = await userService.findUserById(req.auth?._id);
        if (!user){
            return res.status(401).json({
                status: 'fail',
                error: 'User not found'
            });
        }

        res.status(200).json({
            user: {
                picture: user.picture,
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        })

    }catch (e) {
        console.log(e)
        next(e)
    }
};

exports.patchUser = async (req, res, next)=>{
    try {

        const {firstName, lastName} = req.body;
        const user = userService.findUserById(req.auth?._id);

        const fName = firstName !== "" ? firstName : user?.firstName;
        const lName = lastName !== "" ? lastName : user?.lastName;

        const filename = {
            public_id: req?.file?.cloudinaryId,
            secure_url: req?.file?.cloudinaryUrl,
        };

        const isUpdate = await userService.userProfileUpdateService(req.auth?._id, fName, lName, filename);

        if (isUpdate.modifiedCount === 0){
            return res.status(200).json({
                message: 'profile not update'
            })
        }
        res.status(200).json({
            message: 'profile update successfully'
        })
    }catch (e) {
        next(e)
    }
};
