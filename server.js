require("dotenv").config();
const express = require('express');
const path = require('path');
const cors = require("cors");
const { Client, GatewayIntentBits } = require("discord.js");
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const blogRoutes = require('./routes/blog');
const authRoutes = require('./routes/auth');
const Post = require('./models/Post');
const User = require('./models/User');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection with retry logic
const connectWithRetry = () => {
  mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  })
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Retrying in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  });
};

connectWithRetry();

// Set up Mongoose error handling
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

// Express configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600 // time period in seconds
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: 'Incorrect username.' });
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return done(null, false, { message: 'Incorrect password.' });
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        username: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id
      });
      await user.save();
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}
));

passport.serializeUser((user, done) => {
done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
try {
  const user = await User.findById(id);
  done(null, user);
} catch (error) {
  done(error);
}
});



// Discord bot setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const channelId = process.env.DISCORD_CHANNEL_ID;

client.once("ready", () => {
  console.log("Discord bot is ready!");
});

client.on("error", console.error);
client.on("warn", console.warn);

client.login(process.env.DISCORD_BOT_TOKEN);

// "Middleware" to pass user to all views
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Routes
app.get('/', async (req, res) => {
  try {
    const latestPost = await Post.findOne().sort({ createdAt: -1 }).limit(1);
    res.render('index', { title: 'Home', latestPost });
  } catch (error) {
    console.error('Error fetching latest post:', error);
    res.render('index', { title: 'Home', latestPost: null });
  }
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About Me' });
});

app.get('/skills', (req, res) => {
  res.render('skills', { title: 'Skills' });
});

app.get('/stats', (req, res) => {
  res.render('stats', { title: 'GitHub Stats' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact' });
});

app.get('/discord', (req, res) => {
  res.render('discord', { title: 'Discord' });
});

app.get('/404', (req, res) => {
  res.status(404).render('404');
});

app.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Login' });
});

app.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Register' });
});

// Blog routes
app.use('/blog', blogRoutes);

app.use('/auth', authRoutes);

// "Middleware" to protect routes
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Example from documentation of a protected route
app.get('/profile', ensureAuthenticated, (req, res) => {
  res.render('profile', { title: 'Profile', user: req.user });
});

// Discord API routes
app.post("/api/send-message", (req, res) => {
  const message = req.body.message;
  const channel = client.channels.cache.get(channelId);
  
  if (!channel) {
    console.error("Channel not found");
    return res.status(404).json({ error: "Channel not found" });
  }
  
  channel.send(message)
    .then(() => res.status(200).json({ success: true, message: "Message sent successfully" }))
    .catch((error) => {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Failed to send message", details: error.message });
    });
});

app.get("/api/get-messages", (req, res) => {
  const channel = client.channels.cache.get(channelId);
  
  if (!channel) {
    console.error("Channel not found");
    return res.status(404).json({ error: "Channel not found" });
  }
  
  channel.messages.fetch({ limit: 10 })
    .then((messages) => {
      const formattedMessages = messages.map((msg) => ({
        author: msg.author.username,
        content: msg.content,
        timestamp: msg.createdAt,
      }));
      res.json(formattedMessages);
    })
    .catch((error) => {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages", details: error.message });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', { message: 'Page not found' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});