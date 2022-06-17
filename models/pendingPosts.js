import { Schema, models, model } from "mongoose";
const postSchema = new Schema({
  imageURL: String,
  isPending: Boolean,
});
const pendingPosts = models.pendingPosts || model("pendingPosts", postSchema);
export default pendingPosts;
