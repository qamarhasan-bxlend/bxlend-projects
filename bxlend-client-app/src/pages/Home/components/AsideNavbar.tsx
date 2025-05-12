import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Image from 'react-bootstrap/Image';

import { mobileNavLists } from 'src/constants';

const AsideNavbar = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  return (
    <div className="modal" id="mobile-navbar">
      <div className="modal-dialog">
        <div className="modal-content position-fixed start-0 top-0 mobile-navbar-content">
          <div className="modal-header mobile-navbar-header d-flex justify-content-start align-items-center">
            <Link to="/" onClick={() => navigate('/')} data-bs-dismiss="modal">
              <Image src="./assets/logo.png" width="60%" />
            </Link>
          </div>
          <div className="modal-body p-0">
            {mobileNavLists.map(({ link, title, Icon }, index) => (
              <Link
                to={link}
                key={index}
                className={`mobile-nav-link ${
                  isLoggedIn || title === 'Market' || title === 'Trade' || title === 'Presale'
                    ? 'd-flex'
                    : 'd-none'
                } align-items-center ${index === 0 && 'mt-5'}`}
                onClick={() => navigate(link)}
                data-bs-dismiss="modal"
              >
                <Icon />
                <div className="ms-2">{title}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsideNavbar;
