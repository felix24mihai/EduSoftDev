import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_PROBLEM,
  GET_MODULE_PROBLEMS,
  ADD_PROBLEM,
  ADD_LESSON,
  ADD_QUIZ,
  LEARNING_ERROR,
} from './types';

// Get problems, quizzes and lessons by module
export const getAllMaterials = (moduleName) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/learning-materials/${moduleName}`);

    dispatch({
      type: GET_MODULE_PROBLEMS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: LEARNING_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get profile by userId
/* export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profiles/user/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({ type: CLEAR_PROFILE });
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
}; */