const findAllService = (query, model, projection = null) => {
  if (projection !== null) {
    return model.find(query, projection);
  }
  return model.find(query);
};

module.exports = findAllService;
