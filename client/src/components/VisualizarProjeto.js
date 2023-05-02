import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Wrapper from '../assets/wrappers/LoginPage';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import { getAllDias } from '../features/allDias/allDiasSlice';



function createInitialState(projeto) {
  return {
    _id: projeto._id,
    Nome: projeto.Nome,
    Cliente: projeto.Cliente,
    DataInicio: projeto.DataInicio,
    DataObjetivo: projeto.DataObjetivo,
    TipoTrabalho: projeto.TipoTrabalho,
    DataFim: projeto.DataFim,
    Tema: projeto.Tema,
    Acao: projeto.Acao,
    TipoTrabalho: projeto.TipoTrabalho,
    Piloto: projeto.Piloto,
    Links: projeto.Links,
    Finalizado: projeto.Finalizado,
    Resultado: projeto.Resultado,
    Notas: projeto.Notas,
    NumeroHorasTotal: "Sem Horas Inseridas no Projeto",
    NumeroHorasTipoTrabalho: "",
  };
}


function VisualizarProjeto() {
  const { user } = useSelector((store) => store.utilizador);
  const { projeto } = useSelector((store) => store.projeto);
  const [values, setValues] = useState(null);
  const [listaDias, setListaDias] = useState([]);
  const { isLoading } = useSelector((store) => store.utilizador);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (projeto) {
      setValues(createInitialState(projeto.projeto));

      const userLogin = user?.user?.login;
      const projetoId = projeto?.projeto?._id;
      dispatch(getAllDias({ projetoId, userLogin })).then((res) => {
        setListaDias(res.payload.diasAllProjeto);
      });
    }
  }, [projeto]);

  useEffect(() => {
    if (values) {
      const arrayTT = values.TipoTrabalho ? values.TipoTrabalho.split(',') : [];
      const arrayTTH = new Array(arrayTT.length).fill(0);

      if (listaDias) {
        let totalHours = 0;
        for (let i = 0; i < listaDias.length; i++) {
          if (listaDias[i].tipoDeTrabalhoHoras) {
            for (let j = 0; j < listaDias[i].tipoDeTrabalhoHoras.length; j++) {
              if (listaDias[i].tipoDeTrabalhoHoras[j].projeto === values._id) {
                const array = listaDias[i].tipoDeTrabalhoHoras[j].horas ? listaDias[i].tipoDeTrabalhoHoras[j].horas.split(',') : [];
                if (array !== null) {
                  for (let h = 0; h < array.length; h++) {
                    console.log(j)
                    totalHours += Number(array[h]);
                    arrayTTH[h] += Number(array[h]);
                  }
                }
                //totalHours += Number(listaDias[i].tipoDeTrabalhoHoras[j].horas);
                console.log(listaDias[i].tipoDeTrabalhoHoras[j])
                console.log(listaDias[i].tipoDeTrabalhoHoras[j].horas)
              }
            }
          }
        }
        if (totalHours !== 0) {
          setValues({
            ...values,
            NumeroHorasTotal: totalHours,
            NumeroHorasTipoTrabalho: arrayTTH,
          });
        }
      }
    }
  }, [listaDias]);

  if (isLoading) {
    return <Loading />;
  }

  if (values === null) {
    if (projeto === null) {
      return (
        <Wrapper>
          <h2>Sem projeto para Visualizar</h2>
        </Wrapper>
      );
    }
    else {
      return null;
    }
  }

  return (

    <div className="bg-light text-center">

      <div className="container">
        <main>
          <div className="row mb-3 text-center" style={{ marginTop: '3%', textAlign: 'center' }}>
            <div className="col-12">
              <h1>{values.Nome}</h1>
            </div>
            <div className="row mb-3">
              <div className="col-6">
                <p>Tema</p>
              </div>
              <div className="col-6">
                <p>{values.Tema}</p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-6">
                <p>Cliente</p>
              </div>
              <div className="col-6">
                <p>{values.Cliente}</p>
              </div>
            </div>
            <div className="col-md-12 themed-grid-col ">
              <div className="calendar"></div>
            </div>

            <div className="row g-5">
              <div className="col-6">
                <p>Numero total Horas</p>
              </div>
              <div className="col-6">
                <p>{values.NumeroHorasTotal}</p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-3">
            <p>Tipos de Trabalho</p>
            </div>
            {values.TipoTrabalho && values.TipoTrabalho.length > 0 ? (
              values.TipoTrabalho.split(",").map((t, i) => (
                <div className="row mb-3" key={i}>
                  <div className="col-6">
                    <p>{t}</p>
                  </div>
                  <div className="col-6">
                    <p>{values.NumeroHorasTipoTrabalho[i]}</p>
                  </div>
                </div>
              ))
            ) : (
              <div>
              <p>Sem Tipos de Trabalho definidos</p>
              </div>
            )}
            </div>
            <div className="row mb-3">
              <div className="col-3">
                <p>Data Inicio</p>
              </div>
              <div className="col-3">
                <p>{values.DataInicio ? new Date(values.DataInicio).toLocaleDateString('en-CA') : ''}</p>
              </div>
              <div className="col-3">
                <p>Data Objetivo</p>
              </div>
              <div className="col-3">
                <p>{values.DataObjetivo ? new Date(values.DataObjetivo).toLocaleDateString('en-CA') : ''}</p>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-4 text-end">
                <label htmlFor="username" className="">
                  Piloto/s
                </label>
              </div>
              <div className="col-8">
                <p>{values.Pilotos ? values.Pilotos : "Sem Pilotos"}</p>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-6 text-end">
                <label htmlFor="acao" className="">
                  Ação
                </label>
              </div>
              <div className="col-6">
                <p>{values.Acao ? values.Acao : "Sem Ações"}</p>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-6 text-end">
                <label htmlFor="country" className="">
                  Notas
                </label>
              </div>
              <div className="col-6">
                <p>{values.Notas ? values.Notas : "Sem Notas"}</p>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-6 text-end">
                <label htmlFor="link" className="">
                  Links
                </label>
              </div>
              <div className="col-6">
                <p>{values.Links ? values.Links : "Sem Links"}</p>
              </div>

              <div className="row mb-3">
                <div className="col-6 text-end">
                  <label className="" htmlFor="orcamento">
                    Realizado
                  </label>
                </div>
                <div className="col-6">
                  <p>{values.Finalizado === true ? "Sim" : "Não"}</p>
                </div>
                {values.Finalizado === true ? (
                  <div className="row mb-3">
                    <div className="col-3">
                      <p>Resultado</p>
                    </div>
                    <div className="col-3">
                      <p style={{ width: "100%" }}> {values.Resultado} </p>
                    </div>
                    <div className="col-3">
                      <p>Data Final</p>
                    </div>
                    <div className="col-3">
                      <p>{values.DataFim ? new Date(values.DataFim).toLocaleDateString('en-CA') : 'Sem Data Final'}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default VisualizarProjeto;

