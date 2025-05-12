import React, { FC, useEffect, useState } from 'react';

import { useDispatch } from 'src/store/useDispatch';
import { setAppAlert } from 'src/store/slice/appAlert';

import { NotificationWrapper } from './styled';

interface INotification {
  message: string;
  isSuccess?: boolean;
}

const Notification: FC<INotification> = ({ message, isSuccess }) => {
  const [isVisible, setIsVisible] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsVisible(true);
    const timeout = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        setIsVisible(false);
        dispatch(
          setAppAlert({
            message: '',
            isSuccess: false,
          })
        );
      }, 1000);
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <NotificationWrapper isVisible={isVisible} isSuccess={!!isSuccess}>
      <div>{message}</div>
    </NotificationWrapper>
  );
};

export default Notification;
