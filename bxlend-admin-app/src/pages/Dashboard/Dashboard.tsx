import React from 'react';

import { ReactComponent as HighlightedMetrics } from 'src/assets/images/HighlightedMetrics.svg';

import Text from 'src/components/Text';
import WidgetsSection from './WidgetsSection';
import RecentActivity from './RecentActivity';
import Prices from './Prices';
import WidgetHighlighted from './WidgetHighlighted';
import Widget from './Widget';

import { StyledContainer, StyledWidgetHighlightedWrap } from './styled';

const Dashboard = () => {
  return (
    <>
      <Text size={30} color="#172A4F" family="Inter-Medium" padding="0 0 4vh" weight={600}>
        Welcome to your dashboard!
      </Text>
      <br />
      <Text size={20} color="#172A4F" family="Inter-Medium" padding="0 0 2vh 2vw" weight={600}>
        Overview
      </Text>
      <StyledWidgetHighlightedWrap>
        <WidgetHighlighted />
        <Widget hasNegativeMargin>
          <HighlightedMetrics />
        </Widget>
      </StyledWidgetHighlightedWrap>
      <WidgetsSection />
      <StyledContainer>
        <RecentActivity />
        <Prices />
      </StyledContainer>
    </>
  );
};

export default Dashboard;
