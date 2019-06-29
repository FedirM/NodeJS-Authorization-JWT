const mongoose = require("mongoose");
const dbPath = "mongodb://localhost/user";
mongoose.connect(dbPath, {
    useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", () => {
    console.log("> error occurred from the database");
    process.exit(-1);
});
db.once("open", () => {
    console.log("> successfully opened the database");
});

module.exports = mongoose;