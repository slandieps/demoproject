// Load environment variables
require('dotenv').config();

// Core modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

// LiveKit
const { AccessToken, WebhookReceiver } = require('livekit-server-sdk');

// DB config
const configDB = require('./config/database');

// Express app
const app = express();
const PORT = process.env.PORT || 8080;

// MongoDB Connection
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.error(err);
  const db = database;
  require('./app/routes.js')(app, passport, db); // load routes
});

// Passport config
require('./config/passport')(passport);

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.raw({ type: 'application/webhook+json' }));
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files

// Sessions & Passport
app.use(session({
  secret: 'randomiz3r',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// =====================
// LiveKit Integration
// =====================
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || 'devkey';
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || 'secret';

// Token endpoint
app.post('/token', async (req, res) => {
  const { roomName, participantName } = req.body;

  if (!roomName || !participantName) {
    return res.status(400).json({ errorMessage: "roomName and participantName are required" });
  }

  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: participantName,
  });
  at.addGrant({ roomJoin: true, room: roomName });

  try {
    const token = await at.toJwt();
    res.json({ token });
  } catch (err) {
    console.error("Token generation error:", err);
    res.status(500).json({ errorMessage: "Token generation failed" });
  }
});

// Webhook endpoint
const webhookReceiver = new WebhookReceiver(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);

app.post('/livekit/webhook', async (req, res) => {
  try {
    const event = await webhookReceiver.receive(req.body, req.get('Authorization'));
    console.log("LiveKit Webhook Event:", event);
  } catch (error) {
    console.error("Error validating webhook event", error);
  }
  res.status(200).send();
});

// =====================
// Routes
// =====================

// Serve the vid.html file from the public directory
app.get('/vid', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'vid.html')); // serve static file
});

// =====================
// Launch the Server
// =====================
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
