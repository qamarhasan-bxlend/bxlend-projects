import React from 'react';

import './index.css';

const Footer = () => {
  return (
    <div className="d-flex deposit-extra-info my-5 flex-sm-row flex-column">
      <div className="col-md-6 col-sm-6 col-12 deposit-problem mb-4">
        <div className="d-flex justify-content-between mb-3">
          <div className="h5">Deposit hasn’t arrived?</div>
          <a href="#" className="btn btn-link p-0 deposit-learn-more-btn">
            Learn more
          </a>
        </div>
        <div className="deposit-problem-content">
          <div>
            If you encounter the following problems during the deposit process, you can go to
            Deposit Status Query to search for your current deposit status or retrieve your assets
            via self-service application.
          </div>
          <ul className="ps-3">
            <li>Deposit has not arrived after a long while.</li>
            <li>Didn’t enter MEMO/Tag correctly</li>
            <li>Deposited unlisted coins</li>
          </ul>
        </div>
      </div>
      <div className="col-md-6 col-sm-6 col-12 deposit-faq">
        <div className="h5 mb-3">FAQ</div>
        <ul className="ps-4">
          <li>
            <a href="#" className="btn btn-link deposit-faq-item">
              Video Tutorial
            </a>
          </li>
          <li>
            <a href="#" className="btn btn-link deposit-faq-item">
              How to Deposit Crypto Step-by-step Guide
            </a>
          </li>
          <li>
            <a href="#" className="btn btn-link deposit-faq-item">
              Why has my deposit not been credited yet?
            </a>
          </li>
          <li>
            <a href="#" className="btn btn-link deposit-faq-item">
              How to buy crypto and get started on BxLend
            </a>
          </li>
          <li>
            <a href="#" className="btn btn-link deposit-faq-item">
              Deposit & Withdrawal status query.
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
