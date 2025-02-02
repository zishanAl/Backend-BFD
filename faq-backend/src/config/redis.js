import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
  },
});

redisClient.on("error", (err) => console.error("❌ Redis Connection Error:", err));

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("✅ Redis Connected Successfully");
  } catch (error) {
    console.error("❌ Redis Connection Failed:", error);
  }
};

connectRedis();

export default redisClient;
