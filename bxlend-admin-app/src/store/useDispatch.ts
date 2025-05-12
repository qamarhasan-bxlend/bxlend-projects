import { useDispatch as useReduxDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from './store';

export const useDispatch = () => {
  return useReduxDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
};
