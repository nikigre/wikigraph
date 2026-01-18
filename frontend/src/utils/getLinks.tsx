import {
  addGraphData,
  setGraphData,
  setIsNewSearch,
  useAppDispatch,
} from "../redux";
import { PredpisSearchResponse } from "../types/PredpisSearchTypes";
import { api } from "./api";

type LinkSearch = {
  mopedID: string;
  type: "set" | "add";
};

const PREDPIS_TYPES = [
  'posegiVPredpis',
  'vpliviNaPredpis', 
  'podrejeniPredpisi',
  'posegaVPredpise',
  'vplivaNaPredpise'
];

const getNameOfTag = (tagname: string): string => {
  switch (tagname) {
    case "zakon":
      return 'Izbrani zakon';
    case "posegiVPredpis":
      return "posega v ta akt";
    case "vpliviNaPredpis": 
      return "vpliva na ta akt";
    case "podrejeniPredpisi":
      return "podrejeni predpis";
    case "posegaVPredpise":
      return "ta akt posega v";
    case "vplivaNaPredpise":
      return "ta akt vpliva na";
    default:
      return "/";
  }
};

const useGetLinks = () => {
  const dispatch = useAppDispatch();

  const searchLinks = async ({ mopedID, type }: LinkSearch) => {
    try {
      if (!mopedID || mopedID.trim() === '') {
        console.warn('Empty mopedID, skipping search');
        return;
      }

      console.log('🔍 Searching for mopedID:', mopedID);

      const { data } = await api.get<PredpisSearchResponse>('/predpisi/search', {
        params: { mopedID: mopedID.trim() }
      });

      console.log('📦 API Response:', data);

      if (!data.primary) {
        console.warn(`No data found for mopedID: ${mopedID}`);
        return;
      }

      console.log('✅ Primary data found:', data.primary);

      const newNodes: Array<{ 
        id: string; 
        title: string; 
        tag: string; 
        tags: string[];
        datumSprejetja?: string;
        datumObjave?: string;
        datumZacetkaVeljavnosti?: string;
        datumPrenehanjaVeljavnosti?: string;
        datumKoncaUporabe?: string;
      }> = [];
      const newLinks: Array<{ source: string; target: string; edgeName: string; ranking: number }> = [];

      // Add the main predpis node
      newNodes.push({
        id: mopedID,
        title: data.primary.naziv || mopedID,
        tag: 'zakon',
        tags: ['zakon'],
        datumSprejetja: data.primary.datumSprejetja,
        datumObjave: data.primary.datumObjave,
        datumZacetkaVeljavnosti: data.primary.datumZacetkaVeljavnosti,
        datumPrenehanjaVeljavnosti: data.primary.datumPrenehanjaVeljavnosti,
        datumKoncaUporabe: data.primary.datumKoncaUporabe
      });

      console.log('🏷️ Added main node:', newNodes[0]);

      // Process each predpis type
      PREDPIS_TYPES.forEach(predpisType => {
        const drawData = data.primary[predpisType];
        console.log(`🔗 Processing ${predpisType}:`, drawData ? drawData.length : 0, 'items');
        
        if (drawData && Array.isArray(drawData)) {
          drawData.forEach((item: any) => {
            // API returns mopedId (lowercase 'd'), not mopedID
            const itemId = item.mopedId || item.mopedID;
            if (itemId && item.naziv) {
              newNodes.push({
                id: itemId,
                title: item.naziv,
                tag: 'predpis',
                tags: [predpisType],
                datumSprejetja: item.datumSprejetja,
                datumObjave: item.datumObjave,
                datumZacetkaVeljavnosti: item.datumZacetkaVeljavnosti,
                datumPrenehanjaVeljavnosti: item.datumPrenehanjaVeljavnosti,
                datumKoncaUporabe: item.datumKoncaUporabe
              });

              newLinks.push({
                source: mopedID,
                target: itemId,
                edgeName: getNameOfTag(predpisType),
                ranking: 3
              });
            }
          });
        }
      });

      console.log('📊 Total nodes created:', newNodes.length);
      console.log('🔗 Total links created:', newLinks.length);
      console.log('📝 Nodes:', newNodes);
      console.log('🔗 Links:', newLinks);

      if (type === "set") {
        console.log('🎯 Setting graph data (new search)');
        dispatch(setGraphData({ nodes: newNodes, links: newLinks }));
        dispatch(setIsNewSearch(true));
      }

      if (type === "add") {
        console.log('➕ Adding to existing graph data');
        dispatch(addGraphData({ nodes: newNodes, links: newLinks }));
      }
    } catch (err) {
      console.error('❌ Error fetching predpis data:', err);
      throw err;
    }
  };

  return { searchLinks };
};

export default useGetLinks;
