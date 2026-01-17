import { FC, useEffect, useState } from "react";
import { StyledSearch } from "./Search.styled";
import { api } from "../utils/api";
import { PredpisSearchDisplay } from "../types/PredpisSearchTypes";
import SearchResult from "./SearchResult";
import { randomSearchRecommendation } from "../utils/randomeSearchRecommendation";
import { useDebounce } from "usehooks-ts";
import { setCurrentSearch, useAppDispatch, useAppSelector } from "../redux";
import { ReactComponent as SearchIcon } from "./SearchIcon.svg";

const Search: FC = () => {
  const dispatch = useAppDispatch();
  const currentSearch = useAppSelector((state) => state.graph.currentSearch);

  const [searchInputValue, setSearchInputValue] = useState("");
  const [results, setResults] = useState<PredpisSearchDisplay[]>([]);
  const [placeholderText, setPlaceholderText] = useState(currentSearch);


  const debouncedQuery = useDebounce(searchInputValue, 300);

  const getPredpisSearch = async () => {
    try {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }

      // Search by mopedID
      const { data } = await api.get('/predpisi/search', {
        params: { mopedID: debouncedQuery },
      });

      if (data.primary) {
        const searchResults: PredpisSearchDisplay[] = [{
          mopedID: data.primary.mopedID,
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
  }, [debouncedQuery]);

  return (
    <StyledSearch $areResults={!!results.length}>
      <div className="input-box">
        <SearchIcon className="search-icon" />
        <input
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.target.value)}
          placeholder={placeholderText}
        />
      </div>

      <div className="results">
        {results.map((result, index) => (
          <SearchResult
            key={`${result.mopedID}-${index}`}
            result={{ title: result.naziv, snippet: result.mopedID }}
            onClick={() => {
              window.gtag("event", "search", {
                mopedID: result.mopedID,
              });

              dispatch(setCurrentSearch(result.mopedID));
              setSearchInputValue("");
              setPlaceholderText(result.mopedID);
            }}
          />
        ))}
      </div>
    </StyledSearch>
  );
};

export default Search;
