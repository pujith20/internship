import express from "express";
import jwt from "jsonwebtoken";
import user from "../models/userModel.js";
const router = express.Router();

// Get User

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const foundUser = await user.findOne({ username });
    if (!foundUser || foundUser.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const userDetails = { 
      username: foundUser.username,
      password: foundUser.password, 
      isAdmin: foundUser.isAdmin
    };
    const token = jwt.sign({ userId: foundUser._id, isAdmin: foundUser.isAdmin }, "MY_SECRET_TOKEN", {
      expiresIn: "1h",
    });
    res.json({ token, userDetails });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/add-user", async (req, res) => {
  try {
    if (!req.body.name || !req.body.username || !req.body.password) {
      return res.status(500).send("Send All the required fields");
    }
    const userDetails = {
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      isAdmin: req.body.isAdmin || false
    };
    const newUser = await user.create(userDetails);
    return res.status(200).send(newUser);
  } catch (err) {
    console.log(err);
  }
});

// Update User

router.put("/update/:id", async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res.status(500).send("Send All the required fields");
    }
    const updateUser = await user.findByIdAndUpdate(req.params.id, req.body);
    if (!updateUser) {
      return res.status(404).send("User Not Found");
    }
    return res.status(200).send("User updated");
  } catch (err) {
    console.log(err);
  }
});


export default router;
