import { useState, useEffect } from 'react';
import Wrapper from '../assets/wrappers/FormRowSelect';

const FormRowCheckboxMultiple = ({ labelText, name, value, handleChange,handleChangeSubmit, list, className, classNameLabel, classNameInput, classNameResult }) => {

    const [separatedArray, setSeparatedArray] = useState(Array.isArray(value) ? (value.length > 0 ? value[0].split(/[,\/]/) : []) : value.split(/[,\/]/));
    const [selectedOption, setSelectedOption] = useState(Array.isArray(separatedArray) ? separatedArray : (value ? value.split(',') : []));

useEffect(() => {
    const updatedSeparatedArray = Array.isArray(value) ? (value.length > 0 ? value[0].split(/[,\/]/) : []) : value.split(/[,\/]/);
    const newSeparatedArray = [...updatedSeparatedArray];

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
          newSeparatedArray[a] = list[i]._id;
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

    if (nome && JSON.stringify(updatedSeparatedArray) !== JSON.stringify(newSeparatedArray)) {
      let verifica = false;
      verifica = handleChange(name, newSeparatedArray);
      if(verifica){
      handleChangeSubmit(1);
    }
    }
    setSeparatedArray(updatedSeparatedArray);
}, [value, list]);

    

      useEffect(() => {
        setSelectedOption(Array.isArray(separatedArray) ? separatedArray : (value ? value.split(',') : []));
    }, [separatedArray]);





    const handleCheckboxChange = (option , id) => {
        let selectedOptions = option;
        let selectedID = id;
        let previousOptions = selectedOption.filter((option) => !selectedOptions.includes(option));
        let updatedOptionsID;
        let updatedOptions;
        let op;

        if (selectedOptions.includes('Todos')) {
            // If "Todos" is selected, unselect all other options
            updatedOptions = ['Todos'];
            setSelectedOption(updatedOptions);
            op = updatedOptions;
        } else {
            // If any other value is selected, unselect "Todos"
            previousOptions = previousOptions.filter(option => option !== 'Todos');

            updatedOptions = [...previousOptions, selectedOptions];
            updatedOptionsID = [...previousOptions, selectedID];
            setSelectedOption(updatedOptions);

            if (updatedOptions.length > 1) {
                setSelectedOption(updatedOptions.length === selectedOption.length ? previousOptions : updatedOptionsID);
                //op = updatedOptions.length === selectedOption.length ? previousOptions : updatedOptions;
                op = updatedOptions.length === selectedOption.length ? previousOptions : updatedOptionsID;
            } else {
                setSelectedOption(updatedOptionsID);
                op = updatedOptionsID;
            }
        }
        if (updatedOptions[0] === null || updatedOptions[0] === '') {
            updatedOptions.shift();
        }
        handleChange(name, op);
    };

    let checkboxOptions;
    if (name === 'Piloto') {
        
        const options = ['Todos', ...list.map(itemValue => itemValue.nome)];
        const ids = ['Todos', ...list.map(itemValue => itemValue._id)]
      checkboxOptions = options.map((option, index) => {

        if (option === name) {
          return (
            <p key={index}></p>
          );
        }
      
        
        return (
          <div key={index}>
            <div className='row'>
              <div className='col-6'>
                <label htmlFor={option}>{option}</label>
              </div>
              <div className='col-3'>
                <input
                  type="checkbox"
                  id={option}
                  name={name}
                  value={ids[index]}
                  checked={selectedOption.includes(option)}
                  onChange={() => handleCheckboxChange(option , ids[index])}
                />
              </div>
            </div>
          </div>
        );
      });
      
    }
    
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
                    {value && (
                        <div className={className ? className : 'row mb-3 text-center'}>
                            <div className={classNameLabel ? classNameLabel : 'form-label'}>
                                <p>{'Selecionado: ' || name + ': '}</p>
                            </div>
                            <div className={classNameResult ? classNameResult : 'form-label'}>
                                <p>{Array.isArray(separatedArray) ? separatedArray.join(', ') : separatedArray}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Wrapper>
    );
};

export default FormRowCheckboxMultiple;
