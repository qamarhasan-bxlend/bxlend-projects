import React, { FC, ReactNode, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/useDispatch';
import { fetchDashboardData } from 'src/store/slice/dashboardCount';

import { Loader } from 'src/components/Loader';
import Text from 'src/components/Text';

import { StyledContainer, StyledWidgetHeader, StyledWidgetDropdown } from './styled';

const Widget: FC<{
  title?: string;
  subtitle?: string;
  hasNegativeMargin?: boolean;
  type?: string;
  count?: number;
  children: ReactNode;
}> = ({ title, subtitle, hasNegativeMargin, type, count, children }) => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector(({ dashboardCount }) => dashboardCount);

  const getCount = () => {
    if (type === 'bank-accounts') {
      return data.bankAccounts
    }

    return data[type as string]
  }

  useEffect(() => {
    if (type && typeof data[type === 'bank-accounts' ? 'bankAccounts' : type] !== 'number') {
      dispatch(fetchDashboardData(type));
    }
  }, [dispatch, type]);

  return (
    <>
      <StyledContainer hasNegativeMargin={hasNegativeMargin} alignItems={loading}>
        {loading ? (
          <Loader />
        ) : (
          <>
            <StyledWidgetHeader hasTitle={!!title}>
              {title && (
                <Text size={18} color="#1B224A" family="Inter-Medium">
                  {title}
                </Text>
              )}
              {/* TODO: CREATE WIDGETDROPDOWN COMPONENT */}
              <StyledWidgetDropdown>Monthly</StyledWidgetDropdown>
            </StyledWidgetHeader>
            {subtitle && (
              <Text size={14} color="#1B224A" padding="5% 0 0 5%" family="Lexend-Regular">
                {`You have total ${count ?? getCount()} ${type || ''}`}
              </Text>
            )}
            {children}
          </>
        )}
      </StyledContainer>
    </>
  );
};

export default Widget;
