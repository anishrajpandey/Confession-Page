import { toPng, toJpeg } from "html-to-image";
import { useRef, useState } from "react";
import Image from "next/image";

export default function Home({ apiEndpoint }) {
  const mainElement = useRef();
  const textPreview = useRef();
  const [ConfessText, setConfessText] = useState("Preview");
  const [Loading, setLoading] = useState(false);
  const [ShowMessage, setShowMessage] = useState(false);
  const [SubmittedMessage, setSubmittedMessage] = useState("Submit");

  const handleSubmit = async () => {
    // ********Maintaining the aspect ratio**********
    mainElement.current.style.width =
      0.8 * mainElement.current.clientHeight + "px";

    // mainElement.current.style.aspectRatio = "4/5";s
    let dataUrl = await toPng(mainElement.current);

    // mainElement.current.style.width = "450px !important";
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
    setSubmittedMessage("Submitted");
    setLoading(false);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      setSubmittedMessage("Submit");
    }, 3000);
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
            <textarea
              className="textArea"
              onChange={(e) => {
                setConfessText(e.target.value);
              }}
              placeholder="Confess Here..."
            ></textarea>
            {(SubmittedMessage !== "Submitted" ? true : false) && (
              <button
                onClick={handleSubmit}
                disabled={
                  Loading || (SubmittedMessage === "Submitted" ? true : false)
                }
              >
                {SubmittedMessage}
              </button>
            )}
            <br />
            <br />
            <br />
            <h2>Preview..</h2>
            <div className="confessPost" ref={mainElement}>
              <span className="logo">@confess_gyanodaya</span>
              <div type="text" className="textBox" ref={textPreview}></div>
              {ConfessText}
            </div>
          </div>
        )}

        {ShowMessage && (
          <div className="msgContainer">
            <div className="msgBox">
              <span>&#10003;</span> <p>Submitted</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
  // hello my na,
}

export async function getServerSideProps() {
  return {
    props: {
      apiEndpoint: process.env.POST_API_ENDPOINT,
    },
  };
}
