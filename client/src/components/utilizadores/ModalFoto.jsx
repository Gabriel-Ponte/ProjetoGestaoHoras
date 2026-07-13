import { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import DefaultUserImg from "@/assets/image/DefaultUserImg.png";
import Wrapper from '@/styles/ModalFoto';
import { Buffer } from 'buffer';
import PropTypes from 'prop-types';
import { AppModal, AppButton } from '@/components/ui';


function ModalFoto({ label, name, value, handleChange, className }) {
  const { t } = useTranslation('utilizadores');
  const [file, setFile] = useState("");
  const [showModal, setShowModal] = useState(false);
  const imgRef = useRef(null);

  const [foto, setFoto] = useState(value);
  useEffect(() => {
    if(value === "" || typeof value === "undefined"){
    fetch(DefaultUserImg)
    .then(response => response.blob())
    .then(blob => {
      const novaFoto = URL.createObjectURL(blob);
      return fetch(novaFoto);
    })
    .then(response => response.arrayBuffer())
    .then(buffer => {
      const fotoUser = new Uint8Array(buffer);
      setFoto(fotoUser);
      handleChange(name, fotoUser);
    })
    .catch(error => {
      console.error("Error fetching image:", error);
    });
    }
    else{
    setFoto(value);
  }
   
  }, [file, value]);

  const handleFileInputChange = (file) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const novaFoto = new Uint8Array(event.target.result);
      if (novaFoto.length > 10000) {
        resizeImage(event.target.result)
          .then((resizedDataUrl) => {
            const novaFoto = new Uint8Array(resizedDataUrl);
            handleChange(name, novaFoto);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        handleChange(name, novaFoto);
      }
    };
    if(file){
    reader.readAsArrayBuffer(file);
  }
  };

  
  const resizeImage = (image) => {
    return new Promise((resolve) => {
      const img = new Image();
  
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        let width = img.width;
        let height = img.height;
  
        if (width > height) {
          if (width > 100) {
            height *= 100 / width;
            width = 100;
          }
        } else {
          if (height > 100) {
            width *= 100 / height;
            height = 100;
          }
        }
  
        canvas.width = width;
        canvas.height = height;
  
        ctx.drawImage(img, 0, 0, width, height);
  
        canvas.toBlob((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const resizedArrayBuffer = reader.result;
            resolve(resizedArrayBuffer);
          };
          reader.readAsArrayBuffer(blob);
        }, image.contentType);
      };
  
      const arrayBufferView = new Uint8Array(image);
      const blob = new Blob([arrayBufferView], { type: image.contentType });
      const url = URL.createObjectURL(blob);
      img.src = url;
    });
  };
  

  const handleFileChange = () => {
    handleFileInputChange(file);
    setShowModal(false);
  };



  const handleFileInputChange1 = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        imgRef.current.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange1 = (event) => {
    const file = event.target.files[0];
    setFile(file);
    handleFileInputChange1(file);
  };

  const close = () => {
    document.getElementById('foto').value = '';
    imgRef.current.src = DefaultUserImg;
    setFile(null);
    if (foto && foto.data && foto.contentType) {
      const blob = new Blob([new Uint8Array(foto.data)], { type: foto.contentType });
      imgRef.current.src = URL.createObjectURL(blob);
    }
    setShowModal(false);
  };

  if (foto.data instanceof Uint8Array) {
    const buffer = Buffer.from(value.data);
    setFoto({ data: { data: buffer }, contentType: value.contentType });
  }




  return (
    <Wrapper>
      <div className={className ? className : "form-row"}>
        <div className="row text-center">
          <div className="col-md-12 themed-grid-col text-start">
            <label  className='form-label'>
              {label || name}
            </label>
          </div>
        </div>
        <div className="row mb-3 text-center">
          <div className="col-md-12 themed-grid-col">
            <button
              type="button"
              className="btn"
              onClick={() => setShowModal(true)}
            >
              <img
                alt={t('photo.alt')}
                src={
                  foto.data
                    ? URL.createObjectURL(new Blob([new Uint8Array(foto.data.data)], { type: foto.contentType }))
                    : DefaultUserImg
                }
                className="rounded mx-auto d-block"
                style={{ maxWidth: "100px" }}
              />
              {t('photo.choose')}
            </button>
          </div>
        </div>
      </div>

      <AppModal
        open={showModal}
        onClose={close}
        title={t('photo.title')}
        footer={
          <>
            <AppButton variant="secondary" onClick={close}>
              {t('photo.close')}
            </AppButton>
            <AppButton variant="primary" onClick={handleFileChange} disabled={!file}>
              {t('photo.save')}
            </AppButton>
          </>
        }
      >
        <div className="container">
          <img
            ref={imgRef}
            alt={t('photo.alt')}
            src={
              foto.data
                ? URL.createObjectURL(new Blob([new Uint8Array(foto.data.data)], { type: foto.contentType }))
                : DefaultUserImg
            }
            className="rounded mx-auto d-block"
            style={{ maxWidth: "100px" }}
          />
          <br />
          <input
            id="foto"
            name="foto"
            type="file"
            accept=".jpg,.png"
            className="rounded mx-auto d-block"
            onChange={handleFileChange1}
          />
        </div>
      </AppModal>
    </Wrapper>
  );
}


ModalFoto.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.string.isRequired
  ]).isRequired,
  name: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
}

export default ModalFoto;