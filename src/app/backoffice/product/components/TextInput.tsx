import { ChangeEvent } from "react";

interface TextInputProps {
    label: string;
    id: string;
    name: string;
    value: string | number;
    type?: "text" | "number";
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    min?: number;
    max?: number;
    step?: number;
    required?: boolean;
}

const TextInput = ({
    label,
    id,
    name,
    value,
    type = "text",
    onChange,
    min,
    max,
    step,
    required = false,
}: TextInputProps) => (
    <div className="mb-5">
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
        <input
            type={type}
            id={id}
            name={name}
            value={value !== undefined ? value.toString() : ""}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            required={required}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
    </div>
);

export default TextInput;
