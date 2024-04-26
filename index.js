import express from "express";
import { rateLimit } from "express-rate-limit";

const app = express();

/**
 * This will apply for all routes
 *  this limitter will count 5 requests within 5 seconds and it will respond "Too many request"
 */
// app.use(
//   limitter({
//     windowMs: 5000, // milisecond
//     max: 5, // maximum number of request wthin windowMs, after 5 seconds from last requst max will rest to 5
//     message: {
//       code: 429, // too many request http code
//       message: "Too many requst",
//     },
//   })
// );

// limitter can be applied on routine indevsully
const limiter = rateLimit({
  windowMs: 30 * 1000,
  limit: 2,
  message: "Too many request",
});

app.get("/", limiter, (req, res) =>
  res.send("Hello from a rate limitted app.")
);

app.get("/api", limiter, (req, res) =>
  res.send("Only certain number requests allowed per s/m/d")
);

app.get("/open", (req, res) => res.send("This is an open endpoint"));

app.get("/register", (req, res) => res.send("Register page"));
app.post("/register", (req, res) => res.send("Ok register"));

app.get("/login", (req, res) => res.send("Login page"));
app.post("/login", (req, res) => res.send("Ok login"));

app.listen(3000, () => {
  console.log("🚀 server on port 3000 🔐");
});
