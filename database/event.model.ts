import mongoose from "../lib/mongodb";
import type { Document, Model, Types } from "mongoose";

// Event attributes stored in the database.
export interface EventAttrs {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // normalized to YYYY-MM-DD
  time: string; // normalized to HH:MM (24h)
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
}

// Document type which includes mongoose Document fields and timestamps.
export interface EventDocument extends Document<Types.ObjectId>, EventAttrs {
  createdAt?: Date;
  updatedAt?: Date;
}

const { Schema } = mongoose;

// Create a URL-friendly slug from a title.
const slugify = (value: string): string =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .replace(/-+/g, "-");

// Normalize a date string to YYYY-MM-DD (ISO date part).
const normalizeDate = (value: string): string => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) throw new Error("Invalid date");
  return d.toISOString().slice(0, 10);
};

// Normalize time to HH:MM (24-hour). Accepts common 12h/24h inputs.
const normalizeTime = (value: string): string => {
  const s = value.trim().toLowerCase();
  const m24 = s.match(/^(\d{1,2}):(\d{2})$/);
  if (m24) {
    const hh = Number(m24[1]);
    const mm = Number(m24[2]);
    if (hh < 0 || hh > 23 || mm < 0 || mm > 59) throw new Error("Invalid time");
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  }
  const m12 = s.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
  if (m12) {
    let hh = Number(m12[1]);
    const mm = Number(m12[2] ?? 0);
    const mer = m12[3];
    if (hh < 1 || hh > 12 || mm < 0 || mm > 59) throw new Error("Invalid time");
    if (mer === "pm" && hh !== 12) hh += 12;
    if (mer === "am" && hh === 12) hh = 0;
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  }
  throw new Error("Unrecognized time format");
};

// Schema: required validators ensure non-empty strings/arrays where needed.
const EventSchema = new Schema<EventDocument, Model<EventDocument>>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      validate: { validator: (v: string) => typeof v === "string" && v.trim().length > 0, message: "Title cannot be empty" },
    },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: [true, "Description is required"] },
    overview: { type: String, required: [true, "Overview is required"] },
    image: { type: String, required: [true, "Image is required"] },
    venue: { type: String, required: [true, "Venue is required"] },
    location: { type: String, required: [true, "Location is required"] },
    date: { type: String, required: [true, "Date is required"] },
    time: { type: String, required: [true, "Time is required"] },
    mode: { type: String, required: [true, "Mode is required"] },
    audience: { type: String, required: [true, "Audience is required"] },
    agenda: { type: [String], required: [true, "Agenda is required"], validate: { validator: (v: string[]) => Array.isArray(v) && v.length > 0, message: "Agenda must be a non-empty array" } },
    organizer: { type: String, required: [true, "Organizer is required"] },
    tags: { type: [String], required: [true, "Tags are required"], validate: { validator: (v: string[]) => Array.isArray(v), message: "Tags must be an array" } },
  },
  { timestamps: true, strict: true }
);

// Ensure unique index on slug.
EventSchema.index({ slug: 1 }, { unique: true });

// Pre-save: generate slug (only when title changes) and normalize date/time.
EventSchema.pre<EventDocument>("save", async function () {
  if (this.isModified("title") || !this.slug) {
    const base = slugify(this.title);
    let candidate = base;
    let suffix = 0;
    // Use mongoose.models to avoid circular import at module load time.
    const EventModel = mongoose.models.Event as Model<EventDocument> | undefined;
    while (EventModel) {
      const existing = await EventModel.findOne({ slug: candidate, _id: { $ne: this._id } }).lean().exec();
      if (!existing) break;
      suffix += 1;
      candidate = `${base}-${suffix}`;
    }
    this.slug = candidate;
  }

  if (this.isModified("date")) {
    this.date = normalizeDate(this.date);
  }

  if (this.isModified("time")) {
    this.time = normalizeTime(this.time);
  }
});

// Export model (guard against recompilation in development).
export const Event = (mongoose.models.Event as Model<EventDocument>) || mongoose.model<EventDocument>("Event", EventSchema);
export default Event;
