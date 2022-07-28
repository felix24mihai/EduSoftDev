import {
  GET_MODULE_PROBLEMS,
  GET_LEARNING_MATERIAL,
  UPDATE_LEARNING_MATERIAL,
  DELETE_LEARNING_MATERIAL,
  REMOVE_ANSWER,
  LEARNING_ERROR,
} from '../actions/types';

const initialState = {
  learningMaterial: null,
  problems: [],
  loading: true,
  error: {},
};

export default function LearningMaterialsReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_LEARNING_MATERIAL:
    case UPDATE_LEARNING_MATERIAL:
      return {
        ...state,
        learningMaterial: payload,
        loading: false,
      };
    case GET_MODULE_PROBLEMS:
      return {
        ...state,
        problems: payload,
        loading: false,
      };
    case DELETE_LEARNING_MATERIAL:
      return {
        ...state,
        problems: state.problems.filter(
          (learningMaterial) => learningMaterial._id !== payload
        ),
        loading: false,
      };
    case REMOVE_ANSWER:
      let wrongAnswers = state.learningMaterial.wrongAnswers;
      let rightAnswers = state.learningMaterial.rightAnswers;
      if (payload.answerType === 'wrongAnswers') {
        wrongAnswers = state.learningMaterial.wrongAnswers.filter(
          (answer) => answer._id !== payload.answerId
        );
      } else {
        rightAnswers = state.learningMaterial.rightAnswers.filter(
          (answer) => answer._id !== payload.answerId
        );
      }
      return {
        ...state,
        learningMaterial: {
          ...state.learningMaterial,
          wrongAnswers: wrongAnswers,
          rightAnswers: rightAnswers,
        },
        loading: false,
      };
    case LEARNING_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
