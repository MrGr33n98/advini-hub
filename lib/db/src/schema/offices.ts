import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const officesTable = pgTable("offices", {
  id: serial("id").primaryKey(),
  cnpj: text("cnpj").unique(),
  tradeName: text("trade_name").notNull(),
  legalName: text("legal_name"),
  address: text("address"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  phone: text("phone"),
  website: text("website"),
  foundedYear: integer("founded_year"),
  lawyerCount: integer("lawyer_count").notNull().default(1),
  logoUrl: text("logo_url"),
  mission: text("mission"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOfficeSchema = createInsertSchema(officesTable).omit({ id: true, createdAt: true });
export type InsertOffice = z.infer<typeof insertOfficeSchema>;
export type Office = typeof officesTable.$inferSelect;
