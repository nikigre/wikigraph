import fs from 'fs';
import path from 'path';

// JSON file-based cache
const cachePath = path.join(__dirname, '../../query-cache.json');

export interface QueryLog {
  id?: string;
  mopedID: string;
  data: any;
  dateOfUpdate: string;
  created_at?: string;
}

interface CacheData {
  [mopedID: string]: QueryLog;
}

// Initialize cache file if it doesn't exist
if (!fs.existsSync(cachePath)) {
  fs.writeFileSync(cachePath, JSON.stringify({}), 'utf-8');
}

const readCache = (): CacheData => {
  try {
    const data = fs.readFileSync(cachePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading cache:', error);
    return {};
  }
};

const writeCache = (cache: CacheData): void => {
  try {
    fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing cache:', error);
  }
};

export const saveQueryLog = (mopedID: string, data: any): void => {
  const cache = readCache();
  cache[mopedID] = {
    mopedID,
    data,
    dateOfUpdate: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };
  writeCache(cache);
};

export const getQueryLogs = (mopedID?: string): QueryLog[] => {
  const cache = readCache();
  
  if (mopedID) {
    const entry = cache[mopedID];
    return entry ? [entry] : [];
  }
  
  return Object.values(cache);
};

export const getCachedQuery = (mopedID: string): any | null => {
  const cache = readCache();
  const entry = cache[mopedID];
  
  return entry ? entry.data : null;
};
