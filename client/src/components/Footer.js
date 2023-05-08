import React from 'react';
import '../assets/css/footer.css';
import { MdOutlineEmail } from 'react-icons/md';
import { BsTelephoneFill } from 'react-icons/bs';

function Footer() {
  const Data = new Date().toISOString().slice(0, 10);
  return (
    <footer className="footer">
      <div className="container">
        <div className="topTextFooter">
          <p className="textFooter float-end">
           {Data} 
          </p>
          <p className="textFooter">Versão: 1.0.0 &copy;</p>
        </div>
        <div className="middleTextFooter">
          <p className="textFooter float-end">
          <MdOutlineEmail />  info@isq.pt&copy;
          </p>
        </div>
        <div className="bottonTextFooter">
          <p className="textFooter float-end">
            <BsTelephoneFill/>  +351 214 228 100&copy;
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
