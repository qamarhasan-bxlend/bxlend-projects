import React from 'react';

import { Container } from 'src/components/Container';
import { Modal } from 'src/components/Modal';
import { AlertCopy } from './AlertCopy';
import ListItemRenderer from './ListItemRenderer';

import { formatFieldString } from 'src/constants';

interface ItemDetailsModalProps {
  item: { [key: string]: any };
  title?: string;
  currencies?: any;
  children?: React.ReactNode;
  onClose: () => void;
}

const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  item,
  title,
  currencies,
  children,
  onClose,
}) => {
  const renderField = (key: string, value: any, parentKey = '') => {
    const fieldKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === 'string' || typeof value === 'number') {
      return (
        <Container
          key={fieldKey}
          paddingBottom="0.5rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Container fontWeight={500}>{formatFieldString(fieldKey)}</Container>
          <ListItemRenderer item={item} field={fieldKey} currencies={currencies} isModal />
        </Container>
      );
    }

    return null;
  };

  return (
    <Modal isOpen onClose={onClose}>
      {title && (
        <Container textAlign="center" fontWeight={600} fontSize="1.5rem">
          {title}
        </Container>
      )}
      {children}
      <Container display="flex" flexDirection="column" gap="0.5rem" marginTop="1rem">
        {Object.entries(item).map(([key, value]) => renderField(key, value))}
      </Container>
      <AlertCopy />
    </Modal>
  );
};

export default ItemDetailsModal;
