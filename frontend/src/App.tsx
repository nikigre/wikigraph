import { FC, useEffect } from "react";
import { StyledApp } from "./App.styled";
import Graph from "./Graph/Graph";
import Search from "./Search/Search";
import { useAppSelector } from "./redux";
import useGetLinks from "./utils/getLinks";
import Footer from "./Footer/Footer";

const App: FC = () => {
  const currentSearch = useAppSelector((state) => state.graph.currentSearch);

  const { searchLinks } = useGetLinks();

  useEffect(() => {
    console.log('🚀 App: Current search changed to:', currentSearch);
    if (currentSearch) {
      searchLinks({ mopedID: currentSearch, type: "set" });
    } else {
      console.log('⚠️ App: Empty currentSearch, skipping API call');
    }
  }, [currentSearch]);

  return (
    <StyledApp>
      <Search />
      <Graph />
      <Footer />
    </StyledApp>
  );
};

export default App;
