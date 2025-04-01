import { Kafka } from "kafkajs";
import { Server, Socket } from "socket.io";
import http from "http";
import { fetchTopics } from "./admin-client/AdminClient";
import dotenv from "dotenv";

dotenv.config();

const server = http.createServer();
const clients: Map<Socket, string | null> = new Map(); 
const io = new Server(server, {
  cors: { origin: "*" },
});

const brokers = process.env.KAFKA_BROKERS?.split(",") || [];

const kafka = new Kafka({
  clientId: "StreamSight",
  brokers: brokers,
  connectionTimeout: 30000,
  requestTimeout: 30000,
  logLevel: 1,
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "test-k-consumer",sessionTimeout: 30000 });

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
      console.log(`Produced message: ${message} to topic: ${topic}`);
    } catch (error) {
      console.error("Error producing message:", error);
      socket.emit("status", "Error producing message");
    }
  });

socket.on("consume", async ({ topic }) => {
    console.log(`Client subscribed to topic: ${topic}`);
    clients.set(socket, topic);
    await consumer.stop();
    await consumer.subscribe({ topic, fromBeginning: false });
    initializeConsumer();

});

  socket.on("disconnect", () => {
    console.log("WebSocket disconnected");
    clients.delete(socket);
  });
});

server.listen(7000, () =>
  console.log("Server running on http://localhost:7000")
);