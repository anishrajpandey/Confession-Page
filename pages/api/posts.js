import mongoose from "mongoose";
import connectToDB from "../../connectmongo";
import pendingPosts from "../../models/pendingPosts";
export default async function handler(req, res) {
  if (!mongoose.connections[0].readyState) {
    await connectToDB();
  }
  if (req.method === "POST") {
    res.status(200).json({ message: "This is a POSt request" });

    let responseFromMongoDB = await pendingPosts.create(req.body);
    console.log(responseFromMongoDB);
  } else if (req.method === "GET") {
    let data = await pendingPosts.find();

    res.status(200).json({ data });
  }
}
