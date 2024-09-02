import express from "express";
import {
  logAction,
  getActionHistory,
} from "./controllers/actionHistoryController";

const app = express();
app.use(express.json());

app.post("/actions", logAction);
app.get("/actions", getActionHistory);

app.listen(4000, () => console.log("Server is running on port 4000"));
