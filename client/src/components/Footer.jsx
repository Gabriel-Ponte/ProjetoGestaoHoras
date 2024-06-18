import Wrapper from '../assets/wrappers/footer';
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
            <p><MdOutlineEmail />  info@isqctag.pt
              </p>
            </div>
          </div>
            <div className='row'>
            <div className="col-6 text-end">
            <p className="textFooter">Versão: 1.0.0</p>
            </div>
            <div className="col-6 text-end">
              <p >
                <BsTelephoneFill />
                +351 927 752 803
              </p>
              <p >
                <BsTelephoneFill />
                +351 927 752 769
              </p>
            </div>
          </div>
          </div>
        </div>
      </footer>
    </Wrapper>
  );
}

export default Footer;
