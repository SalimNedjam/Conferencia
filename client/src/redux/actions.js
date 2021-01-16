import { SET_USER, UNSET_USER } from './actionTypes';

export const setUser = content => ({
  type: SET_USER,
  payload: {content},
});

export const unsetUser = content => ({
  type: UNSET_USER,
  payload: {content}
})