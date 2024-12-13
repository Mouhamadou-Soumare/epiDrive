import { ChangeEvent } from "react";

interface TextareaInputProps {
    label: string;
    id: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    required?: boolean;
}

const TextareaInput = ({
    label,
    id,
    name,
    value,
    onChange,
    required = false,
}: TextareaInputProps) => (
    <div className="mb-5">
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
        <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
    </div>
);

export default TextareaInput;
