const {Schema, model} = require('mongoose');
const slugify = require("slugify");

const {ObjectId} = Schema.Types;
const courseSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Course name is required'],
        minLength: [3, 'Course name must be 3 character'],
        maxLength: [300, 'Course name is too large'],
        trim: true,
        lowercase: true,
        unique: true
    },
    slug: {
        type: String,
        trim: true,
        lowercase: true,
    },
    description: {
      type: String
    },
    regularPrice: {
        type: Number,
        required: [true, 'price is required'],
    },
    sellPrice: {
        type: Number
    },
    teacherId: {
        type: ObjectId,
        ref: 'Teacher',
        required: [true, 'teacher is required'],
    },
    categoryId: {
        type: ObjectId,
        ref: 'Category',
        required: [true, 'category is required'],
    },
    benefit: [String],
    thumbnail: {
        type: String,
        required: [true, 'thumbnail is required'],
    }

}, {versionKey: false, timestamps: true});

courseSchema.pre('save', function (next) {
    this.slug = slugify(this.name);
    next();
})

const course = model('Course', courseSchema);

module.exports = course;