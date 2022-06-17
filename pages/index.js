import { toJpeg, toPng } from "html-to-image";
import { useRef, useEffect, useState } from "react";

export default function Home({ apiEndpoint }) {
  const element = useRef();
  const element2 = useRef();
  const [ConfessText, setConfessText] = useState("Confess Here...");
  // useEffect(() => {
  async function convertToPng() {
    let currentElement = element.current;
    let dataUrl = await toPng(currentElement);
    return dataUrl;
  }

  // }, []);
  const handleSubmit = async () => {
    // ***********POSTING TO CLOUDINARY**************

    console.log("Posting to cloudinary");
    let formData = new FormData();
    let imageUrl = await convertToPng(); //dont know why convert to png returns promise instead of string
    formData.append("file", imageUrl);
    formData.append("upload_preset", "confess-uploads");
    // console.log("url is", formData["file"]);
    let res = await fetch(
      "https://api.cloudinary.com/v1_1/ddlejmdqj/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    var { secure_url } = await res.json();
    console.log("posted to cloudinary ", secure_url);
    // ****************POSTING TO MONGODB*************
    console.log("posting to mongo....");
    let body = JSON.stringify({
      imageURL: secure_url,
      isPending: true,
    });
    console.log(body);
    let data = await fetch(apiEndpoint, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });
    let responseFromMongoDB = await data.json();
    console.log(responseFromMongoDB);
    console.log("posted to mongodb.....");
  };

  return (
    <div className="container">
      <h1>Gyanodaya confession Page</h1>

      <div className="main">
        <div
          className="confessPost"
          ref={element}
          style={{ width: "500px", fontSize: "1.5rem" }}
        >
          <span className="logo">@confessgyanodaya</span>
          <div
            type="text"
            contentEditable={true}
            className="textBox"
            onFocus={() => setConfessText("")}
          >
            {/* {ConfessText} */}
          </div>
        </div>
      </div>

      {/* <button onClick={convertToPng}>Test Button</button> */}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
//
export async function getServerSideProps() {
  return {
    props: {
      apiEndpoint: process.env.POST_API_ENDPOINT,
    },
  };
}
