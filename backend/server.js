const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const cors = require("cors");

// handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log("Shuting down the server due to uncaught Exception");
  process.exit(1);
});

dotenv.config({ path: "backend/config/config.env" });
// connecting database
app.use(cors());
connectDatabase();

app.listen(process.env.PORT, () => {
  console.log("server is working on", process.env.PORT);
});



// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log("Shuting down the server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
