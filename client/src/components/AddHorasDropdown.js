
import React, { useState, useEffect } from 'react';

import { FaCaretDown } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { createTipoTrabalhoOther } from '../features/tipoTrabalho/tipoTrabalhoSlice';
import { toast } from 'react-toastify';


import TimePickerClock from './TimePickerClock';
import OptionsPanel from './OptionsPanel';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';




const AddHorasDropdown = React.memo(({ sortedProjetos, verificaChange, listaTipoTrabalho, 
  values, handleHorasChange, convertToMinutes,
  arrayTipoTrabalho, matchFoundProjeto, ListaTrabalhoAll,
  ListaTrabalhoGeral, ListaTrabalhoGeralOther, setListaTrabalhoGeralOther,
  setListaTipoTrabalho, setListaTrabalhoGeral }) => {

    const [StringListaTrabalho, setStringListaTrabalho] = useState();
    const [StringListaTrabalhoGeral, setStringListaTrabalhoGeral] = useState();
    const [StringListaTrabalhoGeralOther, setStringListaTrabalhoGeralOther] = useState();
    const [listaTrabalhoGeralAdd, setListaTrabalhoGeralAdd] = useState();
    const [options, setOptions] = useState();


    useEffect(() => {
      const date = new Date(values.Data);
      const dayStart = new Date(Date.UTC(2023, 11, 1, 0, 0, 0));
      const dayEnd = new Date(Date.UTC(2023, 11, 10, 0, 0, 0));

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
          setListaTrabalhoGeralAdd(ListaTrabalhoGeral.filter(item => (item.tipo === 2 || item.tipo === 4 || item.tipo === 5)));
          ListaTrabalhoGeralString = listaTipoTrabalho.filter(item => (item.tipo === 2 || item.tipo === 4 || item.tipo === 5)).map(item => item.TipoTrabalho).join(",");
        } else {
          setListaTrabalhoGeralAdd(ListaTrabalhoGeral.filter(item => (item.tipo === 2 || item.tipo === 4)));
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

      const ListaTrabalho = listaTipoTrabalho
      .filter(item => item.tipo === 1)
      .map(item => item.TipoTrabalho)
      .join(",");

      const ListaTrabalhoGeralOther = listaTipoTrabalho
        .filter(item => item.tipo === 3)
        .map(item => item.TipoTrabalho)
        .join(",");
  
      setStringListaTrabalho(ListaTrabalho);
  
      setStringListaTrabalhoGeral(ListaTrabalhoGeralString);
  
      setStringListaTrabalhoGeralOther(ListaTrabalhoGeralOther);
  
      setOptions(ListaTrabalhoGeralOther?.split(","));

    }, [ListaTrabalhoGeral, listaTipoTrabalho, values.Data]);


  const dispatch = useDispatch();

  const [showProjeto, setShowProjeto] = useState({});


  // Initialize horasP as an object
  const horasP = [];

  // Initialize horasP with project IDs as keys and initial values of 0
  sortedProjetos.forEach(project => {
    horasP[project._id] = 0;
  });

  const handleTipoTrabalho = async (inputValue) => {
    if (inputValue && inputValue.trim() !== "") {
      const values = StringListaTrabalhoGeral?.split(",");

      if (!values.map(value => value.toLowerCase()).includes(inputValue.toLowerCase())) {
        // Handle when inputValue is not already in StringListaTrabalhoGeral

        // Create a mapping to preserve the original case
        const inputValueMap = new Map();
        let originalCaseInputValue = "";
        if (!options.some(option => option.toLowerCase() === inputValue.toLowerCase())) {
          await dispatch(createTipoTrabalhoOther({ TipoTrabalho: inputValue, tipo: 3 })).then((res) => {

            const tipoTrabalhoArray = Array.isArray(res.payload.tipoTrabalho) ? res.payload.tipoTrabalho : [res.payload.tipoTrabalho];

            const updatedListaTrabalhoGeral = [...ListaTrabalhoGeral, ...tipoTrabalhoArray];
            const updatedListaTipoTrabalho = [...listaTipoTrabalho, ...tipoTrabalhoArray];

            setListaTipoTrabalho(updatedListaTipoTrabalho,);
            setListaTrabalhoGeral(updatedListaTrabalhoGeral);
          })
          originalCaseInputValue = inputValue;
        } else {
          options.forEach(option => inputValueMap.set(option.toLowerCase(), option));
          originalCaseInputValue = inputValueMap.get(inputValue.toLowerCase());
          // Remove originalCaseInputValue from options
          const updatedOptions = options.filter(option => option.toLowerCase() !== inputValue.toLowerCase());
          setOptions(updatedOptions);

          const normalizedInputValue = originalCaseInputValue.toLowerCase(); // or .toUpperCase()
          const tipoTrabalho = ListaTrabalhoGeralOther.filter(item => item.TipoTrabalho.toLowerCase() === normalizedInputValue);
          const updatedListaTrabalhoGeral = [...ListaTrabalhoGeral, ...tipoTrabalho];

          setListaTrabalhoGeral(updatedListaTrabalhoGeral);

          const updatedListaTrabalhoGeralOther = ListaTrabalhoGeralOther.filter(item => item.TipoTrabalho.toLowerCase() !== normalizedInputValue);
          setListaTrabalhoGeralOther(updatedListaTrabalhoGeralOther);

          // tipoTrabalhoArray.filter(item => item.tipo === 3))


          let NovaStringListaTrabalhoGeralOther = StringListaTrabalhoGeralOther?.split(",");

          // Use the mapping to get the original case of inputValue
          NovaStringListaTrabalhoGeralOther = NovaStringListaTrabalhoGeralOther.filter(item => item !== originalCaseInputValue);

          setStringListaTrabalhoGeralOther(NovaStringListaTrabalhoGeralOther.join(","));
        }

        let NovaStringListaTrabalhoGeral = StringListaTrabalhoGeral?.split(",");

        // Use the mapping to get the original case of inputValue

        NovaStringListaTrabalhoGeral.push(originalCaseInputValue);

        setStringListaTrabalhoGeral(NovaStringListaTrabalhoGeral.join(","));

      } else {
        toast.error('Valor inserido não permitido!');
      }
    }
  }

  const handleDropdownToggle = (projectId) => {
    setShowProjeto((prevShowProjeto) => {
      return {
        ...prevShowProjeto,
        [projectId]: !prevShowProjeto[projectId],
      };
    });
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {sortedProjetos.map((project, idProjeto) => {
          return (
            <div className="list-group-item" key={project._id}>
              <div className="row mb-3 text-center">
                <div className="col-md-4 text-end themed-grid-col">
                  <h5>{project.Nome}</h5>
                </div>
                <div className="col-md-8  themed-grid-col">
                  <div className='row'>
                    <div className="col-md-10 btn-container">
                      <button
                        type="button"
                        className="btn button-Dropdown"
                        onClick={() => handleDropdownToggle(project._id)}
                      >
                        <FaCaretDown />

                      </button>
                      <div className={`dropdown ${showProjeto[project._id] ? "show-dropdown" : "hidden-dropdown"}
                      ${showProjeto[project._id] ? "" : "d-none"}`} >

                        <div className="row mb-3 text-center" key={"NewDia" + project._id}>
                          {!verificaChange && (
                            (project.Nome !== "Geral" ? StringListaTrabalho : StringListaTrabalhoGeral)?.split(",").map((t, i) => {
  
                              const ttID = listaTipoTrabalho.filter(item => item.TipoTrabalho === t).map(item => item._id).join(",");
                              let value = "";

                              if (values.tipoDeTrabalhoHoras[project._id]) {
                                const valuesHorasTypeArray = values.tipoDeTrabalhoHoras[project._id].horas ? values.tipoDeTrabalhoHoras[project._id].horas?.split(",") : [];
                                const valuesTTTypeArray = values.tipoDeTrabalhoHoras[project._id].tipoTrabalho ? values.tipoDeTrabalhoHoras[project._id].tipoTrabalho?.split(",") : [];


                                for (let h = 0; h < valuesHorasTypeArray?.length; h++) {
                                  if (valuesTTTypeArray[h] === ttID) {
                                    value = valuesHorasTypeArray[h];
                                  }
                                }
                              }
                              return (
                                <TimePickerClock
                                  key={`New${i}-${project._id}-${ttID}`}
                                  name={t}
                                  selectedTime={convertToMinutes(value)}
                                  projectID={project._id}
                                  ttID={ttID}
                                  projectNome={project.Nome}
                                  convertToInt={handleHorasChange}
                                />
                              )
                            })
                          )
                          }
                          {project.Nome === "Geral" && (
                            <OptionsPanel options={options} handleTipoTrabalho={handleTipoTrabalho} />
                          )}

                          <div key={"NewDia" + project._id}>
                            {verificaChange && values.tipoDeTrabalhoHoras?.length !== 0 && Array.isArray(arrayTipoTrabalho) &&
                              arrayTipoTrabalho.map((item, ID) => {
                                const itemTypeArray = item.tipoTrabalho ? item.tipoTrabalho?.split(",") : [];
                                const matchFound = new Array(itemTypeArray?.length + 1).fill(false);

                                if (project._id === item.projeto) {

                                  const valuesHorasTypeArray = values.tipoDeTrabalhoHoras[project._id].horas ? values.tipoDeTrabalhoHoras[project._id].horas?.split(",") : [];

                                  matchFoundProjeto[idProjeto] = true;
                                  return (
                                    
                                    <div key={"EditarDia" + ID}>

                                      {(project.Nome !== "Geral" ? StringListaTrabalho : StringListaTrabalhoGeral)?.split(",").map((t, i) =>
                                        itemTypeArray.map((iT, iId) => {  
                                          if ((project.Nome !== "Geral" ? ListaTrabalhoAll[i]._id : listaTrabalhoGeralAdd[i]._id) === iT) {

                                            matchFound[i] = true;
                                            return (
                                              <TimePickerClock
                                                key={i}
                                                name={t}
                                                selectedTime={valuesHorasTypeArray[iId] != null && !isNaN(valuesHorasTypeArray[iId])
                                                  ? convertToMinutes(valuesHorasTypeArray[iId])
                                                  : []}
                                                projectID={project._id}
                                                ttID={listaTipoTrabalho.filter(item => item.TipoTrabalho === t).map(item => item._id).join(",")}
                                                projectNome={project.Nome}
                                                convertToInt={handleHorasChange}
                                              />
                                            );
                                          } else {

                                            if (iId === itemTypeArray?.length - 1) {
                                              if (!matchFound[i]) {
                                                return (
                                                  <TimePickerClock
                                                    key={i}
                                                    name={t}
                                                    selectedTime={isNaN(values.tipoDeTrabalhoHoras[project._id]?.[t])}
                                                    projectID={project._id}
                                                    ttID={listaTipoTrabalho.filter(item => item.TipoTrabalho === t).map(item => item._id).join(",")}
                                                    projectNome={project.Nome}
                                                    convertToInt={handleHorasChange}
                                                  />
                                                );
                                              }
                                            }
                                            return (<div key= {i}></div>);
                                          }
                                        }
                                        )
                                      )
                                      }

                                      {project.Nome === "Geral" && StringListaTrabalhoGeralOther?.length > 0 && StringListaTrabalhoGeralOther?.split(",").map((t, i) =>
                                        itemTypeArray.map((iT, iId) => {

                                          if ((project.Nome === "Geral" && ListaTrabalhoGeralOther[i]?._id) === iT) {
  
                                            matchFound[i] = true;
                                            return (
                                              <TimePickerClock
                                                key={i}
                                                name={t}
                                                selectedTime={
                                                  valuesHorasTypeArray[iId] != null && !isNaN(valuesHorasTypeArray[iId])
                                                    ? convertToMinutes(valuesHorasTypeArray[iId])
                                                    : []
                                                }
                                                projectID={project._id}
                                                ttID={listaTipoTrabalho.filter(item => item.TipoTrabalho === t).map(item => item._id).join(",")}
                                                projectNome={project.Nome}
                                                convertToInt={handleHorasChange}
                                              />
                                            );
                                          } else {
                                            return (<div key={i}></div>);
                                          }
                                        }
                                        )
                                      )}
                                    </div>
                                  );
                                } else {
                                  if (!matchFoundProjeto[idProjeto] && ID === arrayTipoTrabalho?.length - 1) {
                                    return (
                                      <div key={"EditarDiaProjetoNotFound" + idProjeto}>
                                        {(project.Nome !== "Geral" ? StringListaTrabalho : StringListaTrabalhoGeral)?.split(",").map((t, i) => {
                                          const ttID = (listaTipoTrabalho.filter(item => item.TipoTrabalho === t).map(item => item._id).join(","))
                                          let value = "";

                                          if (values.tipoDeTrabalhoHoras[project._id]) {
                                            const valuesHorasTypeArray = values.tipoDeTrabalhoHoras[project._id].horas ? values.tipoDeTrabalhoHoras[project._id].horas?.split(",") : [];
                                            const valuesTTTypeArray = values.tipoDeTrabalhoHoras[project._id].tipoTrabalho ? values.tipoDeTrabalhoHoras[project._id].tipoTrabalho?.split(",") : [];

                                            for (let h = 0; h < valuesHorasTypeArray?.length; h++) {
                                              if (valuesTTTypeArray[h] === ttID) {
                                                value = valuesHorasTypeArray[h];
                                              }
                                            }
                                          }
                                          return (
                                            <TimePickerClock
                                              key={i}
                                              name={t}
                                              selectedTime={convertToMinutes(value)}
                                              projectID={project._id}
                                              ttID={ttID}
                                              projectNome={project.Nome}
                                              convertToInt={handleHorasChange}
                                            />
                                          )
                                        }
                                        )
                                        }
                                      </div>
                                    );
                                  } else{
                                    return (<></>);
                                  }
                                }
                              }
                              )
                            }
                          </div>
                        </div>
                      </div>
                    </div>


                    <div className={`col-md-2  text-start ${showProjeto[project._id] ? "hidden-dropdown" : "show-dropdown"}`}>
                      {values.tipoDeTrabalhoHoras[project._id]?.horas && values.tipoDeTrabalhoHoras[project._id]?.horas?.split(",").map((t, i) => {
                        horasP[project._id] += +t;
                        return null;
                      })}
                      <h3>{horasP[project._id] !== 0 ? convertToMinutes(horasP[project._id]) : ''}</h3>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )
        })}
      </LocalizationProvider>
    </>
  );
});
export default AddHorasDropdown;
