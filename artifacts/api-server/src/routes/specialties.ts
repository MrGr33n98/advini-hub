import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { specialtiesTable } from "@workspace/db/schema";

const router: IRouter = Router();

router.get("/specialties", async (req, res) => {
  try {
    const specialties = await db.select().from(specialtiesTable).orderBy(specialtiesTable.name);
    res.json(specialties.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description ?? undefined,
      parentId: s.parentId ?? null,
      slug: s.slug,
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to list specialties");
    res.status(500).json({ error: "internal_error", message: "Failed to list specialties" });
  }
});

export default router;
