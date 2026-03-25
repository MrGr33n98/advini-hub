import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { contactMessagesTable } from "@workspace/db/schema";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  try {
    const { lawyerId, clientName, clientEmail, clientPhone, message, caseType } = req.body;

    if (!lawyerId || !clientName || !clientEmail || !message || !caseType) {
      return res.status(400).json({ error: "missing_fields", message: "Required fields are missing" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      return res.status(400).json({ error: "invalid_email", message: "Invalid email address" });
    }

    await db.insert(contactMessagesTable).values({
      lawyerId,
      clientName,
      clientEmail,
      clientPhone: clientPhone ?? null,
      message,
      caseType,
    });

    res.json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    req.log.error({ err }, "Failed to send contact message");
    res.status(500).json({ error: "internal_error" });
  }
});

export default router;
