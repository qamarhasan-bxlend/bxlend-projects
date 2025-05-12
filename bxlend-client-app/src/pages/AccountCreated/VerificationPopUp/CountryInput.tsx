import React, { useState, useEffect, useRef, FC } from 'react';

import { Input } from 'src/components/Input';

import { ICountry } from 'src/interfaces';

import { StyledDropdown, StyledOption } from './styled';

interface ICountryInput {
  countries: ICountry[];
  query: string;
  // eslint-disable-next-line no-unused-vars
  setQuery: (e: string) => void;
}

const CountryInput: FC<ICountryInput> = ({ countries, query, setQuery }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [matchedCountries, setMatchedCountries] = useState<ICountry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query) {
      const regex = new RegExp(`^${query}`, 'i');
      const matches = countries.filter((country) => regex.test(country.name));
      setMatchedCountries(matches.slice(0, 5));
    } else {
      setMatchedCountries([]);
    }
  }, [query, countries]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsOpen(true);
  };

  const handleOptionClick = (country: ICountry) => {
    setQuery(country.name);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    if (!query) {
      setMatchedCountries([...countries].sort((a, b) => a.name.localeCompare(b.name)));
    }
    setIsOpen(true);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div ref={inputRef} style={{ position: 'relative' }}>
      <Input value={query} onChange={handleInputChange} onFocus={handleInputFocus} />
      {isOpen && matchedCountries.length > 0 && (
        <StyledDropdown>
          {matchedCountries.map((country) => (
            <StyledOption key={country.name} onClick={() => handleOptionClick(country)}>
              {country.name}
            </StyledOption>
          ))}
        </StyledDropdown>
      )}
    </div>
  );
};

export default CountryInput;
