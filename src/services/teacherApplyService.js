const RoleModel = require("../models/Role");
const TeacherApplyModel = require("../models/TeacherApply");
exports.getAllApplyTeacherService = async (
    {pageNo, perPage, keyword}
)=>{

    const skipPage = (pageNo - 1) * perPage;
    const searchRegex = {$regex: keyword, $options: 'ix'};

    const query = keyword === '0' ? {} : {$or: [
            {firstName: searchRegex},
            {lastName: searchRegex},
            {email: searchRegex},
            {mobile: searchRegex},
            {about: searchRegex},
            {qualification: searchRegex},

        ]
    };

    const teachers = await TeacherApplyModel.aggregate([
        {$match: query},
        {
            $facet:{
                total:[{$count: "count"}],
                rows:[
                    {
                        $project: {
                            email: 1,
                            mobile: 1,
                            firstName: 1,
                            lastName: 1,
                            qualification: 1,
                            about: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            status: 1
                        }
                    },
                    {$skip: skipPage},
                    {$limit: perPage},
                    {$sort: {createdAt: -1}}
                ]
            }
        },


    ])

    return {total: teachers[0]?.total[0]?.count, rows: teachers[0]?.rows};
}