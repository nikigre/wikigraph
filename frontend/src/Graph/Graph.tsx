import { FC, useEffect, useState, useRef, useMemo } from "react";
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
import Controls from "../Controls/Controls";
import { getNodeValidityType } from "../utils/nodeValidityHelper";
import GraphErrorBoundary from "./GraphErrorBoundary";

type Props = {};

type GraphElement = ForceGraphMethods<NodeObject<Node>, LinkObject<Node, Link>>;

const Graph: FC<Props> = () => {
  const ref = useRef<GraphElement>();

  const { isNewSearch, nodes, links } = useAppSelector((state) => state.graph);
  const settings = useAppSelector((state) => state.settings);
  
  // Fallback to default values if visibleNodeTypes is undefined
  const visibleNodeTypes = settings?.visibleNodeTypes || {
    valid: true,
    invalid: true,
    unknown: true,
    future: true,
  };

  // TODO: add ability to toggle 3D views
  const [show3d, _setShow3d] = useState(false);
  const [data, setData] = useState<Data>({ nodes: [], links: [] });

  // Helper to safely get link source/target IDs
  const getLinkNodeId = (linkNode: string | NodeObject<Node> | undefined | null): string | null => {
    if (!linkNode) return null;
    if (typeof linkNode === 'string') return linkNode;
    if (typeof linkNode === 'object' && linkNode.id) return linkNode.id;
    return null;
  };

  // Filter nodes based on visibility settings
  const filteredData = useMemo(() => {
    if (!data.nodes || !data.links || !Array.isArray(data.nodes) || !Array.isArray(data.links)) {
      return { nodes: [], links: [] };
    }

    // First, filter by visibility type and ensure valid nodes
    const typeFilteredNodes = data.nodes.filter((node) => {
      if (!node || !node.id) return false;
      const nodeType = getNodeValidityType(node);
      const isVisible = visibleNodeTypes[nodeType];
      return isVisible;
    });

    const typeFilteredNodeIds = new Set(typeFilteredNodes.map((n) => n.id));

    // Filter links to only include those between visible nodes with valid IDs
    const visibleLinks = data.links.filter((link) => {
      if (!link) return false;
      const sourceId = getLinkNodeId(link.source as any);
      const targetId = getLinkNodeId(link.target as any);
      if (!sourceId || !targetId) return false;
      return typeFilteredNodeIds.has(sourceId) && typeFilteredNodeIds.has(targetId);
    });

    // Build a set of nodes that have at least one visible connection
    const connectedNodeIds = new Set<string>();
    visibleLinks.forEach((link) => {
      const sourceId = getLinkNodeId(link.source as any);
      const targetId = getLinkNodeId(link.target as any);
      if (sourceId) connectedNodeIds.add(sourceId);
      if (targetId) connectedNodeIds.add(targetId);
    });

    // Keep only nodes that have connections (or are the only node)
    const visibleNodes = typeFilteredNodes.filter((node) => {
      // If there's only one node, show it even without connections
      if (typeFilteredNodes.length === 1) return true;
      // Otherwise, only show nodes that have at least one connection
      return connectedNodeIds.has(node.id);
    });

    console.log('🔍 Filtering nodes:', {
      total: data.nodes.length,
      afterTypeFilter: typeFilteredNodes.length,
      afterOrphanFilter: visibleNodes.length,
      visibleLinks: visibleLinks.length,
      visibleNodeTypes,
    });

    return {
      nodes: visibleNodes,
      links: visibleLinks,
    };
  }, [data, visibleNodeTypes]);

  useEffect(() => {
    console.log('🎨 Graph effect triggered - isNewSearch:', isNewSearch, 'nodes:', nodes.length, 'links:', links.length);
    
    // Ensure we always have valid arrays
    if (!nodes || !links) {
      console.warn('⚠️ Invalid nodes or links data');
      return;
    }

    if (isNewSearch) {
      console.log('🆕 NEW SEARCH - Setting fresh graph data');
      const newData = {
        nodes: (nodes || []).map((node) => Object.assign({}, node)),
        links: (links || []).map((link) => Object.assign({}, link)),
      };
      console.log('📊 Graph data to render:', newData);
      setData(newData);
      return;
    }

    // When nodes are updated (even if count doesn't change), we need to sync
    // This happens when clicking on existing nodes to get more details
    if (nodes.length === data.nodes.length && links.length === data.links.length) {
      console.log('🔄 UPDATING existing nodes with new data');
      const updatedData = {
        nodes: (nodes || []).map((node) => Object.assign({}, node)),
        links: (links || []).map((link) => Object.assign({}, link)),
      };
      setData(updatedData);
      return;
    }

    // need to copy nodes to prevent the library for mutating state directly
    const updatedData = {
      nodes: [
        ...data.nodes,
        ...(nodes || [])
          .slice(data.nodes.length)
          .map((node) => Object.assign({}, node)),
      ],
      links: [
        ...data.links,
        ...(links || [])
          .slice(data.links.length)
          .map((link) => Object.assign({}, link)),
      ],
    };
    console.log('➕ ADDING to existing graph - Total nodes:', updatedData.nodes.length, 'Total links:', updatedData.links.length);
    setData(updatedData);
  }, [nodes, links, isNewSearch]);

  const { handleHover, handleClick, handleInitialZoom } = useGraphUtils(
    ref.current,
    filteredData.nodes
  );

  const {
    decideLineColor,
    decideLineWidth,
    decideShowParticles,
    nodeCanvasObject,
  } = useGraphStyling();

  // Force graph refresh when node data changes by reheating the simulation slightly
  useEffect(() => {
    if (ref.current && filteredData.nodes.length > 0) {
      // Use a tiny reheat to force redraw without disrupting layout
      try {
        ref.current.d3ReheatSimulation?.();
      } catch (e) {
        // Ignore if method doesn't exist
      }
    }
  }, [filteredData]);

  if (show3d) {
    return (
      <>
        <Legend />
        <Controls />
        <GraphErrorBoundary>
          <ForceGraph3d
            enableNodeDrag={false}
            onNodeClick={handleClick}
            graphData={filteredData as any}
            nodeLabel={(n) => n.title}
            onNodeHover={handleHover}
            linkWidth={decideLineWidth}
            linkDirectionalParticles={4}
            linkDirectionalParticleWidth={decideShowParticles}
          />
        </GraphErrorBoundary>
      </>
    );
  }

  return (
    <>
      <Legend />
      <Controls />
      <GraphErrorBoundary>
        <ForceGraph2d
          ref={ref}
          enableNodeDrag={false}
          onNodeClick={handleClick}
          graphData={filteredData}
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
      </GraphErrorBoundary>
    </>
  );
};

export default Graph;
