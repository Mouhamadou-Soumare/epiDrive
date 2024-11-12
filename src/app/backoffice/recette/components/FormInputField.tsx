interface FormInputFieldProps {
    id: string;
    name: string;
    value: string;
    label: string;
    type?: 'text' | 'textarea';
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  }
  
  const FormInputField: React.FC<FormInputFieldProps> = ({ id, name, value, label, type = 'text', onChange }) => (
    <div className="mb-5">
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          value={value}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={onChange}
        />
      ) : (
        <input
          type="text"
          id={id}
          name={name}
          value={value}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={onChange}
        />
      )}
    </div>
  );
  
  export default FormInputField;
  