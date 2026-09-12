require("dotenv").config();

const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const { pool } = require("./db/pool");
const { migrate } = require("./db/migrate");
const { sessionMiddleware } = require("./middleware/session");
const { requireAuth, optionalAuth } = require("./middleware/auth");
const { errorHandler } = require("./middleware/errorHandler");
const { grantDailyCreditsIfNeeded } = require("./services/credits");

const authRoutes = require("./routes/auth");
const { githubAuthRouter } = require("./routes/github");
const meRoutes = require("./routes/me");
const chatRoutes = require("./routes/chat");
const conversationRoutes = require("./routes/conversations");
const projectRoutes = require("./routes/projects");
const creditRoutes = require("./routes/credits");
const referralRoutes = require("./routes/referrals");
const { backfillReferralCodes, sanitizeReferralCode } = require("./services/referrals");

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

async function bootstrap() {
  await migrate();
  await backfillReferralCodes();

  const app = express();

  app.set("trust proxy", 1);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
          imgSrc: ["'self'", "data:", "https://avatars.githubusercontent.com"],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameAncestors: ["'self'", "https:", "http:"],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      frameguard: false,
    })
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(sessionMiddleware);

  const authLimiter = rateLimit({
