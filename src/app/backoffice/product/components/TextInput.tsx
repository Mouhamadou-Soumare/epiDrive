import { ChangeEvent, useState, useCallback } from "react";

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

const TextInput: React.FC<TextInputProps> = ({
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
}) => {
    const [error, setError] = useState("");

    // Validation dynamique des champs
    const handleValidation = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (required && val.trim() === "") {
            setError(`Le champ "${label}" est obligatoire.`);
        } else {
            setError("");
        }
    }, [label, required]);

    return (
        <div className="mb-5">
            <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                id={id}
                name={name}
                value={value !== undefined ? value.toString() : ""}
                onChange={(e) => {
                    handleValidation(e);
                    onChange(e);
                }}
                min={min}
                max={max}
                step={step}
                required={required}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                aria-label={label}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default TextInput;
