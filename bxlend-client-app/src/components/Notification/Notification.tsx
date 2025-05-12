import React, { FC, useEffect, useState } from 'react';

import { useDispatch } from 'src/store/useDispatch';
import { setAppAlert } from 'src/store/slice/appAlert';

import { StyledNotificationWrapper, StyledContent } from './styled';

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
          }),
        );
      }, 1000);
    }, 5000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledNotificationWrapper $isVisible={isVisible} $isSuccess={!!isSuccess}>
      <StyledContent id="content">{message}</StyledContent>
    </StyledNotificationWrapper>
  );
};

export default Notification;
