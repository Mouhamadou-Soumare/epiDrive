import { ChangeEvent, useState, useCallback } from "react";

interface TextareaInputProps {
    label: string;
    id: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    required?: boolean;
}

const TextareaInput: React.FC<TextareaInputProps> = ({
    label,
    id,
    name,
    value,
    onChange,
    required = false,
}) => {
    const [error, setError] = useState("");

    // Validation dynamique
    const handleValidation = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        if (required && e.target.value.trim() === "") {
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
            <textarea
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
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default TextareaInput;
