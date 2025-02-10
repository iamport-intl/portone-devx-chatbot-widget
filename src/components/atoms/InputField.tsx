import React, { forwardRef } from 'react';

export type InputFieldProps = {
    value: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    disabled?: boolean;
};

// Wrap the component with forwardRef to pass the ref to the underlying <input>.
const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({ value, placeholder, onChange, onKeyDown, disabled }, ref) => {
    return (
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full p-4 text-sm text-gray-700 bg-gray-50 rounded-lg focus:outline-none disabled:cursor-not-allowed"
      />
    );
  });

export default InputField;
  