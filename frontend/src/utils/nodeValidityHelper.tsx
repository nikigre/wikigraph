import { Node } from "../types/GraphTypes";

export type NodeValidityType = 'valid' | 'invalid' | 'unknown' | 'future';

export const getNodeValidityType = (node: Node): NodeValidityType => {
  const now = new Date();
  
  // Check if datumSprejetja is in the future - future
  if (node.datumSprejetja) {
    const datumSprejetja = new Date(node.datumSprejetja);
    if (datumSprejetja > now) {
      return 'future';
    }
  }
  
  // Check if datumPrenehanjaVeljavnosti or datumKoncaUporabe is in the past - invalid
  if (node.datumPrenehanjaVeljavnosti) {
    const datumPrenehanjaVeljavnosti = new Date(node.datumPrenehanjaVeljavnosti);
    if (datumPrenehanjaVeljavnosti < now) {
      return 'invalid';
    }
  }
  
  if (node.datumKoncaUporabe) {
    const datumKoncaUporabe = new Date(node.datumKoncaUporabe);
    if (datumKoncaUporabe < now) {
      return 'invalid';
    }
  }
  
  // Check if we have enough information to determine validity
  if (!node.datumZacetkaVeljavnosti) {
    return 'unknown';
  }
  
  // Check if active
  const datumZacetkaVeljavnosti = new Date(node.datumZacetkaVeljavnosti);
  const validityStartInPast = datumZacetkaVeljavnosti <= now;
  
  // If validity hasn't started yet
  if (!validityStartInPast) {
    return 'unknown';
  }
  
  // If we have datumPrenehanjaVeljavnosti, check if it's in the future
  if (node.datumPrenehanjaVeljavnosti) {
    const datumPrenehanjaVeljavnosti = new Date(node.datumPrenehanjaVeljavnosti);
    if (datumPrenehanjaVeljavnosti >= now) {
      return 'valid';
    }
  } else {
    // No end date means it's still valid (if it started)
    return 'valid';
  }
  
  // Default unknown
  return 'unknown';
};
