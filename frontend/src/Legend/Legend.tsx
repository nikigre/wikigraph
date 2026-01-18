import { FC } from "react";
import {
  LegendContainer,
  LegendTitle,
  LegendItem,
  ColorBox,
  LegendText,
} from "./Legend.styled";

const Legend: FC = () => {
  return (
    <LegendContainer>
      <LegendTitle>Legenda vozlišč</LegendTitle>
      <LegendItem>
        <ColorBox color="#00FF00" />
        <LegendText>Veljavni predpisi</LegendText>
      </LegendItem>
      <LegendItem>
        <ColorBox color="#FF0000" />
        <LegendText>Neveljavni predpisi</LegendText>
      </LegendItem>
      <LegendItem>
        <ColorBox color="#FFFF00" />
        <LegendText>Neznano stanje</LegendText>
      </LegendItem>
      <LegendItem>
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
