import { Router, type IRouter } from "express";
import healthRouter from "./health";
import lawyersRouter from "./lawyers";
import specialtiesRouter from "./specialties";
import reviewsRouter from "./reviews";
import blogRouter from "./blog";
import bannersRouter from "./banners";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(lawyersRouter);
router.use(specialtiesRouter);
router.use(reviewsRouter);
router.use(blogRouter);
router.use(bannersRouter);
router.use(contactRouter);

export default router;
