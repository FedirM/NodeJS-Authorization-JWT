const mongoose = require("./database");
const schema = {
    u_name: { type: mongoose.SchemaTypes.String, required: true },
    u_pass: { type: mongoose.SchemaTypes.String, required: true },
    u_id: { type: mongoose.SchemaTypes.Number, required: true},
    u_role: { type: mongoose.SchemaTypes.Boolean, required: true},
    lastseen: { type: mongoose.SchemaTypes.Date, require: true}
};
const collectionName = "users"; // Name of the collection of documents
const userSchema = mongoose.Schema(schema);
const User = mongoose.model(collectionName, userSchema);
module.exports = User;