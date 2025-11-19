import { Event } from "./event.model";
import { Booking } from "./booking.model";

export { Event, type EventDocument } from "./event.model";
export { Booking, type BookingDocument } from "./booking.model";

// Convenience default export of the models grouped together.
export default {
  Event,
  Booking,
};
