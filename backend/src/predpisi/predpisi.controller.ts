import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { PisrsApiResponse } from './predpisi.type';

const PISRS_API_KEY = process.env.PISRS_API_KEY || '1vlnd5ed1d91c';

const PISRS_URLS = {
  registerPredpisov:
    'https://pisrs.si/extapi/predpis/register-predpisov?pageSize=10&page=1&mopedID=',
  splosniAktiZaIzvrsevanjeJavnihPooblastil:
    'https://pisrs.si/extapi/predpis/splosni-akti-za-izvrsevanje-javnih-pooblastil?pageSize=10&page=1&mopedID=',
  drugiSplosniInPosamicniAkti:
    'https://pisrs.si/extapi/predpis/drugi-splosni-in-posamicni-akti?pageSize=10&page=1&mopedID=',
  neveljavniPredpisi:
    'https://pisrs.si/extapi/predpis/neveljavni-predpisi?pageSize=10&page=1&mopedID=',
  obsoletniInKonzumiraniPredpisi:
    'https://pisrs.si/extapi/predpis/obsoletni-in-konzumirani-predpisi?pageSize=10&page=1&mopedID=',
  predpisiVpripravi:
    'https://pisrs.si/extapi/predpis/predpisi-v-pripravi?pageSize=10&page=1&mopedID=',
};

const axiosConfig = {
  headers: {
    'X-API-Key': PISRS_API_KEY,
  },
};

/**
 * Search for a specific predpis by mopedID
 * Returns predpis data and related predpisi from all categories
 */
export const searchPredpis = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mopedID } = req.query;

    if (!mopedID || typeof mopedID !== 'string') {
      return res.status(400).json({ error: 'mopedID query parameter is required' });
    }

    // Fetch main predpis from all categories
    const results: any = {
      primary: null,
      related: [],
    };

    // Try to find the primary predpis in all categories
    for (const [category, baseUrl] of Object.entries(PISRS_URLS)) {
      try {
        const { data } = await axios.get<PisrsApiResponse>(baseUrl + mopedID, axiosConfig);

        if (data.data && data.data.length > 0) {
          if (!results.primary) {
            results.primary = {
              ...data.data[0],
              category,
            };
          } else {
            results.related.push({
              ...data.data[0],
              category,
            });
          }
        }
      } catch (err) {
        // Continue to next category if one fails
        continue;
      }
    }

    if (!results.primary) {
      return res.status(404).json({ error: `Predpis with mopedID ${mopedID} not found` });
    }

    res.json(results);
  } catch (err) {
    next(err);
  }
};

/**
 * Get related predpisi by category and parent mopedID
 */
export const getRelatedPredpisi = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mopedID, category } = req.query;

    if (!mopedID || typeof mopedID !== 'string') {
      return res.status(400).json({ error: 'mopedID query parameter is required' });
    }

    const selectedCategory = category as string | undefined;

    if (selectedCategory && !PISRS_URLS[selectedCategory as keyof typeof PISRS_URLS]) {
      return res.status(400).json({ error: `Invalid category: ${selectedCategory}` });
    }

    const results: any[] = [];

    // If specific category requested, only fetch that
    if (selectedCategory) {
      const baseUrl = PISRS_URLS[selectedCategory as keyof typeof PISRS_URLS];
      const { data } = await axios.get<PisrsApiResponse>(baseUrl + mopedID, axiosConfig);

      if (data.data && data.data.length > 0) {
        results.push(...data.data.map((item) => ({ ...item, category: selectedCategory })));
      }
    } else {
      // Fetch from all categories
      for (const [category, baseUrl] of Object.entries(PISRS_URLS)) {
        try {
          const { data } = await axios.get<PisrsApiResponse>(baseUrl + mopedID, axiosConfig);

          if (data.data && data.data.length > 0) {
            results.push(...data.data.map((item) => ({ ...item, category })));
          }
        } catch (err) {
          // Continue to next category if one fails
          continue;
        }
      }
    }

    res.json({ data: results });
  } catch (err) {
    next(err);
  }
};
