import { FC, useEffect, useState, useRef } from "react";
import { StyledSearch } from "./Search.styled";
import { api } from "../utils/api";
import { PredpisSearchDisplay } from "../types/PredpisSearchTypes";
import SearchResult from "./SearchResult";
import { randomSearchRecommendation } from "../utils/randomeSearchRecommendation";
import { useDebounce } from "usehooks-ts";
import { setCurrentSearch, useAppDispatch, useAppSelector } from "../redux";
import { ReactComponent as SearchIcon } from "./SearchIcon.svg";
import useGetLinks from "../utils/getLinks";

const Search: FC = () => {
  const dispatch = useAppDispatch();
  const currentSearch = useAppSelector((state) => state.graph.currentSearch);
  const nodes = useAppSelector((state) => state.graph.nodes);
  const { searchLinks } = useGetLinks();
  const graphRef = useRef<any>(null);

  const [searchInputValue, setSearchInputValue] = useState("");
  const [results, setResults] = useState<PredpisSearchDisplay[]>([]);
  const [placeholderText, setPlaceholderText] = useState(currentSearch);
  const [foundInGraph, setFoundInGraph] = useState<PredpisSearchDisplay | null>(null);

  const debouncedQuery = useDebounce(searchInputValue, 300);

  const getPredpisSearch = async () => {
    try {
      if (!debouncedQuery) {
        setResults([]);
        setFoundInGraph(null);
        return;
      }

      // First, check if the node exists in current graph
      const matchingNode = nodes.find(
        (node) =>
          node.id.toLowerCase() === debouncedQuery.toLowerCase() ||
          node.title.toLowerCase().includes(debouncedQuery.toLowerCase())
      );

      if (matchingNode) {
        setFoundInGraph({
          mopedId: matchingNode.id,
          naziv: matchingNode.title,
        });
        setResults([]);
        return;
      }

      setFoundInGraph(null);

      // Search by mopedID via API
      const { data } = await api.get('/predpisi/search', {
        params: { mopedID: debouncedQuery },
      });

      if (data.primary) {
        const searchResults: PredpisSearchDisplay[] = [{
          mopedId: data.primary.mopedId,
          naziv: data.primary.naziv,
        }];

        setResults(searchResults);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.log(err);
      setResults([]);
    }
  };

  useEffect(() => {
    getPredpisSearch();
  }, [debouncedQuery, nodes]);

  const handleZoomToNode = (mopedId: string) => {
    console.log('🎯 handleZoomToNode called for:', mopedId);
    window.dispatchEvent(new CustomEvent("zoomToNode", { detail: { nodeId: mopedId } }));
  };

  return (
    <StyledSearch $areResults={!!results.length || !!foundInGraph}>
      <div className="input-box">
        <SearchIcon className="search-icon" />
        <input
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.target.value)}
          placeholder={placeholderText}
        />
      </div>

      <div className="results">
        {foundInGraph && (
          <div
            style={{
              padding: "10px 12px",
              background: "#4CAF50",
              color: "white",
              borderRadius: "4px",
              marginBottom: "8px",
              cursor: "pointer",
              fontSize: "13px",
            }}
            onClick={() => {
              setSearchInputValue("");
              handleZoomToNode(foundInGraph.mopedId);
            }}
          >
            <strong>✓ Najdeno v grafu:</strong> {foundInGraph.naziv}
            <div style={{ fontSize: "11px", marginTop: "4px", opacity: 0.9 }}>
              Kliknite za prikaz
            </div>
          </div>
        )}

        {results.map((result, index) => (
          <SearchResult
            key={`${result.mopedId}-${index}`}
            result={{ title: result.naziv, snippet: result.mopedId }}
            onClick={() => {
              window.gtag("event", "search", {
                mopedID: result.mopedId,
              });

              console.log('🎯 Search result clicked:', result.mopedId, '- Adding to graph');
              
              // Add to graph instead of replacing
              searchLinks({ mopedID: result.mopedId, type: "add" });
              
              // Update placeholder but keep current search for initial load
              setSearchInputValue("");
              setPlaceholderText(result.naziv);
            }}
          />
        ))}
      </div>
    </StyledSearch>
  );
};

export default Search;
