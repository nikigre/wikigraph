import { FC, useEffect, useState, useRef } from "react";
import ForceGraph2d, {
  LinkObject,
  NodeObject,
  ForceGraphMethods,
} from "react-force-graph-2d";
import ForceGraph3d from "react-force-graph-3d";
import { Data, Link, Node } from "../types/GraphTypes";
import useGraphUtils from "../utils/useGraphUtils";
import { useAppSelector } from "../redux";
import useGraphStyling from "../utils/useGraphStyling";
import Legend from "../Legend/Legend";

type Props = {};

type GraphElement = ForceGraphMethods<NodeObject<Node>, LinkObject<Node, Link>>;

const Graph: FC<Props> = () => {
  const ref = useRef<GraphElement>();

  const { isNewSearch, nodes, links } = useAppSelector((state) => state.graph);

  // TODO: add ability to toggle 3D views
  const [show3d, _setShow3d] = useState(false);
  const [data, setData] = useState<Data>({ nodes: [], links: [] });

  useEffect(() => {
    console.log('🎨 Graph effect triggered - isNewSearch:', isNewSearch, 'nodes:', nodes.length, 'links:', links.length);
    
    if (isNewSearch) {
      console.log('🆕 NEW SEARCH - Setting fresh graph data');
      const newData = {
        nodes: nodes.map((node) => Object.assign({}, node)),
        links: links.map((link) => Object.assign({}, link)),
      };
      console.log('📊 Graph data to render:', newData);
      setData(newData);
      return;
    }

    // When nodes are updated (even if count doesn't change), we need to sync
    // This happens when clicking on existing nodes to get more details
    if (nodes.length === data.nodes.length) {
      console.log('🔄 UPDATING existing nodes with new data');
      const updatedData = {
        nodes: nodes.map((node) => Object.assign({}, node)),
        links: links.map((link) => Object.assign({}, link)),
      };
      setData(updatedData);
      return;
    }

    // need to copy nodes to prevent the library for mutating state directly
    const updatedData = {
      nodes: [
        ...data.nodes,
        ...nodes
          .slice(data.nodes.length)
          .map((node) => Object.assign({}, node)),
      ],
      links: [
        ...data.links,
        ...links
          .slice(data.links.length)
          .map((link) => Object.assign({}, link)),
      ],
    };
    console.log('➕ ADDING to existing graph - Total nodes:', updatedData.nodes.length, 'Total links:', updatedData.links.length);
    setData(updatedData);
  }, [nodes, links, isNewSearch]);

  const { handleHover, handleClick, handleInitialZoom } = useGraphUtils(
    ref.current,
    data.nodes
  );

  const {
    decideLineColor,
    decideLineWidth,
    decideShowParticles,
    nodeCanvasObject,
  } = useGraphStyling();

  if (show3d) {
    return (
      <>
        <Legend />
        <ForceGraph3d
          enableNodeDrag={false}
          onNodeClick={handleClick}
          graphData={data as any}
          nodeLabel={(n) => n.title}
          onNodeHover={handleHover}
          linkWidth={decideLineWidth}
          linkDirectionalParticles={4}
          linkDirectionalParticleWidth={decideShowParticles}
        />
      </>
    );
  }

  return (
    <>
      <Legend />
      <ForceGraph2d
        ref={ref}
        enableNodeDrag={false}
        onNodeClick={handleClick}
        graphData={data}
        cooldownTime={400}
        nodeLabel={(n) => n.title}
        linkColor={decideLineColor}
        linkDirectionalParticleColor={() => "white"}
        nodeCanvasObject={nodeCanvasObject}
        onNodeHover={handleHover}
        nodeRelSize={5}
        maxZoom={20}
        minZoom={0.2}
        linkWidth={decideLineWidth}
        linkDirectionalParticles={4}
        linkDirectionalParticleWidth={decideShowParticles}
        onEngineStop={handleInitialZoom}
      />
    </>
  );
};

export default Graph;
