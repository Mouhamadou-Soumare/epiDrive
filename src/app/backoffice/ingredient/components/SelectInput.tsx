import { ChangeEvent } from "react";

interface SelectInputProps {
    label: string;
    id: string;
    name: string;
    value: number;
    options: { value: number; label: string }[];
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
}

const SelectInput = ({
    label,
    id,
    name,
    value,
    options,
    onChange,
    required = false,
}: SelectInputProps) => (
    <div className="mb-5">
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
        <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
            <option value="">Sélectionner une option</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

export default SelectInput;
