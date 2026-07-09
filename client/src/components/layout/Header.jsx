import Wrapper from '@/styles/header';
import logo from "@/assets/image/logo.png";

function Header() {
  return (
    <Wrapper>
    <header className="header" id="headerPrincipal">
      <div className="container">
        <img src={logo} alt="Logo Pulse" className="imageLogo" />
      </div>
    </header>
    </Wrapper>
  );
}

export default Header;
