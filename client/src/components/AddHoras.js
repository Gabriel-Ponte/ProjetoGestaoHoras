import { useEffect, useState, useCallback } from 'react';
import Wrapper from '../assets/wrappers/addDias';
import { FaCaretDown } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { getAllProjetos, handleChange } from '../features/allProjetos/allProjetosSlice';
import { getTipoTrabalho } from '../features/tipoTrabalho/tipoTrabalhoSlice';
import { toast } from 'react-toastify';
import { createDia, getDia, editDia } from '../features/dias/diasSlice';
import { FormRow } from '../components';
import PageBtnContainer from './PageBtnContainer';

const initialState = {
  _id: '',
  Data: new Date().toISOString().slice(0, 10),
  NumeroHoras: '',
  Utilizador: '',
  tipoDeTrabalhoHoras: [],
};

const ListaProjetos = () => {
  const [values, setValues] = useState(initialState);
  const {
    projetos,
    isLoading,
    page,
    totalProjetos,
    numOfPages,
    search,
    searchStatus,
    searchType,
    sort,
  } = useSelector((store) => store.allProjetos);

  const dispatch = useDispatch();

  const [showProjeto, setShowProjeto] = useState({});
  const [horasT, setHorasT] = useState(0);
  const { user } = useSelector((store) => store.utilizador);
  const [listaDias, setListaDias] = useState([]);
  const [verificaDiaCalled, setVerificaDiaCalled] = useState(false);
  const [listaTipoTrabalho, setListaTipoTrabalho] = useState([]);
  let StringListaTrabalho = listaTipoTrabalho.map(item => item.TipoTrabalho).join(",");

  useEffect(() => {
    dispatch(handleChange({ name: 'projetoFinalizado', value: "false" }));
    dispatch(getAllProjetos({ ProjetoFinalizado: false }))
    dispatch(getTipoTrabalho()).then((res) => {
      const tipoTrabalhoArray = Array.isArray(res.payload.tipoTrabalho) ? res.payload.tipoTrabalho : [];
      setListaTipoTrabalho(tipoTrabalhoArray);
    });
  }, [totalProjetos]);

  useEffect(() => {
    dispatch(getDia(values.Data, user.user.id)).then((res) => {
      setListaDias(res.payload.dia);
    });
  }, []);

  const verificaDia = useCallback((e) => {
    const { name, value } = e.target;
    for (let i = 0; i < listaDias.length; i++) {
      const DataRecebida = new Date(listaDias[i].Data).toISOString().slice(0, 10);
      if (value === DataRecebida) {
        const tipoDeTrabalhoHoras = {};
        for (let j = 0; j < listaDias[i].tipoDeTrabalhoHoras.length; j++) {
          const val = listaDias[i].tipoDeTrabalhoHoras[j].projeto;
          tipoDeTrabalhoHoras[val] = listaDias[i].tipoDeTrabalhoHoras[j];
        }
        setValues({
          ...values,
          [name]: value,
          _id: listaDias[i]._id,
          Utilizador: user.user.login,
          NumeroHoras: listaDias[i].NumeroHoras,
          tipoDeTrabalhoHoras: tipoDeTrabalhoHoras,
        });
        setHorasT(listaDias[i].NumeroHoras);
        setVerificaDiaCalled(true);
        return;
      }
    }

    setValues({
      ...values,
      [name]: value,
      NumeroHoras: "",
      tipoDeTrabalhoHoras: [],
    });
    setHorasT(0);
    setVerificaDiaCalled(false);
    return;

  }, [listaDias]);



  useEffect(() => {
    verificaDia({ target: { name: 'Data', value: values.Data } });
  }, [listaDias]);


  const handleDropdownToggle = (projectId) => {
    setShowProjeto((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const handleDia = async (e) => {
    e.preventDefault();
    if (horasT > 8) {
      toast.error('Valor inserido excede as 8 Horas diarias!');
    }
    if (horasT <= 0) {
      toast.error('Valor inserido invalido!');
      return;
    }

    values.Utilizador = user.user.login;

    if (verificaDiaCalled) {
      await dispatch(editDia(values));
    } else {
      await dispatch(createDia(values));
    }
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };



  const handleHorasChange = (projectId, tipoTrabalho, projectName, e) => {
    let newHorasT = horasT;
    let horasNumber = Number(e.target.value);
    let diff = 0;
    if (isNaN(horasNumber) || horasNumber <= 0 || horasNumber === null) {
      horasNumber = 0;
      //return;
    }

    const newTipoDeTrabalhoHoras = { ...values.tipoDeTrabalhoHoras };
    const horasTipoTrabalhoArray = newTipoDeTrabalhoHoras[projectId]?.horas?.split(',') || [];
    const tipoTrabalhoArray = newTipoDeTrabalhoHoras[projectId]?.tipoTrabalho?.split(',') || [];
    let newShowProjeto = { ...showProjeto };

    if (tipoTrabalhoArray.includes(tipoTrabalho)) {

      const index = tipoTrabalhoArray.indexOf(tipoTrabalho);
      const oldValue = Number(horasTipoTrabalhoArray[index]);
      const newValue = horasNumber;

      if (oldValue !== newValue) {
        diff = newValue - oldValue;
        horasTipoTrabalhoArray[index] = newValue;

        newTipoDeTrabalhoHoras[projectId] = {
          ...newTipoDeTrabalhoHoras[projectId],
          horas: horasTipoTrabalhoArray.join(','),
        };
        newHorasT = horasT + diff;
      }

    } else {
      newShowProjeto = {
        ...newShowProjeto,
        [projectId + tipoTrabalho]: horasNumber
      };
      tipoTrabalhoArray.push(tipoTrabalho);
      horasTipoTrabalhoArray.push(horasNumber);
      newTipoDeTrabalhoHoras[projectId] = {
        ...newTipoDeTrabalhoHoras[projectId],
        tipoTrabalho: tipoTrabalhoArray.join(','),
        horas: horasTipoTrabalhoArray.join(',')
      };
      newHorasT = horasT + horasNumber;
    }
    console.log(newHorasT)
    if (newHorasT > 24) {
      toast.error('Valor inserido excede as 24 Horas!');
      setValues({ ...values, [e.target.id]: 0 });
      //setHorasT(horasT - (showProjeto[projectId + tipoTrabalho] || 0));
      return;
    }

    setValues({
      ...values,
      [e.target.id]: horasNumber,
      NumeroHoras: newHorasT,
      tipoDeTrabalhoHoras: newTipoDeTrabalhoHoras
    });

    setHorasT(newHorasT);
    setShowProjeto(newShowProjeto);
  };
  console.log(horasT)
  const matchFoundProjeto = new Array(projetos.length).fill(false);
  const arrayTipoTrabalho = Object.entries(values.tipoDeTrabalhoHoras).map(([key, value]) => ({ _id: key, ...value }));
  let counter = 0;
  return (
    <Wrapper>
      <div className="container">
        <div>
          <h3>{verificaDiaCalled ? 'Editar Dia' : 'Adicionar Dia'}</h3>
          <FormRow
            type="date"
            className="form-control dataAddHoras"
            classNameInputDate="form__field__date"
            classNameLabel="form-field-label"
            id="Dia"
            name="Data"
            placeholder="Dia Adicionar Horas"
            value={values.Data ? new Date(values.Data).toLocaleDateString('en-CA') : ''}
            handleChange={verificaDia}
          />
        </div>
        <div className="list-group mx-1 w-auto">
          {projetos.map((project, idProjeto) => {
            if (project.Finalizado === true) {
              return;
            }

            // initialize the counter
            return (
              <div className="list-group-item" key={project._id}>
                <div className="row mb-3 text-center">
                  <div className="col-md-4 text-end themed-grid-col">
                    <h5>{project.Nome}</h5>
                  </div>
                  <div className="col-md-8  themed-grid-col">
                    <div className="btn-container">
                      <button
                        type="button"
                        className="btn button-Dropdown"
                        onClick={() => handleDropdownToggle(project._id)}
                      >
                        <FaCaretDown />
                      </button>

                      <div
                    className={
                      `dropdown ${showProjeto[project._id] ? "show-dropdown" : "hidden-dropdown"}
                      ${showProjeto[project._id] ? "" : "d-none"}`}

                      >
                        <div className="row mb-3 text-center" key={"NewDia" + project._id}>
                          {!verificaDiaCalled && (
                            StringListaTrabalho.split(",").map((t, i) => (
                              <div className="row mb-3 text-center" key={"NovoDia" + i}>
                                <div className="col-md-9 text-start themed-grid-col">
                                  <p>{t}</p>
                                </div>
                                <div className="col-md-3 themed-grid-col">
                                  <input
                                    type="number"
                                    min="0"
                                    max="24"
                                    id="horas"
                                    className="horas"
                                    placeholder="0"
                                    value={values.tipoDeTrabalhoHoras[project.Nome]?.[t]}
                                    onChange={(e) =>
                                      handleHorasChange(
                                        project._id,
                                        t,
                                        project.Nome,
                                        e
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            )
                            )
                          )
                          }

                          <div key={"NewDia" + project._id}>
                            {verificaDiaCalled && values.tipoDeTrabalhoHoras.length !== 0 && Array.isArray(arrayTipoTrabalho) &&
                              arrayTipoTrabalho.map((item, ID) => {
                              
                                counter++;
                                const itemTypeArray = item.tipoTrabalho ? item.tipoTrabalho.split(",") : [];
                                const matchFound = new Array(itemTypeArray.length + 1).fill(false);

                                if (project._id === item.projeto) {
                                  const valuesHorasTypeArray = values.tipoDeTrabalhoHoras[project._id].horas ? values.tipoDeTrabalhoHoras[project._id].horas.split(",") : [];
                                  matchFoundProjeto[idProjeto] = true;
                                  let counter1 = -1;
                                  return (
                                    <div key={"EditarDia" + ID}>
                                      {StringListaTrabalho.split(",").map((t, i) =>
                                        itemTypeArray.map((iT, iId) => {
                                          if (t === iT) {
                                            matchFound[i] = true;
                                            counter1++;
                                            return (
                                              <div className="row mb-3 text-center" key={"EditarDiaTTFound" + iId}>
                                                <div className="col-md-9 text-start themed-grid-col">
                                                  <p>{t}</p>
                                                </div>
                                                <div className="col-md-3 themed-grid-col">
                                                  <input
                                                    type="number"
                                                    min="0"
                                                    max="24"
                                                    id={`horas-${item._id}`}
                                                    className="horas"
                                                    placeholder="0"
                                                    value={
                                                      valuesHorasTypeArray[iId] != null && !isNaN(valuesHorasTypeArray[iId])
                                                        ? valuesHorasTypeArray[iId]
                                                        : []
                                                    }
                                                    onChange={(e) =>
                                                      handleHorasChange(
                                                        project._id,
                                                        t,
                                                        project.Nome,
                                                        e
                                                      )
                                                    }
                                                  />
                                                </div>
                                              </div>
                                            );
                                          } else {
                                            if (iId === itemTypeArray.length - 1) {
                                              if (!matchFound[i]) {
                                                return (
                                                  <div className="row mb-3 text-center" key={"EditarDiaTTNotFound" + iId}>
                                                    <div className="col-md-9 text-start themed-grid-col">
                                                      <p>{t}</p>
                                                    </div>
                                                    <div className="col-md-3 themed-grid-col">
                                                      <input
                                                        key={i}
                                                        type="number"
                                                        min="0"
                                                        max="24"
                                                        id={`horas-${item._id}`}
                                                        className="horas"
                                                        placeholder="0"
                                                        value={
                                                          isNaN(values.tipoDeTrabalhoHoras[project.Nome]?.[t])
                                                        }
                                                        onChange={(e) =>
                                                          handleHorasChange(
                                                            project._id,
                                                            t,
                                                            project.Nome,
                                                            e
                                                          )
                                                        }
                                                      />
                                                    </div>
                                                  </div>
                                                );
                                              }
                                            }
                                          }
                                        }
                                        )
                                      )
                                      }
                                    </div>
                                  );
                                } else {
                                  if (!matchFoundProjeto[idProjeto] && ID === arrayTipoTrabalho.length - 1) {
                                    return (
                                      <div key={"EditarDiaProjetoNotFound" + idProjeto}>
                                        {StringListaTrabalho.split(",").map((t, i) => {
                                          return (
                                            <div className="row mb-3 text-center" key={"EditarDiaProjetoNotFoundList" + i}>
                                              <div className="col-md-9 text-start themed-grid-col" >
                                                <p>{t}</p>
                                              </div>
                                              <div className="col-md-3 themed-grid-col">
                                                <input
                                                  type="number"
                                                  min="0"
                                                  max="24"
                                                  id="horas"
                                                  className="horas"
                                                  placeholder="0"
                                                  value={values.tipoDeTrabalhoHoras[project.Nome]?.t}
                                                  onChange={(e) =>
                                                    handleHorasChange(
                                                      project._id,
                                                      t,
                                                      project.Nome,
                                                      e
                                                    )
                                                  }
                                                />
                                              </div>
                                            </div>
                                          )
                                        }
                                        )
                                        }
                                      </div>
                                    );
                                  }
                                }
                              }
                              )
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {numOfPages > 1 && <PageBtnContainer />}
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total de horas: {horasT}</h5>
            </div>

            <div className="card-body">
              <button
                type="submit"
                disabled={isLoading}
                onClick={(e) => { handleDia(e) }}
                className="w-100 btn btn-lg btn-primary"
              >
                {isLoading ? 'loading...' : verificaDiaCalled ? 'Editar Dia' : 'Adicionar Dia'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default ListaProjetos;