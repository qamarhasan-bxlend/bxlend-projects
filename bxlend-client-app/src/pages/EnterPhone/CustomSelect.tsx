import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const SelectWrapper = styled.div`
  position: relative;
  width: fit-content;
`;

const SelectedOption = styled.div`
  padding: 0.625rem;
  border: 0.0625rem solid #ccc;
  border-radius: 2.5rem;
  cursor: pointer;
  white-space: nowrap;
  background: #fff;
  color: #111 !important;
`;

const OptionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  border: 0.0625rem solid #ccc;
  border-radius: 0.5rem;
  background: white;
  max-height: 12.5rem;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1);
  background: #fff !important;
`;

const OptionItem = styled.li`
  color: #111 !important;
  padding: 0.625rem;
  cursor: pointer;
  color: #111;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.625rem;
  border: none;
  outline: none;
  box-sizing: border-box;
  font-size: 0.875rem;
`;

const CustomSelect = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedOption, setSelectedOption] = useState(value || options[0]);
  const selectRef = useRef(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange(option);
  };

  useEffect(() => {
    setSelectedOption(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // @ts-expect-error ignore error
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setFilteredOptions(
      options.filter(
        (option) =>
          `+${option.code.toLowerCase()}`.includes(searchTerm.toLowerCase()) ||
          `+${option.phone_code}`.includes(searchTerm),
      ),
    );
  }, [searchTerm, options]);

  return (
    <SelectWrapper ref={selectRef}>
      <SelectedOption onClick={() => setIsOpen(!isOpen)}>
        +{selectedOption.phone_code} {selectedOption.code}
      </SelectedOption>
      {isOpen && (
        <OptionsList>
          <li>
            <SearchInput
              className="isDark"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </li>
          {filteredOptions.length ? (
            filteredOptions.map((option) => (
              <OptionItem key={option.code} onClick={() => handleOptionClick(option)}>
                +{option.phone_code} {option.code}
              </OptionItem>
            ))
          ) : (
            <OptionItem>No code found</OptionItem>
          )}
        </OptionsList>
      )}
    </SelectWrapper>
  );
};

export default CustomSelect;
