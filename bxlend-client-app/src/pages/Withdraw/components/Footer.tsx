import React from 'react';

const Footer = () => {
  return (
    <div className="d-flex deposit-extra-info my-5 flex-sm-row flex-column">
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
