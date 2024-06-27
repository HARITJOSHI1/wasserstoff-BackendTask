import express from "express";

const APP_PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());

app.use("/demo", (_, res) => {
  return res.json({message: "It works!!!!"})
});

app.all("*", (_, res) => res.status(404).json({ message: "Route not found" }));

app.listen(4000, () => {
  console.info(`Server running on PORT ${APP_PORT}`);
  
});
