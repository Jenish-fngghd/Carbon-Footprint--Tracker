const express = require("express");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Configure Nodemailer for sending emails (using a Gmail example)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "jenishsorathiya2005@gmail.com", // Your email address
    pass: "vsmzcotkjxqyiqwi", // Your email password or app-specific password
  },
});

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("ecoApp");
    const usersCollection = db.collection("users");
    const otpsCollection = db.collection("otps");

    // Helper function to generate a 6-digit OTP
    const generateOTP = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };

    // Login Endpoint (unchanged)
    app.post("/api/login", async (req, res) => {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const user = await usersCollection.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      res.json({
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        joinedDate: user.joinedDate,
        devices: user.devices || [],
        ecoPoints: user.ecoPoints,
        coupons: user.coupons || [],
      });
    });

    // Generate OTP Endpoint
    app.post("/api/generate-otp", async (req, res) => {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Check if email already exists
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // Generate OTP
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

      // Store OTP in the database
      await otpsCollection.insertOne({
        email,
        otp,
        expiresAt,
        createdAt: new Date(),
      });

      // Send OTP via email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP for EcoApp Signup",
        text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
      };

      try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "OTP sent to your email" });
      } catch (error) {
        console.error("Failed to send OTP email:", error);
        res.status(500).json({ error: "Failed to send OTP" });
      }
    });

    // Verify OTP Endpoint
    app.post("/api/verify-otp", async (req, res) => {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ error: "Email and OTP are required" });
      }

      const otpRecord = await otpsCollection.findOne({ email, otp });
      if (!otpRecord) {
        return res.status(400).json({ error: "Invalid OTP" });
      }

      // Check if OTP has expired
      if (new Date() > new Date(otpRecord.expiresAt)) {
        await otpsCollection.deleteOne({ email, otp });
        return res.status(400).json({ error: "OTP has expired" });
      }

      // OTP is valid, delete it from the database
      await otpsCollection.deleteOne({ email, otp });
      res.json({ message: "OTP verified successfully" });
    });

    // SignUp Endpoint
    app.post("/api/signup", async (req, res) => {
      const { firstName, lastName, email, password, devices } = req.body;
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Check for duplicate email (should already be checked in OTP step, but adding for safety)
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // Check for duplicate device IDs (from previous implementation)
      if (devices && devices.length > 0) {
        const deviceIds = devices.map(device => device.id);
        const usersWithDevices = await usersCollection
          .find({ "devices.id": { $in: deviceIds } })
          .toArray();

        if (usersWithDevices.length > 0) {
          const duplicateDeviceIds = usersWithDevices
            .flatMap(user => user.devices)
            .filter(device => deviceIds.includes(device.id))
            .map(device => device.id);

          return res.status(400).json({
            error: `The following device IDs are already registered: ${duplicateDeviceIds.join(", ")}`,
          });
        }
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = {
        firstName,
        lastName,
        email,
        passwordHash,
        joinedDate: new Date().toISOString().split("T")[0],
        devices: devices || [],
        ecoPoints: 500,
        coupons: [],
      };

      const result = await usersCollection.insertOne(newUser);
      res.json({
        id: result.insertedId.toString(),
        firstName,
        lastName,
        email,
        joinedDate: newUser.joinedDate,
        devices: newUser.devices,
        ecoPoints: newUser.ecoPoints,
        coupons: newUser.coupons,
      });
    });

    // Update User Endpoint (unchanged)
    app.put("/api/users/:id", async (req, res) => {
      const { id } = req.params;
      const updates = req.body;

      // Check for duplicate device IDs when updating
      if (updates.devices) {
        const deviceIds = updates.devices.map(device => device.id);
        const usersWithDevices = await usersCollection
          .find({
            _id: { $ne: new MongoClient.ObjectId(id) },
            "devices.id": { $in: deviceIds },
          })
          .toArray();

        if (usersWithDevices.length > 0) {
          const duplicateDeviceIds = usersWithDevices
            .flatMap(user => user.devices)
            .filter(device => deviceIds.includes(device.id))
            .map(device => device.id);

          return res.status(400).json({
            error: `The following device IDs are already registered: ${duplicateDeviceIds.join(", ")}`,
          });
        }
      }

      const result = await usersCollection.updateOne(
        { _id: new MongoClient.ObjectId(id) },
        { $set: updates }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedUser = await usersCollection.findOne({ _id: new MongoClient.ObjectId(id) });
      res.json({
        id: updatedUser._id.toString(),
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        joinedDate: updatedUser.joinedDate,
        devices: updatedUser.devices || [],
        ecoPoints: updatedUser.ecoPoints,
        coupons: updatedUser.coupons || [],
      });
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
}

startServer();