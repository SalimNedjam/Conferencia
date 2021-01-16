import { SET_USER, UNSET_USER } from "../actionTypes";

const initialState = {
  user: undefined,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER: {
      const {content} = action.payload;
      return {
        ...state,
        user: content,
      };
    }
    case UNSET_USER: {
      return {
        ...state,
        user: undefined,
      };
    }
    default:
      return state;
  }
}