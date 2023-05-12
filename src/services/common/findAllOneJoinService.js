const findAllOneJoinService = ( model, join, projection = null) => {
    if (projection !== null) {
        return model.aggregate([
            {$match: {}},
            join,
            projection
        ])
    }
    return model.aggregate([
        {$match: {}},
        join

    ]);
};

module.exports = findAllOneJoinService;
