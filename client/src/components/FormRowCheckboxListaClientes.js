import { useState, useEffect } from 'react';
import Wrapper from '../assets/wrappers/FormRowCheckboxMultiple';

const FormRowCheckboxListaClientes = ({ labelText, name, value, handleChange, list, className, classNameLabelResult, classNameLabel, classNameInput, classNameResult }) => {
  // Define state for selected checkboxes
  const [selectedOption, setSelectedOption] = useState(value);
  // State for the new option input field
  const [newOption, setNewOption] = useState('');

  // Handle adding new option
  const handleAddNewOption = () => {
    if (newOption.trim() !== '') {
      setSelectedOption(newOption.trim());
      setNewOption('');
    }
  };

  // useEffect to handle updating the parent component when the checkboxes change
  useEffect(() => {
    handleChange(name, selectedOption);
  }, [selectedOption]);

  // Handle checkbox change
  const handleCheckboxChange = (option) => {
    setSelectedOption(option === selectedOption ? '' : option);
  };

  let checkboxOptions;
  // Render the checkbox options based on the 'list' prop
  if (list && Array.isArray(list.clientes)) {
    checkboxOptions = list.clientes.map((option, index) => (
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
              onChange={() => handleCheckboxChange(option)}
              checked={option === selectedOption}
            />
          </div>
        </div>
      </div>
    ));
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
            <div className="row">
              <div className="col-9">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                />
              </div>
              <div className="col-3">
                <button type='button' onClick={handleAddNewOption}>+</button>
              </div>
            </div>
            {checkboxOptions}
          </div>
        </div>
        
        {value && (
          <div className={'row text-end'}>
            <div className={classNameLabelResult ? classNameLabelResult : 'form-label text-end'}>
              <p className="text-end">{'Selecionado: ' || name + ': '}</p>
            </div>
            <div className={classNameResult ? classNameResult : 'form-label'}>
              <p className="text-center">{selectedOption}</p>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default FormRowCheckboxListaClientes;
