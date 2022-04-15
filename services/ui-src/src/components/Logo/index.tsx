import QmrLogo from "../../assets/logo_qmr.png";

export function Logo() {
  return (
    <div data-testid="qmr-logo">
      <img src={QmrLogo} alt="QMR Logo" style={{ maxWidth: "100px" }} />
    </div>
  );
}
