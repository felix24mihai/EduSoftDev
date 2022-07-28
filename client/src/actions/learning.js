import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_MODULE_PROBLEMS,
  GET_LEARNING_MATERIAL,
  UPDATE_LEARNING_MATERIAL,
  DELETE_LEARNING_MATERIAL,
  REMOVE_ANSWER,
  LEARNING_ERROR,
} from './types';

// Get problems, quizzes and lessons by module
export const getAllMaterials = (moduleName) => async (dispatch) => {
  try {
    const res = await axios.get(
      `/api/learning-materials/modules/${moduleName}`
    );

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

// Get problems, quizzes and lessons by module
export const getLearningMaterial = (learningMaterialId) => async (dispatch) => {
  try {
    const res = await axios.get(
      `/api/learning-materials/${learningMaterialId}`
    );

    dispatch({
      type: GET_LEARNING_MATERIAL,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: LEARNING_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add learning material
export const addLearningMaterial =
  (formData, materialType, moduleName, navigate) => async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      await axios.post(
        `/api/learning-materials/add-${materialType}`,
        formData,
        config
      );
      materialType =
        materialType.charAt(0).toUpperCase() + materialType.slice(1);

      navigate(`/modules/${moduleName}`);
      dispatch(setAlert(`${materialType} Created`, 'success'));
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
      }
    }
  };

// Update learning material
export const updateLearningMaterial =
  (formData, materialId, materialType) => async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    let route = 'problems';
    if (materialType === 'Lesson') {
      route = 'lessons';
    } else if (materialType === 'Quiz') {
      route = 'quizzes';
    }
    try {
      const res = await axios.put(
        `/api/learning-materials/${route}/${materialId}`,
        formData,
        config
      );
      materialType =
        materialType.charAt(0).toUpperCase() + materialType.slice(1);

      dispatch({
        type: UPDATE_LEARNING_MATERIAL,
        payload: res.data,
      });

      dispatch(setAlert(`${materialType} Updated`, 'success'));
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
      }
    }
  };

// Delete one learning material
export const deleteLearningMaterial =
  (learningMaterialId, materialType) => async (dispatch) => {
    try {
      await axios.delete(`/api/learning-materials/${learningMaterialId}`);

      dispatch({
        type: DELETE_LEARNING_MATERIAL,
        payload: learningMaterialId,
      });
      dispatch(setAlert(`${materialType} Deleted`, 'success', 2500, false));
    } catch (err) {
      dispatch({
        type: LEARNING_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

// Delete answer from a quiz
export const deleteAnswer =
  (quizId, answerType, answerId) => async (dispatch) => {
    try {
      await axios.delete(
        `/api/learning-materials/quizzes/${quizId}/${answerType}/${answerId}`
      );

      dispatch({
        type: REMOVE_ANSWER,
        payload: { answerType, answerId },
      });
      dispatch(setAlert('Answer Deleted', 'success', 2000, false));
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
      }
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
