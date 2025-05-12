import React from 'react';
import { BiCopy } from 'react-icons/bi';

import { Container } from 'src/components/Container';
import Badge from 'src/components/Table/Row/Badge';

import { convertDate, shortenString, handleCopy } from 'src/components/Table/helpers';

interface IListItemRenderer {
  item: any;
  field: string;
  isModal?: boolean;
}

const ListItemRenderer: React.FC<IListItemRenderer> = ({ item, field, isModal = false }) => {
  if (field === 'created_at' || field === 'updated_at' || field === 'birthdate') {
    return (
      <Container display={isModal ? 'flex' : 'block'} gap="0.5rem">
        <Container>{convertDate(item[field]).date}</Container>
        <Container>{convertDate(item[field]).time}</Container>
      </Container>
    );
  }

  if (field === 'status' || field === 'kyc_status') {
    return <Badge value={item[field]} />;
  }

  if (field === 'photo_url' || field === 'front' || field === 'back') {
    return <img src={item[field]} style={{ maxWidth: '20rem' }} />;
  }

  if (
    field === '_id' ||
    field === 'id' ||
    field === 'kyc_id' ||
    field === 'user_id' ||
    field === 'email' ||
    field === 'recipient_address' ||
    field === 'from' ||
    field === 'owner' ||
    field === 'crypto_api_transaction_request_id' ||
    field === 'presale_user_id' ||
    field === 'order_number' ||
    field === 'deposit_address'
  ) {
    return (
      <Container display="flex" alignItems="center" gap="0.5rem">
        <Container>{shortenString(item[field])}</Container>
        {isModal && (
          <Container onClick={() => handleCopy(item[field])} height="16px" cursor="pointer" alignSelf="center">
            <BiCopy height={20} width={20} />
          </Container>
        )}
      </Container>
    );
  }

  return <span>{item[field] ?? '-'}</span>;
};

export default ListItemRenderer;
