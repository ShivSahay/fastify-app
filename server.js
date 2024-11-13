import Fastify from "fastify";
import userRouter from "./src/routes/user.js";
import fastifyMongo from "@fastify/mongodb";
import dotenv from "dotenv";
dotenv.config();
const fastify = new Fastify({
  logger: true,
});

// Connect to MongoDB Database

fastify.register(fastifyMongo, {
  forceClose: true,
  url: process.env.MONGODB_URL,
});

fastify.register(userRouter);

fastify.get("/", (request, reply) => {
  return {
    message: "Welcome, to Fastify auth service!",
  };
});

const start = async () => {
  const PORT = process.env.PORT || 4000;
  try {
    await fastify.listen({ port: PORT });
    console.log("Server listing on port " + PORT);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
