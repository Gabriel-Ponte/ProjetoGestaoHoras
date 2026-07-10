import Wrapper from '@/styles/footer';
import { MdOutlineEmail } from 'react-icons/md';
import { BsTelephoneFill } from 'react-icons/bs';

function Footer() {
  const data = new Date().toISOString().slice(0, 10);
  const email = import.meta.env.VITE_INFO_EMAIL;
  const phone = import.meta.env.VITE_PHONE_NUMBER;
  const phone2 = import.meta.env.VITE_PHONE_NUMBER_2;

  return (
    <Wrapper>
      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-item">{data}</span>
          <span className="footer-sep">•</span>
          <span className="footer-item">Versão 1.0.0</span>

          {email && (
            <>
              <span className="footer-sep">•</span>
              <a className="footer-item" href={`mailto:${email}`}>
                <MdOutlineEmail size={15} /> {email}
              </a>
            </>
          )}

          {phone && (
            <>
              <span className="footer-sep">•</span>
              <a className="footer-item" href={`tel:${phone}`}>
                <BsTelephoneFill size={12} /> {phone}
              </a>
            </>
          )}

          {phone2 && (
            <>
              <span className="footer-sep">•</span>
              <a className="footer-item" href={`tel:${phone2}`}>
                <BsTelephoneFill size={12} /> {phone2}
              </a>
            </>
          )}
        </div>
      </footer>
    </Wrapper>
  );
}

export default Footer;
