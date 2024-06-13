import { useState, useEffect } from 'react';
import Wrapper from '../assets/wrappers/FormRowSelect';

const FormRowSelect = ({ labelText, name, value, handleChange, list, multiple, handleLista, className, classNameLabel, classNameInput, classNameResult, todos }) => {
  if (multiple === null) {
    multiple = true;
  }


  let separatedArray;
  if (Array.isArray(value)) {
    separatedArray = value.length > 0 ? value[0].split(/[,/]/) : [];

  } else {
    separatedArray = value.split(/[,/]/);
  }


  const [newOption, setNewOption] = useState(''); // state to hold new option value
  const [updatedList, setUpdatedList] = useState(list); // state to hold updated list
  const [selectedOption, setSelectedOption] = useState(Array.isArray(separatedArray) ? separatedArray : (value ? value.split(',') : []));
  
 


  useEffect(() => {
    setSelectedOption(Array.isArray(separatedArray) ? separatedArray : (value ? value.split(',') : []));
    // eslint-disable-next-line
  }, [value]);
  
  const handleMultiChange = async (event) => {

    let selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    let previousOptions = selectedOption.filter((option) => !selectedOptions.includes(option));
    let updatedOptions;
    let op;
    if (selectedOptions[0] === 'Todos') {
      // If "todos" is selected, unselect all other options
      updatedOptions = ['Todos'];
      setSelectedOption(updatedOptions.length === selectedOption.length ? updatedOptions : updatedOptions);

      op = updatedOptions.length === selectedOption.length ? updatedOptions : updatedOptions;
    } else {
      // If any other value is selected, unselect "todos"
      selectedOptions = selectedOptions.filter(option => option !== 'Todos');
      previousOptions = previousOptions.filter(option => option !== 'Todos');

      updatedOptions = [...previousOptions, ...selectedOptions];
      if(updatedOptions.length > 1){
      setSelectedOption(updatedOptions.length === selectedOption.length ? previousOptions : updatedOptions);
      op = updatedOptions.length === selectedOption.length ? previousOptions : updatedOptions;
      }else{
        setSelectedOption(updatedOptions);
        op = updatedOptions;
      }
    }
    
 
    
    if (updatedOptions[0] === null || updatedOptions[0] === '') {
      updatedOptions.shift();
    }
    handleChange(event.target.id, op);
  };


  const handleSingleChange = (event) => {
    handleChange(event);
  }
  const handleNewOptionChange = (event) => {
    setNewOption(event.target.value);
  };
  
  if (!updatedList.length && list.length) {
    setUpdatedList(list);
  }
  useEffect(() => {

  }, [updatedList]);

  let selectOptions;

  if (name === 'Piloto') {
    const listaUtilizador = list.map((itemValue, index) => (
      <option key={index} data-key={itemValue._id} value={itemValue.nome}>
        {
          itemValue.nome
        }
      </option>
    ));


    if(multiple){
    selectOptions = [
      <option key="default" value="Todos">
        Todos
      </option>,
      ...listaUtilizador,
    ];
  }else{
    if(todos && (todos === 2 || todos === 7)){
      selectOptions = [
        <option key="default" value="Todos">
          Todos
        </option>,
        <option key="Administradores" value="Administradores">
        Administradores
        </option>,
        <option key="Engenharia de Processos" value="Engenharia de Processos">
        Engenharia Processos
        </option>,
        <option key="Laboratorio" value="Laboratorio">
          Laboratorio
        </option>,
        <option key="Outro" value="Outro">
          Outro
        </option>,
          <option key="separator" disabled>
          ---------------
        </option>,
        ...listaUtilizador,
      ];
    }
    else if(todos && todos === 5){
      selectOptions = [
        <option key="Engenharia de Processos" value="Engenharia de Processos">
        Engenharia Processos
        </option>,

          <option key="separator" disabled>
          ---------------
        </option>,
        ...listaUtilizador,
      ];
    }    else if(todos && todos === 6){
      selectOptions = [

        <option key="Laboratorio" value="Laboratorio">
          Laboratorio
        </option>,
          <option key="separator" disabled>
          ---------------
        </option>,
        ...listaUtilizador,
      ];
    }
    else if(todos && todos === 7){
      selectOptions = [
        <option key="Outro" value="Outro">
          Outro
        </option>,
          <option key="separator" disabled>
          ---------------
        </option>,
        ...listaUtilizador,
      ];
    } 
     else if(todos && todos === 8){
      selectOptions = [
        <option key="default" value="Todos">
          Todos
        </option>,
          <option key="separator" disabled>
          ---------------
        </option>,
        ...listaUtilizador,
      ];
    }
    else{
    selectOptions = listaUtilizador.concat(
    );
  }
  }
  } else if(name === 'listaProjetos'){
    // Add checkbox inputs for each option
    const lista = updatedList.map((itemValue, index) => (
      <option key={index} value={itemValue._id}>
        {
         itemValue._id_P + ' - ' + itemValue.Nome
        }
      </option>
    ));
    selectOptions = [
      <option key="Todos" value="Todos">
        Todos
      </option>,
        <option key="separator" disabled>
        ---------------
      </option>,
      ...lista,
    ];

  } else {
    // Add checkbox inputs for each option
    const lista = updatedList.map((itemValue, index) => (
      <option key={index} value={itemValue.TipoTrabalho}>
        {
          itemValue.TipoTrabalho
        }
      </option>
    ));

    selectOptions = lista.concat(
    );
  }

  const handleAddToList = () => {
    if (newOption.trim() !== '') {
      const newList = [...updatedList, {
        _id: updatedList.length + 1,
        TipoTrabalho: newOption,
        __v: 0
      }];

      if (list.some(item => item.TipoTrabalho === newOption) || updatedList.some(item => item.TipoTrabalho === newOption)) {
        alert('This option was already added.');
        setNewOption('');
        return;
      }
      setUpdatedList(newList);
      handleLista(newOption.trim());
      setNewOption('');
    }
  };
  return (
    <Wrapper>
      <div className={className ? className : 'form-row'}>
        {
          //<div className="multiselect">
        }
        {classNameLabel !== null ? (
          <div className={classNameLabel ? classNameLabel : 'form-label'}>{labelText || name}</div>
        ) : (
          <label htmlFor={name} className='form-label'>
            {labelText || name}
          </label>
        )}
        <div className={classNameInput ? classNameInput : 'form-row'}>
          {multiple ? (
            <select
              multiple
              name={name}
              id={name}
              value={selectedOption}
              onChange={handleMultiChange}
              className="form-select"
            >
              {selectOptions}
            </select>
          ) : (
            <select
              name={name}
              id={name}
              value={selectedOption[0]}
              onChange={handleSingleChange}
              className="form-select"
            >
              {selectOptions}
            </select>
          )}

          {value && name !== 'listaProjetos' && (
            <div className={className ? className : 'row mb-3 text-center'}>
              <div className={classNameLabel ? classNameLabel : 'form-label'}>
                <p>
                  {'Selecionado: ' || name + ': '}
                </p>
              </div>
              <div className={classNameResult ? classNameResult : 'form-label'}>
                <p>
                  {Array.isArray(value) ? value.join(', ') : value}
                </p>
                </div>
              </div>
          )}

          {name !== 'Piloto' && name !== 'listaProjetos' && (
            <div className={className ? className : 'row mb-3 text-center'}>
              <div className={classNameLabel ? classNameLabel : 'form-row'}>
                <label htmlFor={`${name}-new-option`} className="form-label">
                  Nova Opção:
                </label>
              </div>

              <div className={classNameInput ? classNameInput : 'form-row'}>
                <input
                  type="text"
                  id={`${name}-new-option`}
                  value={newOption}
                  onChange={handleNewOptionChange}
                  className="form-input"
                />
                <button type="button" onClick={handleAddToList}>
                  Adicionar
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </Wrapper>
  );
};

export default FormRowSelect;
