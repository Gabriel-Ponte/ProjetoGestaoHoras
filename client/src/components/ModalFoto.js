import React, { useState, useEffect ,useRef } from "react";
import DefaultUserImg from "../assets/image/DefaultUserImg.png";
import Wrapper from '../assets/wrappers/ModalFoto';
import { toast } from 'react-toastify';
import { Buffer } from 'buffer';
function ModalFoto({ label, name, value, handleChange }) {
  const [file, setFile] = useState("");
  const [showModal, setShowModal] = useState(false);
  const imgRef = useRef(null);

  const [foto, setFoto] = useState(value);
  useEffect(() => {

  }, [file]);

  const handleFileInputChange = (file) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const novaFoto =  new Uint8Array(event.target.result)

      if (novaFoto.length > 10000){
        toast.error(`Foto inserida é demasiado grande`);
      }else{
      handleChange(name, novaFoto);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = () => {
    handleFileInputChange(file);
    setShowModal(false);
  };



  const handleFileInputChange1 = (file) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      imgRef.current.src = event.target.result;
      
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange1 = (event) => {
    const file = event.target.files[0];
    setFile(file);
    handleFileInputChange1(file);
  };
  
  const close = () => {
    setFile(0);
    setShowModal(false);
  };
  if(foto.data instanceof Uint8Array) {
    //const buffer = Buffer.from(new Uint8Array(Object.values(value.data)));
    const buffer = Buffer.from(value.data);
    console.log(buffer);
    setFoto({ data: buffer, contentType: value.contentType });
  }
  return (
    <Wrapper>
      <div className="form-row">
      <div className="row mb-3 text-center">
            <div className="col-md-6 themed-grid-col">
        <label htmlFor={name} className='form-label'>
        {label || name}
      </label>
        </div>
        <div className="col-md-6 themed-grid-col">
        <img
          ref={imgRef}
          src={
            foto.data
              ? URL.createObjectURL(new Blob([new Uint8Array(foto.data.data)], { type: foto.contentType }))
              : DefaultUserImg
          }
          className="rounded mx-auto d-block"
          style={{ maxWidth: "100px" }}
        />

          <button
            type="button"
            className="btn"
            data-bs-toggle="modal"
            data-bs-target="#ModalFoto"
            onClick={() => setShowModal(true)}
          >
            Escolher
          </button>
          </div>
        </div>
      </div>
      <div
      
        className={showModal ? "modal show" : "modal fade"}
        id="ModalFoto"
        tabIndex="-1"
        aria-labelledby="ModalLabelFoto"
        aria-hidden={!showModal}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ModalLabel">
                Inserir Foto
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="container">
                <img
                  ref={imgRef}
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
                  accept="image/*"
                  className="rounded mx-auto d-block"
                  onChange={handleFileChange1}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={close}
              >
                Sair
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleFileChange}
                disabled={!file}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default ModalFoto;