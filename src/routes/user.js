import { authHandler } from "../hooks/auth.js";

const createUserSchema = {
  body: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: { type: "string" },
      email: { type: "string" },
      password: { type: "string" },
    },
  },
  response: {
    201: {
      type: "object",
      properties: {
        message: { type: "string" },
        id: { type: "string" },
      },
      //   required: ["message"],
    },
  },
};

async function userRouter(fastify, opts) {
  fastify.post(
    "/api/users",
    { schema: createUserSchema },
    async (request, reply) => {
      // Perform validation and database operations here
      const { name, email, password } = request.body;

      const userCollection = fastify.mongo.db.collection("users");
      // Do not store plain passwords in the database

      const result = await userCollection.insertOne({ name, email, password });
      const insertedId = result.insertedId;

      console.log("Result - ", result);
      fastify.log.info(`User created successfully: ${insertedId}}`);
      reply.code(201);
      return {
        message: "User Created !!",
        id: insertedId,
      };
    }
  );

  fastify.get("/api/users", async (request, reply) => {
    const { q } = request.query;
    console.log("Query: ", q);

    const userCollection = fastify.mongo.db.collection("users");

    let query = {};
    if (q) {
      query = { name: { $regex: new RegExp(q, "i") } };
    }

    const user = await userCollection.find(query).toArray();
    fastify.log.info(`User fetched !! ${user}`);
    // return user;
    reply.send(user);
  });

  fastify.get(
    "/api/users/:id",
    { preHandler: authHandler },
    async (request, reply) => {
      console.log("From User Handler....", request.userId);
      const { id } = request.params;

      const userCollection = fastify.mongo.db.collection("users");

      const user = await userCollection.findOne({
        _id: new fastify.mongo.ObjectId(id),
      });
      fastify.log.info(`User fetched by ID!! ${user}`);
      // return user;
      reply.send(user);
    }
  );
}

export default userRouter;
