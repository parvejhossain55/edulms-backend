const FormHelper = require("../../helpers/FormHelper");
const reviewService = require("../../services/course/reviewService");

exports.addReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.auth._id;

    if (!FormHelper.isIdValid(courseId)) {
      return res.status(400).json({ error: "Course Id is required" });
    }
    if (FormHelper.isEmpty(comment)) {
      return res.status(400).json({ error: "Comment is required" });
    }
    if (FormHelper.isEmpty(rating)) {
      return res.status(400).json({ error: "Rating is required" });
    }

    await reviewService.addReview({
      course: courseId,
      userId,
      rating,
      comment,
    });
    res.status(201).send("Review added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
