import React from 'react';

import '../index.css';

export type ToggleSwitchProps = {
  activeButton: string;
  loading: boolean;
  setActiveButton: React.Dispatch<React.SetStateAction<string>>;
};
const ToggleSwitch = ({ activeButton, loading, setActiveButton }: ToggleSwitchProps) => {
  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
  };
  return (
    <div className="w-100 trade-spot-toggle-btn">
      <button
        className={`w-50 btn first-btn ${activeButton === 'buy' ? 'active' : ''}`}
        id={activeButton ? 'activeButton' : undefined}
        disabled={loading}
        onClick={() => handleButtonClick('buy')}
      >
        Buy
      </button>
      <button
        className={`w-50 btn second-btn ${activeButton === 'sell' ? 'active' : ''}`}
        id={activeButton ? 'activeButton' : undefined}
        disabled={loading}
        onClick={() => handleButtonClick('sell')}
      >
        Sell
      </button>
    </div>
  );
};
export default ToggleSwitch;
