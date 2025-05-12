import React from 'react';
import Image from 'react-bootstrap/esm/Image';
import { BiCopy } from 'react-icons/bi';

import { Container } from 'src/components/Container';
import Badge from 'src/components/StatusBadge/Badge';

import { convertDate, getCryptoCurrencyLogo, handleCopy, shortenString } from 'src/constants';

const ListItemRenderer = ({ item, field, isModal = false, currencies = [] }) => {
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

  if (field === 'currency') {
    const logo = getCryptoCurrencyLogo(currencies, item[field].toLowerCase());
    return (
      <Container display="flex" alignItems="center" gap="0.5rem">
        {logo && <Image width={24} height={24} src={logo} />}
        <Container>{item[field]}</Container>
      </Container>
    );
  }

  if (
    field === '_id' ||
    field === 'id' ||
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
          <Container onClick={() => handleCopy(item[field])} cursor="pointer">
            <BiCopy />
          </Container>
        )}
      </Container>
    );
  }

  return <span>{item[field] || '-'}</span>;
};

export default ListItemRenderer;
