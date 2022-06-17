import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./../styles/admin.module.css";

const Admin = ({ apiEndpoint, updateApiEndpoint,at }) => {
  const [PostList, setPostList] = useState([]);
  const fetchData = async () => {
    let data = await fetch(apiEndpoint);
    let res = await data.json();
    setPostList(res.data);
  };

  useEffect(() => {
    fetchData();
  });
  const postToInstagram = async (url, caption = "") => {
    //CREATING MEAIA CONTAINER
    console.log(url)
    let media = await fetch(`https://graph.facebook.com/v14.0/17841451771977639/media?image_url=${url}&caption=${caption}&access_token=${at}`, {
      method:"POST"
    })
    let {id} =await media.json(); 
    console.log(id)  


    //posting with media_id
    await fetch(`https://graph.facebook.com/v14.0/17841451771977639/media_publish?creation_id=${id}&access_token=${at}`,{method:'POST'})
    console.log("Success")
  }
  const handleAccept = async(e) => {
    const id = e.target.parentElement.parentElement.id;

   
    let data = await fetch(updateApiEndpoint, {
      method: "POST",
      body: JSON.stringify({id: id ,shouldReturnUrlAsAResponse:true}),
      headers: {
        "Content-Type": "application/json",
      },
    });
    let { url} = await data.json();
    postToInstagram(url)
  };
  
  const handleReject = async (e) => {
    const id = e.target.parentElement.parentElement.id;
    let body = {
      id: "62ac3ddf299fab60def96898",
    };
    let res = await fetch(updateApiEndpoint, {
      method: "POST",
      body: JSON.stringify({id: id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("api request sent");
    console.log(res);
  };
  return (
    <main>
      {PostList.map((elem) => {
       
        return (
          true
         //todo elem.isPending 
          && 
          <div key={elem._id} id={elem._id}>
            <Image
              src={elem.imageURL}
              width={300}
              height={300}
              alt="Cannot Load Image"
            ></Image>
            <span> {elem.isPending ? "True" : "False"}</span>
            <div className={styles.buttonArea}>
              <button onClick={handleAccept}>Accept</button>
              <button onClick={handleReject}>Reject</button>
            </div>
          </div>
        );
      })}
    </main>
  );
};

export default Admin;
export async function getServerSideProps() {
  return {
    props: {
      apiEndpoint: process.env.POST_API_ENDPOINT,
      updateApiEndpoint: process.env.UPDATE_API_ENDPOINT,
      at:process.env.ACCESS_TOKEN
    },
  };
}
// h