/**
 * lib/mongodb.ts
 *
 * Mongoose connection helper for Next.js (TypeScript).
 * - Caches the connection on `globalThis` to prevent multiple connections in
 *   development (hot reloads).
 * - Exports `connectToDatabase()` which returns the connected `Mongoose` instance.
 * - Exports the default `mongoose` object for defining models.
 */

import mongoose, { ConnectOptions, Mongoose } from "mongoose";

// Fail fast if the connection string is missing. Keep message actionable.
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

// Typed cache stored on the global object to survive module reloads in dev.
type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  // Attach the cache to globalThis so it persists across hot reloads in Next.js.
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = globalThis.mongooseCache ?? { conn: null, promise: null };

/**
 * Establishes a Mongoose connection and returns the Mongoose instance.
 * Uses a simple global cache to avoid creating multiple connections during
 * development when modules may be reloaded.
 */
export async function connectToDatabase(): Promise<Mongoose> {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    const opts: ConnectOptions = {
      // Mongoose 6+ has sensible defaults. This object is present so options
      // can be added in one place if needed (tls, authSource, etc.).
    };

    // Save the connect promise immediately to avoid duplicate connect attempts
    // when multiple modules call this function concurrently.
    cache.promise = mongoose.connect(MONGODB_URI!, opts).then(() => mongoose as unknown as Mongoose);
    globalThis.mongooseCache = cache;
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

// Default export of the mongoose instance for defining models elsewhere.
export default mongoose;
