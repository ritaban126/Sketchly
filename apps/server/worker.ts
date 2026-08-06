import "dotenv/config";
import express from "express";
import {startImageProcessingWorker} from "./src/jobs/imageProcessing.job";
import {startNotificationWorker} from "./src/jobs/notification.job";


const healthApp = express();
healthApp.get("/health", (_req, res) => res.json({ status: "worker alive" }));
healthApp.listen(process.env.PORT || 3001);
startImageProcessingWorker();
startNotificationWorker();

console.log("All BullMQ workers started");