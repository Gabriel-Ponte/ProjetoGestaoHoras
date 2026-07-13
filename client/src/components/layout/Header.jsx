import Wrapper from '@/styles/header';
import logo from "@/assets/image/logo.png";
import { ThemeToggle, LanguageSelector } from '@/components/ui';

function Header() {
  return (
    <Wrapper>
      <header className="header" id="headerPrincipal">
        <div className="container">
          <img src={logo} alt="Logo Pulse" className="imageLogo" />

          {/* Theme + language live in the Header because it is rendered on every
              screen, including Login / Error (which have no navbar). */}
          <div className="header-actions">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </header>
    </Wrapper>
  );
}

export default Header;
