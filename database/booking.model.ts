import mongoose from "../lib/mongodb";
import type { Document, Model, Types } from "mongoose";
import type { EventDocument } from "./event.model";

// Booking attributes stored in MongoDB.
export interface BookingAttrs {
  eventId: Types.ObjectId;
  email: string;
}

export interface BookingDocument extends Document<Types.ObjectId>, BookingAttrs {
  createdAt?: Date;
  updatedAt?: Date;
}

const { Schema } = mongoose;

// Simple RFC-like email validation regex (sufficient for most use cases).
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<BookingDocument, Model<BookingDocument>>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator: (v: string) => EMAIL_REGEX.test(v),
        message: "Email is invalid",
      },
    },
  },
  { timestamps: true, strict: true }
);

// Pre-save hook: ensure referenced Event exists before saving a booking.
BookingSchema.pre<BookingDocument>("save", async function () {
  const eventId = this.eventId;
  if (!mongoose.isValidObjectId(eventId)) {
    throw new Error("Invalid eventId");
  }

  // Use the registered Event model to verify existence. If the Event model
  // isn't registered yet, mongoose.models.Event will be undefined and the
  // lookup will fail intentionally to prevent orphan bookings.
  const EventModel = mongoose.models.Event as Model<EventDocument> | undefined;
  if (!EventModel) {
    // This should not happen in a properly initialized app; fail fast.
    throw new Error("Event model is not registered");
  }

  const exists = await EventModel.exists({ _id: eventId });
  if (!exists) {
    throw new Error("Referenced event does not exist");
  }
});

// Export model while guarding against recompilation in dev mode.
export const Booking = (mongoose.models.Booking as Model<BookingDocument>) ||
  mongoose.model<BookingDocument>("Booking", BookingSchema);

export default Booking;
