import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Wrapper from '@/styles/FormRowCheckboxMultiple';
import PropTypes from 'prop-types';

const FormRowCheckboxMultiple = ({ labelText, name, value, handleChange, handleChangeSubmit, list, className, classNameLabelResult, classNameLabel, classNameInput, classNameResult }) => {
  const { t } = useTranslation('forms');
  // The raw literals 'Todos' / 'Não encontrado' stay in state: they are the option
  // ids, the select-all sentinel and are compared/submitted. Only labels are translated.
  const translateOption = (option) =>
    option === 'Todos'
      ? t('common.todos')
      : option === 'Não encontrado'
        ? t('common.naoEncontrado')
        : option;
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
      let verifica;
      verifica = handleChange(name, separatedArrayId);
      if(verifica){
      handleChangeSubmit(1);
      return;
    }
  }
   
  }, [selectedOptions, list]);

  const handleCheckboxChange = (option) => {
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

  // `ids` é paralelo a `options` (mesma ordem): guarda o `_id` de cada utilizador e o
  // sentinela 'Todos'. Serve de chave estável, em vez do índice do array.
  const checkboxOptions = options.map((option, index) => {
    const optionId = ids[index];
    return (
      <div key={optionId}>
        <div className='row'>
          <div className='col-9'>
            <label htmlFor={option} style={{ cursor: 'pointer' }}>{translateOption(option)}</label>
          </div>
          <div className='col-3'>
            <input
              style={{ cursor: 'pointer' }}
              type="checkbox"
              id={option}
              name={name}
              value={optionId}
              checked={selectedOptions.includes(option)}
              onChange={() => handleCheckboxChange(option)}
              // onChange={() => handleCheckboxChange(option, optionId)}
            />
          </div>
        </div>
      </div>
    );
  });

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
            <p className="text-end">{t('common.selecionado')}</p>
            </div>
            <div className={classNameResult ? classNameResult : 'form-label'}>
              <p className="text-center">{Array.isArray(separatedArray) ? separatedArray.map(translateOption).join(', ') : translateOption(separatedArray)}</p>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

FormRowCheckboxMultiple.propTypes = {
  labelText :PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.array.isRequired,
    PropTypes.string.isRequired
  ]).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleChangeSubmit: PropTypes.func,
  list: PropTypes.array.isRequired,
  className: PropTypes.string.isRequired,
  classNameLabelResult: PropTypes.string.isRequired,
  classNameLabel: PropTypes.string.isRequired,
  classNameInput: PropTypes.string.isRequired,
  classNameResult: PropTypes.string.isRequired,
}

//PropTypes.oneOfType([
//   PropTypes.bool.isRequired,
//   PropTypes.string.isRequired
// ]).isRequired,

export default FormRowCheckboxMultiple;
