const ValidateToken = () => {
  return new Promise((resolve, reject) => {
    // token check logic ...
    resolve({ userId: "12345" }); // Replace with actual token validation logic
    // reject(new Error('User token is Invalid'));
  });
};

export const authHandler = (request, reply, done) => {
  console.log("checking auth....");
  ValidateToken()
    .then((user) => {
      // reply.status(401).send({message: "Unauthorized"});
      request.userId = user.userId;
      done();
    })
    .catch((err) => {
      //   reply.status(500).send({ message: "Internal Server Error" });
      reply.code(401).send({ message: err.message, success: false });
      //   done(err);
    });
};
