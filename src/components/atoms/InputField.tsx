type InputFieldProps = {
    value: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  };
  export default function InputField({ value, placeholder, onChange, onKeyDown }: InputFieldProps) {
    return (
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full p-2 border rounded text-black"
      />
    );
  }
  