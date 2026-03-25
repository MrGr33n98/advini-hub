import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { reviewsTable, lawyersTable } from "@workspace/db/schema";
import { eq, and, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/reviews/lawyer/:lawyerId", async (req, res) => {
  try {
    const lawyerId = parseInt(req.params["lawyerId"]!, 10);
    if (isNaN(lawyerId)) {
      return res.status(400).json({ error: "invalid_id" });
    }

    const reviews = await db
      .select()
      .from(reviewsTable)
      .where(and(eq(reviewsTable.lawyerId, lawyerId), eq(reviewsTable.moderationStatus, "approved")));

    res.json(reviews.map(r => ({
      id: r.id,
      lawyerId: r.lawyerId,
      rating: r.rating,
      comment: r.comment,
      caseType: r.caseType,
      caseOutcome: r.caseOutcome ?? null,
      moderationStatus: r.moderationStatus,
      createdAt: r.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to get reviews");
    res.status(500).json({ error: "internal_error" });
  }
});

router.post("/reviews", async (req, res) => {
  try {
    const { lawyerId, rating, comment, caseType, caseOutcome, clientName } = req.body;

    if (!lawyerId || !rating || !comment || !caseType || !clientName) {
      return res.status(400).json({ error: "missing_fields", message: "Required fields are missing" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "invalid_rating", message: "Rating must be 1-5" });
    }
    if (comment.length < 20) {
      return res.status(400).json({ error: "comment_too_short", message: "Comment must be at least 20 characters" });
    }

    const [inserted] = await db.insert(reviewsTable).values({
      lawyerId,
      clientName,
      rating,
      comment,
      caseType,
      caseOutcome: caseOutcome ?? null,
      moderationStatus: "pending",
    }).returning();

    if (!inserted) {
      return res.status(500).json({ error: "insert_failed" });
    }

    const autoApprove = rating >= 3 && comment.length >= 50;
    if (autoApprove) {
      await db
        .update(reviewsTable)
        .set({ moderationStatus: "approved" })
        .where(eq(reviewsTable.id, inserted.id));

      const allReviews = await db
        .select({ rating: reviewsTable.rating })
        .from(reviewsTable)
        .where(and(eq(reviewsTable.lawyerId, lawyerId), eq(reviewsTable.moderationStatus, "approved")));

      const avgRating = allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;

      await db
        .update(lawyersTable)
        .set({
          avgRating: Math.round(avgRating * 10) / 10,
          totalReviews: allReviews.length,
        })
        .where(eq(lawyersTable.id, lawyerId));
    }

    res.status(201).json({
      id: inserted.id,
      lawyerId: inserted.lawyerId,
      rating: inserted.rating,
      comment: inserted.comment,
      caseType: inserted.caseType,
      caseOutcome: inserted.caseOutcome ?? null,
      moderationStatus: autoApprove ? "approved" : "pending",
      createdAt: inserted.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create review");
    res.status(500).json({ error: "internal_error" });
  }
});

export default router;
