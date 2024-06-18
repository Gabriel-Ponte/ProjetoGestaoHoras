import { useState, useEffect } from 'react';
import Wrapper from '../assets/wrappers/FormRowCheckboxMultiple';

const FormRowCheckboxMultiple = ({ labelText, name, value, handleChange, handleChangeSubmit, list, className, classNameLabelResult, classNameLabel, classNameInput, classNameResult }) => {
  // eslint-disable-next-line no-useless-escape
  const [controlArray] = useState(Array.isArray(value) ? (value.length > 0 ? value[0].split(/[,\/]/) : []) : value.split(/[,\/]/));
  const [selectedOptions, setSelectedOptions] = useState([]);

  // eslint-disable-next-line no-useless-escape
  const [separatedArray, setSeparatedArray] = useState(Array.isArray(value) ? (value.length > 0 ? value[0].split(/[,\/]/) : []) : value.split(/[,\/]/));
  //const [selectedIDs, setSelectedIDs] = useState([]);
 
  useEffect(() => {
    const updatedSeparatedArray = Array.isArray(value) ? (value.length > 0 ? value[0].split(/[,/]/) : []) : value.split(/[,/]/);
    const separatedArrayId = [...updatedSeparatedArray];

    //let nome = false;
    for (let a = 0; a < updatedSeparatedArray.length; a++) {
      let matchFound = false;
      for (let i = 0; i < list.length; i++) {
        if (updatedSeparatedArray[a] === list[i]._id) {
          updatedSeparatedArray[a] = list[i].nome;
          matchFound = true;
          break;
        }
        if (updatedSeparatedArray[a] === list[i].nome || updatedSeparatedArray[a] === list[i].login) {
          updatedSeparatedArray[a] = list[i].nome;
          separatedArrayId[a] = list[i]._id;
          matchFound = true;
          //nome = true;
          break;
        }
      }
      if (!matchFound) {
        if (updatedSeparatedArray[a].length > 5) {
          updatedSeparatedArray[a] = "Não encontrado";
        }
      }
    }
    setSelectedOptions(updatedSeparatedArray);
     
  }, [value, list]);

  useEffect(() => {
    // eslint-disable-next-line no-useless-escape
    const updatedSeparatedArray = Array.isArray(value) ? (value.length > 0 ? value[0].split(/[,\/]/) : []) : value.split(/[,\/]/);
    const separatedArrayId = [...updatedSeparatedArray];

    let nome = false;
    for (let a = 0; a < updatedSeparatedArray.length; a++) {
      let matchFound = false;
      for (let i = 0; i < list.length; i++) {
        if (updatedSeparatedArray[a] === list[i]._id) {
          updatedSeparatedArray[a] = list[i].nome;
          matchFound = true;
          break;
        }
        if (updatedSeparatedArray[a] === list[i].nome || updatedSeparatedArray[a] === list[i].login) {
          updatedSeparatedArray[a] = list[i].nome;
          separatedArrayId[a] = list[i]._id;
          matchFound = true;
          nome = true;
          break;
        }
      }
      if (!matchFound) {
        if (updatedSeparatedArray[a].length > 5) {
          updatedSeparatedArray[a] = "Não encontrado";
        }
      }
    }
    
    setSeparatedArray(updatedSeparatedArray);

    if (nome && JSON.stringify(controlArray) !== JSON.stringify(separatedArrayId)) {
      let verifica = false;
      verifica = handleChange(name, separatedArrayId);
      if(verifica){
      handleChangeSubmit(1);
      return;
    }
  }
   
  }, [selectedOptions, list]);

  const handleCheckboxChange = (option, id) => {
    let updatedOptions;
    let updatedIDs;
    
    if (option === 'Todos') {

      // If "Todos" is selected, select all other options
      updatedOptions = ['Todos'];
      updatedIDs = ['Todos'];
    } else {
      // If any other value is selected, unselect "Todos" and update the selected options
      updatedOptions = selectedOptions.includes(option)
        ? selectedOptions.filter((item) => item !== option && item !== 'Todos')
        : [...selectedOptions.filter((item) => item !== 'Todos'), option];

      updatedIDs = updatedOptions.map((option) => {
        const matchingItem = list.find((item) => item.nome === option);
        return matchingItem ? matchingItem._id : option;
      });
    }
    setSelectedOptions(updatedOptions);
    handleChange(name, updatedIDs);
  };

  const options = ['Todos', ...list.map((item) => item.nome)];
  const ids = ['Todos', ...list.map((item) => item._id)];

  const checkboxOptions = options.map((option, index) => (
    <div key={index}>
      <div className='row'>
        <div className='col-9'>
          <label htmlFor={option} style={{ cursor: 'pointer' }}>{option}</label>
        </div>
        <div className='col-3'>
          <input
            style={{ cursor: 'pointer' }}
            type="checkbox"
            id={option}
            name={name}
            value={ids[index]}
            checked={selectedOptions.includes(option)}
            onChange={() => handleCheckboxChange(option, ids[index])}
          />
        </div>
      </div>
    </div>
  ));

  return (
    <Wrapper>
      <div className={className ? className : 'form-row'}>
        {classNameLabel !== null ? (
          <div className={classNameLabel ? classNameLabel : 'form-label'}>{labelText || name}</div>
        ) : (
          <label htmlFor={name} className="form-label">
            {labelText || name}
          </label>
        )}
        <div className={classNameInput ? classNameInput : 'form-row'}>
          <div>
            {checkboxOptions}
          </div>
        </div>
        {value && (
          <div className={'row text-end'}>
            <div className={classNameLabelResult ? classNameLabelResult : 'form-label text-end'}>
              <p className="text-end">{'Selecionado: ' || name + ': '}</p>
            </div>
            <div className={classNameResult ? classNameResult : 'form-label'}>
              <p className="text-center">{Array.isArray(separatedArray) ? separatedArray.join(', ') : separatedArray}</p>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default FormRowCheckboxMultiple;
