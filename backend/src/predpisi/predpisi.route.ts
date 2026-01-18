import { Router } from 'express';
import { searchPredpis, getRelatedPredpisi, getQueryLogsController } from './predpisi.controller';

const router = Router();

/**
 * GET /api/predpisi/search?mopedID=<id>
 * Search for a predpis by mopedID and get related predpisi
 */
router.get('/search', searchPredpis);

/**
 * GET /api/predpisi/related?mopedID=<id>&category=<category>
 * Get related predpisi by category (optional)
 */
router.get('/related', getRelatedPredpisi);

/**
 * GET /api/predpisi/logs?mopedID=<id>
 * Get query logs (optionally filtered by mopedID)
 */
router.get('/logs', getQueryLogsController);

export default router;
