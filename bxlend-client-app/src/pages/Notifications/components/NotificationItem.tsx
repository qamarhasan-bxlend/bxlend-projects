import React, { useState, FC } from 'react';
import { IoMailOpen } from 'react-icons/io5';
import { IoMdMail } from 'react-icons/io';
import styled from 'styled-components';

import { Container } from 'src/components/Container';
import { Loader } from 'src/components/Loader';

import { useDispatch } from 'src/store/useDispatch';
import { fetchNotificationsCount } from 'src/store/slice/notificationsCount';

import request from 'src/request';
import { PUBLIC_URL } from 'src/configs';

interface IItemProps {
  message: string;
  createdAt: string;
  read: boolean;
  id: string;
}

const StyledWrap = styled.div<{ $isRead: boolean }>`
  background-color: ${({ $isRead }) => ($isRead ? '#f9f9f9' : '#fff')};
  border: 1px solid ${({ $isRead }) => ($isRead ? '#e0e0e0' : '#ccc')};
  border-radius: 0.5rem;
  box-shadow: ${({ $isRead }) => ($isRead ? 'none' : '0px 4px 8px rgba(0, 0, 0, 0.05)')};

  cursor: ${({ $isRead }) => ($isRead ? 'default' : 'pointer')};
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.6rem auto;
  padding: 1rem 1.25rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ $isRead }) => ($isRead ? '#f5f5f5' : '#f0f8ff')};
    box-shadow: 0px 6px 0.75rem rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.08);
  }
`;

const getRelativeTime = (createdAt: string): string => {
  const currentTime = new Date();
  const createdTime = new Date(createdAt);
  const timeDifference = currentTime.getTime() - createdTime.getTime();
  const secondsDifference = Math.floor(timeDifference / 1000);
  const minutesDifference = Math.floor(secondsDifference / 60);
  const hoursDifference = Math.floor(minutesDifference / 60);
  const daysDifference = Math.floor(hoursDifference / 24);
  const weeksDifference = Math.floor(daysDifference / 7);
  const monthsDifference = Math.floor(daysDifference / 30);
  const yearsDifference = Math.floor(daysDifference / 365);

  if (secondsDifference < 60) {
    return secondsDifference === 1 ? '1 second ago' : `${secondsDifference} seconds ago`;
  } else if (minutesDifference < 60) {
    return minutesDifference === 1 ? '1 minute ago' : `${minutesDifference} minutes ago`;
  } else if (hoursDifference < 24) {
    return hoursDifference === 1 ? '1 hour ago' : `${hoursDifference} hours ago`;
  } else if (daysDifference < 7) {
    return daysDifference === 1 ? '1 day ago' : `${daysDifference} days ago`;
  } else if (weeksDifference < 4) {
    return weeksDifference === 1 ? '1 week ago' : `${weeksDifference} weeks ago`;
  } else if (monthsDifference < 12) {
    return monthsDifference === 1 ? '1 month ago' : `${monthsDifference} months ago`;
  } else {
    return yearsDifference === 1 ? '1 year ago' : `${yearsDifference} years ago`;
  }
};

const NotificationItem: FC<IItemProps> = ({ message, createdAt, read, id }) => {
  const [isRead, setIsRead] = useState(read);
  const [loading, setLoading] = useState(false);
  const relativeTime = getRelativeTime(createdAt);

  const dispatch = useDispatch();

  const handleReadStatus = () => {
    if (isRead) return null;
    setLoading(true);
    request
      .put(`${PUBLIC_URL}/v1/notifications/${id}`, {})
      .then(() => {
        setIsRead(true);
        dispatch(fetchNotificationsCount());
      })
      .finally(() => setLoading(false));
  };

  return (
    <StyledWrap onClick={handleReadStatus} $isRead={isRead}>
      <Container display="flex" alignItems="center" gap="1.25rem">
        <Container paddingRight={20}>
          <Container fontWeight={600} color="#172A4F !important">
            {message}
          </Container>
          <Container fontSize="0.8rem" color="#172A4F !important">
            {relativeTime}
          </Container>
        </Container>
      </Container>
      <Container fontSize="1.75rem" cursor="pointer">
        {loading ? (
          <Loader size={26} />
        ) : isRead ? (
          <IoMailOpen fill="#172A4F" />
        ) : (
          <IoMdMail fill="#172A4F" />
        )}
      </Container>
    </StyledWrap>
  );
};

export default NotificationItem;
