const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" }, // Optional: Standalone or inside a folder
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  
  containers: [
    {
      id: { type: Number, required: true },
      type: { type: String, required: true },
      value: { type: String, required: false }, // Optional, depending on your needs
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("File", FileSchema);