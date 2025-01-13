import { Kafka } from "kafkajs";
import { Server, Socket } from "socket.io";
import http from "http";

const server = http.createServer();
const subscribedTopics: Set<string> = new Set();
const clients: Set<Socket> = new Set();

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

io.on("connection", (socket) => {
  console.log("Websocket connected!");
  if (!clients.has(socket)) {
    clients.add(socket);
  }

  socket.on("produce", async ({ topic, message }) => {
    try {
      await producer.send({
        topic,
        messages: [{ value: message }],
      });
      socket.emit("status", "Message produced successfully");
    } catch (error) {
      console.error("Error producing message:", error);
      socket.emit("status", "Error producing message");
    }
  });

  socket.on("disconnect", () => {
    console.log("WebSocket disconnected");
  });
});

async function realTimeConsumer(topic: string) {
  try {
    if (!subscribedTopics.has(topic)) {
      console.log(`Subscribing to topic: ${topic}`);
      await consumer.connect();
      await consumer.subscribe({ topic, fromBeginning: true });
      subscribedTopics.add(topic);
    }

    consumer.run({
      eachMessage: async ({ message }) => {
        const value = message.value ? message.value.toString() : "null";
        console.log(`Consumed message: ${value}`);
        clients.forEach((client) => {
          client.emit("realTimeMessage", value);
        });
      },
    });
  } catch (error) {
    console.error("Error consuming messages:", error);
  }
}

realTimeConsumer("alm.entitlements.audit.topic.qa");

server.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);
