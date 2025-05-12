import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from 'src/store/store';

import { Button } from 'src/components/Button';
import { Container } from 'src/components/Container';
import { Glass } from 'src/components/Glass';
import { FadeInSection } from 'src/components/FadeInSection';
import PortfolioItem from './PortfolioItem';

import { getSign } from 'src/constants';

const Portfolio = () => {
  const sign = getSign();

  const { user } = useSelector((state: RootState) => state.user);

  return (
    <div className="mt-5 pt-5" id="portfolio">
      <FadeInSection>
        <Container fontSize="2.2rem" textAlign="center">
          Build your own crypto portfolio
        </Container>
        <div className="portfolio-subtitle ms-4 text-center pb-5">
          Start your first trade with these easy steps
        </div>
      </FadeInSection>
      <FadeInSection>
        <div className="row">
          <div className="col-12 col-sm-9 col-md-6 col-lg-6">
            <Glass padding="1rem 1.5rem" margin="0 0 1rem">
              <PortfolioItem
                id={1}
                title="Verify your identity"
                content="Complete the identity verification process to secure your account and transactions"
                url="./assets/portfolio-1.png"
              />
            </Glass>
          </div>
        </div>
      </FadeInSection>
      <FadeInSection>
        <div className="row">
          <div className="col-12 col-sm-9 col-md-6 col-lg-6 mx-auto">
            <Glass padding="1rem 1.5rem" margin="0 0 1rem">
              <PortfolioItem
                id={2}
                title="Fund your account"
                content="Add funds to your crypto account to start trading crypto. You can add funds with a variety of payment methods"
                url="./assets/portfolio-2.png"
              />
            </Glass>
          </div>
        </div>
      </FadeInSection>
      <FadeInSection>
        <div className="row">
          <div className="col-12 col-sm-9 col-md-6 col-lg-6 ms-auto">
            <Glass padding="1rem 1.5rem" margin="0 0 1rem">
              <PortfolioItem
                id={3}
                title="Start trading"
                content="You’re good to go! Buy/sell crypto, set up your account and discover what BxLend has to offer"
                url="./assets/portfolio-3.png"
              />
            </Glass>
          </div>
        </div>
      </FadeInSection>
      <div className="get-started-btn mt-5 pt-5 d-flex justify-content-center">
        <Link to={user.id ? '/market' : `${sign}&action=signup`} style={{ textDecoration: 'none' }}>
          <Button text="Get Started" $isPulsing />
        </Link>
      </div>
    </div>
  );
};

export default Portfolio;
