import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter  } from 'react-router-dom';
import formFields from './formFields';
import * as actions from '../../actions';

const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history }) => {
  const reviewFields = formFields.map(({ label, name }) => {
    return (
      <div>
        <label>{label}</label>
        <div>{formValues[name]}</div>
      </div>
    );
  })
  

  return (
    <div>
      <h5>Please confirm your entries</h5>
      {reviewFields}
      <button className="yellow white-text darken-3 btn-flat" onClick={onCancel}>
        Back
      </button>
      <button 
        className="green white-text btn-flat right"
        onClick={() => submitSurvey(formValues, history)}
      >
        Send Survey
        <i className="material-icons right">email</i>
      </button>
    </div>
  );
}

export default connect(
  state => ({ formValues: state.form.surveyForm.values }),
  actions
)(withRouter(SurveyFormReview));