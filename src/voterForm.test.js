import React from 'react';
import { render } from '@testing-library/react';
import VoterForm from './voterForm';

test('renders voter form', () => {
  const { getByText } = render(<VoterForm />);
  const SubmitButton = getByText(/Submit/i);
  expect(SubmitButton).toBeInTheDocument();
});
