import { Link } from 'react-router-dom';
import { ChevronDown } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import Image from 'react-bootstrap/Image';
import { styled } from 'styled-components';

import { Button } from 'src/components/Button';
import { Container } from 'src/components/Container';

import { RootState } from 'src/store/store';
import { getSign } from 'src/constants';

const SlideInContainer = styled.div`
  opacity: 0;
  transform: translateX(-300px);
  animation: slideIn 0.8s ease-out forwards;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-300px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const Main = () => {
  const sign = getSign();
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <div className="justify-content-between" style={{ display: 'flex' }}>
      <div className="jumbotron-title col-lg-6 col-sm-12">
        <SlideInContainer>
          <div className="main-letter">Buy and exchange cryptocurrency with trust</div>
          <div className="d-flex button-position">
            <Link
              to={user.id ? '/market' : `${sign}&action=signup`}
              style={{ textDecoration: 'none' }}
            >
              <Container margin="0 1.25rem 1rem">
                <Button text="Get Started" $isPulsing />
              </Container>
            </Link>
            <a href={'/#portfolio'} style={{ textDecoration: 'none' }}>
              <Button text="How it works?" type="outlined" />
            </a>
          </div>
        </SlideInContainer>
      </div>

      <div className="main-picture col-lg-5 col-sm-12">
        <Image src="./assets/jumbotron-cropped-img.png" width="72%" className="d-block d-lg-none" />
        <Container display="flex" justifyContent="flex-end">
          <Image
            src="./assets/jumbotron-img-cropped.png"
            width="60%"
            className="d-none d-lg-block"
          />
        </Container>
      </div>

      <div
        className="scroll-down-btn d-flex d-lg-none justify-content-center mb-5"
        style={{
          position: 'fixed',
          right: 0,
          visibility: 'hidden',
        }}
      >
        <ChevronDown width="1.25rem" height="1.25rem" />
      </div>
    </div>
  );
};

export default Main;
