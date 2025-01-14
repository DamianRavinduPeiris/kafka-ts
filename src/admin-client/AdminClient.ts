import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "react-kafka-app",
  brokers: ["localhost:9092"],
});
const admin = kafka.admin();

const fetchTopics = async () => {
  try {
    await admin.connect();

    const topics = await admin.listTopics();

    console.log(`Available Kafka topics :${topics}`);

    await admin.disconnect();
  } catch (error) {
    console.error("Error fetching topics:", error);
  }
};

export { fetchTopics };