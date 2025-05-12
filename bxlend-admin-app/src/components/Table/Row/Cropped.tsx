import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ReactComponent as CopyIcon } from 'src/assets/images/Copy.svg';
import { StyledCopyButton } from '../styled';

const Cropped = ({ value }: { value: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  return (
    <span
      style={{ position: 'relative' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {value.length > 12 ? (
        <>
          {`${value.substring(0, 3)}...${value.substring(value.length - 3)}`}
          {isHovered && (
            <CopyToClipboard text={value} onCopy={() => {
              setIsCopied(true);
              setTimeout(() => {
                setIsCopied(false);
              }, 1000)
            }}>
              <StyledCopyButton>
                {isCopied ? 'Copied!' : <CopyIcon />}
              </StyledCopyButton>
            </CopyToClipboard>
          )}
        </>
      ) : (
        value
      )}
    </span>
  );
};

export default Cropped;
