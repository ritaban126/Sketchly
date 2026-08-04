import "dotenv/config";
import {startImageProcessingWorker} from "./src/jobs/imageProcessing.job";
import {startNotificationWorker} from "./src/jobs/notification.job";


startImageProcessingWorker();
startNotificationWorker();

console.log("All BullMQ workers started");