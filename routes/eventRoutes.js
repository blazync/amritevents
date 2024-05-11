import { Router } from "express";
import authenticate from "../middleware/auth.js";
import { getAllEvents, createEvent, getEventById, updateEventById, deleteEventById } from "../controllers/eventController.js";

const router = Router();

/** GET all events */
router.get('/events', authenticate, getAllEvents);

/** GET a single enquiry by ID */
router.get('/events/:id', authenticate, getEventById);

/** POST a new enquiry */
router.post('/events',authenticate, createEvent);


/** PUT/update an existing enquiry by ID */
router.put('/events/:id', authenticate, updateEventById);

/** DELETE an enquiry by ID */
router.delete('/events/:id', authenticate, deleteEventById);

export default router;
