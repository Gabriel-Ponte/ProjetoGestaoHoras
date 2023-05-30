import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Wrapper from '../assets/wrappers/VisualizarProjeto';
import Loading from './Loading';
import { getAllDias } from '../features/allDias/allDiasSlice';
import Calendar from './Calendar'

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
  const { projeto , isLoading } = useSelector((store) => store.projeto);
  const [values, setValues] = useState(null);
  const [listaDias, setListaDias] = useState([]);
  const [selectedDay, setSelectedDay] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    if (projeto) {
      setValues(createInitialState(projeto.projeto));
      const userLogin = user?.user?.login;
      const projetoId = projeto?.projeto?._id;
      dispatch(getAllDias({ projetoId, userLogin })).then((res) => {
        setListaDias(res.payload.diasAllProjeto);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listaDias]);

  const handleChangeCalendario = useCallback((dia, mes, ano) => {
    const [selectedDia, selectedMes, selectedAno] = [dia, mes, ano];
    setSelectedDay({ dia: selectedDia, mes: selectedMes, ano: selectedAno });
  }, []);

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

  //const today = new Date();
  //const diaSelected = selectedDay ? selectedDay.dia : 0;
  //const month = selectedDay ? selectedDay.mes : today.getMonth();
  //const year = selectedDay ? selectedDay.ano : today.getFullYear();
  console.log(values.Piloto)
  console.log(projeto.projeto.Piloto)
  return (
    <Wrapper>
      <div className="mainVisualiza">

        <div className="col-12">
          <main>
            <div className="row mb-3 " >

              <div className="col-12 text-center mb-5 ">
                <h1>{values.Nome}</h1>
              </div>
              <div className="col-7 left text-center" >

                <div className="row mb-3">
                  <div className="col-6">
                    <h5>Tema</h5>
                  </div>
                  <div className="col-6 text-start">
                    <p>{values.Tema}</p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-6">
                    <h5>Cliente</h5>
                  </div>
                  <div className="col-6 text-start">
                    <p>{values.Cliente}</p>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-6 text-center">
                    <h5 className="">
                      Piloto/s
                    </h5>
                  </div>
                  <div className="col-6 text-start">
                    <p>{values.Piloto ? values.Piloto : "Sem Pilotos"}</p>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-6 text-center">
                    <h5 htmlFor="acao" className="">
                      Ação
                    </h5>
                  </div>
                  <div className="col-6 text-start">
                    <p>{values.Acao ? values.Acao : "Sem Ações"}</p>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-6 text-center">
                    <h5 htmlFor="country" className="">
                      Notas
                    </h5>
                  </div>
                  <div className="col-6 text-start">
                    <p>{values.Notas ? values.Notas : "Sem Notas"}</p>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-6 text-center">
                    <h5 htmlFor="link" className="">
                      Links
                    </h5>
                  </div>
                  <div className="col-6 text-start">
                    <p>{values.Links ? values.Links : "Sem Links"}</p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-6 text-center">
                    <h5 className="" htmlFor="orcamento">
                      Realizado
                    </h5>
                  </div>
                  <div className="col-6 text-start">
                    <p>{values.Finalizado === true ? "Sim" : "Não"}</p>
                  </div>
                  </div>
                  {values.Finalizado === true ? (
                    <div className="row mb-3">
                      <div className="col-7 text-center">
                        <h5>Resultado</h5>
                      </div>
                      <div className="col-5 text-start">
                        <p style={{ width: "100%" }}> {values.Resultado === true ? "Sucesso" : "Insucesso"}</p>
                      </div>
                    </div>
                  ) : null}
              </div>

              <div className="col-5 text-center right">
                <div className="col-12 mb-5 text-center">
                  <Calendar
                    handleChange={handleChangeCalendario}
                    inserted={listaDias}
                    inicio={values?.DataInicio}
                    objetivo={values?.DataObjetivo}
                    fim={values?.DataFim}
                  />
                </div>
                <div className="row mb-3 ">
                  <div className="col-3">
                    <h5>Data Inicio</h5>
                  </div>
                  <div className="col-3">
                    <p>{values.DataInicio ? new Date(values.DataInicio).toLocaleDateString('en-CA') : ''}</p>
                  </div>

                  {values.Finalizado === true ? (
                    <>
                      <div className="col-3">
                        <h5>Data Final</h5>
                      </div>
                      <div className="col-3">
                        <p>{values.DataFim ? new Date(values.DataFim).toLocaleDateString('en-CA') : 'Sem Data Final'}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-3">
                        <h5>Data Objetivo</h5>
                      </div>
                      <div className="col-3">
                        <p>{values.DataObjetivo ? new Date(values.DataObjetivo).toLocaleDateString('en-CA') : ''}</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="row g-5">
                  <div className="col-6">
                    <h5>Numero total Horas</h5>
                  </div>
                  <div className="col-6">
                    <p>{values.NumeroHorasTotal}</p>
                  </div>
                </div>
                {typeof values.NumeroHorasTotal === 'number' &&(
                <div className="row mb-3">
                  <div className="col-3">
                    <h5>Tipos de Trabalho</h5>
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
              )}

              </div>



            </div>
          </main>
        </div>
      </div>
    </Wrapper>
  );
}

export default VisualizarProjeto;

/*


              <div>
              {listaDias.map((dia) => {
                const data = new Date(dia.Data);
                const isSameMonth = month === data.getMonth() && year === data.getFullYear();
                const isSameDate = diaSelected === 0 || Number(diaSelected) === data.getDate();
                const projetoList = dia.tipoDeTrabalhoHoras.map(({ tipoTrabalho, horas, projeto }) => {
                  return dispatch(getUser(dia.Utilizador)).then((res) => 
                    {
                    const user = res.payload.projeto;
                  }
                  );
                  console.log(user)
                });
                if (isSameMonth && isSameDate) {
                  console.log(dia)
                  console.log(dia.tipoDeTrabalhoHoras )

                }

                return null;
              })}
            </div>
              <div className='text-center'>
              {listaDias && listaDias === 'undefined' && listaDias.filter((dia) => {
                const data = new Date(dia.Data);
                const isSameMonth = month === data.getMonth() && year === data.getFullYear();
                const isSameDate = diaSelected === 0 || Number(diaSelected) === data.getDate();

                return isSameMonth && isSameDate;
              }).length === 0 && diaSelected === 0 && (
                  <h2>Sem Horas inseridas neste mês</h2>
                )}

              {listaDias && listaDias === 'undefined' && listaDias.filter((dia) => {
                const data = new Date(dia.Data);
                const isSameMonth = month === data.getMonth() && year === data.getFullYear();
                const isSameDate = diaSelected === 0 || Number(diaSelected) === data.getDate();

                return isSameMonth && isSameDate;
              }).length === 0  && diaSelected !== 0 && (
                  <h2>Sem Horas inseridas neste dia {diaSelected}</h2>
                )}
            </div>
*/