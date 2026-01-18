import styled from "styled-components";

export const ControlsContainer = styled.div`
  position: fixed;
  right: 20px;
  top: 80px;
  background: rgba(0, 0, 0, 0.85);
  padding: 15px 20px;
  border-radius: 8px;
  color: white;
  font-family: Inter, sans-serif;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
`;

export const ControlsTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 8px;
`;

export const ControlButton = styled.button<{ isActive?: boolean }>`
  background: ${(props) => props.isActive ? "#ff4444" : "#4CAF50"};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  width: 100%;
  margin-bottom: 8px;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const StatusText = styled.div`
  font-size: 12px;
  color: #aaa;
  margin-top: 8px;
  text-align: center;
`;

export const SettingRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px;
`;

export const SettingLabel = styled.label`
  font-size: 12px;
  color: #ddd;
`;

export const SettingInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;
