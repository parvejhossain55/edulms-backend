const dropDownService = (model, projection, query) => {

    if(query === undefined){
        return model.aggregate([
            {$match: {}},
            {$project: projection}
        ])
    }else {
        return model.aggregate([
            {$match: query},
            {$project: projection}
        ])
    }


}

module.exports = dropDownService;