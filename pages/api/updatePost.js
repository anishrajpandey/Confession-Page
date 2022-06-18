import mongoose from "mongoose";
import connectToDB from "../../connectmongo";
import pendingPosts from "../../models/pendingPosts";

export default async function handler(req, res) {
  if (!mongoose.connections[0].readyState) {
    await connectToDB();
  }
  if (req.method === "GET") {
    res.status(200).json({ message: "Fuck you..This method is not allowed" });
  }
  if (req.method === "POST") {
    const id = req.body.id;
    let mongores = await pendingPosts.updateOne(
      { _id: `${id}` },
      { $set: { isPending: "false" } }
    );
    if (req.body.shouldReturnUrlAsAResponse) {
          const id = req.body.id;
      const response  = await pendingPosts.findOne({ _id: id })
      res.status(200).json({ url: response.imageURL })
      await pendingPosts.remove({ _id: id })

    }
  }
}
