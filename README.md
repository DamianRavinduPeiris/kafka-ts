# StreamSight

**StreamSight** is a lightweight yet powerful web application built to consume and produce real-time Kafka events via a **Socket.IO** interface. Developed with **KafkaJS**, it offers a streamlined way to work with real-time data streams.


**Frontend Repository** [can be found from here.](https://github.com/DamianRavinduPeiris/StreamSight)

### Frontend Configuration

Please follow the instructions in the [here](https://github.com/DamianRavinduPeiris/StreamSight) to set up and configure the frontend.

#### Prerequisites

Ensure the following tools are installed:

- **Node.js** (v16.x or higher)
- **Kafka** (locally or via a cloud provider such as Confluent Cloud)
- **npm** or **yarn**

#### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/DamianRavinduPeiris/kafka-ts.git

2. **Navigate to the project directory**
   ```bash
   cd kafka-ts

3. **Install dependencies**
   Using npm:
   ```bash
   npm install
   ```
   Or using yarn:
   ```bash
   yarn install

4. **Create an `.env` file in project root and add `KAFKA_BROKERS` property which contains your cluster endpoint(s).If you have multiple endpoints,seperate them with commas.**


5. **Start the application**
   Using npm:
   ```bash
   npm run dev
   ```
   Or using yarn:
   ```bash
   yarn start
## Screenshots

### 1) Producing Events  
![Producing Events](https://github.com/user-attachments/assets/55e08de7-c6c4-4f96-b9f6-b4e0d8d91fec)  


### 2) Consuming Events  
![Consuming Events](https://github.com/user-attachments/assets/b850e4e3-1477-4eba-b7e4-584ff20b2821)  


### 3) Searching Through Consumed Events  
![Searching Events](https://github.com/user-attachments/assets/3c43a1df-3929-434a-bcbd-f465ad35905d)  


## Contribution Guidelines

Contributions are welcome! Here's how you can contribute:

1. Fork the repository.
2. Create a new feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   
3. Commit your changes:
   ```bash
   git commit -m "Add your feature description"
   
4. Push the branch:
   ```bash
   git push origin feature/your-feature-name
   
5. Open a pull request.

### Reporting Issues

If you encounter any issues, please open an issue in the repository with a detailed description.


## License

This project is licensed under the [MIT License](LICENSE).

Made with ❤️ by [Damian](#)
