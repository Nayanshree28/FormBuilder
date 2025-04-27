const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  formId: { type: String, required: true },
  replies: [
    {
      question: { type: String, required: true },
      reply: { type: String, default: "" },
    },
  ],
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Response", responseSchema);
