import { Kafka }from 'kafkajs'

const kafka = new Kafka({
    clientId: 'react-kafka-app',
    brokers: ['localhost:9092'], 
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'react-kafka-group' });

async function produceMessage(topic:string, message:string) {
    await producer.connect();
    await producer.send({
        topic,
        messages: [{ value: message }],
    });
    await producer.disconnect();
}


async function consumeMessages(topic:string) {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            console.log('Received message : ', message.value ? message.value.toString() : '');
            
        },
    });
}
consumeMessages('alm.entitlements.audit.topic.qa');

module.exports = { produceMessage, consumeMessages };
