import React from 'react';
import { PasswordValidationResult } from '../hooks/usePasswordValidation';

interface PasswordRequirementsProps {
    validationResult: PasswordValidationResult;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ validationResult }) => {
    const { strength, requirements } = validationResult;

    if (!strength) return null;

    return (
        <div className="mt-2 space-y-3">
            <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Password strength</span>
                <span
                    className={
                        strength === 'strong'
                            ? 'text-green-600'
                            : strength === 'medium'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                    }
                >
                    {strength.charAt(0).toUpperCase() + strength.slice(1)}
                </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                <div
                    className={
                        'h-full transition-all duration-200 ' +
                        (strength === 'strong'
                            ? 'bg-green-500 w-full'
                            : strength === 'medium'
                                ? 'bg-yellow-400 w-2/3'
                                : strength === 'weak'
                                    ? 'bg-red-500 w-1/3'
                                    : 'bg-transparent w-0')
                    }
                />
            </div>

            <ul className="mt-4 space-y-0.5 text-xs">
                {requirements.map((req) => (
                    <li key={req.id} className="flex items-center gap-1 text-gray-600">
                        <span
                            className={
                                'inline-flex items-center justify-center w-4 h-4 rounded-full mr-1 text-[10px] ' +
                                (req.met ? 'bg-green-500 text-white' : 'bg-red-500 text-white')
                            }
                        >
                            {req.met ? '✓' : '✕'}
                        </span>
                        <span>{req.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
