import mongoose from "mongoose";
const connectToDB = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
};
export default connectToDB;
