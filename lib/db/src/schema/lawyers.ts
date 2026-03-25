import { pgTable, serial, integer, text, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const lawyersTable = pgTable("lawyers", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  oabNumber: text("oab_number").notNull(),
  oabState: text("oab_state").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  bio: text("bio").notNull().default(""),
  yearsExperience: integer("years_experience").notNull().default(0),
  hourlyRateMin: real("hourly_rate_min"),
  hourlyRateMax: real("hourly_rate_max"),
  isVerified: boolean("is_verified").notNull().default(false),
  avgRating: real("avg_rating").notNull().default(0),
  totalReviews: integer("total_reviews").notNull().default(0),
  photoUrl: text("photo_url"),
  phone: text("phone"),
  website: text("website"),
  languages: text("languages").array().notNull().default([]),
  officeId: integer("office_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLawyerSchema = createInsertSchema(lawyersTable).omit({ id: true, createdAt: true });
export type InsertLawyer = z.infer<typeof insertLawyerSchema>;
export type Lawyer = typeof lawyersTable.$inferSelect;
