import React, { ChangeEvent, FC } from 'react';
import { Button } from 'src/components/Button';
import { StyledUploadInput, StyledWrap, StyledClosebtn } from './styled';
import { Container } from 'src/components/Container';

interface UploadFileProps {
  file?: File | null;
  // eslint-disable-next-line no-unused-vars
  setFile: (file: File | null) => void;
  text?: string;
  isPlus?: boolean;
}

const UploadFile: FC<UploadFileProps> = ({ text = 'File', isPlus, file, setFile }) => {
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
    }
  };

  const handleDelete = () => {
    setFile(null);
    const input = document.getElementById(`upload-input-${text}`) as HTMLInputElement;
    if (input) input.value = '';
  };

  return (
    <>
      {file ? (
        <StyledWrap>
          <Container color="#172A4F !important">{file.name}</Container>
          <StyledClosebtn onClick={handleDelete} aria-label="Remove file">
            +
          </StyledClosebtn>
        </StyledWrap>
      ) : (
        <>
          <Button
            text={isPlus ? '+' : `Upload ${text} Side`}
            $fullWidth
            onClick={() => document.getElementById(`upload-input-${text}`)?.click()}
          />
          <StyledUploadInput
            id={`upload-input-${text}`}
            type="file"
            onChange={handleUpload}
            accept="image/*"
          />
        </>
      )}
    </>
  );
};

export default UploadFile;
