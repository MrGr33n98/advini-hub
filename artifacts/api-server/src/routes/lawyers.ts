import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  lawyersTable,
  lawyerSpecialtiesTable,
  specialtiesTable,
  officesTable,
  reviewsTable,
} from "@workspace/db/schema";
import { eq, and, gte, ilike, inArray, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/lawyers", async (req, res) => {
  try {
    const specialty = req.query["specialty"] as string | undefined;
    const city = req.query["city"] as string | undefined;
    const state = req.query["state"] as string | undefined;
    const minRating = req.query["minRating"] ? parseFloat(req.query["minRating"] as string) : undefined;
    const search = req.query["search"] as string | undefined;
    const page = Math.max(1, parseInt((req.query["page"] as string) || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt((req.query["limit"] as string) || "12", 10)));
    const offset = (page - 1) * limit;

    const conditions = [];

    if (city) {
      conditions.push(ilike(lawyersTable.city, `%${city}%`));
    }
    if (state) {
      conditions.push(ilike(lawyersTable.state, `%${state}%`));
    }
    if (minRating !== undefined && !isNaN(minRating)) {
      conditions.push(gte(lawyersTable.avgRating, minRating));
    }
    if (search) {
      conditions.push(ilike(lawyersTable.fullName, `%${search}%`));
    }

    let lawyerIds: number[] | undefined;

    if (specialty) {
      const spec = await db
        .select({ id: specialtiesTable.id })
        .from(specialtiesTable)
        .where(ilike(specialtiesTable.slug, specialty));
      const specIds = spec.map(s => s.id);
      if (specIds.length > 0) {
        const ls = await db
          .selectDistinct({ lawyerId: lawyerSpecialtiesTable.lawyerId })
          .from(lawyerSpecialtiesTable)
          .where(inArray(lawyerSpecialtiesTable.specialtyId, specIds));
        lawyerIds = ls.map(l => l.lawyerId);
        if (lawyerIds.length === 0) {
          return res.json({ data: [], total: 0, page, limit, totalPages: 0 });
        }
        conditions.push(inArray(lawyersTable.id, lawyerIds));
      }
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult, lawyers] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(lawyersTable).where(where),
      db.select().from(lawyersTable).where(where).limit(limit).offset(offset),
    ]);

    const total = countResult[0]?.count ?? 0;

    const lawyerWithSpecialties = await Promise.all(
      lawyers.map(async (lawyer) => {
        const specs = await db
          .select({ specialty: specialtiesTable })
          .from(lawyerSpecialtiesTable)
          .innerJoin(specialtiesTable, eq(lawyerSpecialtiesTable.specialtyId, specialtiesTable.id))
          .where(eq(lawyerSpecialtiesTable.lawyerId, lawyer.id));

        return {
          id: lawyer.id,
          fullName: lawyer.fullName,
          oabNumber: lawyer.oabNumber,
          oabState: lawyer.oabState,
          city: lawyer.city,
          state: lawyer.state,
          bio: lawyer.bio,
          yearsExperience: lawyer.yearsExperience,
          hourlyRateMin: lawyer.hourlyRateMin ?? null,
          hourlyRateMax: lawyer.hourlyRateMax ?? null,
          isVerified: lawyer.isVerified,
          avgRating: lawyer.avgRating,
          totalReviews: lawyer.totalReviews,
          photoUrl: lawyer.photoUrl ?? null,
          specialties: specs.map(s => ({
            id: s.specialty.id,
            name: s.specialty.name,
            description: s.specialty.description ?? undefined,
            parentId: s.specialty.parentId ?? null,
            slug: s.specialty.slug,
          })),
        };
      })
    );

    res.json({
      data: lawyerWithSpecialties,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to list lawyers");
    res.status(500).json({ error: "internal_error", message: "Failed to list lawyers" });
  }
});

router.get("/lawyers/:id", async (req, res) => {
  try {
    const id = parseInt(req.params["id"]!, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "invalid_id", message: "Invalid lawyer ID" });
    }

    const [lawyer] = await db.select().from(lawyersTable).where(eq(lawyersTable.id, id));
    if (!lawyer) {
      return res.status(404).json({ error: "not_found", message: "Lawyer not found" });
    }

    const [specs, office, reviews] = await Promise.all([
      db
        .select({ specialty: specialtiesTable })
        .from(lawyerSpecialtiesTable)
        .innerJoin(specialtiesTable, eq(lawyerSpecialtiesTable.specialtyId, specialtiesTable.id))
        .where(eq(lawyerSpecialtiesTable.lawyerId, id)),
      lawyer.officeId
        ? db.select().from(officesTable).where(eq(officesTable.id, lawyer.officeId)).then(r => r[0] ?? null)
        : Promise.resolve(null),
      db
        .select()
        .from(reviewsTable)
        .where(and(eq(reviewsTable.lawyerId, id), eq(reviewsTable.moderationStatus, "approved")))
        .limit(5),
    ]);

    res.json({
      id: lawyer.id,
      fullName: lawyer.fullName,
      oabNumber: lawyer.oabNumber,
      oabState: lawyer.oabState,
      city: lawyer.city,
      state: lawyer.state,
      bio: lawyer.bio,
      yearsExperience: lawyer.yearsExperience,
      hourlyRateMin: lawyer.hourlyRateMin ?? null,
      hourlyRateMax: lawyer.hourlyRateMax ?? null,
      isVerified: lawyer.isVerified,
      avgRating: lawyer.avgRating,
      totalReviews: lawyer.totalReviews,
      photoUrl: lawyer.photoUrl ?? null,
      phone: lawyer.phone ?? null,
      website: lawyer.website ?? null,
      languages: lawyer.languages,
      specialties: specs.map(s => ({
        id: s.specialty.id,
        name: s.specialty.name,
        slug: s.specialty.slug,
        parentId: s.specialty.parentId ?? null,
      })),
      office: office ? {
        id: office.id,
        tradeName: office.tradeName,
        city: office.city,
        state: office.state,
        lawyerCount: office.lawyerCount,
        logoUrl: office.logoUrl ?? null,
      } : null,
      recentReviews: reviews.map(r => ({
        id: r.id,
        lawyerId: r.lawyerId,
        rating: r.rating,
        comment: r.comment,
        caseType: r.caseType,
        caseOutcome: r.caseOutcome ?? null,
        moderationStatus: r.moderationStatus,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get lawyer");
    res.status(500).json({ error: "internal_error", message: "Failed to get lawyer" });
  }
});

export default router;
