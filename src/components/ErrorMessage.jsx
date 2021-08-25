import React from 'react';

export const ErrorMessage = ({ message }) => (
    <span style={{ color: 'red' }}>{JSON.stringify(message)}</span>
)