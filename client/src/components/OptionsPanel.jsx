import { useEffect, useState } from 'react';
import { IoAddOutline } from 'react-icons/io5'
import PropTypes from 'prop-types'; 

function OptionsPanel({ options, handleTipoTrabalho}) {

   const [inputValue, setInputValue] = useState('');
   const [filteredOptions, setFilteredOptions] = useState([]);
   const [isDropdownOpen, setDropdownOpen] = useState(false);


   const handleSelectOption = (option) => {
    handleTipoTrabalho(option);
    setInputValue("");
    setDropdownOpen(false)
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
      setDropdownOpen(true)
      setInputValue(e.target.value);
    };

  
    return (
      <div className="row mb-3 text-center" key={"Other"}>
      <div className="col-md-12 text-center themed-grid-col">
        <input
          id="autocomplete"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Outro..."
          autoComplete="off"
        />
        <button
          type="submit"
          onClick={() => { handleSelectOption(inputValue) }}>
            <IoAddOutline /> 
        </button>
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