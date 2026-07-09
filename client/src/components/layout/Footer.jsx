import Wrapper from '@/styles/footer';
import { MdOutlineEmail } from 'react-icons/md';
import { BsTelephoneFill } from 'react-icons/bs';

function Footer() {
  const Data = new Date().toISOString().slice(0, 10);
  return (
    <Wrapper>
      <footer className="footer">
        <div className="row divFooter">
          <div className="col-12">
          <div className="row">
          <div className="col-6 text-center">
              <p className="">
                {Data}
              </p>
            </div>

            <div className="col-6 text-center">
            <p><MdOutlineEmail /> {import.meta.env.VITE_INFO_EMAIL} 
              </p>
            </div>
          </div>
            <div className='row'>
            <div className="col-6 text-end">
            <p className="textFooter">Versão: 1.0.0</p>
            </div>
            <div className="col-6 text-end">
                {import.meta.env.VITE_PHONE_NUMBER && (
                  <p >
                    <BsTelephoneFill size={14} />
                    <span>{import.meta.env.VITE_PHONE_NUMBER}</span>
                  </p>
                )}

                {import.meta.env.VITE_PHONE_NUMBER_2 && (
                  <p >
                    <BsTelephoneFill size={14} />
                    <span>{import.meta.env.VITE_PHONE_NUMBER_2}</span>
                  </p>
                )}
            </div>
          </div>
          </div>
        </div>
      </footer>
    </Wrapper>
  );
}

export default Footer;
