import React, { FC } from 'react';
import { Search } from 'react-bootstrap-icons';

import { Input } from '../Input/Input';

import './style.css';

export type ISearchBox = {
  placeHolder?: string;
  keyword?: string;
  setKeyword?: React.Dispatch<React.SetStateAction<string>>;
};

const SearchBox: FC<ISearchBox> = ({ placeHolder, keyword = '', setKeyword }) => {
  return (
    <div className="input-group border-0 search-box">
      <Input
        type="search"
        value={keyword}
        placeholder={placeHolder}
        onChange={(e) => setKeyword && setKeyword(e.target.value.toString())}
      />
      <div className="input-group-prepend border-0 d-block d-sm-none">
        <button id="button-addon4" type="button" className="btn btn-link text-info">
          <Search />
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
