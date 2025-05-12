import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/useDispatch';
import { fetchWithdrawCount } from 'src/store/slice/withdrawCount';
import { fetchDepositCount } from 'src/store/slice/depositCount';

import Widget from '../Widget';

import { WIDGETS } from 'src/utils/constants';

import { StyledSVGWrap, StyledWidgetsWrap, StyledWrap } from '../styled';

const WidgetsSection = () => {
  const dispatch = useDispatch();
  const { withdrawCount } = useSelector(({ withdrawCount }) => withdrawCount);
  const { depositCount } = useSelector(({ depositCount }) => depositCount);

  useEffect(() => {
    if (withdrawCount === null) {
      dispatch(fetchWithdrawCount());
    }

    if (depositCount === null) {
      dispatch(fetchDepositCount());
    }
  }, []);

  return (
    <>
      <StyledWidgetsWrap>
        <StyledWrap>
          <Widget
            title="Deposits"
            subtitle={`You have total ${depositCount === null ? 0 : depositCount} deposits this month`}
            count={depositCount === null ? 0 : depositCount}
            // TODO: Uncomment when /deposit and /withdraw endpoints are fixed.
            // type="deposits this month"
          >
            <ul className="widget_list">
              <li>9 withdrawal requests pending</li>
              <li>48 Deposits succesful</li>
            </ul>
          </Widget>
          <Widget
            title="Withdrawals"
            subtitle={`You have total ${withdrawCount === null ? 0 : withdrawCount} withdraws this week`}
            count={withdrawCount === null ? 0 : withdrawCount}
            // TODO: Uncomment when /deposit and /withdraw endpoints are fixed.
            // type="withdraws this week"
          >
            <ul className="widget_list">
              <li>9 withdrawal requests pending</li>
              <li>48 successful withdraws</li>
            </ul>
          </Widget>
        </StyledWrap>
        {WIDGETS.map(({ title, subtitle, img: Img, type, id }) => (
          <Widget key={id} title={title} subtitle={subtitle} type={type}>
            <StyledSVGWrap>
              <Img />
            </StyledSVGWrap>
          </Widget>
        ))}
      </StyledWidgetsWrap>
    </>
  );
};

export default WidgetsSection;
