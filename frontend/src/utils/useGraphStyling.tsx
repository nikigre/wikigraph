import { LinkObject, NodeObject } from "react-force-graph-2d";
import { useAppSelector } from "../redux";
import { Link, Node } from "../types/GraphTypes";
import { useCallback } from "react";

const useGraphStyling = () => {
  const { hoveredNodeId: hoveredNode, highlightedNodes } = useAppSelector(
    (state) => state.graph
  );

  const getNodeColor = (node: NodeObject<Node>): string => {
    const now = new Date();
    
    // Check if datumSprejetja is in the future - make it white
    if (node.datumSprejetja) {
      const datumSprejetja = new Date(node.datumSprejetja);
      if (datumSprejetja > now) {
        return "#FFFFFF"; // White - future adoption date
      }
    }
    
    // Check if datumPrenehanjaVeljavnosti or datumKoncaUporabe is in the past - make it red
    if (node.datumPrenehanjaVeljavnosti) {
      const datumPrenehanjaVeljavnosti = new Date(node.datumPrenehanjaVeljavnosti);
      if (datumPrenehanjaVeljavnosti < now) {
        return "#FF0000"; // Red - validity ended
      }
    }
    
    if (node.datumKoncaUporabe) {
      const datumKoncaUporabe = new Date(node.datumKoncaUporabe);
      if (datumKoncaUporabe < now) {
        return "#FF0000"; // Red - usage ended
      }
    }
    
    // Check if we have enough information to determine validity
    // We need at least datumZacetkaVeljavnosti to know if it's valid
    if (!node.datumZacetkaVeljavnosti) {
      return "#FFFF00"; // Yellow - insufficient information
    }
    
    // Check if active (datumZacetkaVeljavnosti in past and datumPrenehanjaVeljavnosti is null or future)
    const datumZacetkaVeljavnosti = new Date(node.datumZacetkaVeljavnosti);
    const validityStartInPast = datumZacetkaVeljavnosti <= now;
    
    // If validity hasn't started yet, it's not currently valid
    if (!validityStartInPast) {
      return "#FFFF00"; // Yellow - not yet valid
    }
    
    // If we have datumPrenehanjaVeljavnosti, check if it's in the future
    if (node.datumPrenehanjaVeljavnosti) {
      const datumPrenehanjaVeljavnosti = new Date(node.datumPrenehanjaVeljavnosti);
      if (datumPrenehanjaVeljavnosti >= now) {
        return "#00FF00"; // Green - currently valid
      }
    } else {
      // No end date means it's still valid (if it started)
      return "#00FF00"; // Green - currently valid
    }
    
    // Default yellow for unknown status
    return "#FFFF00";
  };

  const nodeCanvasObject = useCallback(
    (
      node: NodeObject<Node>,
      ctx: CanvasRenderingContext2D,
      globalScale: number
    ) => {
      const highlightNode = highlightedNodes[node.id];
      const label = globalScale < 1 ? "" : node.title;
      const radius = Math.min(10 / globalScale, 2);
      const fontSize = 12 / globalScale;
      const textYOffset = 20 / globalScale; // Offset for text below the circle

      // Draw blue circle
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);
      const nodeColor = getNodeColor(node);
      ctx.fillStyle = highlightNode ? "orange" : nodeColor;
      ctx.fill();

      // Draw text below the circle
      ctx.font = `${fontSize}px Inter`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.globalAlpha =
        highlightNode && hoveredNode !== node.id
          ? 1
          : Math.min(Math.max(globalScale - 3.5, 0) / 5, 1);
      ctx.fillStyle = "white";
      ctx.fillText(label, node.x!, node.y! + textYOffset);

      ctx.globalAlpha = 1;
    },
    [highlightedNodes, hoveredNode]
  );

  const decideStyle = (
    element: LinkObject<Node, Link>,
    activeStyle: any,
    inactiveStyle: any
  ) => {
    const source = element.source as NodeObject<Node>;
    const target = element.target as NodeObject<Node>;

    const isActive = source.id === hoveredNode || target.id === hoveredNode;

    return isActive ? activeStyle : inactiveStyle;
  };

  const decideShowParticles = useCallback(
    (element: LinkObject<Node, Link>) => decideStyle(element, 2, 0),
    [hoveredNode]
  );

  const decideLineWidth = useCallback(
    (element: LinkObject<Node, Link>) => decideStyle(element, 4, 1),
    [hoveredNode]
  );

  const getColorByEdgeType = (edgeName?: string): string => {
    switch (edgeName) {
      case "posega v ta akt":
        return "#ff6b6b"; // Red
      case "vpliva na ta akt":
        return "#4ecdc4"; // Teal
      case "podrejeni predpis":
        return "#95e1d3"; // Light teal
      case "ta akt posega v":
        return "#ffa07a"; // Light salmon
      case "ta akt vpliva na":
        return "#6c5ce7"; // Purple
      case "Izbrani zakon":
        return "#fdcb6e"; // Yellow
      default:
        return "#3f3f3f42"; // Default gray
    }
  };

  const decideLineColor = useCallback(
    (element: LinkObject<Node, Link>) => {
      const source = element.source as NodeObject<Node>;
      const target = element.target as NodeObject<Node>;
      const isActive = source.id === hoveredNode || target.id === hoveredNode;
      
      const baseColor = getColorByEdgeType(element.edgeName);
      
      // If active, make it more opaque
      if (isActive) {
        return baseColor.replace("42", ""); // Remove transparency
      }
      
      return baseColor;
    },
    [hoveredNode]
  );

  return {
    decideLineColor,
    decideLineWidth,
    decideShowParticles,
    nodeCanvasObject,
  };
};

export default useGraphStyling;
