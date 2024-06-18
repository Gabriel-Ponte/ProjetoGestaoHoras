import Wrapper from '../assets/wrappers/header';
import logo from "../assets/image/logoISQ_CTAG.png";

function Header() {
  return (
    <Wrapper>
    <header className="header" id="headerPrincipal">
      <div className="container">
        <img src={logo} alt="Logo ICQ CTAG" className="imageLogo" />
      </div>
    </header>
    </Wrapper>
  );
}

export default Header;
