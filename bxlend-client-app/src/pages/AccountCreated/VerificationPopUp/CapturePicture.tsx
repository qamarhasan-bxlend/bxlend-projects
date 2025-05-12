import React, { useState, useRef } from 'react';

import { Container } from 'src/components/Container';
import { Button } from 'src/components/Button';

import { StyledWrap } from './styled';

const CapturePicture = ({
  videoRef,
  isVideoStarted,
  uploadedImage,
  setUploadedImage,
  handleStartCamera,
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [file, setFile] = useState<null | File>(null);
  const canvasRef = useRef();

  const canvasWidth = 340.7;
  const canvasHeight = 255.53;

  const handleStopCamera = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleTakePicture = () => {
    const canvas = canvasRef.current;
    // @ts-expect-error TODO: Fix type
    const context = canvas.getContext('2d');
    // @ts-expect-error TODO: Fix type
    canvas.width = canvasWidth;
    // @ts-expect-error TODO: Fix type
    canvas.height = canvasHeight;
    context.drawImage(videoRef.current, 0, 0, canvasWidth, canvasHeight);
    // @ts-expect-error TODO: Fix type
    const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
    // @ts-expect-error TODO: Fix type
    canvas.toBlob((blob) => {
      const file = new File([blob], 'picture.jpeg', { type: 'image/jpeg' });
      setFile(file);
    }, 'image/jpeg');
    setImageSrc(dataUrl);
    handleStopCamera();
  };

  const handleDelete = () => {
    setUploadedImage(null);
    setImageSrc(null);
    handleStartCamera();
  };

  return (
    <>
      {uploadedImage && uploadedImage.name ? (
        <StyledWrap>
          <Container color="#111 !important" fontSize="1rem">
            {uploadedImage.name}
          </Container>
          <Container
            cursor="pointer"
            transform="rotate(45deg)"
            color="red !important"
            fontSize="1.5rem"
            onClick={handleDelete}
          >
            +
          </Container>
        </StyledWrap>
      ) : (
        <Container>
          {imageSrc ? (
            <>
              <Container display="flex" justifyContent="center">
                <img src={imageSrc} alt="Captured image" style={{ height: '15rem' }} />
              </Container>
              <Container display="flex" justifyContent="center" gap="1.25rem" paddingTop="0.6rem">
                <Button
                  text="Retake picture"
                  type="outlined"
                  onClick={() => {
                    setImageSrc(null);
                    setUploadedImage(null);
                    handleStartCamera();
                  }}
                />
                <Button text="Upload Picture" onClick={() => setUploadedImage(file)} />
              </Container>
            </>
          ) : (
            <Container>
              <video ref={videoRef} style={{ width: '100%', height: '15rem' }}></video>
              {/* @ts-expect-error TODO: Fix type */}
              <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
              <Container display="flex" justifyContent="center">
                {isVideoStarted && <Button text="Take Picture" onClick={handleTakePicture} />}
              </Container>
            </Container>
          )}
        </Container>
      )}
    </>
  );
};

export default CapturePicture;
