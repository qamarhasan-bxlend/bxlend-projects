import React, { useEffect, useState } from 'react';
import { useDispatch } from 'src/store/useDispatch';

import { Container } from 'src/components/Container';
import { Loader } from 'src/components/Loader';
import { Glass } from 'src/components/Glass';
import NotificationItem from './components/NotificationItem';
import NoResult from 'src/components/NoResult/NoResult';
import Pagination from 'src/components/Pagination';

import request from 'src/request';
import { setAppAlert } from 'src/store/slice/appAlert';
import { PUBLIC_URL } from 'src/configs';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const dispatch = useDispatch();

  const getNotifications = (page) => {
    setIsLoading(true);
    request
      .get(`${PUBLIC_URL}/v1/notifications?page=${page}&limit=10`)
      .then(({ data }) => {
        setNotifications(data?.notifications);
        setTotalPages(data?.meta?.page_count);
      })
      .catch(({ response }) =>
        dispatch(
          setAppAlert({
            message: response?.data?.error || 'Something went wrong.',
            isSuccess: false,
          }),
        ),
      )
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    getNotifications(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  if (isLoading) {
    return <Loader overlay />;
  }

  return (
    <Glass height="100%">
      <>
        <>
          <Container fontSize="1.75rem" textAlign="center" paddingBottom="1.25rem">
            Notifications
          </Container>
          <Container display="flex" flexDirection="column" gap="0.75rem" flex="1">
            {notifications.map(({ id, message, created_at, readStatus }) => (
              <NotificationItem
                key={id}
                message={message}
                createdAt={created_at}
                read={readStatus}
                id={id}
              />
            ))}
          </Container>
        </>
        {!isLoading && notifications.length ? (
          <Container display="flex" justifyContent="center" paddingTop="1rem">
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              nPages={totalPages}
            />
          </Container>
        ) : null}
        {!notifications.length && !isLoading ? <NoResult /> : null}
      </>
    </Glass>
  );
};

export default NotificationsPage;
