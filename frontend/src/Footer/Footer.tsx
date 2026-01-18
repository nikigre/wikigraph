import { StyledFooter } from "./Footer.styled";

const Footer = () => {
  return (
    <StyledFooter>
      <p className="instructions">
        Kliknite na vozlišča za nalaganje več povezav. CMD/CTRL + klik za odpiranje PISRS strani. Za najboljšo izkušnjo uporabite računalnik.
      </p>
      <p className="footer-text">
        <strong>PISRS Graf</strong> - Vizualizacija povezave med slovenskimi predpisi
      </p>
      <p className="footer-text" style={{ fontSize: "12px", marginTop: "5px" }}>
        Bazirana na{" "}
        <a href="https://github.com/dannydi12/wikigraph" target="_blank" rel="noreferrer">
          WikiGraph
        </a>{" "}
        by{" "}
        <a href="https://danthebuilder.com" target="_blank" rel="noreferrer">
          Daniel Di Venere
        </a>{" "}
        🤖
      </p>
    </StyledFooter>
  );
};

export default Footer;
