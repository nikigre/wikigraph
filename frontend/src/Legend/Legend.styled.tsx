import styled from "styled-components";

export const LegendContainer = styled.div`
  position: fixed;
  left: 20px;
  top: 80px;
  background: rgba(0, 0, 0, 0.85);
  padding: 15px 20px;
  border-radius: 8px;
  color: white;
  font-family: Inter, sans-serif;
  z-index: 1000;
  min-width: 220px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
`;

export const LegendTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 8px;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ColorBox = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  margin-right: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
  
  /* For yellow color, add a darker border for visibility */
  ${(props) => props.color === "#FFFF00" && `
    border: 1px solid rgba(0, 0, 0, 0.5);
  `}
`;

export const LegendText = styled.span`
  line-height: 1.4;
`;
