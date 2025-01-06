const express = require("express");
const { ObjectId } = require("mongodb");
const multer = require("multer");
const connectDB = require("../utils/db");

const router = express.Router();
const upload = require("../../src/config/multerConfig");

// GET /events
router.get("/", async (req, res, next) => {
  try {
    const db = await connectDB();
    const { id, type, limit, page } = req.query;

    if (id) {
      const event = await db.collection("events").findOne({ _id: new ObjectId(id) });
      if (!event) return res.status(404).json({ message: "Event not found" });
      return res.json(event);
    }

    if (type === "latest") {
      const events = await db
        .collection("events")
        .find()
        .sort({ schedule: -1 })
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit))
        .toArray();
      return res.json(events);
    }

    res.status(400).json({ message: "Invalid query parameters" });
  } catch (err) {
    next(err);
  }
});

// POST /events
router.post("/", upload.single("files[image]"), async (req, res, next) => {
    try {
      const db = await connectDB();
      const { name, tagline, schedule, description, moderator, category, sub_category, rigor_rank } = req.body;
  
      if (!name || !tagline || !schedule || !description) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const scheduleDate = new Date(schedule);
      if (isNaN(scheduleDate.getTime())) {
        return res.status(400).json({ message: "Invalid schedule date" });
      }
  
      const rigorRank = parseInt(rigor_rank);
      if (isNaN(rigorRank)) {
        return res.status(400).json({ message: "Invalid rigor_rank value" });
      }
  
      if (!req.file) {
        return res.status(400).json({ message: "File upload failed" });
      }
  
      const newEvent = {
        name,
        tagline,
        schedule: scheduleDate,
        description,
        files: { image: req.file.filename },
        moderator,
        category,
        sub_category,
        rigor_rank: rigorRank,
        attendees: [],
      };
  
      const result = await db.collection("events").insertOne(newEvent);
      res.status(201).json({ id: result.insertedId, event: newEvent });
    } catch (err) {
      next(err);
    }
  });

// PUT /events/:id
router.put("/:id", upload.single("files[image]"), async (req, res, next) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const { name, tagline, schedule, description, moderator, category, sub_category, rigor_rank } = req.body;

    const updatedEvent = {
      ...(name && { name }),
      ...(tagline && { tagline }),
      ...(schedule && { schedule: new Date(schedule) }),
      ...(description && { description }),
      ...(req.file && { files: { image: req.file.filename } }),
      ...(moderator && { moderator }),
      ...(category && { category }),
      ...(sub_category && { sub_category }),
      ...(rigor_rank && { rigor_rank: parseInt(rigor_rank) }),
    };

    const result = await db.collection("events").updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedEvent }
    );

    if (result.matchedCount === 0) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event updated successfully" });
  } catch (err) {
    next(err);
  }
});

// DELETE /events/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const db = await connectDB();
    const { id } = req.params;

    const result = await db.collection("events").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
