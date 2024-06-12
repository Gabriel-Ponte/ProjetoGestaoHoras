
import React, { useState, useEffect } from 'react';


import TimePickerClock from './TimePickerClock';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


const AddHorasProjetoDropdown = React.memo(({ sortedProjetos,verificaChange, listaTipoTrabalho, 
  values, handleHorasChange, convertToMinutes, arrayTipoTrabalho, matchFoundProjeto, ListaTrabalhoAll, setListaTipoTrabalho }) => {

    const [StringListaTrabalho, setStringListaTrabalho] = useState();

    useEffect(() => {

      const ListaTrabalho = listaTipoTrabalho
      .filter(item => item.tipo === 1)
      .map(item => item.TipoTrabalho)
      .join(",");
  
      setStringListaTrabalho(ListaTrabalho);

    }, [listaTipoTrabalho, values.Data]);


  // Initialize horasP as an object
  const horasP = [];

  horasP[sortedProjetos?.projeto?._id] = 0;

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="list-group-item" key={sortedProjetos?.projeto?._id}>
              <div className="row mb-3 text-center">
                <div className="col-md-12  themed-grid-col">
                  <div className='row'>
                  <div className="col-md-2  themed-grid-col"></div>
                    <div className="col-md-8 mt-5 btn-container">
                        <div className="row mb-3 text-center" key={"NewDia" + sortedProjetos?.projeto?._id}>
                          {!verificaChange && (
                            (StringListaTrabalho)?.split(",").map((t, i) => {
                              const ttID = listaTipoTrabalho.filter(item => item.TipoTrabalho === t).map(item => item._id).join(",");
                              let value = "";

                              if (values.tipoDeTrabalhoHoras[sortedProjetos?.projeto?._id]) {
                                const valuesHorasTypeArray = values.tipoDeTrabalhoHoras[sortedProjetos?.projeto?._id].horas ? values.tipoDeTrabalhoHoras[sortedProjetos?.projeto?._id].horas?.split(",") : [];
                                const valuesTTTypeArray = values.tipoDeTrabalhoHoras[sortedProjetos?.projeto?._id].tipoTrabalho ? values.tipoDeTrabalhoHoras[sortedProjetos?.projeto?._id].tipoTrabalho?.split(",") : [];


                                for (let h = 0; h < valuesHorasTypeArray?.length; h++) {
                                  if (valuesTTTypeArray[h] === ttID) {
                                    value = valuesHorasTypeArray[h];
                                  }
                                }
                              }
                              return (
                                <TimePickerClock
                                  key={`New${i}-${sortedProjetos?.projeto?._id}-${ttID}`}
                                  name={t}
                                  selectedTime={convertToMinutes(value)}
                                  projectID={sortedProjetos?.projeto?._id}
                                  ttID={ttID}
                                  projectNome={sortedProjetos?.projeto?.Nome}
                                  convertToInt={handleHorasChange}
                                />
                              )
                            })
                          )
                          }

                          <div key={"NewDia" + sortedProjetos?.projeto?._id}>
                            {verificaChange && values.tipoDeTrabalhoHoras?.length !== 0 && Array.isArray(arrayTipoTrabalho) &&
                              arrayTipoTrabalho.map((item, ID) => {
                                const itemTypeArray = item.tipoTrabalho ? item.tipoTrabalho?.split(",") : [];
                                const matchFound = new Array(itemTypeArray?.length + 1).fill(false);

                                if (sortedProjetos?.projeto?._id === item.projeto) {

                                  const valuesHorasTypeArray = values.tipoDeTrabalhoHoras[sortedProjetos?.projeto?._id].horas ? values.tipoDeTrabalhoHoras[sortedProjetos?.projeto?._id].horas?.split(",") : [];

                                  matchFoundProjeto[sortedProjetos?.projeto?._id] = true;
                                  return (
                                    
                                    <div key={"EditarDia" + ID}>

                                      {StringListaTrabalho?.split(",").map((t, i) =>
                                        itemTypeArray.map((iT, iId) => {  
                                          if (ListaTrabalhoAll[i]._id === iT) {

                                            matchFound[i] = true;
                                            return (
                                              <TimePickerClock
                                                key={i}
                                                name={t}
                                                selectedTime={valuesHorasTypeArray[iId] != null && !isNaN(valuesHorasTypeArray[iId])
                                                  ? convertToMinutes(valuesHorasTypeArray[iId])
                                                  : []}
                                                projectID={sortedProjetos?.projeto?._id}
                                                ttID={listaTipoTrabalho.filter(item => item.TipoTrabalho === t).map(item => item._id).join(",")}
                                                projectNome={sortedProjetos?.projeto?.Nome}
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
                                                    selectedTime={isNaN(values.tipoDeTrabalhoHoras[sortedProjetos?.projeto?._id]?.[t])}
                                                    projectID={sortedProjetos?.projeto?._id}
                                                    ttID={listaTipoTrabalho.filter(item => item.TipoTrabalho === t).map(item => item._id).join(",")}
                                                    projectNome={sortedProjetos?.projeto?.Nome}
                                                    convertToInt={handleHorasChange}
                                                  />
                                                );
                                              }
                                            }
                                          }
                                        }
                                        )
                                      )
                                      }

                                      {StringListaTrabalho?.length > 0 && StringListaTrabalho?.split(",").map((t, i) =>
                                        itemTypeArray.map((iT, iId) => {

                                          if ((StringListaTrabalho[i]?._id) === iT) {
  
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
                                                projectID={sortedProjetos?.projeto?._id}
                                                ttID={listaTipoTrabalho.filter(item => item.TipoTrabalho === t).map(item => item._id).join(",")}
                                                projectNome={sortedProjetos?.projeto?.Nome}
                                                convertToInt={handleHorasChange}
                                              />
                                            );
                                          }
                                        }
                                        )
                                      )}
                                    </div>
                                  );
                                } else {
                                  if (!matchFoundProjeto[sortedProjetos?.projeto?._id] && ID === arrayTipoTrabalho?.length - 1) {
                                    return (
                                      <div key={"EditarDiaProjetoNotFound" + sortedProjetos?.projeto?._id}>
                                        {StringListaTrabalho?.split(",").map((t, i) => {
                                          const ttID = (listaTipoTrabalho.filter(item => item.TipoTrabalho === t).map(item => item._id).join(","))
                                          let value = "";

                                          if (values.tipoDeTrabalhoHoras[sortedProjetos?.projeto?._id]) {
                                            const valuesHorasTypeArray = values.tipoDeTrabalhoHoras[sortedProjetos?.projeto?._id].horas ? values.tipoDeTrabalhoHoras[sortedProjetos?.projeto?._id].horas?.split(",") : [];
                                            const valuesTTTypeArray = values.tipoDeTrabalhoHoras[sortedProjetos?.projeto?._id].tipoTrabalho ? values.tipoDeTrabalhoHoras[sortedProjetos?.projeto?._id].tipoTrabalho?.split(",") : [];

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
                                              projectID={sortedProjetos?.projeto?._id}
                                              ttID={ttID}
                                              projectNome={sortedProjetos?.projeto?.Nome}
                                              convertToInt={handleHorasChange}
                                            />
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

                    <div className={`col-md-2  text-start `}>
                      {
    
                      values.tipoDeTrabalhoHoras[sortedProjetos?.projeto?._id]?.horas && values.tipoDeTrabalhoHoras[sortedProjetos?.projeto?._id]?.horas?.split(",").map((t, i) => {
                        horasP[sortedProjetos?.projeto?._id] += +Number(t);
                        return null;
                      })}
                      <h3>{horasP[sortedProjetos?.projeto?._id] !== 0 ? convertToMinutes(horasP[sortedProjetos?.projeto?._id]) : ''}</h3>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          

      </LocalizationProvider>
    </>
  );
});
export default AddHorasProjetoDropdown;
