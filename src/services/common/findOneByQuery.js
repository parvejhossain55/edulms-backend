const findOneByQuery = (query, model, projection = null) => {
    if (projection !== null){
        return model.findOne(query, projection);
    }
    return model.findOne(query);

}

module.exports = findOneByQuery