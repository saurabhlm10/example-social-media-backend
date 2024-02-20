require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { TodoModel } = require("./Todo");
const { default: mongoose } = require("mongoose");

const connectToDb = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then((conn) => console.log("Connected to DB at", conn.connection.host))
    .catch((err) => console.log("An error occured in DB", err.message));
};

connectToDb();

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello"));

app.post("/createTodo", async (req, res) => {
  try {
    const createdTodo = await TodoModel.create(req.body);

    return res.status(200).json({
      message: "Created Todo successfully",
      data: createdTodo,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.get("/gettodos", async (req, res) => {
  try {
    const todos = await TodoModel.find();

    return res.status(200).json({
      message: "Fetched Todos successfully",
      data: todos,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.put("/updatetodo/:id", async (req, res) => {
  const updatedTodo = await TodoModel.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { new: true }
  );

  console.log(req.body);
  console.log(updatedTodo);

  return res.status(200).json({
    message: "Updated Todo successfully",
    data: updatedTodo,
  });
});

app.delete("/deleteTodo/:id", async (req, res) => {
  const deletedTodo = await TodoModel.findOneAndDelete({ id: req.params.id });

  return res.status(200).json({
    message: "Deleted Todo successfully",
  });
});

app.listen(4000, () => console.log("App is listening on 4000"));
