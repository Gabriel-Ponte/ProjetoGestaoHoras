
import { memo, useState, useEffect, useCallback } from 'react';
//, useMemo
import { FaCaretDown } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { createTipoTrabalhoOther } from '../features/tipoTrabalho/tipoTrabalhoSlice';
import { toast } from 'react-toastify';


import TimePickerClock from './TimePickerClock';
import OptionsPanel from './OptionsPanel';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import PropTypes from 'prop-types'; 
import Loading from './Loading';


const AddHorasDropdown = ({ sortedProjetos, verificaChange, listaTipoTrabalho, values, handleHorasChange, convertToMinutes, arrayTipoTrabalho, matchFoundProjeto, ListaTrabalhoAll,
  ListaTrabalhoGeral, ListaTrabalhoGeralOther, setListaTrabalhoGeralOther,
  setListaTipoTrabalho, setListaTrabalhoGeral , blocked}) => {

    const [StringListaTrabalho, setStringListaTrabalho] = useState('');
    const [StringListaTrabalhoGeral, setStringListaTrabalhoGeral] = useState('');
    const [StringListaTrabalhoGeralOther, setStringListaTrabalhoGeralOther] = useState('');
    const [StringListaTrabalhoCompensacaoD, setStringListaTrabalhoCompensacaoD] = useState('');

    const [listaTrabalho, setListaTrabalho] = useState([]);
    const [listaTrabalhoGeralAdd, setListaTrabalhoGeralAdd] = useState([]);
    const [options, setOptions] = useState([]);
    const [showProjeto, setShowProjeto] = useState({});

    const dispatch = useDispatch();
 
    const initializeLists = useCallback(() => {
      const date = new Date(values.Data);
      const dayStart = new Date(Date.UTC(2023, 11, 1, 0, 0, 0));
      const dayEnd = new Date(Date.UTC(2023, 11, 10, 0, 0, 0));

      // const isWithinRange = (date) => date >= dayStart && date <= dayEnd;

      const dateDay = date.getDate();
      const dateMonth = date.getMonth();
      const dateYear = date.getFullYear();

      const startDay = dayStart.getDate();
      const startMonth = dayStart.getMonth();
      const startYear = dayStart.getFullYear();

      const endDay = dayEnd.getDate();

      let ListaTrabalhoGeralString = [];


      if((dateDay >=  startDay && dateMonth === startMonth && dateYear === startYear)  || dateYear > startYear || dateMonth > startMonth){
        if((dateDay <=  endDay && dateMonth === startMonth && dateYear === startYear)){
          setListaTrabalhoGeralAdd(ListaTrabalhoGeral.filter(item => (item.tipo === 2 || item.tipo === 4 || item.tipo === 5 || item.tipo === 6)));
          ListaTrabalhoGeralString = listaTipoTrabalho.filter(item => (item.tipo === 2 || item.tipo === 4 || item.tipo === 5)).map(item => item.TipoTrabalho).join(",");
        } else {
          setListaTrabalhoGeralAdd(ListaTrabalhoGeral.filter(item => (item.tipo === 2 || item.tipo === 4 || item.tipo === 6)));
          ListaTrabalhoGeralString = listaTipoTrabalho
          .filter(item => (item.tipo === 2 || item.tipo === 4))
          .map(item => item.TipoTrabalho).join(",");
        }
      }else{
        setListaTrabalhoGeralAdd(ListaTrabalhoGeral.filter(item => (item.tipo === 2)));
        ListaTrabalhoGeralString = listaTipoTrabalho
        .filter(item => (item.tipo === 2))
        .map(item => item.TipoTrabalho)
        .join(",");
      }



      const lTrabalho = listaTipoTrabalho.filter(item => item.tipo === 1);

      const strListaTrabalho = lTrabalho.map(item => item.TipoTrabalho).join(",");

      const lTrabalhoGeralOther = listaTipoTrabalho.filter(item => item.tipo === 3);

      const strListaTrabalhoGeralOther = lTrabalhoGeralOther.map(item => item.TipoTrabalho).join(",");



      const ListaTrabalhoGeralDomingo = listaTipoTrabalho.filter(item => (item.tipo === 2 || item.tipo === 4 || item.tipo === 6));
      

      const strListaTrabalhoGeralDomingo = ListaTrabalhoGeralDomingo.map(item => item.TipoTrabalho).join(",");

      setStringListaTrabalhoCompensacaoD(strListaTrabalhoGeralDomingo);
      setListaTrabalho(lTrabalho);
      setStringListaTrabalho(strListaTrabalho);
  
      setStringListaTrabalhoGeral(ListaTrabalhoGeralString);
  
      setStringListaTrabalhoGeralOther(strListaTrabalhoGeralOther);
  
      setOptions(strListaTrabalhoGeralOther?.split(","));

     
    }, [ listaTipoTrabalho, values.Data, ListaTrabalhoGeral]);

    useEffect(() => {
      initializeLists();
    }, [listaTipoTrabalho, values.Data]);

  // Initialize horasP as an object
  const horasP = [];

  // Initialize horasP with project IDs as keys and initial values of 0
  sortedProjetos.forEach(project => {
    horasP[project._id] = 0;
  });

  
  const handleTipoTrabalho = useCallback(async (inputValue) => {
    if (inputValue && inputValue.trim() !== "") {
      const values = StringListaTrabalhoGeral.split(",");

      if (!values.map(value => value.toLowerCase()).includes(inputValue.toLowerCase())) {
        const inputValueMap = new Map();
        let originalCaseInputValue = "";
        if (!options.some(option => option.toLowerCase() === inputValue.toLowerCase())) {
          await dispatch(createTipoTrabalhoOther({ TipoTrabalho: inputValue, tipo: 3 })).then((res) => {
            const tipoTrabalhoArray = Array.isArray(res.payload.tipoTrabalho) ? res.payload.tipoTrabalho : [res.payload.tipoTrabalho];

            const updatedListaTrabalhoGeral = [...ListaTrabalhoGeral, ...tipoTrabalhoArray];
            const updatedListaTipoTrabalho = [...listaTipoTrabalho, ...tipoTrabalhoArray];

            setListaTipoTrabalho(updatedListaTipoTrabalho);
            setListaTrabalhoGeral(updatedListaTrabalhoGeral);
            setListaTrabalhoGeralAdd(updatedListaTrabalhoGeral);
          })
          originalCaseInputValue = inputValue;
        } else {
          options.forEach(option => inputValueMap.set(option.toLowerCase(), option));
          originalCaseInputValue = inputValueMap.get(inputValue.toLowerCase());
          const updatedOptions = options.filter(option => option.toLowerCase() !== inputValue.toLowerCase());
          setOptions(updatedOptions);

          const normalizedInputValue = originalCaseInputValue.toLowerCase();
          const tipoTrabalho = ListaTrabalhoGeralOther.filter(item => item.TipoTrabalho.toLowerCase() === normalizedInputValue);
          const updatedListaTrabalhoGeral = [...ListaTrabalhoGeral, ...tipoTrabalho];

          setListaTrabalhoGeral(updatedListaTrabalhoGeral);
          setListaTrabalhoGeralAdd(updatedListaTrabalhoGeral);
          const updatedListaTrabalhoGeralOther = ListaTrabalhoGeralOther.filter(item => item.TipoTrabalho.toLowerCase() !== normalizedInputValue);
          setListaTrabalhoGeralOther(updatedListaTrabalhoGeralOther);

          let NovaStringListaTrabalhoGeralOther = StringListaTrabalhoGeralOther.split(",");

          NovaStringListaTrabalhoGeralOther = NovaStringListaTrabalhoGeralOther.filter(item => item !== originalCaseInputValue);

          setStringListaTrabalhoGeralOther(NovaStringListaTrabalhoGeralOther.join(","));
        }

        let NovaStringListaTrabalhoGeral = StringListaTrabalhoGeral.split(",");

        NovaStringListaTrabalhoGeral.push(originalCaseInputValue);


        setStringListaTrabalhoGeral(NovaStringListaTrabalhoGeral.join(","));
      } else {
        toast.error('Valor inserido não permitido!');
      }
    }
  }, [StringListaTrabalhoGeral, options, dispatch, ListaTrabalhoGeral, listaTipoTrabalho, ListaTrabalhoGeralOther, StringListaTrabalhoGeralOther]);


  const handleDropdownToggle = useCallback((projectId) => {
    setShowProjeto((prevShowProjeto) => ({
      ...prevShowProjeto,
      [projectId]: !prevShowProjeto[projectId],
    }));
  }, []);

  const renderTimePickerClock = useCallback((obtainKey,project, t, ttID, value, dis) => (
    <TimePickerClock
      disabled = {dis}
      key={obtainKey}
      name={t}
      selectedTime={convertToMinutes(value)}
      projectID={project._id}
      ttID={ttID}
      projectNome={project.Nome}
      convertToInt={handleHorasChange}
    />
  ), [convertToMinutes, handleHorasChange]);



 const renderProjectDropdown = useCallback((project, idProjeto) => {
  return (
    <div className="list-group-item" key={"project_" + project._id}>
      <div className="row mb-3 text-center">
        <div className="col-md-4 text-end themed-grid-col">
          <h5>{project.Nome}</h5>
        </div>
        <div className="col-md-8 themed-grid-col">
          <div className="row">
            <div className="col-md-10 btn-container">
              <button
                type="button"
                className="btn button-Dropdown"
                onClick={() => handleDropdownToggle(project._id)}
              >
                <FaCaretDown />
              </button>

              <div className={`dropdown ${showProjeto[project._id] ? "show-dropdown" : "hidden-dropdown"} ${showProjeto[project._id] ? "" : "d-none"}`}>
                <div className="row mb-3 text-center" key={"NewDia" + project._id}>
                  {!verificaChange ? (
                    (project.Nome !== "Geral" ? listaTrabalho : listaTrabalhoGeralAdd)?.map((tt, idTT) => (
                      <div key={project._id + "_" + idTT}>
                        {renderTimePickerClock(`TPC_${project._id}_${tt._id}`, project, tt.TipoTrabalho, tt._id, horasP[project._id], false)}
                      </div>
                    ))
                  ) : (
                    <div key={"EditDia" + project._id}>

                      {values.tipoDeTrabalhoHoras?.length !== 0 && Array.isArray(arrayTipoTrabalho) && arrayTipoTrabalho.map((item, ID) => {
                        const itemTypeArray = item.tipoTrabalho?.split(",") || [];
                        const matchFound = new Array(itemTypeArray?.length + 1).fill(false);
                        if (project._id === item.projeto) {
                          const valuesHorasTypeArray = values.tipoDeTrabalhoHoras[project._id].horas?.split(",") || [];
                          matchFoundProjeto[idProjeto] = true;
                          return (
                            <div key={"EditarDia" + ID}>
                            {(((values?.accepted === 5 || values?.accepted === 4) && project.Nome === "Geral") ?  StringListaTrabalhoCompensacaoD :  project.Nome !== "Geral" ? StringListaTrabalho : StringListaTrabalhoGeral)?.split(",").map((t, i) =>                             
                                itemTypeArray.map((iT, iId) => {
                                  if ((project.Nome !== "Geral" ? ListaTrabalhoAll[i]._id : listaTrabalhoGeralAdd[i]._id) === iT) {
                                    matchFound[iId] = true;
                                    const val = valuesHorasTypeArray[iId] != null && !isNaN(valuesHorasTypeArray[iId]) ? valuesHorasTypeArray[iId] : [];
                                    const ttID = listaTipoTrabalho.find(item => item.TipoTrabalho === t)._id;
                                    const dis = (((project.Nome !== "Geral" ? ListaTrabalhoAll[i].tipo : listaTrabalhoGeralAdd[i].tipo) === 6 ) || blocked);
             
                                    return renderTimePickerClock(`Edit-${i}-true`, project, t, ttID, val, dis);
                                  } else {
                                    if (iId === itemTypeArray.length - 1 && !matchFound[i]) {
                                      const val = isNaN(values.tipoDeTrabalhoHoras[project._id]?.[t]);
                                      const ttID = listaTipoTrabalho.find(item => item.TipoTrabalho === t)._id;
                                      return renderTimePickerClock(`Edit-${i}-false`, project, t, ttID, val, blocked);
                                    }
                                  }
                                })
                              )}
                              
                                
                              {project.Nome === "Geral" && StringListaTrabalhoGeralOther?.split(",").map((t, i) =>
                                itemTypeArray.map((iT, iId) => {
                                  if (ListaTrabalhoGeralOther[i]?._id === iT) {
                                    matchFound[i] = true;
                                    const ttID = listaTipoTrabalho.find(item => item.TipoTrabalho === t)._id;
                                    const val = valuesHorasTypeArray[iId] != null && !isNaN(valuesHorasTypeArray[iId]) ? valuesHorasTypeArray[iId] : [];
                                    return renderTimePickerClock(`Edit-Geral-${i}-true`, project, t, ttID, val, blocked);
                                  }
                                })
                              )}
                            </div>
                          );

                        } else  if (!matchFoundProjeto[idProjeto] && ID === arrayTipoTrabalho?.length - 1) {
                          return (
                            <div key={"EditarDiaProjetoNotFound" + idProjeto}>
                              {(project.Nome !== "Geral" ? listaTrabalho : listaTrabalhoGeralAdd)?.map((tt, idTT) => (
                                <div key={project._id + "_" + idTT}>
                                  {renderTimePickerClock(`TPC_${project._id}_${tt._id}`, project, tt.TipoTrabalho, tt._id, horasP[project._id], blocked)}
                                </div>
                              ))}
                            </div>
                          );
                        }
                      })}

                    </div>
                  )}

                  {project.Nome === "Geral" && <OptionsPanel options={options} handleTipoTrabalho={handleTipoTrabalho} />}
                </div>
              </div>
            </div>

            <div className={`col-md-2  text-start ${showProjeto[project._id] ? "hidden-dropdown" : "show-dropdown"}`}>
                {values.tipoDeTrabalhoHoras[project._id]?.horas && values.tipoDeTrabalhoHoras[project._id]?.horas?.split(",").map((t) => {
                  horasP[project._id] += +t;
                  return null;
                })}
                <h3>{horasP[project._id] !== 0 ? convertToMinutes(horasP[project._id]) : ''}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}, [handleDropdownToggle, showProjeto, verificaChange, listaTrabalho, listaTrabalhoGeralAdd, renderTimePickerClock, values, arrayTipoTrabalho, StringListaTrabalho, StringListaTrabalhoGeral, ListaTrabalhoAll, StringListaTrabalhoCompensacaoD, ListaTrabalhoGeralOther, listaTipoTrabalho, horasP, handleTipoTrabalho, options]);


if(listaTrabalhoGeralAdd.length === 0){
  return <Loading />;
}

 return (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    {sortedProjetos.map(renderProjectDropdown)}
  </LocalizationProvider>
);


};

AddHorasDropdown.propTypes = {
  sortedProjetos: PropTypes.array.isRequired,
  verificaChange: PropTypes.bool.isRequired,
  listaTipoTrabalho: PropTypes.array.isRequired,
  values: PropTypes.object.isRequired,
  handleHorasChange: PropTypes.func.isRequired,
  convertToMinutes: PropTypes.func.isRequired,
  arrayTipoTrabalho: PropTypes.array.isRequired,
  matchFoundProjeto: PropTypes.array.isRequired,
  ListaTrabalhoAll: PropTypes.array.isRequired,
  ListaTrabalhoGeral: PropTypes.array.isRequired,
  ListaTrabalhoGeralOther: PropTypes.array.isRequired,
  setListaTrabalhoGeralOther: PropTypes.func.isRequired,
  setListaTipoTrabalho: PropTypes.func.isRequired,
  setListaTrabalhoGeral : PropTypes.func.isRequired,
  blocked: PropTypes.bool,
}

export default memo(AddHorasDropdown);
