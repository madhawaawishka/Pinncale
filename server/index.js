const express = require("express");
const mongoose = require("mongoose");
const pdf = require('html-pdf');
const cors = require("cors");
const { resolve } = require('path');
const nodeMailer = require("nodemailer");

const path = require('path');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

const env = require('dotenv').config({ path: './.env' });
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_51P0Ggb02NNbm5WjcvAZ8IAsOgpidQiTfSeqewumWezdCAORzNCcfATJXnNGG0CIMHcqOcFsjigLKuKgMrJJHMNhW00vtdgHWvv');
const BankCardModel = require("./models/BankCards");
const PrimiumPlanModel = require("./models/PremiumPlan");
const CartModel = require("./models/Cart");
const MemberModel = require("./models/User");
const LeaderBoardModel = require("./models/LeaderBoard");
const GameModel = require("./models/Game");
const PaymentModel = require("./models/Payment");
const DownloadModel = require("./models/Downloads");
const CommunityModel = require("./models/Community");
const StreamModel = require("./models/Stream");
const ChannelModel = require("./models/Channel");
const SeasonModel = require("./models/Season");
const SubscriberModel = require("./models/Subscribers");
const ViewBatleModel = require("./models/Viewsbatle");

// feedback and faq
const FeedbackModel =require('./models/Feedback')
const FaqModel  =require('./models/faqs')



const pdfTemplate = require('./documents');

const UserModel = require('./models/User');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const store = session.MemoryStore();

const app = express();
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: false,
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    },
    store,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://pinnacleitp:pinnacle123@crud.vsshiuj.mongodb.net/?retryWrites=true&w=majority&appName=crud",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// mongoose.connect("mongodb://127.0.0.1:27017/pinnacle")

//if conflict remove
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });


const transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth:{
    user: 'nilinduwara2001.08.02@gmail.com',
    pass: 'vhhffcblqgwtorfw'
  }
});

app.post('/send-paymentemail', async (req, res) => {
  const { to, subject, html } = req.body;

  try {
    const info = await transporter.sendMail({
      from: 'nilinduwara2001.08.02@gmail.com',
      to: to,
      subject: subject,
      html: html,
    });
    res.send("Email sent successfully!");
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to send email.");
  }
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//----------multer end
//create new bank card details
app.post("/createBankCard", (req, res) => {
  BankCardModel.create(req.body)
    .then((bankcard) => res.json(bankcard))
    .catch((err) => res.json(err));
});

app.post("/createViewBatle", (req, res) => {
  ViewBatleModel.create(req.body)
    .then((batle) => res.json(batle))
    .catch((err) => res.json(err));
});

// get all the bank card details
// app.get('/', (req, res) => {
//     BankCardModel.find({})
//     .then(bankcards => res.json(bankcards))
//     .catch(err => res.json(err))
// })

// get specific cards details related to the given memberid
app.get("/getBankCardByUserID/:id", (req, res) => {
  const id = req.params.id;
  BankCardModel.find({ memberID: id })
    .then((cards) => {
      if (cards.length > 0) {
        res.json(cards);
      } else {
        res.json({ message: "No cards found for memberID 1" });
      }
    })
    .catch((err) => res.json(err));
});

//update nickname
app.put("/updateNickName/:id", (req, res) => {
  const id = req.params.id;
  BankCardModel.findByIdAndUpdate(
    { _id: id },
    {
      CardName: req.body.cardName,
    }
  )
    .then((bankcards) => res.json(bankcards))
    .catch((err) => res.json(err));
});

//delete card details
app.delete("/deleteCardDeatils/:id", (req, res) => {
  const id = req.params.id;
  BankCardModel.findByIdAndDelete({ _id: id })
    .then((res) => res.json(res))
    .catch((err) => res.json(err));
});

//create premium plan
app.post("/createPremiumPlane", (req, res) => {
  PrimiumPlanModel.create(req.body)
    .then((premiumplan) => res.json(premiumplan))
    .catch((err) => res.json(err));
});

//get premium plan details using id
app.get("/getPlanById/:id", (req, res) => {
  const id = req.params.id;
  PrimiumPlanModel.findById(id)
    .then((premiumplan) => {
      if (premiumplan) {
        res.json(premiumplan);
      } else {
        res.status(404).json({ message: "No plan found for the given ID" });
      }
    })
    .catch((err) => res.status(500).json({ message: "Internal Server Error" }));
});

// app.get('/getcartitems',(req,res) =>{
//     CartModel.find({})
//     .then(ItemDetails => res.json(ItemDetails))
//     .catch(err => res.json(err))
// })

//create new bank card details
app.post("/createCartItem", (req, res) => {
  CartModel.create(req.body)
    .then((carts) => res.json(carts))
    .catch((err) => res.json(err));
});

//get cart details related to member
app.get("/getCartItemByMemberID/:id", (req, res) => {
  const id = req.params.id;
  CartModel.find({ memberID: id })
    .then((carts) => {
      if (carts.length > 0) {
        res.json(carts);
      }
    })
    .catch((err) => res.json(err));
});

//get cart item by id
app.get("/getCartItemById/:id", (req, res) => {
  const id = req.params.id;
  CartModel.findById(id)
    .then((cart) => {
      if (cart) {
        res.json(cart);
      } else {
        res.status(404).json({ message: "No item found for the given ID" });
      }
    })
    .catch((err) => res.status(500).json({ message: "Internal Server Error" }));
});

//delete cart items
app.delete("/deleteCartItem/:id", (req, res) => {
  const id = req.params.id;
  CartModel.findByIdAndDelete({ _id: id })
    .then((ItemDetails) => res.json(ItemDetails))
    .catch((err) => res.json(err));
});

//delete cart when a game is deleted items
app.delete("/deleteCartItemWhenGameUnavailable/:id", (req, res) => {
  const id = req.params.id;
  CartModel.deleteMany({ gameID: id })
    .then(() => res.json({ message: "All related cart items deleted successfully" }))
    .catch((err) => res.json(err));
});

// app.get('/getSuggestedGameIds/:genres', async (req, res) => {
//   try {
//     const genres = req.params.genres.split(',');
//     const suggestedGames = await GameModel.find({ genre: { $in: genres } }).select('_id');
//     const gameIds = suggestedGames.map(game => game._id); 

//     res.json(gameIds);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });
// // console.log(suggestedGames);

app.get("/:id", (req, res) => {
  const id = req.params.id;

  //get leaderboard details
  if (id === "LeaderBoard") {
    // LeaderBoardModel.find({})
    // .sort({ viewcount: -1 }) // Sorting by viewcount column in descending order
    // .then((LeaderboardDetails) => res.json(LeaderboardDetails))
    // .catch((err) => res.json(err));
    ChannelModel.find({})
    .sort({ viewCount: -1 }) // Sorting by viewcount column in descending order
    .then((channel) => res.json(channel))
    .catch((err) => res.json(err));
  } 
  //get all the premium plan details
  else if (id === "premiumplan") {
    PrimiumPlanModel.find({})
      .then((premiumplan) => res.json(premiumplan))
      .catch((err) => res.json(err));
  }
  //get all the premium plan details
  else if (id === "game") {
    GameModel.find({})
      .then((game) => res.json(game))
      .catch((err) => res.json(err));
  }
  //get all the premium plan details
  else if (id === "Community") {
    CommunityModel.find({})
      .then((community) => res.json(community))
      .catch((err) => res.json(err));
  }
  //get all the stream details
  else if (id === "stream") {
    StreamModel.find({})
      .then((stream) => res.json(stream))
      .catch((err) => res.json(err));
  }
   //get all the cart details
   else if (id === "cart") {
    CartModel.find({})
      .then((carts) => res.json(carts))
      .catch((err) => res.json(err));
  }
  else if (id === "Aleaderboard") {
    LeaderBoardModel.find({})
    .then((LeaderboardDetails) => res.json(LeaderboardDetails))
    .catch((err) => res.json(err));
  }

  //feddback and faq 
  else if (id === "fblist") {
    FeedbackModel.find({})
    .then(feedbacks =>res.json(feedbacks))
    .catch(err => res.json(err))
  }
  else if (id === "faq") {
    FaqModel.find({})
    .then(faqs =>res.json(faqs))
    .catch(err => res.json(err))
  }
  else if (id === "views") {
    ViewBatleModel.find({})
    .then(batle =>res.json(batle))
    .catch(err => res.json(err))
  }
});

//deled all leaderboard
app.delete("/deleteAllLeaderboardRecords", (req, res) => {
  LeaderBoardModel.deleteMany({})
    .then(() => res.json({ message: "All records deleted successfully." }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

//create leaderboard 
app.post("/createLeaderboard", (req, res) => {
  LeaderBoardModel.create(req.body)
    .then((leaderboard) => res.json(leaderboard))
    .catch((err) => res.json(err));
});


// app.put("/updateViewCount/:id", (req, res) => {
//   const id = req.params.id;
//   StreamModel.findByIdAndUpdate({ _id: id },
//     {
//       viewCount: req.body.viewCount,
//     }
//   )
//     .then((stream) => res.json(stream))
//     .catch((err) => res.json(err));
// });



//get member details using member id
app.get("/getmemberbyid/:id", (req, res) => {
  const id = req.params.id;
  UserModel.findById({ _id: id })
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "No game found for the given ID" });
      }
    })
    .catch((err) => res.status(500).json({ message: "Internal Server Error" }));
});

app.post("/api/payment", async (req, res) => {
  try {
    const { payment_method_id, subtotal, description } = req.body;

    // Create a PaymentIntent on the server using the Stripe API
    const paymentIntent = await stripe.paymentIntents.create({
      payment_method: payment_method_id,
      amount: subtotal * 100, // Amount in cents
      currency: "usd",
      description: description,
      confirm: true,
      return_url: "http://localhost:3000/account",
    });

    // PaymentIntent was successful
    res.json({ success: true, paymentIntent });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// create new game
app.post("/createGame", (req, res) => {
  GameModel.create(req.body)
    .then((game) => res.json(game))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// get game details using id
app.get("/getGamebyID/:id", (req, res) => {
  const id = req.params.id;
  GameModel.findById({ _id: id })
    .then((game) => {
      if (game) {
        res.json(game);
      } else {
        res.status(404).json({ message: "No game found for the given ID" });
      }
    })
    .catch((err) => res.status(500).json({ message: "Internal Server Error" }));
});

//update game by id
app.put("/updateGame/:id", (req, res) => {
  const id = req.params.id;
  GameModel.findByIdAndUpdate(
    { _id: id },
    {
      name: req.body.itemname,
      gameImageUrl: req.body.itemgameImageUrl,
      configurations: req.body.itemconfigurations,
      description: req.body.itemdescription,
      price: req.body.itemprice,
      downloadCount: req.body.itemdownloadCount,
      type: req.body.itemtype,
      developer: req.body.itemdeveloper,
      publisher: req.body.itempublisher,
      releasdate: req.body.itemreleasdate,
    }
  )
    .then((game) => res.json(game))
    .catch((err) => res.json(err));
});

//delete game by id
app.delete("/deleteGame/:id", (req, res) => {
  const id = req.params.id;
  GameModel.findByIdAndDelete({ _id: id })
    .then((game) => res.json(game))
    .catch((err) => res.json(err));
});

app.post("/createPaymnetRecod", (req, res) => {
  PaymentModel.create(req.body)
    .then((payment) => res.json(payment))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.get("/api/adminAllPayment", (req, res) => {
    PaymentModel.find({})
      .then((payment) => res.json(payment))
      .catch((err) => res.json(err));
});

//get payment details related to member
app.get("/getPaymentRecodsByMemberID/:id", (req, res) => {
  const id = req.params.id;
  PaymentModel.find({ memberid: id })
    .then((payment) => {
      if (payment.length > 0) {
        res.json(payment);
      }
    })
    .catch((err) => res.json(err));
});

app.get("/getlatestPayment/:id", (req, res) => {
  const id = req.params.id;
  PaymentModel.find({ memberid: id })
    .sort({ date: -1 })
    .limit(1)
    .then((payment) => {
      if (payment.length > 0) {
        res.json(payment);
      } else {
        res.json({ message: "No payment records found for this member ID" });
      }
    })
    .catch((err) => res.json(err));
});

//delete Payment history by id
app.delete("/deletePaymentHistory/:id", (req, res) => {
  const id = req.params.id;
  PaymentModel.findByIdAndDelete({ _id: id })
    .then((payment) => res.json(payment))
    .catch((err) => res.json(err));
});

//delete all the record related to the member id
app.delete("/deletePaymentHistoryRelatedToMember/:id", (req, res) => {
  const memberId = req.params.id;
  PaymentModel.deleteMany({ memberid: memberId })
    .then(() =>
      res.json({ message: "All payment records deleted successfully." })
    )
    .catch((err) => res.status(500).json({ error: err.message }));
});

// app.post("/createdounloadRecod", (req, res) => {
//   DownloadModel.create(req.body)
//     .then((download) => res.json(download))
//     .catch((err) => res.status(500).json({ error: err.message }));
// });

app.get("/getDownloadbyMemberid/:id", (req, res) => {
  const id = req.params.id;
  DownloadModel.find({ memberid: id })
    .then((downloads) => {
      if (downloads.length > 0) {
        res.json(downloads);
      } else {
        res.json({ message: "No download records found for this member ID" });
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.delete("/deleteDownloadGame/:id", (req, res) => {
  const id = req.params.id;
  DownloadModel.findByIdAndDelete({ _id: id })
    .then((downloads) => res.json(downloads))
    .catch((err) => res.json(err));
});

//update CrystalCount
app.put("/updateCrystalCount/:id", (req, res) => {
  const id = req.params.id;
  MemberModel.findByIdAndUpdate(
    { _id: id },
    {
      crystalCount: req.body.newCrystalcount,
    }
  )
    .then((member) => res.json(member))
    .catch((err) => res.json(err));
});

app.put("/updateDownloadCount/:id", (req, res) => {
  const id = req.params.id;
  GameModel.findByIdAndUpdate(
    { _id: id },
    {
      downloadCount: req.body.newDownloadcount,
    }
  )
    .then((member) => res.json(member))
    .catch((err) => res.json(err));
});


app.post("/createCommunityPost", (req, res) => {
  CommunityModel.create(req.body)
    .then((community) => res.json(community))
    .catch((err) => res.json(err));
});

app.put("/updateCommunityPost/:id", (req, res) => {
  const id = req.params.id;
  CommunityModel.findByIdAndUpdate(
    { _id: id },
    {
      postUrl: req.body.postUrl,
      description: req.body.description,
      name: req.body.name,
      releasedate: req.body.releasedate,
      type: req.body.type,
    }
  )
    .then((community) => res.json(community))
    .catch((err) => res.json(err));
});

//delete game by id
app.delete("/deleteCommunityPost/:id", (req, res) => {
  const id = req.params.id;
  CommunityModel.findByIdAndDelete({ _id: id })
    .then((game) => res.json(game))
    .catch((err) => res.json(err));
});

//create new stream
// app.post("/createStream", (req, res) => {
//   StreamModel.create(req.body)
//     .then((stream) => res.json(stream))
//     .catch((err) => res.status(500).json({ error: err.message }));
// });

//delete stream by id
app.delete("/deleteStream/:id", (req, res) => {
  const id = req.params.id;
  StreamModel.findByIdAndDelete({ _id: id })
    .then((stream) => res.json(stream))
    .catch((err) => res.json(err));
});

//update stream by id
app.put("/updateStream/:id", (req, res) => {
  const id = req.params.id;
  StreamModel.findByIdAndUpdate(
    { _id: id },
    {
      name: req.body.name,
      videoUrl: req.body.videoUrl,
      thumbnailUrl: req.body.thumbnailUrl,
      description: req.body.description,
      viewCount: req.body.viewCount,
      type: req.body.type,
      channel_ID: req.body.channel_ID,
      secretVideoCode: req.body.secretVideoCode,
      gameType: req.body.gameType,
    }
  )
    .then((stream) => res.json(stream))
    .catch((err) => res.json(err));
});

// get game details using id
app.get("/getStream/:id", (req, res) => {
  const id = req.params.id;
  StreamModel.findById({ _id: id })
    .then((stream) => res.json(stream))
    .catch((err) => res.json(err));
});

app.get("/getStreamByChannelID/:channelID", (req, res) => {
  const channelID = req.params.channelID;
  StreamModel.find({ channel_ID: channelID })
    .then((stream) => res.json(stream))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// create new stream
app.post("/createChannel", (req, res) => {
  ChannelModel.create(req.body)
    .then((stream) => res.json(stream))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.get("/getChannelByMemberID/:memberID", (req, res) => {
  const memberId = req.params.memberID;
  ChannelModel.findOne({ memberID: memberId })
    .then((channel) => res.json(channel))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// get channel details using stream id
app.get("/getChannelByStreamID/:channelid", (req, res) => {
  const channelid = req.params.channelid;
  ChannelModel.findById(channelid)
    .then((channel) => res.json(channel))
    .catch((err) => res.json(err));
});

app.get("/getChannelbyid/:id", (req, res) => {
  const id = req.params.id;
  ChannelModel.findById({ _id: id })
    .then((channel) => res.json(channel))
    .catch((err) => res.json(err));
});

app.put("/updateChannelViewCount/:id", (req, res) => {
  const id = req.params.id;
  ChannelModel.findByIdAndUpdate({ _id: id },
    {
      viewCount: req.body.channelviewCount,
    }
  )
    .then((channel) => res.json(channel))
    .catch((err) => res.json(err));
});

app.get("/getChannelbyViewCount", (req, res) => {
  ChannelModel.find({})
    .sort({ viewcount: -1 }) // Sorting by viewcount column in descending order
    .then((channel) => res.json(channel))
    .catch((err) => res.json(err));
  } 
);

//update game by id
app.put("/updateChannelData/:id", (req, res) => {
  const id = req.params.id;
  ChannelModel.findByIdAndUpdate(
    { _id: id },
    {
      channelName: req.body.channelName,
      channelDescription: req.body.channelDescription,
      channelDp: req.body.channelDp,
    }
  )
    .then((channel) => res.json(channel))
    .catch((err) => res.json(err));
});
//delete stream by id
app.delete("/deleteChannel/:id", (req, res) => {
  const id = req.params.id;
  ChannelModel.findByIdAndDelete({ _id: id })
    .then((stream) => res.json(stream))
    .catch((err) => res.json(err));
});


app.get('/api/streams', async (req, res) => {
  try {
    const streams = await StreamModel.find().populate('channel_ID', 'channelName'); // Populating channel name
    res.json(streams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/streams/count-by-type', async (req, res) => {
  try {
      const countByType = await StreamModel.aggregate([
          {
              $group: {
                  _id: '$type', // Group by the 'type' field
                  count: { $sum: 1 } // Count the number of occurrences
              }
          },
          {
              $project: {
                  _id: 0, // Exclude this field
                  type: '$_id', // Rename '_id' to 'type'
                  count: 1 // Include the count
              }
          }
      ]);

      const formattedCountByType = countByType.reduce((acc, curr) => {
          acc[curr.type] = curr.count;
          return acc;
      }, {});

      res.json(formattedCountByType);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});



app.get('/api/channels', async (req, res) => {
  try {
    const channels = await ChannelModel.find();
    res.json(channels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.get('/api/streams', async (req, res) => {
  try {
    const streams = await StreamModel.find().populate('channel_ID', 'channelName'); // Populating channel name
    res.json(streams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/streams/count-by-type', async (req, res) => {
  try {
      const countByType = await StreamModel.aggregate([
          {
              $group: {
                  _id: '$type', // Group by the 'type' field
                  count: { $sum: 1 } // Count the number of occurrences
              }
          },
          {
              $project: {
                  _id: 0, // Exclude this field
                  type: '$_id', // Rename '_id' to 'type'
                  count: 1 // Include the count
              }
          }
      ]);

      const formattedCountByType = countByType.reduce((acc, curr) => {
          acc[curr.type] = curr.count;
          return acc;
      }, {});

      res.json(formattedCountByType);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

app.get('/api/channels', async (req, res) => {
  try {
    const channels = await ChannelModel.find();
    res.json(channels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// get channel details using stream id
app.get("/getChannelByChannelID/:channelid", (req, res) => {
  const channelid = req.params.channelid;
  ChannelModel.findById(channelid)
    .then((channel) => res.json(channel))
    .catch((err) => res.json(err));
});

//create new Subscriber details
app.post("/createSubscription", (req, res) => {
  SubscriberModel.create(req.body)
    .then((subscribers) => res.json(subscribers))
    .catch((err) => res.json(err));
});
app.put("/updateSubscriberCountofChannel/:id", (req, res) => {
  const id = req.params.id;
  ChannelModel.findByIdAndUpdate({ _id: id },
    {
      subscribercount: req.body.subscriberCount,
    }
  )
    .then((channel) => res.json(channel))
    .catch((err) => res.json(err));
});
//get subscription details related to member - function was written to find if a member is already subscribed or not to a channel
app.get("/getSubscribtionByMemberID/:memberID/:channelID", (req, res) => {
  const { memberID, channelID } = req.params;
  SubscriberModel.findOne({ memberID, channelID })
    .then((subscribers) => {
      if (subscribers) {
        res.json(subscribers);
      } else {
        res.status(404).json({ message: "Subscription not found." });
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

//get subscriptions related to member
app.get("/getSubscriptionsByMemberID/:id", (req, res) => {
  const id = req.params.id;
  SubscriberModel.find({ memberID: id })
    .then((subscription) => {
      if (subscription.length > 0) {
        res.json(subscription);
      }
    })
    .catch((err) => res.json(err));
});

//delete Subscription
app.delete("/deleteSubscription/:id", (req, res) => {
  const id = req.params.id;
  SubscriberModel.findByIdAndDelete({ _id: id })
    .then((subscription) => res.json(subscription))
    .catch((err) => res.json(err));
});


//Dasun - New...............................................................................................................

//------dasun part start----

const bcrypt = require('bcrypt');
const saltRounds = 10; // You can adjust this based on security/performance needs

app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password, accountType, firstname, lastname, dob,crystalCount,primium,xpCount,memberLevel,league } = req.body;
    if (!username || !email || !password || !accountType) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let image = '';

    // Create a new user with the hashed password
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword, // Store the hashed password, not the plain one
      accountType,
      firstname,
      lastname,
      dob,
      image,
      crystalCount,
      primium,
      xpCount,
      memberLevel,
      league
    });

    await newUser.save(); // Save the new user in the database
    res.status(201).json({ message: 'User created successfully', user: newUser });

  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' }); // No user found
    }

    // Compare the submitted password with the hashed password in the database
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' }); // Password does not match
    }

    // Assuming you are using sessions for storing user information
    req.session.authenticated = true;
    req.session.user = {
      username: user.username,
      email,
      firstname: user.firstname,
      lastname: user.lastname,
      type: user.accountType,
      dob: user.dob,
      image: user.image,
      id: user._id.toString()
    };

    res.status(200).json({
      message: 'Login successful',
      user: req.session.user,
      // user: {
      //   username: user.username,
      // },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// current user endpoint
app.get('/api/me', async (req, res) => {
  try {
    if (req.session.authenticated) {
      return res.status(200).json({
        user: req.session.user,
      });
    }

    return res.status(401).json({
      message: 'unauthorized',
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/changeData', async(req, res) => {

  const {detail} = req.body;

  if(detail == 'changePass'){
    const {username, email, newPass} = req.body;
    const user = await UserModel.findOne({ email, username });

    const hashedPassword = await bcrypt.hash(newPass, saltRounds);
  
    if(user){
      user.password = hashedPassword;
  
      await user.save()
      .then((user) => res.json(user))
      .catch((err) => res.json(err));
    }
  }else if(detail == 'updateDetails'){
    const {username, email, firstName, lastName, dob} = req.body;
    const user = await UserModel.findOne({ email, username });

    if(user){
      user.firstname = firstName;
      user.lastname = lastName;
      user.dob = dob;
  
      await user.save()
      .then((user) => res.json(user))
      .catch((err) => res.json(err));
    }
  }else if(detail == 'updateProfileImage'){
    const {username, email, url} = req.body;
    const user = await UserModel.findOne({ email, username });

    if(user){
      user.image = url;
  
      await user.save()
      .then((user) => res.json(user))
      .catch((err) => res.json(err));
    }
  }
});

app.delete('/api/deleteAccount', async (req, res) => {
  try {

    const {username, email} = req.body;

    const deletedAccount = await UserModel.findOneAndDelete({ email, username });

    if (!deletedAccount) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', post: deletedAccount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/deleteUniqueAccount', async (req, res) => {
  try {
    const { email } = req.body;

    // Mark the user as deleted instead of completely removing them
    const updatedAccount = await UserModel.findOneAndUpdate(
      { email }, 
      { deleted: true },  // Assuming there's a 'deleted' field in your schema
      { new: true }
    );

    if (!updatedAccount) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', post: updatedAccount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.get('/api/allUsers', async (req, res) => {
  try {
    const allUsers = await UserModel.find();
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//get user details
app.get('/api/getuser', (req, res) => {
  const email = req.query.email;
  console.log(email)
  UserModel.findOne({ email })
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'No User Found' });
      }
    })
    .catch((err) => res.status(500).json({ message: 'Internal Server Error' }));
});


// pdf genaration
// app.post('/api/create-pdf', (req, res) => {
//   pdf.create(pdfTemplate(req.body), {}).toFile('result.pdf', (err) => {
//       if(err) {
//           res.status(500).send('Error creating PDF');
//           return;
//       }
//       res.status(200).send('PDF created successfully');
//   });
// });

app.post('/api/create-pdf/:templateName', (req, res) => {
  const { templateName } = req.params;
  const pdfTemplate = require(`./documents/${templateName}`);

  pdf.create(pdfTemplate(req.body), {}).toFile('result.pdf', (err) => {
    if(err) {
      res.status(500).send('Error creating PDF');
      return;
    }
    res.status(200).send('PDF created successfully');
  });
});

app.get('/api/fetch-pdf', (req, res) => {
  res.sendFile(`${__dirname}/result.pdf`, (err) => {
      if(err) {
          res.status(500).send('Error fetching PDF');
          return;
      }
  });
});


app.post("/season", (req, res) => {
  SeasonModel.create(req.body)
    .then((season) => res.json(season))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.get("/api/readSeason/:id", (req, res) => {
  const id = req.params.id;
  SeasonModel.findById(id)
    .then((season) => {
      if (!season) {
        return res.status(404).json({ error: "Season not found" });
      }
      res.json(season);
    })
    .catch((err) => {
      console.error("Error retrieving season:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

app.put("/updateEndDate/:id", (req, res) => {
  const id = req.params.id;
  SeasonModel.findByIdAndUpdate(
    { _id: id },
    {
      endDate: req.body.newEndDate,
    }
  )
    .then((season) => res.json(season))
    .catch((err) => res.json(err));
});

app.post("/season", (req, res) => {
  SeasonModel.create(req.body)
    .then((season) => res.json(season))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.get("/api/readSeason/:id", (req, res) => {
  const id = req.params.id;
  SeasonModel.findById(id)
    .then((season) => {
      if (!season) {
        return res.status(404).json({ error: "Season not found" });
      }
      res.json(season);
    })
    .catch((err) => {
      console.error("Error retrieving season:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

app.put("/updateEndDate/:id", (req, res) => {
  const id = req.params.id;
  SeasonModel.findByIdAndUpdate(
    { _id: id },
    {
      endDate: req.body.newEndDate,
    }
  )
    .then((season) => res.json(season))
    .catch((err) => res.json(err));
});
app.get('/getFeedback/:id',(req,res) => {
  const id=req.params.id;
  FeedbackModel.findById({_id:id})
  .then(feedbacks =>res.json(feedbacks))
  .catch(err => res.json(err))
})

app.put('/updateFeedback/:id',(req,res) => {
  const id=req.params.id;
  FeedbackModel.findByIdAndUpdate({_id:id},{
      name:req.body.name,
      email:req.body.email,
      feedback:req.body.feedback})
  .then(feedbacks =>res.json(feedbacks))
  .catch(err => res.json(err))
})

app.delete('/deleteFeedback/:id',(req,res) => {
  const id=req.params.id;
  FeedbackModel.findByIdAndDelete({_id:id})
  .then(res => res.json(res))
  .catch(err => res.json(err))
})

app.post("/createfeedback",(req,res) => {
  FeedbackModel.create(req.body)
  .then(feedbacks => res.json(feedbacks))
  .catch(err => res.json(err))
})


app.post("/createfaq",(req,res) => {
  FaqModel.create(req.body)
  .then(faqs => res.json(faqs))
  .catch(err => res.json(err))
})

app.delete('/deletefaq/:id',(req,res) =>{
  const id=req.params.id;
  FaqModel.findByIdAndDelete({_id:id})
  .then(res =>res.json(res))
  .catch(err => res.json(err))
})

// ----------levelling system code start ----------
//Updated by Ishan
app.put("/updateViewCount/:id", (req, res) => {
  const id = req.params.id;
  const userId = req.body.userId;
  StreamModel.findByIdAndUpdate({ _id: id },
    {
      viewCount: req.body.viewCount,
    }
  )
  .then((stream) => {
    // Find the user by _id and update xpCount
    UserModel.findOneAndUpdate(
      { _id: req.body.userId },
      { $inc: { xpCount: 5 } },
      { new: true }
    )
      .then((user) => {
        if (user) {
          const level = Math.floor(user.xpCount / 100);
          if (user.xpCount >= 500 && user.xpCount < 1000) {
            UserModel.findOneAndUpdate(
              { _id: req.body.userId },
              { $set: { memberLevel: level, league: 'Master' } },
              { new: true }
            )
            .then((updatedUser) => {
              // Send response with updated user
              res.json({ stream, user: updatedUser });
            })
            .catch((err) => res.status(500).json({ error: err.message }));
          } else if(user.xpCount >= 1000 && user.xpCount < 1500){
            UserModel.findOneAndUpdate(
              { _id: req.body.userId },
              { $set: { memberLevel: level, league: 'Legendary' } },
              { new: true }
            )
            .then((updatedUser) => {
              // Send response with updated user
              res.json({ stream, user: updatedUser });
            })
            .catch((err) => res.status(500).json({ error: err.message }));
          }else if(user.xpCount >= 1500){
            UserModel.findOneAndUpdate(
              { _id: req.body.userId },
              { $set: { memberLevel: level, league: 'Legendary' } },
              { new: true }
            )
            .then((updatedUser) => {
              // Send response with updated user
              res.json({ stream, user: updatedUser });
            })
            .catch((err) => res.status(500).json({ error: err.message }));
          }else {
            UserModel.findOneAndUpdate(
              { _id: req.body.userId },
              { $set: { memberLevel: level, league: 'Rookie' } },
              { new: true }
            )
            .then((updatedUser) => {
              // Send response with updated user
              res.json({ stream, user: updatedUser });
            })
            .catch((err) => res.status(500).json({ error: err.message }));
          }
        } else {
          res.status(404).json({ error: "User not found" });
        }
      })
      .catch((err) => res.status(500).json({ error: err.message }));
    })
    .catch((err) => res.status(500).json({ error: err.message }));
  });

  //Updated by Ishan
app.post("/createdounloadRecod", (req, res) => {
  DownloadModel.create(req.body)
    .then((download) => {
      // Find the user by _id and update xpCount
      UserModel.findOneAndUpdate(
        { _id: req.body.userId },
        { $inc: { xpCount: 50 } },
        { new: true }
      )
        .then((user) => {
          if (user) {
            const level = Math.floor(user.xpCount / 100);
            if (user.xpCount >= 500 && user.xpCount < 1000) {
              UserModel.findOneAndUpdate(
                { _id: req.body.userId },
                { $set: { memberLevel: level, league: 'Master' } },
                { new: true }
              )
              .then((updatedUser) => {
                // Send response with updated user
                res.json({ download, user: updatedUser });
              })
              .catch((err) => res.status(500).json({ error: err.message }));
            } else if(user.xpCount >= 1000 && user.xpCount < 1500){
              UserModel.findOneAndUpdate(
                { _id: req.body.userId },
                { $set: { memberLevel: level, league: 'Legendary' } },
                { new: true }
              )
              .then((updatedUser) => {
                // Send response with updated user
                res.json({ download, user: updatedUser });
              })
              .catch((err) => res.status(500).json({ error: err.message }));
            }else if(user.xpCount >= 1500){
              UserModel.findOneAndUpdate(
                { _id: req.body.userId },
                { $set: { memberLevel: level, league: 'Legendary' } },
                { new: true }
              )
              .then((updatedUser) => {
                // Send response with updated user
                res.json({ download, user: updatedUser });
              })
              .catch((err) => res.status(500).json({ error: err.message }));
            }else {
              UserModel.findOneAndUpdate(
                { _id: req.body.userId },
                { $set: { memberLevel: level, league: 'Rookie' } },
                { new: true }
              )
              .then((updatedUser) => {
                // Send response with updated user
                res.json({ stream, user: updatedUser });
              })
              .catch((err) => res.status(500).json({ error: err.message }));
            }
          } else {
            res.status(404).json({ error: "User not found" });
          }
        })
        .catch((err) => res.status(500).json({ error: err.message }));
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

//Updated by Ishan
// create new stream
app.post("/createStream", (req, res) => {
  // Create the stream
  StreamModel.create(req.body)
    .then((stream) => {
      // Find the user by _id and update xpCount
      UserModel.findOneAndUpdate(
        { _id: req.body.userId },
        { $inc: { xpCount: 20 } },
        { new: true }
      )
        .then((user) => {
          if (user) {
            const level = Math.floor(user.xpCount / 100);
            if (user.xpCount >= 500 && user.xpCount < 1000) {
              UserModel.findOneAndUpdate(
                { _id: req.body.userId },
                { $set: { memberLevel: level, league: 'Master' } },
                { new: true }
              )
              .then((updatedUser) => {
                // Send response with updated user
                res.json({ stream, user: updatedUser });
              })
              .catch((err) => res.status(500).json({ error: err.message }));
            } else if(user.xpCount >= 1000 && user.xpCount < 1500){
              UserModel.findOneAndUpdate(
                { _id: req.body.userId },
                { $set: { memberLevel: level, league: 'Legendary' } },
                { new: true }
              )
              .then((updatedUser) => {
                // Send response with updated user
                res.json({ stream, user: updatedUser });
              })
              .catch((err) => res.status(500).json({ error: err.message }));
            }else if(user.xpCount >= 1500){
              UserModel.findOneAndUpdate(
                { _id: req.body.userId },
                { $set: { memberLevel: level, league: 'Legendary' } },
                { new: true }
              )
              .then((updatedUser) => {
                // Send response with updated user
                res.json({ stream, user: updatedUser });
              })
              .catch((err) => res.status(500).json({ error: err.message }));
            }else {
              UserModel.findOneAndUpdate(
                { _id: req.body.userId },
                { $set: { memberLevel: level, league: 'Rookie' } },
                { new: true }
              )
              .then((updatedUser) => {
                // Send response with updated user
                res.json({ stream, user: updatedUser });
              })
              .catch((err) => res.status(500).json({ error: err.message }));
            }
          } else {
            res.status(404).json({ error: "User not found" });
          }
        })
        .catch((err) => res.status(500).json({ error: err.message }));
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

//----------levelling system code end ----------

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const fetchAllEmails = async () => {
  try {
    const users = await UserModel.find({}, 'email'); // Fetch only email field
    return users.map(user => user.email);
  } catch (error) {
    console.error('Error fetching emails:', error);
    return [];
  }
};

const sendGameNotificationEmail = async (emails, game) => {
  try {
    const msg = {
      to: emails, // Send to all emails
      from: 'pinnacleitp@gmail.com', // Replace with your verified sender email
      subject: `New Game: ${game.name} Available Now!`,
      text: `Hello!\n\nWe're excited to announce that a new game, "${game.name}," is now available!\n\nType: ${game.type}\n\nCheck it out now on our platform!`,
    };

    await sgMail.sendMultiple(msg); // Send emails in bulk
    console.log('Game notification emails sent successfully!');
  } catch (error) {
    console.error('Error sending game notification emails:', error.response ? error.response.body : error);
  }
};

// Route to handle new game notification
app.post('/api/sendGameNotification', async (req, res) => {
  try {
    const emails = await fetchAllEmails();
    if (emails.length > 0) {
      const gameDetails = req.body; // Assume game details are passed in the request
      await sendGameNotificationEmail(emails, gameDetails);
    }
    res.status(200).json({ success: true, message: 'Emails sent successfully!' });
  } catch (error) {
    console.error('Error in sendGameNotification:', error);
    res.status(500).json({ success: false, error: 'Failed to send emails.' });
  }
});


//::::::::::::::::::::::::::::::::::::::::::::::Special Function Game::::::::::::::::::::::::::::::::::::::::::::::

//::::::::::::::::::::::::::::::::::::::::::::::Special Function Community::::::::::::::::::::::::::::::::::::::::::::::

// Helper function to send community post notification emails
const sendCommunityPostNotificationEmail = async (emails, post) => {
  try {
    const msg = {
      to: emails, // Send to all emails
      from: 'pinnacleitp@gmail.com', // Replace with a verified sender email
      subject: `New Community Post: ${post.name} Released!`,
      text: `Hello!\n\nWe have a new community post for you!\n\nTitle: "${post.name}"\nType: ${post.type}\nRelease Date: ${post.releasedate}\n\nCheck out the post now!`,
    };

    await sgMail.sendMultiple(msg); // Send emails in bulk
    console.log('Community post notification emails sent successfully!');
  } catch (error) {
    console.error('Error sending community post notification emails:', error.response ? error.response.body : error);
  }
};


app.post('/api/sendCommunityPostNotification', async (req, res) => {
  try {
    const emails = await fetchAllEmails();
    if (emails.length > 0) {
      const postDetails = req.body; // Assume post details are passed in the request
      await sendCommunityPostNotificationEmail(emails, postDetails);
    }
    res.status(200).json({ success: true, message: 'Emails sent successfully!' });
  } catch (error) {
    console.error('Error in sendCommunityPostNotification:', error);
    res.status(500).json({ success: false, error: 'Failed to send emails.' });
  }
});

//::::::::::::::::::::::::::::::::::::::::::::::Special Function Community::::::::::::::::::::::::::::::::::::::::::::::

//::::::::::::::::::::::::::::::::::::::::::::::Special Function Stream::::::::::::::::::::::::::::::::::::::::::::::

// Helper function to send stream notification emails
const sendStreamNotificationEmail = async (emails, stream) => {
  try {
    const msg = {
      to: emails, // Send to all emails
      from: 'pinnacleitp@gmail.com', // Replace with a verified sender email
      subject: `New Stream: ${stream.name} is Now Available!`,
      text: `Hello!\n\nA new stream, "${stream.name}," is now available!\n\nDescription: ${stream.description}\nType: ${stream.type}\n\nCheck it out on our platform!`,
    };

    await sgMail.sendMultiple(msg); // Send emails in bulk
    console.log('Stream notification emails sent successfully!');
  } catch (error) {
    console.error('Error sending stream notification emails:', error.response ? error.response.body : error);
  }
};

// API route to handle new stream notification
app.post('/api/sendStreamNotification', async (req, res) => {
  try {
    const emails = await fetchAllEmails();
    if (emails.length > 0) {
      const streamDetails = req.body; // Assume stream details are passed in the request
      await sendStreamNotificationEmail(emails, streamDetails);
    }
    res.status(200).json({ success: true, message: 'Emails sent successfully!' });
  } catch (error) {
    console.error('Error in sendStreamNotification:', error);
    res.status(500).json({ success: false, error: 'Failed to send emails.' });
  }
});

//::::::::::::::::::::::::::::::::::::::::::::::Special Function Stream::::::::::::::::::::::::::::::::::::::::::::::



app.get('/getallfeedbacks', (req, res) => {
  FeedbackModel.find()
    .then(feedbacks => {
      console.log('Feedbacks fetched:', feedbacks);
      res.json(feedbacks);
    })
    .catch(err => {
      console.error('Error fetching feedbacks:', err);
      res.status(500).json({ error: err.message });
    });
});




app.listen(3001, () => {
  console.log("Server is Running");
});
