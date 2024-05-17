import React, { useState, useEffect } from "react";
import axios from "axios";
import SubscriptionCard from "../components/SubscriptionCard";

export default function SubscriberCard(props) {
  const [subscriptionDetails, setSubscriptionDetails] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/getSubscriptionsByMemberID/${props.memberID}`)
      .then((result) => setSubscriptionDetails(result.data))
      .catch((err) => console.log(err));
  }, [props.memberID]);

  return (
    <div>
      <div className=" text-center font-semibold text-[25px] py-3 bg-clip-text text-transparent bg-gradient-to-r from-[#FF451D] to-[#FE7804]">My Favorite Subscriptions</div>
      <div>
        <div>
          {subscriptionDetails.map((item) => (
            <SubscriptionCard
              subscriberID={item._id} 
              memberID={item.memberID} 
              channelID={item.channelID}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
