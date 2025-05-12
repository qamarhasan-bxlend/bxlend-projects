import React, { FC } from 'react';

interface IListCheckboxItem {
  text: string;
  link: string;
}

const ListCheckboxItem: FC<IListCheckboxItem> = ({ text, link }) => {
  return (
    <li
      style={{
        listStyle: 'none',
        display: 'flex',
        gap: '0.6rem',
        fontSize: '0.8rem',
      }}
    >
      <input type="checkbox" />
      <span>
        {text} <a href="#">{link}</a>
      </span>
    </li>
  );
};

export default ListCheckboxItem;
