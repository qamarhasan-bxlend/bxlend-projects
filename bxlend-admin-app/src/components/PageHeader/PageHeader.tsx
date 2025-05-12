import React, { FC, ReactNode } from 'react';

import { Container } from '../Container';
import Search from '../Search';

import { StyledHeader } from './styled';

const PageHeader: FC<{
  title: string;
  subtitle?: string;
  dropdownTitle?: string;
  dropDownItems?: string[];
  hideSearch?: boolean;
  children?: ReactNode;
  entity?: string;
  fetchEntity?: any;
  updateEntityField?: any;
  updateEntitySearch?: any;
}> = ({
  title,
  subtitle,
  dropdownTitle,
  dropDownItems,
  hideSearch,
  children,
  entity,
  fetchEntity,
  updateEntityField,
  updateEntitySearch,
}) => {
  return (
    <>
      <StyledHeader>
        <Container fontSize="1.5rem" fontWeight={600} paddingBottom="1rem">
          {title}
        </Container>
        {!hideSearch && (
          <Search
            title={dropdownTitle ?? title}
            dropDownItems={dropDownItems}
            entity={entity as string}
            fetchEntity={fetchEntity}
            updateEntityField={updateEntityField}
            updateEntitySearch={updateEntitySearch}
          />
        )}
      </StyledHeader>
      {subtitle ? (
        <Container fontSize="1rem" paddingBottom="2rem">
          {subtitle}
        </Container>
      ) : (
        children
      )}
    </>
  );
};

export default PageHeader;
