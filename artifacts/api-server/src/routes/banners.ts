import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { bannersTable } from "@workspace/db/schema";
import { and, eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/banners", async (req, res) => {
  try {
    const position = req.query["position"] as string | undefined;
    const conditions = [eq(bannersTable.isActive, true)];
    if (position) {
      conditions.push(eq(bannersTable.position, position));
    }
    const banners = await db.select().from(bannersTable).where(and(...conditions));
    res.json(banners.map(b => ({
      id: b.id,
      title: b.title,
      imageUrl: b.imageUrl,
      targetUrl: b.targetUrl,
      position: b.position,
      isActive: b.isActive,
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to list banners");
    res.status(500).json({ error: "internal_error" });
  }
});

export default router;
