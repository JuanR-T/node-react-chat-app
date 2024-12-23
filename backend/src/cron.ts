import cron from "cron";
import https from "https";

const URL = "https://node-react-chat-app-6cwi.onrender.com/";

/**
 * Represents a cron job that sends a request to the deployed app server, every 14 min. 
 * This is done to bypass render sleeping feature, where the request are slowed down after 15 min of inactivity.
 */
const job = new cron.CronJob("*/14 * * * *", () => {
    https.get(URL, (res) => {
        if (res.statusCode === 200) {
            console.log("Cron job request sent successfully");
        } else {
            console.log("Cron job request failed");
        }
    }).on("error", (err) => {
        console.error("Error in cron job request",err);
    });
})

export default job;