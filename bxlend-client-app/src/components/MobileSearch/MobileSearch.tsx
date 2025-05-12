import React from 'react';

import { Button } from 'src/components/Button';
import { Container } from '../Container';

export const MobileSearch = ({ setKeyword }) => {
  return (
    <div className="modal fade" id="mobileSearchInput">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <Container color="#111 !important" fontSize="1.25rem">
              Search Coin
            </Container>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <input
              className="form-control"
              placeholder="Search Coin"
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <Button text="Search" data-bs-dismiss="modal" />
          </div>
        </div>
      </div>
    </div>
  );
};
