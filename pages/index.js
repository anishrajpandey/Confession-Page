import { toPng, toJpeg } from "html-to-image";
import { useRef, useState } from "react";
import Image from "next/image";

export default function Home({ apiEndpoint }) {
  const mainElement = useRef();
  const [ConfessText, setConfessText] = useState("Confess Here...");
  const [Loading, setLoading] = useState(false);
  const [ShowMessage, setShowMessage] = useState(false);

  const handleSubmit = async () => {
    let dataUrl = await toPng(mainElement.current);

    // ***********POSTING TO CLOUDINARY**************
    setLoading(true);

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
    console.log("posted to mongodb.....");
    setLoading(false);
    setShowMessage(true);
  };

  return (
    <>
      <div className="container">
        <h1>Gyanodaya confession Page</h1>
        {Loading ? (
          <div className="loaderBox">
            <Image
              src="/loader.gif"
              alt="Loading..."
              width="200"
              height="200"
            ></Image>
            <h2>POSTING....</h2>
          </div>
        ) : (
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
        )}
        <button onClick={handleSubmit} disabled={Loading}>
          Submit
        </button>
        {/* {ShowMessage} && (
        <div className="msgBox"> */}
        {/* <p>
            Request Successfully Sent. Your post will be published to instagram
            once approved by the admin:|
          </p> */}
        {/* </div> */}
        {/* ) */}
      </div>
    </>
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
