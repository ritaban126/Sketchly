import "dotenv/config";
import {startImageProcessingWorker} from "./src/jobs/imageProcessing.job";
import {startExportWorker} from "./src/jobs/export.job";
import {startNotificationWorker} from "./src/jobs/notification.job";


startImageProcessingWorker();
startExportWorker();
startNotificationWorker();

console.log("All BullMQ workers started");