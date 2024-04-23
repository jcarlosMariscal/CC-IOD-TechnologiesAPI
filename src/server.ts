// import express from "express";

// const app = express();

// app.get("/", (req, res) => {
//   res.json({ message: "Hello World" });
// })

// app.listen(1116, () => {
//   console.log("Server listening on port 1116");
// })

import app from "./app";

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});