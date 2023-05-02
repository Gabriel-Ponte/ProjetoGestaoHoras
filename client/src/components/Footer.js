import React from 'react';
import '../assets/css/footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="topTextFooter">
          <p className="textFooter float-end">
            Data: &copy; <br />
          </p>
          <p className="textFooter">Version: &copy;</p>
        </div>
        <div className="middleTextFooter">
          <p className="textFooter float-end">
            Email: &copy;
          </p>
        </div>
        <div className="bottonTextFooter">
          <p className="textFooter float-end">
            Contacto: &copy;
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
