import React, { Fragment } from 'react';
import { Navigate } from 'react-router-dom';
import CreateProfile from './CreateProfile';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const EditProfile = ({ profile: { profile } }) => {
  // Redirect if user doesn't have a profile
  if (profile === null) {
    return <Navigate to={'/create-profile'} />;
  }

  return (
    <Fragment>
      <CreateProfile />
    </Fragment>
  );
};

EditProfile.propTypes = {
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps)(EditProfile);
