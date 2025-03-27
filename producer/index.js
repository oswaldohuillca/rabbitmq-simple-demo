// const amqp = require("amqplib");

// const RABBITMQ_URL =
//   process.env.RABBITMQ_URL || "amqp://user:password@rabbitmq";

// async function sendMessage() {
//   const connection = await amqp.connect(RABBITMQ_URL);
//   const channel = await connection.createChannel();
//   const queue = "notifications";

//   await channel.assertQueue(queue, { durable: true });

//   const message = { text: "Hola desde Producer!", timestamp: new Date() };
//   channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
//     persistent: true,
//   });

//   console.log(" [x] Mensaje enviado:", message);

//   setTimeout(() => {
//     connection.close();
//     process.exit(0);
//   }, 500);
// }

// sendMessage().catch(console.error);

const express = require("express");
const amqp = require("amqplib");

const app = express();
const PORT = process.env.PORT || 3001;
const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://user:password@rabbitmq";

async function sendMessage() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  const queue = "notifications";

  await channel.assertQueue(queue, { durable: true });

  return { connection, channel, queue };
}

// Ruta para enviar un mensaje
app.get("/send", async (req, res) => {
  try {
    const { connection, channel, queue } = await sendMessage();
    const message = { text: "Hola desde Producer!", timestamp: new Date() };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    console.log(" [x] Mensaje enviado:", message);
    res.json({ success: true, message });

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Iniciar Express
app.listen(PORT, () => {
  console.log(` [*] Servidor Producer corriendo en http://localhost:${PORT}`);
});
