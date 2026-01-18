import { FC, useState, useEffect, useRef } from "react";
import {
  ControlsContainer,
  ControlsTitle,
  ControlButton,
  StatusText,
  SettingRow,
  SettingLabel,
  SettingInput,
} from "./Controls.styled";
import { useAppSelector } from "../redux";
import useGetLinks from "../utils/getLinks";

type Props = {};

const Controls: FC<Props> = () => {
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
  const [delay, setDelay] = useState(2000); // 2 seconds default
  const { nodes, links, currentSearch } = useAppSelector((state) => state.graph);
  const { searchLinks } = useGetLinks();
  const processedNodesRef = useRef<Set<string>>(new Set());
  const queueRef = useRef<string[]>([]);
  const isProcessingRef = useRef(false);

  // Build BFS queue based on graph structure
  const buildBFSQueue = (): string[] => {
    if (!nodes || nodes.length === 0 || !links) {
      return [];
    }

    const queue: string[] = [];
    const visited = new Set<string>();
    const adjacencyList = new Map<string, Set<string>>();

    // Build adjacency list from links
    (links || []).forEach((link) => {
      const source = typeof link.source === 'string' ? link.source : (link.source as any).id || link.source;
      const target = typeof link.target === 'string' ? link.target : (link.target as any).id || link.target;
      
      if (!adjacencyList.has(source)) {
        adjacencyList.set(source, new Set());
      }
      if (!adjacencyList.has(target)) {
        adjacencyList.set(target, new Set());
      }
      
      adjacencyList.get(source)!.add(target);
      adjacencyList.get(target)!.add(source);
    });

    // BFS starting from currentSearch node
    const startNode = currentSearch || (nodes.length > 0 ? nodes[0].id : null);
    if (!startNode) return [];

    const bfsQueue = [startNode];
    visited.add(startNode);

    while (bfsQueue.length > 0) {
      const current = bfsQueue.shift()!;
      queue.push(current);

      const neighbors = adjacencyList.get(current) || new Set();
      neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          bfsQueue.push(neighbor);
        }
      });
    }

    // Add any disconnected nodes at the end
    nodes.forEach((node) => {
      if (!visited.has(node.id)) {
        queue.push(node.id);
      }
    });

    return queue;
  };

  useEffect(() => {
    if (!isAutoAdvancing || isProcessingRef.current) return;

    const processNextNode = async () => {
      // Rebuild queue if needed (when new nodes are added)
      if (queueRef.current.length === 0) {
        const bfsQueue = buildBFSQueue();
        queueRef.current = bfsQueue.filter(
          (nodeId) => !processedNodesRef.current.has(nodeId)
        );
      }

      if (queueRef.current.length === 0) {
        setIsAutoAdvancing(false);
        return;
      }

      // Get next node from BFS queue
      const nodeToProcess = queueRef.current.shift()!;

      isProcessingRef.current = true;

      try {
        console.log(`🤖 BFS Auto-advancing: Processing node ${nodeToProcess}`);
        await searchLinks({ mopedID: nodeToProcess, type: "add" });
        processedNodesRef.current.add(nodeToProcess);
      } catch (error) {
        console.error("Error processing node:", error);
      } finally {
        isProcessingRef.current = false;
      }
    };

    const timer = setTimeout(processNextNode, delay);

    return () => clearTimeout(timer);
  }, [isAutoAdvancing, nodes.length, links.length, delay, searchLinks, currentSearch]);

  const handleStart = () => {
    const bfsQueue = buildBFSQueue();
    queueRef.current = bfsQueue.filter(
      (nodeId) => !processedNodesRef.current.has(nodeId)
    );
    setIsAutoAdvancing(true);
  };

  const handleStop = () => {
    setIsAutoAdvancing(false);
  };

  const handleReset = () => {
    setIsAutoAdvancing(false);
    processedNodesRef.current.clear();
    queueRef.current = [];
  };

  const unprocessedCount = nodes.filter(
    (node) => !processedNodesRef.current.has(node.id)
  ).length;

  return (
    <ControlsContainer>
      <ControlsTitle>Samodejno širjenje (BFS)</ControlsTitle>

      <SettingRow>
        <SettingLabel>Zamik (ms)</SettingLabel>
        <SettingInput
          type="number"
          min="500"
          max="10000"
          step="500"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          disabled={isAutoAdvancing}
        />
      </SettingRow>

      {!isAutoAdvancing ? (
        <ControlButton onClick={handleStart} disabled={unprocessedCount === 0}>
          ▶ Začni
        </ControlButton>
      ) : (
        <ControlButton isActive onClick={handleStop}>
          ⏸ Ustavi
        </ControlButton>
      )}

      <ControlButton
        onClick={handleReset}
        style={{ background: "#666" }}
        disabled={isAutoAdvancing}
      >
        🔄 Ponastavi
      </ControlButton>

      <StatusText>
        {isAutoAdvancing ? (
          <>Obdelava vozlišč... ({processedNodesRef.current.size}/{nodes.length})</>
        ) : (
          <>Neobdelanih: {unprocessedCount}/{nodes.length}</>
        )}
      </StatusText>
      <StatusText style={{ fontSize: '10px', marginTop: '4px' }}>
        V čakalni vrsti: {queueRef.current.length}
      </StatusText>
    </ControlsContainer>
  );
};

export default Controls;
