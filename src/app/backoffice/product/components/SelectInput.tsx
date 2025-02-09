import { ChangeEvent, useState, useCallback } from "react";

interface SelectInputProps {
    label: string;
    id: string;
    name: string;
    value: number | string;
    options: { value: number; label: string }[];
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({
    label,
    id,
    name,
    value,
    options,
    onChange,
    required = false,
}) => {
    const [error, setError] = useState("");

    // Validation dynamique
    const handleValidation = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        if (required && e.target.value === "") {
            setError(`Veuillez sélectionner une option.`);
        } else {
            setError("");
        }
    }, [required]);

    return (
        <div className="mb-5">
            <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                id={id}
                name={name}
                value={value}
                onChange={(e) => {
                    handleValidation(e);
                    onChange(e);
                }}
                required={required}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                aria-label={label}
            >
                <option value="">Sélectionner une option</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default SelectInput;
