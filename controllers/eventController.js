import Event from "../models/eventModel.js";

// GET all events
export const getAllEvents = async (req, res) => {
  try {
    const { role, permissions } = req.user;
    if (!(role === "admin")) {
      return res.status(403).json({
        error: "Sorry! You are not authorized to perform this action.",
      });
    }
    const events = await Event.find();
    res.status(200).json({ success: true, events: events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET a single event by ID
export const getEventById = async (req, res) => {
  try {
    const { role, permissions } = req.user;
    if (!(role === "admin")) {
      return res.status(403).json({
        error: "Sorry! You are not authorized to perform this action.",
      });
    }
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json({ success: true, event: event });
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST a new event
export const createEvent = async (req, res) => {
  try {
    console.log(req.body)
    const { role, permissions } = req.user;
    if (!(role === "admin")) {
      return res.status(403).json({
        error: "Sorry! You are not authorized to perform this action.",
      });
    }
    const userId = req.user._id;
    console.log(req.body)
    const { event_title, event_category, event_description,event_images,event_date,event_subcategory } = req.body;
    console.log(event_title)
    const event = await Event.create({
      user: userId,
      event_subcategory: event_subcategory,
      event_title: event_title,
      event_category: event_category,
      event_date:event_date,
      event_description: event_description,
      event_images:event_images
    });
    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT/update an existing event by ID
export const updateEventById = async (req, res) => {
  try {
    const { role, permissions } = req.user;
    if (!(role === "admin")) {
      return res.status(403).json({
        error: "Sorry! You are not authorized to perform this action.",
      });
    }
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error("Error updating event by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE an event by ID
export const deleteEventById = async (req, res) => {
  try {
    const { role, permissions } = req.user;
    if (!(role === "admin")) {
      return res.status(403).json({
        error: "Sorry! You are not authorized to perform this action.",
      });
    }
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting event by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
