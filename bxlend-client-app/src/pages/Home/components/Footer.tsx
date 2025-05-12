import { useSelector } from 'react-redux';

import { ReactComponent as Logo } from 'src/assets/Logo.svg';

import { Container } from 'src/components/Container';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { isDark } = useSelector(({ isDark }) => isDark);

  return (
    <footer className={`footer-style ${isDark ? 'isDark' : ''}`}>
      <div className="d-flex pt-5 pb-5 w-100 justify-content-around">
        <a className="d-none d-md-flex col-md-3 align-items-start" href="#">
          <Container margin="auto">
            <Logo />
          </Container>
        </a>
        <div className="col-md-3 d-flex flex-column">
          <Link to="/about-us" className="footer-content">
            About Us
          </Link>
          <Link to="/terms-of-use" className="link footer-content">
            Terms of Use
          </Link>
          <Link to="/privacy-policy" className="footer-content">
            Privacy Policy
          </Link>
          {/* <Link to="#" className="footer-content">
            Announcement
          </Link> */}
        </div>
        <div className="col-md-3 d-flex flex-column">
          <Link to="/faq" className="footer-content">
            FAQ
          </Link>
          {/* <Link to="#" className="footer-content">
            Submit a Ticket
          </Link> */}
          <a
            href="https://medium.com/@bxlend"
            className="footer-content"
            target="_blank"
            rel="noreferrer"
          >
            Blog
          </a>
        </div>
        <div className="col-md-3 d-flex flex-column">
          <a
            href="https://t.me/bxlend"
            target="_blank"
            rel="noreferrer"
            className="footer-content mt-1"
          >
            Telegram
          </a>
          <a
            href="https://twitter.com/bxlend_"
            target="_blank"
            rel="noreferrer"
            className="footer-content mt-1"
          >
            Twitter
          </a>
          <a href="https://bxlend-1.gitbook.io/bxlend-whitepaper" className="footer-content">
            Our Token
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
