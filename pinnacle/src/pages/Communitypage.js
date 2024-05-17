import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Commiunity_display_card from "../components/Commiunity_display_card";
import Footer from "../components/Footer";
import axios from "axios";
import Event from "../assets/commiunity/event.png";

export default function Communitypage() {
  const userId = localStorage.getItem('userId');
  var pageid = "Community";
  const [CommunityPosts, setCommunityPosts] = useState([]);
  const [allViews, setAllViews] = useState([]);
  const [btn, setBtn] = useState(true);

  //read community post details
  useEffect(() => {
    axios
      .get(`http://localhost:3001/${pageid}`)
      .then((result) => setCommunityPosts(result.data))
      .catch((err) => console.log(err));
  }, [pageid]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/${"views"}`)
      .then((result) => setAllViews(result.data))
      .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
      for (const item of allViews) {
        if (item.userId === userId) {
          setBtn(false);
          return;
        }
      }
    }, [allViews, userId]);

  const createViewBatle = (e) => {
    const userId = localStorage.getItem('userId');
    e.preventDefault();
    try {
      const response = axios.post(
        "http://localhost:3001/createViewBatle",
        {
          userId,
        }
      );

      console.log("Community Event created successfully:", response.data);
    } catch (error) {
      console.error("Error creating community Event:", error);

    }
  };

  return (
    <div>
      <Header navid="community"/>
      <div className=" w-11/12 mx-auto mt-9">
        <h1 className=" text-[32px] font-bold text-white">Upcoming Games</h1>
        <div className=" flex justify-between flex-wrap">
          {CommunityPosts.map((item) => {
            return (
              <div className=" w-[30%]">
                <Commiunity_display_card
                  id={item._id}
                  post={item.postUrl}
                  description={item.description}
                  name={item.name}
                  releasedate={item.releasedate}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className=" mt-10">
        <div className=" w-11/12 mx-auto mt-9">

          <h1 className=" text-[32px] font-bold text-white">Upcoming Events</h1>

          <div className=" relative mt-4">
            <img className="w-[80%] h-[500px] mx-auto" src={Event} />
              {btn && (<button onClick={(e)=> {createViewBatle(e); window.location.reload();}} className=" border-2 border-[#FE7804] text-[#FE7804] text-[20px] hover:text-white hover:bg-[#FE7804] font-bold px-6 py-2 rounded-md absolute bottom-14 left-[45%]">
                Register
              </button>)}
              {!btn && (<p className=" text-[#FE7804] absolute bottom-14 left-[40%] font-bold ">You are already registered to this event</p>)}
          </div>
        </div>
        <div className=" mt-9">
          <Footer />
        </div>
      </div>
    </div>
  );
}
