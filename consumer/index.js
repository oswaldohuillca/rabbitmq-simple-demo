// const amqp = require("amqplib");

// const RABBITMQ_URL =
//   process.env.RABBITMQ_URL || "amqp://user:password@rabbitmq";

// async function receiveMessage() {
//   const connection = await amqp.connect(RABBITMQ_URL);
//   const channel = await connection.createChannel();
//   const queue = "notifications";

//   await channel.assertQueue(queue, { durable: true });

//   console.log(
//     " [*] Esperando mensajes en %s. Para salir presiona CTRL+C",
//     queue,
//   );

//   channel.consume(queue, (msg) => {
//     if (msg !== null) {
//       console.log(" [x] Recibido:", msg.content.toString());
//       channel.ack(msg);
//     }
//   });
// }

// receiveMessage().catch(console.error);

const express = require("express");
const amqp = require("amqplib");

const app = express();
const PORT = process.env.PORT || 3000;
const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://user:password@rabbitmq";
const messages = []; // Almacén temporal de mensajes en memoria

async function receiveMessage() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  const queue = "notifications";

  await channel.assertQueue(queue, { durable: true });

  console.log(
    ` [*] Esperando mensajes en ${queue}. Para salir presiona CTRL+C`,
  );

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const message = msg.content.toString();
      console.log(" [x] Recibido:", message);
      messages.push(JSON.parse(message)); // Guardar mensaje en memoria
      channel.ack(msg);
    }
  });
}

// Ruta para obtener los mensajes recibidos
app.get("/messages", (req, res) => {
  res.json({ messages });
});

// Iniciar Express
app.listen(PORT, () => {
  console.log(` [*] Servidor Express corriendo en http://localhost:${PORT}`);
});

// Iniciar el consumidor
receiveMessage().catch(console.error);
