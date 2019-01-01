import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';
import formFields from './formFields';

class SurveyForm extends Component {
  renderFields() {
    return formFields.map(({ label, name }) => {
      return (
        <Field 
          key={name}
          label={label} 
          type="text" 
          name={name} 
          component={SurveyField} 
        />
      );
    });
  }

  render() {
    return (
      <div style={{ marginTop: '15px' }}>
        <form 
          onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}
        >
          {this.renderFields()}
          <Link to="/surveys" className="btn-flat red white-text">
            Cancel
          </Link>
          <button className="btn-flat teal white-text right" type="submit">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    )
  }
}

const validate = (values) => {
  const errors = {};

  errors.emails = validateEmails(values.recipients);

  formFields.forEach(field => {
    const name = field.name;

    if (!values[name]) {
      errors[name] = 'You must provide a ' + field.label;
    }

  })

  return errors;
}

export default reduxForm({
  validate,
  form: 'surveyForm',
  destroyOnUnmount: false
})(SurveyForm);



