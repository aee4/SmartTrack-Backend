const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join:session", (sessionId) => {
      socket.join(sessionId);
    });

    socket.on("leave:session", (sessionId) => {
      socket.leave(sessionId);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = initSocket;
