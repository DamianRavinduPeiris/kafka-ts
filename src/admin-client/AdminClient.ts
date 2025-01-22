import { Kafka } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

const brokers = process.env.KAFKA_BROKERS?.split(",") || [];

const kafka = new Kafka({
  clientId: "react-kafka-app",
  brokers: brokers,
});
const admin = kafka.admin();
const topicsList: string[] = [];

const fetchTopics = async (): Promise<string[]> => {
  try {
    await admin.connect();

    const topics = await admin.listTopics();
    topicsList.push(...topics);

    console.log(`Available Kafka topics :${topics}`);

    await admin.disconnect();
  } catch (error) {
    console.error("Error fetching topics:", error);
  }
  return topicsList;
};

export { fetchTopics };