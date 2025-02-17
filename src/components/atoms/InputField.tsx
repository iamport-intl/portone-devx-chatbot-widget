import React, { forwardRef } from 'react';

export type InputFieldProps = {
    value: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    disabled?: boolean;
};

const InputFieldComponent = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ value, placeholder, onChange, onKeyDown, disabled }, ref) => {
    return (
      <input
        ref={ref}
        type="text"
        aria-label={placeholder || "Chat input"}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full p-4 text-sm text-gray-700 bg-gray-50 rounded-lg focus:outline-none disabled:cursor-not-allowed"
      />
    );
  }
);

export default React.memo(InputFieldComponent);