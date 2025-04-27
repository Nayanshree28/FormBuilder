const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); 
const Folder = require("../models/Folder");
const File = require("../models/File");


// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    await User.create({ name, email, password }); // Create user with name
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id); // Generate JWT
      res.status(201).json({
        message: "Login successful",
        token, // Include the token
        name: user.name, // Include the user's name
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



const updateUser = async (req, res) => {
  const { name, email, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (oldPassword && newPassword) {
      const isMatch = await user.matchPassword(oldPassword);
      if (!isMatch) return res.status(401).json({ message: "Old password is incorrect" });

      user.password = newPassword; // This will trigger the `pre("save")` middleware
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// Create a new folder
const createFolder = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id; // Use `req.user.id` from authenticated token

    if (!name) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    const folder = new Folder({ name, createdBy: userId });
    await folder.save();

    // Populate createdBy field to include only the user's name, excluding _id
    const populatedFolder = await Folder.findById(folder._id)
      .populate('createdBy', 'name');  // Only fetch the 'name' of the user

    res.status(201).json({
      message: "Folder created successfully",
      folder: populatedFolder, // Send populated folder with the user's name (without _id)
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new file (inside a folder or standalone)
const createFile = async (req, res) => {
  try {
    const { name, folderId,  } = req.body;
    const userId = req.user.id; // Use `req.user.id` from authenticated token

    // Log for debugging
    console.log("Received request body:", req.body);
    console.log("User ID from token:", userId);

    // Validate name
    if (!name) {
      return res.status(400).json({ message: "File name is required" });
    }

    // Handle folderId if it's not provided
    if (folderId && folderId === 'null') {
      console.log("Folder ID is null, creating file without a folder.");
    }

    // Create the file
    const file = new File({
      name,
      folderId: folderId !== undefined ? folderId : null, 
      createdBy: userId,
    });

    await file.save();

    // Populate createdBy field to include user's name
    const populatedFile = await File.findById(file._id).populate('createdBy', 'name');

    // Send the response
    res.status(201).json({
      message: "File created successfully",
      file: populatedFile,
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error creating file:", error);
    
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Get all folders and files created by the user
const getFoldersAndFiles = async (req, res) => {
  try {
    const userId = req.user.id;

    const folders = await Folder.find({ createdBy: userId });
    const files = await File.find({ createdBy: userId });

    res.status(200).json({ folders, files });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// Delete a folder and all its files
const deleteFile = async (req, res) => {
  try {
    const { id } = req.params; // File ID from the request URL
    const userId = req.user.id; // User ID from the authenticated token

    const file = await File.findOneAndDelete({ _id: id, createdBy: userId });
    if (!file) {
      return res.status(404).json({ message: "File not found or unauthorized" });
    }

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Delete a folder and all its files
const deleteFolder = async (req, res) => {
  try {
    const { id } = req.params; // Folder ID from the request URL
    const userId = req.user.id; // User ID from the authenticated token

    const folder = await Folder.findOneAndDelete({ _id: id, createdBy: userId });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found or unauthorized" });
    }

    // Optionally delete all files associated with the folder
    await File.deleteMany({ folderId: id });

    res.status(200).json({ message: "Folder and associated files deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




const updateFile = async (req, res) => {
  try {
    const { id } = req.params;  
    const { name } = req.body;  

    console.log("Updating file with ID:", id); 

    // Check if ID is valid
    if (!id) {
      return res.status(400).json({ message: "File ID is required" });
    }

    const updatedFile = await File.findByIdAndUpdate(
      id, 
      { name },
      { new: true }  // Return the updated file
    );

    if (!updatedFile) {
      return res.status(404).json({ message: "File not found" });
    }

    res.status(200).json({
      message: "File updated successfully",
      file: updatedFile,
    });
  } catch (error) {
    console.log("Error:", error);  // Log error message for debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Partial Update File (PATCH)
const partialUpdateFile = async (req, res) => {
  const { id } = req.params; // Get file ID from the URL
  const updates = req.body; // Get fields to update from the request body

  try {
    const updatedFile = await File.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedFile) {
      return res.status(404).json({ message: "File not found" });
    }
    res.status(200).json({ message: "File partially updated", updatedFile });
  } catch (error) {
    res.status(500).json({ message: "Error updating file", error });
  }
};


module.exports = { registerUser,
                   loginUser ,
                   updateUser, 
                   createFolder,
                   createFile,
                   getFoldersAndFiles,
                   deleteFolder,
                   updateFile, 
                   deleteFile,
                   partialUpdateFile,
                 
                  };
