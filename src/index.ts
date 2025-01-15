import { Kafka } from "kafkajs";
import { Server, Socket } from "socket.io";
import http from "http";
import { fetchTopics } from "./admin-client/AdminClient";

const server = http.createServer();
const clients: Map<Socket, string | null> = new Map(); // Map to track client and their subscribed topic

const io = new Server(server, {
  cors: { origin: "*" },
});

const kafka = new Kafka({
  clientId: "react-kafka-app",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "react-kafka-group" });

(async () => {
  await producer.connect();
  console.log("Producer connected...");
})();

async function initializeConsumer() {
    await consumer.connect();
    console.log("Consumer connected...");

    consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const value = message.value ? message.value.toString() : "null";
            console.log(`Received message: ${value}`);
            for (const [socket, subscribedTopic] of clients) {
                if (subscribedTopic === topic) {
                    socket.emit("message", value);
                }
            }
        },
    });
}

initializeConsumer();

io.on("connection", async (socket) => {
  console.log("WebSocket connected!");

  clients.set(socket, null);

  let topics = await fetchTopics();
  socket.emit("topics", topics);

  socket.on("produce", async ({ topic, message }) => {
    try {
      await producer.send({
        topic,
        messages: [{ value: message }],
      });
      socket.emit("status", "Message produced successfully!");
    } catch (error) {
      console.error("Error producing message:", error);
      socket.emit("status", "Error producing message");
    }
  });

socket.on("consume", async ({ topic }) => {
    console.log(`Client subscribed to topic: ${topic}`);
    clients.set(socket, topic);
    await consumer.stop();
    await consumer.subscribe({ topic, fromBeginning: true });
    initializeConsumer();

});

  socket.on("disconnect", () => {
    console.log("WebSocket disconnected");
    clients.delete(socket);
  });
});

server.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);
