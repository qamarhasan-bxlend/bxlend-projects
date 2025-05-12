import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BiSupport } from 'react-icons/bi';
import { FaQuestionCircle } from 'react-icons/fa';
import { LuMessageSquare } from 'react-icons/lu';
import { styled } from 'styled-components';

import { Container } from 'src/components/Container';
import { FadeInSection } from 'src/components/FadeInSection';
import { Glass } from 'src/components/Glass';

import { ROUTE_FAQ } from 'src/routes';

const Box = styled.div`
  transition: 0.25s all;

  &:hover {
    transform: scale(1.04);
  }
`;

const HelpSection = () => {
  const { isDark } = useSelector(({ isDark }) => isDark);

  const iconColor = isDark ? '#fff' : '#172a4f';

  return (
    <FadeInSection $offsetY={100}>
      <div className="mt-5 pt-5">
        <Container fontSize="2.2rem" paddingBottom="3rem">
          Need Help?
        </Container>
        <div className="d-flex justify-content-around help-content-align gap-5">
          <Box>
            <a style={{ textDecoration: 'none' }} href="mailto:customercare@bxlend.com">
              <Glass padding="1rem 5.75rem">
                <div className="d-flex align-items-center flex-column">
                  <BiSupport fill={iconColor} size="3rem" />
                  <Container fontSize="1rem" paddingTop="0.6rem">
                    Chat support
                  </Container>
                </div>
              </Glass>
            </a>
          </Box>
          <Box>
            <Link style={{ textDecoration: 'none' }} to={ROUTE_FAQ}>
              <Glass padding="1rem 7.25rem">
                <div className="d-flex align-items-center flex-column">
                  <FaQuestionCircle fill={iconColor} size="3rem" />
                  <Container fontSize="1rem" paddingTop="0.6rem">
                    FAQ
                  </Container>
                </div>
              </Glass>
            </Link>
          </Box>
          <Box>
            <a style={{ textDecoration: 'none' }} href="https://medium.com/@bxlend">
              <Glass padding="1rem 7.25rem">
                <div className="d-flex align-items-center flex-column">
                  <LuMessageSquare stroke={iconColor} size="3rem" />
                  <Container fontSize="1rem" paddingTop="0.6rem">
                    Blog
                  </Container>
                </div>
              </Glass>
            </a>
          </Box>
        </div>
      </div>
    </FadeInSection>
  );
};

export default HelpSection;
