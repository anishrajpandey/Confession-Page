import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./../styles/admin.module.css";
// import { set } from "mongoose";

const Admin = ({ apiEndpoint, updateApiEndpoint, at }) => {
  const [PostList, setPostList] = useState([]);
  const [Message, setMessage] = useState("");
  const [Limit, setLimit] = useState(0);
  const fetchData = async () => {
    let data = await fetch(apiEndpoint);
    let res = await data.json();

    setPostList(res.data);
  };

  useEffect(() => {
    fetchData();
    fetchLimitData();
  }, [Message]);
  const fetchLimitData = async () => {
    let resp = await fetch(
      `https://graph.facebook.com/v14.0/17841451771977639/content_publishing_limit?access_token=${at}`
    );
    let { data } = await resp.json();

    setLimit(data[0].quota_usage);
  };
  const postToInstagram = async (url, caption = "") => {
    //CREATING MEAIA CONTAINER
    console.log(url);
    let media = await fetch(
      `https://graph.facebook.com/v14.0/17841451771977639/media?image_url=${url}&caption=${caption}&access_token=${at}`,
      {
        method: "POST",
      }
    );
    let { id } = await media.json();
    console.log(id);

    //posting with media_id j
    await fetch(
      `https://graph.facebook.com/v14.0/17841451771977639/media_publish?creation_id=${id}&access_token=${at}`,
      { method: "POST" }
    );
  };
  const handleAccept = async (e) => {
    setMessage("Posting");

    document.body.style.pointerEvents = "none";
    document.body.style.opacity = "0.5";
    const id = e.target.parentElement.parentElement.id;

    let data = await fetch(updateApiEndpoint, {
      method: "POST",
      body: JSON.stringify({ id: id, shouldReturnUrlAsAResponse: true }),
      headers: {
        "Content-Type": "application/json",
      },
      s,
    });
    let { url } = await data.json();
    postToInstagram(url);

    document.body.style.pointerEvents = "all";
    document.body.style.opacity = "1";
    setMessage("Posted");

    setTimeout(() => setMessage(""), 3000);
  };

  const handleReject = async (e) => {
    setMessage("Rejecting");
    e.target.parentElement.parentElement.style.display = "none";
    const id = e.target.parentElement.parentElement.id;

    let res = await fetch(updateApiEndpoint, {
      method: "POST",
      body: JSON.stringify({ id: id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setMessage("Rejected");
    setTimeout(() => setMessage(""), 1000);
  };
  // const [UserName, setUserName] = useState("");
  // const [Password, setPassword] = useState("");
  const [authenticated, setauthenticated] = useState("");
  const handleUserChange = (e) => {
    setUserName(e.target.value);
  };
  const handlePassworChange = (e) => {
    setPassword(e.target.value);
  };
  // const isAuthenticated = (e) => {
  //   e.preventDefault();
  //   if (uid === UserName && pass === Password) {
  //     setauthenticated(true);
  //   } else {
  //     setauthenticated(false);
  //   }
  // };
  return (
    <>
      {/* {!authenticated && (
        <div className={styles.login} onSubmit={isAuthenticated}>
          <form action="/" className={styles.loginform}>
            <div className={styles.form}>
              <h3>Login as ADMIN</h3>
              <input
                type="text"
                onChange={handleUserChange}
                placeholder="Admin ID"
              />
              <input
                type="password"
                placeholder="Admin Password"
                onChange={handlePassworChange}
              />
              <button type="submit">Login</button>
            </div>
          </form>
        </div>
      )} */}
      {/* {authenticated === true && ( */}
      <main>
        {PostList.map((elem) => {
          return (
            elem.isPending && (
              <div key={elem._id} id={elem._id} className={styles.container}>
                <div className={styles.imageContainer}>
                  <Image
                    src={elem.imageURL}
                    height={"600"}
                    width={"600"}
                    alt="Cannot Load Image"
                    // layout={"fill"}
                    objectFit={"contain"}
                    // priority={true}
                  ></Image>
                </div>
                <div className={styles.buttonArea}>
                  <button onClick={handleAccept} disabled={Limit === 25}>
                    Accept
                  </button>
                  <button onClick={handleReject}>Reject</button>
                </div>
              </div>
            )
          );
        })}
        {PostList.filter((e) => e.isPending).length === 0 && (
          <div className={styles.adminMessage}>NO REQUEST</div>
        )}
        <div className={styles.messageBox}>{Message}</div>
        <div className={styles.infoBox}>
          <div>
            Pending Requests:{PostList.filter((e) => e.isPending).length}
          </div>
          <div>Remaining Limits:{25 - Limit}</div>
        </div>
      </main>
      {/* )} */}
      {/* {authenticated === false && (
        <div className={styles.errormsg}>Username or password incorrect</div>
      )} */}
    </>
  );
};

export default Admin;
export async function getServerSideProps() {
  return {
    props: {
      apiEndpoint: process.env.POST_API_ENDPOINT,
      updateApiEndpoint: process.env.UPDATE_API_ENDPOINT,
      at: process.env.ACCESS_TOKEN,
    },
  };
}
