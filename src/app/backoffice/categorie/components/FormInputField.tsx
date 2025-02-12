interface FormInputFieldProps {
  id: string;
  name: string;
  value: string | number | undefined;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'image';
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const FormInputField: React.FC<FormInputFieldProps> = ({ id, name, value, label, type = 'text', onChange }) => (
  <div className="mb-5">
    <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
    {type === 'textarea' ? (
      <textarea
        id={id}
        name={name}
        value={value as string}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        onChange={onChange}
      />
    ) :
    type === 'image' ? (
      <input
        type="file"
        id={id}
        name={name}
        accept="image/*"
        
        className="mt-1 block w-full text-sm text-gray-500 border-gray-300 rounded-md"
        onChange={onChange}
      />
    ) :
    (
      <input
        type={type}
        id={id}
        name={name}
        value={value as string | number}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        onChange={onChange}
      />
    )}
  </div>
);

export default FormInputField;
