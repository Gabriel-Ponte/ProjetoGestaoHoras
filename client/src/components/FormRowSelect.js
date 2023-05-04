import { useState, useEffect, useRef } from 'react';
import Wrapper from '../assets/wrappers/FormRowSelect';

const FormRowSelect = ({ labelText, name, value, handleChange, list, multiple, handleLista, className, classNameLabel, classNameInput, classNameResult }) => {

  if (multiple === null) {
    multiple = true;
  }
  let separatedArray;
  if (Array.isArray(value)) {
    separatedArray = value.length > 0 ? value[0].split(/[,\/]/) : [];
  } else {
    separatedArray = value.split(/[,\/]/);
  }

  const [newOption, setNewOption] = useState(''); // state to hold new option value
  const [updatedList, setUpdatedList] = useState(list); // state to hold updated list
  const [selectedOption, setSelectedOption] = useState(Array.isArray(separatedArray) ? separatedArray : (value ? value.split(',') : []));

  const handleMultiChange = async (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    const previousOptions = selectedOption.filter((option) => !selectedOptions.includes(option));
    // Declare updatedOptions variable outside of the if/else block
    const updatedOptions = [...previousOptions, ...selectedOptions];
    console.log(updatedOptions);
    // Remove duplicated setSelectedOption() call
    setSelectedOption(updatedOptions.length === selectedOption.length ? previousOptions : updatedOptions);
    const op = updatedOptions.length === selectedOption.length ? previousOptions : updatedOptions;
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
      <option key={index} value={itemValue.nome}>
        {
          itemValue.nome
        }
      </option>
    ));

    selectOptions = listaUtilizador.concat(
    );
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

          {value && (
            <div className={classNameResult ? classNameResult : 'formRow'}>
              <div className={classNameLabel ? classNameLabel : 'formRowLabel'}>
                <p>
                  {labelText + ': ' || name + ': '}
                </p>
              </div>
              <div className={classNameLabel ? classNameLabel : 'formRowLabel'}>

                <p>
                  {Array.isArray(value) ? value.join(', ') : value}
                </p>
              </div>
            </div>
          )}

          {name !== 'Piloto' && (
            <div className={className ? className : 'form-row'}>
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
