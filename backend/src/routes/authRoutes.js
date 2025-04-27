const express = require("express");
const { 
  registerUser, 
  loginUser, 
  updateUser, 
  createFolder, 
  createFile, 
  getFoldersAndFiles, 
  deleteFolder, 
  updateFile, 
  deleteFile ,
  partialUpdateFile,

} = require("../controllers/authController");
const authenticateToken = require("../middleware/authMiddleware.js");
const router = express.Router();

// User Authentication Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update", authenticateToken, updateUser);

// Folder Management Routes
router.post("/folders", authenticateToken, createFolder);
router.delete("/folders/:id", authenticateToken, deleteFolder); // Delete folder

// File Management Routes
router.post("/files", authenticateToken, createFile); // Create new file
router.put("/files/:id", authenticateToken, updateFile); // Update file
router.delete("/files/:id", authenticateToken, deleteFile); // Delete file


router.patch("/files/:id", authenticateToken, partialUpdateFile); // New: Partial update file

// Get Folders and Files
router.get('/data', authenticateToken, getFoldersAndFiles); // Get all folders and files




module.exports = router;
