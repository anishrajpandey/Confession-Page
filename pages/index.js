import {  toPng ,toJpeg} from "html-to-image";
import { useRef, useEffect, useState } from "react";

export default function Home({ apiEndpoint }) {
  const mainElement = useRef();
  const [ConfessText, setConfessText] = useState("Confess Here...");
  const [Loading, setLoading] = useState(false)


  const handleSubmit = async () => {
        let dataUrl = await toPng(mainElement.current);

    // ***********POSTING TO CLOUDINARY**************
setLoading(true)

    let formData = new FormData();
  
    formData.append("file", dataUrl);
    formData.append("upload_preset", "confess-uploads");
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
    console.log("posted to mongodb.....");
setLoading(false)
    
  };

  return (
    Loading?"Loading":
    (<div className="container">
      <h1>Gyanodaya confession Page</h1>

      <div className="main">
        <div
          className="confessPost"
          ref={mainElement}
          style={{ width: "500px", fontSize: "1.5rem" }}
        >
          <span className="logo">@confessgyanodaya</span>
          <div
            type="text"
            contentEditable={true}
            suppressContentEditableWarning={true}
            className="textBox"
            onFocus={() => setConfessText("")}
          >
            {ConfessText}
          </div>
        </div>
      </div>

      {/* <button onClick={convertToPng}>Test Button</button> */}
      <button onClick={handleSubmit}>Submit</button>
    </div>)
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
