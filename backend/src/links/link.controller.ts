import { Request, Response, NextFunction } from 'express'
// import { db } from '../utils/db'
import { Link } from './link.type'

// DEPRECATED: This controller is no longer used - replaced by PISRS API
export const getLinks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(410).json({ error: 'This endpoint has been deprecated. Use /api/predpisi instead.' });
  } catch (err) {
    next(err)
  }
}

// DEPRECATED: This controller is no longer used - replaced by PISRS API
export const getDeepLinks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(410).json({ error: 'This endpoint has been deprecated. Use /api/predpisi instead.' });
  } catch (err) {
    next(err)
  }
}
