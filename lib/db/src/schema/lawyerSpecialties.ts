import { pgTable, integer, primaryKey } from "drizzle-orm/pg-core";

export const lawyerSpecialtiesTable = pgTable("lawyer_specialties", {
  lawyerId: integer("lawyer_id").notNull(),
  specialtyId: integer("specialty_id").notNull(),
}, (t) => [primaryKey({ columns: [t.lawyerId, t.specialtyId] })]);
