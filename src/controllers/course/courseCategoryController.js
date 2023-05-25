const courseCategoryService = require("../../services/course/courseCategoryService");
const FormHelper = require("../../helpers/FormHelper");
const listService = require("../../services/common/listService");
const DataModel = require("../../models/CourseCategory");
const dropDownService = require("../../services/common/dropDownService");
const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (FormHelper.isEmpty(name)) {
      return res.status(400).json({
        error: "Category is required",
      });
    }
    const category = await courseCategoryService.createCategory({ name });
    res.status(201).json({
      category,
    });
  } catch (e) {
    next(e);
  }
};

// const getCategories = async (req, res, next) => {
//   try {
//     const categories = await listService(req, DataModel, SearchArray);
//     // const categories = await courseCategoryService.getAllCategories(req.params);
//     res.status(200).json(categories);
//   } catch (e) {
//     next(e);
//   }
// };

const getCategories = async (req, res, next)=>{
  try {
    let SearchRgx = {$regex: req.params.searchKeyword, $options: "i"};
    let SearchArray = [
      {name: SearchRgx},
    ];
    const categories = await listService(req, DataModel, SearchArray);
    res.status(200).json({categories});
  }catch (e) {
    next(e);
  }
}



const getAllCategories = async (req, res, next) => {
  try {
    const categories = await courseCategoryService.getAllCategories(req.params);
    res.status(200).json(categories);
  } catch (e) {
    next(e);
  }
}
// const getAllCategories = async (req, res, next) => {
//   try {
//     const categories = await courseCategoryService.getAllCategories(req.params);
//     res.status(200).json(categories);
//   } catch (e) {
//     next(e);
//   }
// };

//     let SearchRgx = {$regex: req.params.searchKeyword, $options: "i"};
//     let SearchArray = [
//       {name: SearchRgx},
//     ];
//     const categories = await listService(req, DataModel, SearchArray);
//     res.status(200).json({categories});
//   }catch (e) {
//     next(e);
//   }
// }



const getCategorybyID = async (req, res, next) => {
  try {
    const id = req.params.id;

    const category = await DataModel.findById(id);
    res.status(200).json(category);
  } catch (e) {
    next(e);
  }
};
const dropDownCategories = async (req, res, next) => {
  try {
    const projection = {
      label: "$name",
      value: "$_id",
      name: 1,
    };
    const categories = await dropDownService(DataModel, projection);
    res.status(200).json(categories);
  } catch (e) {
    next(e);
  }
};
const updateCategory = async (req, res, next) => {
  try {
    const catId = req.params.id;
    const { name } = req.body;
    if (FormHelper.isEmpty(name)) {
      res.status(400).json({
        error: "Category is required",
      });
    }

    const category = await courseCategoryService.updateCategory(catId, name);
    res.status(200).json({ category });
  } catch (e) {
    next(e);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const catId = req.params.id;

    const category = await courseCategoryService.deleteCategory(catId);
    res.status(200).json({ category });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  dropDownCategories,
  getCategorybyID,
  getAllCategories,
};
