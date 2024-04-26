import express from "express";
import { rateLimit } from "express-rate-limit";
import { slowDown } from "express-slow-down";

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

// slow down requests
const slow_down = slowDown({
  windowMs: 30 * 1000,
  delayAfter: 5, // allow 5 requests per 30 seconds
  delayMs: (hits) => hits * 500, // Add 500ms of delay to every request after the 5th one.
});

// cache responses
let cache_data;
let cache_time;

app.get("/request-limiter", limiter, (req, res) =>
  res.send("This is slow rate-limit endpoint")
);

app.get("/slow-down", slow_down, (req, res) =>
  res.send("This is slow-down endpoint")
);

app.get("/cache-data", (req, res) => {
  // set cache time 30 seconds
  if (cache_time && cache_time > Date.now() - 30 * 1000) {
    return res.json({
      message: cache_data + " cached",
    });
  }
  cache_time = Date.now();
  cache_data = "This is slow cache-data endpoint";
  return res.json({
    message: "This is cached-data endpoint",
    cacheTime: cache_time,
  });
});

app.listen(3000, () => {
  console.log("🚀 server on port 3000 🔐");
});
