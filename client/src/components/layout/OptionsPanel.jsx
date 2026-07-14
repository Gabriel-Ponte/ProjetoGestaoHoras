import { useEffect, useState } from 'react';
import { IoAddOutline } from 'react-icons/io5'
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { AppInput, AppButton } from '@/components/ui';

function OptionsPanel({ options, handleTipoTrabalho}) {

   const { t } = useTranslation('layout');
   const [inputValue, setInputValue] = useState('');
   const [filteredOptions, setFilteredOptions] = useState([]);
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);


   const handleSelectOption = (option) => {
    handleTipoTrabalho(option);
    setInputValue("");
    setIsDropdownOpen(false)
  };


    useEffect(() => {
      // Filter the options when inputValue changes
      if (inputValue) {
        const filteredOptionsSet = options
          .filter((option) => option.toLowerCase().includes(inputValue.toLowerCase()));
          setFilteredOptions(filteredOptionsSet);
        // Handle the filteredOptions, trigger a state update, or any other necessary action here
      }
    }, [inputValue, options]);

    const handleInputChange = (e) => {
      setIsDropdownOpen(true)
      setInputValue(e.target.value);
    };

  
    return (
      <div className="row mb-3 text-center" key={"Other"}>
      <div className="col-md-12 text-center themed-grid-col">
        <AppInput
          id="autocomplete"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={t('optionsPanel.otherPlaceholder')}
          autoComplete="off"
        />
        <AppButton
          type="submit"
          variant="primary"
          size="sm"
          onClick={() => { handleSelectOption(inputValue) }}
          aria-label={t('optionsPanel.add')}
          title={t('optionsPanel.add')}
        >
          <IoAddOutline />
        </AppButton>
      </div>
      {isDropdownOpen &&
      <div className="options-panel">
        {/* Render the options here */}
        {filteredOptions.map((option, index) => (
          <div
            key={index}
            onClick={() => handleSelectOption(option)}
            className="option"
          >
            {option}
          </div>
        ))}
      </div>
    }
    </div>


    );
  }


  OptionsPanel.propTypes = {
    options: PropTypes.array, 
    handleTipoTrabalho: PropTypes.func.isRequired,
  }

  export default OptionsPanel;