const express = require("express");
const cors = require("cors");
const sheetsRoutes = require("./routes/sheetsRoutes"); // Make sure this path is correct

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/sheets", sheetsRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
