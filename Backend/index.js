const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const convertRoute = require("./route/ConvertRoute");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", convertRoute);

app.listen(PORT, () => {
  console.log(`Universal File Converter running on http://localhost:${PORT}`);
});
