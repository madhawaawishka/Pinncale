const mongoose = require('mongoose');
const GameModel = require('./models/Game');
const StreamModel = require('./models/Stream');
const ChannelModel = require('./models/Channel');
const CommunityModel = require('./models/Community');
const PremiumPlanModel = require('./models/PremiumPlan');

const MONGODB_URI =
  'mongodb+srv://pinnacleitp:pinnacle123@crud.vsshiuj.mongodb.net/?retryWrites=true&w=majority&appName=crud';

const sampleGames = [
  {
    name: "Cyberpunk 2077: Phantom Liberty",
    gameImageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    configurations: "OS: Windows 10/11 64-bit | Processor: Core i7-6700 | Memory: 16 GB RAM | Graphics: GeForce RTX 2060 | Storage: 70 GB",
    description: "An open-world, action-adventure RPG set in the dark future of Night City. Enter the shadowy world of spycraft and espionage.",
    price: 59.99,
    downloadCount: 15420,
    type: "action",
    developer: "CD PROJEKT RED",
    publisher: "CD PROJEKT RED",
    releasdate: new Date("2023-09-26"),
  },
  {
    name: "Call of Duty: Modern Warfare III",
    gameImageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    configurations: "OS: Windows 10 64-bit | Processor: Intel Core i5-6600 | Memory: 12 GB RAM | Graphics: NVIDIA GeForce GTX 960 | Storage: 125 GB",
    description: "In the direct sequel to the record-breaking Modern Warfare II, Captain Price and Task Force 141 face off against the ultimate threat.",
    price: 69.99,
    downloadCount: 28950,
    type: "shooter",
    developer: "Sledgehammer Games",
    publisher: "Activision",
    releasdate: new Date("2023-11-10"),
  },
  {
    name: "Forza Horizon 5",
    gameImageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    configurations: "OS: Windows 10 | Processor: Intel i5-4460 | Memory: 8 GB RAM | Graphics: NVidia GTX 970 | Storage: 110 GB",
    description: "Your Ultimate Horizon Adventure awaits! Explore the vibrant and ever-evolving open world landscapes of Mexico with limitless driving action.",
    price: 49.99,
    downloadCount: 19800,
    type: "racing",
    developer: "Playground Games",
    publisher: "Xbox Game Studios",
    releasdate: new Date("2021-11-09"),
  },
  {
    name: "Elden Ring: Shadow of the Erdtree",
    gameImageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    configurations: "OS: Windows 10/11 | Processor: Intel Core i7-8700K | Memory: 16 GB RAM | Graphics: NVIDIA GeForce GTX 1070 | Storage: 60 GB",
    description: "Guided by Empyrean Miquella, players are summoned to the Land of Shadow, a place obscured by the Erdtree where the goddess Marika first set foot.",
    price: 39.99,
    downloadCount: 32100,
    type: "adventure",
    developer: "FromSoftware Inc.",
    publisher: "Bandai Namco Entertainment",
    releasdate: new Date("2024-06-21"),
  },
  {
    name: "EA SPORTS FC 24",
    gameImageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80",
    configurations: "OS: Windows 10 64-bit | Processor: Intel Core i5-6600K | Memory: 8 GB RAM | Graphics: NVIDIA GeForce GTX 1050 Ti | Storage: 100 GB",
    description: "EA SPORTS FC 24 is a new era for The World's Game: 19,000+ fully licensed players, 700+ teams, and 30+ leagues playing together.",
    price: 44.99,
    downloadCount: 22400,
    type: "sports",
    developer: "EA Canada",
    publisher: "Electronic Arts",
    releasdate: new Date("2023-09-29"),
  },
  {
    name: "Apex Legends",
    gameImageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    configurations: "OS: 64-bit Windows 10 | Processor: Intel Core i5 3570K | Memory: 8 GB RAM | Graphics: NVIDIA GeForce GTX 970 | Storage: 56 GB",
    description: "Conquer with character in Apex Legends, a free-to-play Hero shooter where legendary characters with powerful abilities team up for glory.",
    price: 0.00,
    downloadCount: 45000,
    type: "action",
    developer: "Respawn Entertainment",
    publisher: "Electronic Arts",
    releasdate: new Date("2020-11-04"),
  },
  {
    name: "Valorant Masters",
    gameImageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80",
    configurations: "OS: Windows 10 64-bit | Processor: Intel Core 2 Duo E8400 | Memory: 4 GB RAM | Graphics: Intel HD 4000 | Storage: 20 GB",
    description: "A 5v5 character-based tactical shooter where precise gunplay meets unique agent abilities.",
    price: 0.00,
    downloadCount: 38200,
    type: "shooter",
    developer: "Riot Games",
    publisher: "Riot Games",
    releasdate: new Date("2020-06-02"),
  },
  {
    name: "Need for Speed Unbound",
    gameImageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
    configurations: "OS: Windows 10 64-bit | Processor: Core i5-8600 | Memory: 16 GB RAM | Graphics: GeForce GTX 1060 | Storage: 50 GB",
    description: "Race against time, outsmart the cops, and take on weekly qualifiers to reach The Grand, Lakeshore's ultimate street racing challenge.",
    price: 29.99,
    downloadCount: 14100,
    type: "racing",
    developer: "Criterion Games",
    publisher: "Electronic Arts",
    releasdate: new Date("2022-12-02"),
  },
  {
    name: "NBA 2K24",
    gameImageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
    configurations: "OS: Windows 10 64-bit | Processor: Intel Core i5-4430 | Memory: 8 GB RAM | Graphics: NVIDIA GeForce GTX 770 | Storage: 110 GB",
    description: "Experience hoops culture in NBA 2K24. Enjoy loads of pure, authentic action and limitless personalized MyPLAYER options.",
    price: 34.99,
    downloadCount: 16700,
    type: "sports",
    developer: "Visual Concepts",
    publisher: "2K Games",
    releasdate: new Date("2023-09-08"),
  },
  {
    name: "The Witcher 3: Wild Hunt",
    gameImageUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
    configurations: "OS: 64-bit Windows 10 | Processor: Intel CPU Core i5-2500K | Memory: 8 GB RAM | Graphics: Nvidia GPU GeForce GTX 770 | Storage: 50 GB",
    description: "You are Geralt of Rivia, mercenary monster slayer. Before you stands a war-torn, monster-infested continent you can explore at will.",
    price: 19.99,
    downloadCount: 52000,
    type: "adventure",
    developer: "CD PROJEKT RED",
    publisher: "CD PROJEKT RED",
    releasdate: new Date("2015-05-18"),
  }
];

const sampleChannels = [
  {
    channelName: "ShadowGamer Pro",
    channelDescription: "Elite competitive esports and high-stakes battle royale streaming daily!",
    channelDp: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200&q=80",
    memberID: "user_shadow_01",
    viewCount: 45200,
    subscribercount: 8900,
  },
  {
    channelName: "ApexValkyrie",
    channelDescription: "Grandmaster rank shooter & tactical gameplay streams with community squad games.",
    channelDp: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    memberID: "user_valkyrie_02",
    viewCount: 68100,
    subscribercount: 14200,
  },
  {
    channelName: "SpeedDemon Racing",
    channelDescription: "Sim racing and arcade speedruns on ultra-wide triple monitor rig.",
    channelDp: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    memberID: "user_speed_03",
    viewCount: 31200,
    subscribercount: 6700,
  }
];

async function seed() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to database:', mongoose.connection.name);

  // 1. Seed Channels
  console.log('Seeding channels...');
  const createdChannels = [];
  for (const ch of sampleChannels) {
    const existing = await ChannelModel.findOne({ channelName: ch.channelName });
    if (!existing) {
      const doc = await ChannelModel.create(ch);
      createdChannels.push(doc);
    } else {
      createdChannels.push(existing);
    }
  }
  console.log(`Channels ready: ${createdChannels.length}`);

  // 2. Seed Games
  console.log('Seeding games...');
  for (const g of sampleGames) {
    const existing = await GameModel.findOne({ name: g.name });
    if (!existing) {
      await GameModel.create(g);
    } else {
      await GameModel.updateOne({ _id: existing._id }, { $set: { gameImageUrl: g.gameImageUrl } });
    }
  }
  const totalGames = await GameModel.countDocuments();
  console.log(`Total games in database: ${totalGames}`);

  // 3. Seed Streams
  console.log('Seeding streams...');
  const sampleStreams = [
    {
      name: "Warzone Final Circle Clutch - 25 Kills World Record Pace",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
      description: "Insane ranked tournament match in Modern Warfare Warzone with full squad.",
      viewCount: 4210,
      type: "shooter",
      channel_ID: createdChannels[0]._id,
      secretVideoCode: "WZ-2024-LIVE",
      gameType: "Warzone",
    },
    {
      name: "Call of Duty Ranked Play Grind to Top 250",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
      description: "Pushing for global rank 1 with aggressive submachine gun plays.",
      viewCount: 3120,
      type: "shooter",
      channel_ID: createdChannels[1]._id,
      secretVideoCode: "COD-RANKED-01",
      gameType: "Call of Duty",
    },
    {
      name: "Forza Horizon 5 - Highway Speed Trap World Record Run",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
      description: "Tuning hypercars and testing speed limits across Mexico highways.",
      viewCount: 1890,
      type: "racing",
      channel_ID: createdChannels[2]._id,
      secretVideoCode: "FH5-RACE-MAX",
      gameType: "Asphalt 8",
    },
    {
      name: "Mobile Legends Mythic Immortal 5-Man Ranked Domination",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80",
      description: "Playing assassin core in top-tier Asian regional servers.",
      viewCount: 6540,
      type: "action",
      channel_ID: createdChannels[0]._id,
      secretVideoCode: "ML-MYTHIC-PRO",
      gameType: "Mobile Legends",
    },
    {
      name: "PUBG Mobile Conqueror Rank Squad Battles",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      description: "Survival tactics and sniper montages in Erangel high-tier lobbies.",
      viewCount: 5210,
      type: "shooter",
      channel_ID: createdChannels[1]._id,
      secretVideoCode: "PUBG-CONQ-01",
      gameType: "PUBG Mobile",
    },
    {
      name: "GTA V Online: Diamond Casino Heist Speedrun Duo",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
      description: "Silent & Sneaky elite challenge completion in under 12 minutes.",
      viewCount: 2980,
      type: "action",
      channel_ID: createdChannels[2]._id,
      secretVideoCode: "GTAV-HEIST-ELITE",
      gameType: "GTA V",
    }
  ];

  for (const s of sampleStreams) {
    const existing = await StreamModel.findOne({ name: s.name });
    if (!existing) {
      await StreamModel.create(s);
    }
  }
  const totalStreams = await StreamModel.countDocuments();
  console.log(`Total streams in database: ${totalStreams}`);

  // 4. Seed Premium Plans if empty
  const planCount = await PremiumPlanModel.countDocuments();
  if (planCount === 0) {
    console.log('Seeding premium plans...');
    await PremiumPlanModel.create([
      { planType: "Standard Tier", price: 9.99, timePeriod: "1 Month" },
      { planType: "Pro Gamer Tier", price: 24.99, timePeriod: "3 Months" },
      { planType: "Elite Pinnacle Tier", price: 79.99, timePeriod: "1 Year" },
    ]);
    console.log('Premium plans seeded.');
  }

  // 5. Seed Community Posts if empty
  const communityCount = await CommunityModel.countDocuments();
  if (communityCount === 0) {
    console.log('Seeding community posts...');
    await CommunityModel.create([
      {
        name: "Pinnacle Summer Championship 2026 Announcement",
        description: "Registration is now open for the $50,000 summer tournament featuring CoD and Valorant!",
        postUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
        releasedate: new Date(),
        type: "Tournament",
      },
      {
        name: "Top Community Highlights of the Week",
        description: "Check out the best clutch moments submitted by our community streamers.",
        postUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
        releasedate: new Date(),
        type: "Highlights",
      }
    ]);
    console.log('Community posts seeded.');
  }

  console.log('Database seeding successfully finished!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
