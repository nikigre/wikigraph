import { FC } from "react";
import {
  LegendContainer,
  LegendTitle,
  LegendItem,
  ColorBox,
  LegendText,
  Checkbox,
} from "./Legend.styled";
import { useAppDispatch, useAppSelector } from "../redux";
import { toggleNodeType } from "../redux/slices/settingsSlice";

const Legend: FC = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);
  
  // Fallback to default values if visibleNodeTypes is undefined
  const visibleNodeTypes = settings?.visibleNodeTypes || {
    valid: true,
    invalid: true,
    unknown: true,
    future: true,
  };

  return (
    <LegendContainer>
      <LegendTitle>Legenda vozlišč</LegendTitle>
      <LegendItem onClick={(e) => { e.preventDefault(); dispatch(toggleNodeType('valid')); }}>
        <Checkbox 
          type="checkbox" 
          checked={visibleNodeTypes.valid}
          onChange={(e) => { e.stopPropagation(); }}
          onClick={(e) => { e.stopPropagation(); dispatch(toggleNodeType('valid')); }}
        />
        <ColorBox color="#00FF00" />
        <LegendText>Veljavni predpisi</LegendText>
      </LegendItem>
      <LegendItem onClick={(e) => { e.preventDefault(); dispatch(toggleNodeType('invalid')); }}>
        <Checkbox 
          type="checkbox" 
          checked={visibleNodeTypes.invalid}
          onChange={(e) => { e.stopPropagation(); }}
          onClick={(e) => { e.stopPropagation(); dispatch(toggleNodeType('invalid')); }}
        />
        <ColorBox color="#FF0000" />
        <LegendText>Neveljavni predpisi</LegendText>
      </LegendItem>
      <LegendItem onClick={(e) => { e.preventDefault(); dispatch(toggleNodeType('unknown')); }}>
        <Checkbox 
          type="checkbox" 
          checked={visibleNodeTypes.unknown}
          onChange={(e) => { e.stopPropagation(); }}
          onClick={(e) => { e.stopPropagation(); dispatch(toggleNodeType('unknown')); }}
        />
        <ColorBox color="#FFFF00" />
        <LegendText>Neznano stanje</LegendText>
      </LegendItem>
      <LegendItem onClick={(e) => { e.preventDefault(); dispatch(toggleNodeType('future')); }}>
        <Checkbox 
          type="checkbox" 
          checked={visibleNodeTypes.future}
          onChange={(e) => { e.stopPropagation(); }}
          onClick={(e) => { e.stopPropagation(); dispatch(toggleNodeType('future')); }}
        />
        <ColorBox color="#FFFFFF" />
        <LegendText>Prihodnji predpisi</LegendText>
      </LegendItem>
      
      <LegendTitle style={{ marginTop: '15px' }}>Legenda povezav</LegendTitle>
      <LegendItem>
        <ColorBox color="#fdcb6e" />
        <LegendText>Izbrani zakon</LegendText>
      </LegendItem>
      <LegendItem>
        <ColorBox color="#ff6b6b" />
        <LegendText>Posega v ta akt</LegendText>
      </LegendItem>
      <LegendItem>
        <ColorBox color="#4ecdc4" />
        <LegendText>Vpliva na ta akt</LegendText>
      </LegendItem>
      <LegendItem>
        <ColorBox color="#95e1d3" />
        <LegendText>Podrejeni predpis</LegendText>
      </LegendItem>
      <LegendItem>
        <ColorBox color="#ffa07a" />
        <LegendText>Ta akt posega v</LegendText>
      </LegendItem>
      <LegendItem>
        <ColorBox color="#6c5ce7" />
        <LegendText>Ta akt vpliva na</LegendText>
      </LegendItem>
    </LegendContainer>
  );
};

export default Legend;
