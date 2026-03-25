import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { blogPostsTable, lawyersTable } from "@workspace/db/schema";
import { eq, and, sql, arrayContains } from "drizzle-orm";

const router: IRouter = Router();

router.get("/blog", async (req, res) => {
  try {
    const tag = req.query["tag"] as string | undefined;
    const page = Math.max(1, parseInt((req.query["page"] as string) || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt((req.query["limit"] as string) || "9", 10)));
    const offset = (page - 1) * limit;

    const conditions = [eq(blogPostsTable.isPublished, 1)];
    if (tag) {
      conditions.push(arrayContains(blogPostsTable.tags, [tag]));
    }

    const where = and(...conditions);

    const [countResult, posts] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(blogPostsTable).where(where),
      db.select().from(blogPostsTable).where(where).limit(limit).offset(offset),
    ]);

    const total = countResult[0]?.count ?? 0;

    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const [author] = await db
          .select({ fullName: lawyersTable.fullName, oabNumber: lawyersTable.oabNumber, oabState: lawyersTable.oabState })
          .from(lawyersTable)
          .where(eq(lawyersTable.id, post.authorLawyerId));
        return {
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          tags: post.tags,
          publishedAt: post.publishedAt?.toISOString() ?? new Date().toISOString(),
          featuredImageUrl: post.featuredImageUrl ?? null,
          authorName: author?.fullName ?? "Advogado Verificado",
          authorOab: author ? `OAB/${author.oabState} ${author.oabNumber}` : "",
          readTimeMinutes: post.readTimeMinutes,
        };
      })
    );

    res.json({
      data: postsWithAuthors,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to list blog posts");
    res.status(500).json({ error: "internal_error" });
  }
});

router.get("/blog/:id", async (req, res) => {
  try {
    const id = parseInt(req.params["id"]!, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "invalid_id" });
    }

    const [post] = await db.select().from(blogPostsTable).where(and(eq(blogPostsTable.id, id), eq(blogPostsTable.isPublished, 1)));
    if (!post) {
      return res.status(404).json({ error: "not_found", message: "Blog post not found" });
    }

    const [author] = await db
      .select({ fullName: lawyersTable.fullName, oabNumber: lawyersTable.oabNumber, oabState: lawyersTable.oabState })
      .from(lawyersTable)
      .where(eq(lawyersTable.id, post.authorLawyerId));

    res.json({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags,
      publishedAt: post.publishedAt?.toISOString() ?? new Date().toISOString(),
      featuredImageUrl: post.featuredImageUrl ?? null,
      authorName: author?.fullName ?? "Advogado Verificado",
      authorOab: author ? `OAB/${author.oabState} ${author.oabNumber}` : "",
      readTimeMinutes: post.readTimeMinutes,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get blog post");
    res.status(500).json({ error: "internal_error" });
  }
});

export default router;
