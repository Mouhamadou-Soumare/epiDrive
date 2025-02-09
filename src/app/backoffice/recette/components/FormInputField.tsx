import { ChangeEvent, useState, useCallback } from "react";

interface FormInputFieldProps {
  id: string;
  name: string;
  value: string;
  label: string;
  type?: "text" | "textarea";
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const FormInputField: React.FC<FormInputFieldProps> = ({ id, name, value, label, type = "text", onChange }) => {
  const [error, setError] = useState<string | null>(null);

  const validateField = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value.trim();
    if (!val) {
      setError(`Le champ "${label}" est requis.`);
    } else {
      setError(null);
    }
  }, [label]);

  return (
    <div className="mb-5">
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900">
        {label} <span className="text-red-500">*</span>
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          value={value}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={(e) => {
            onChange(e);
            validateField(e);
          }}
          aria-label={label}
        />
      ) : (
        <input
          type="text"
          id={id}
          name={name}
          value={value}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={(e) => {
            onChange(e);
            validateField(e);
          }}
          aria-label={label}
        />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormInputField;
