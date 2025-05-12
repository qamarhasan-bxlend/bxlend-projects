import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Button } from 'src/components/Button';
import { Container } from 'src/components/Container';

import { getSign } from 'src/constants';

const StartToday = ({ user }) => {
  const sign = getSign();

  const { isDark } = useSelector(({ isDark }) => isDark);

  return (
    <Container
      paddingTop="3rem"
      marginTop="5rem"
      width="calc(100% + 6rem)"
      marginLeft="-3rem"
      background={isDark ? 'rgba(255, 255, 255, 0.1)' : '#fafafa'}
    >
      <div className="start-title-style">Start earning today</div>
      <Container padding="1rem 0 4rem" textAlign="center">
        <Link to={user.id ? '/market' : `${sign}&action=signup`} style={{ textDecoration: 'none' }}>
          <Button text="Join Us Now" />
        </Link>
      </Container>
    </Container>
  );
};

export default StartToday;
