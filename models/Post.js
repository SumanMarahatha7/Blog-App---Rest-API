const {mongoose,Schema, model} = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: false,
      unique: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

PostSchema.plugin(uniqueValidator);
const postModel = model("Post", PostSchema);

module.exports = postModel;
