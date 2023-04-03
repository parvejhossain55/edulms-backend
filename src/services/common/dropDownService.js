const dropDownService = (model, projection) => {
    return model.aggregate([
        {$match: {}},
        {$project: projection}
    ])
}

module.exports = dropDownService;