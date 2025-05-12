import React from 'react';

import Text from 'src/components/Text';
import Table from 'src/components/Table';

import { RECENT_ACTIVITY_DATA, RECENT_ACTIVITY_HEADERS } from 'src/utils/constants';

import { StyledWidgetDropdown } from '../Widget/styled';
import { StyledWrap } from '../styled';
import { StyledHeader } from './styled';

const RecentActivity = () => {
  return (
    <StyledWrap>
      <StyledHeader>
        <Text size={26} color="#172A4F" family="Inter-Medium" padding="2vh 0">
          Recent Activity
        </Text>
        <StyledWidgetDropdown>View All</StyledWidgetDropdown>
      </StyledHeader>
        <Table headers={RECENT_ACTIVITY_HEADERS} data={RECENT_ACTIVITY_DATA} columns="2.5fr 1.5fr 1fr .8fr" />
    </StyledWrap>
  );
};

export default RecentActivity;
