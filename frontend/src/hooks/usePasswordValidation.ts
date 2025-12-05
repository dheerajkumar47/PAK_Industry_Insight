import { useState, useEffect } from 'react';

export interface PasswordRequirement {
  id: string;
  label: string;
  met: boolean;
}

export interface PasswordValidationResult {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong' | '';
  requirements: PasswordRequirement[];
}

export const usePasswordValidation = (password: string): PasswordValidationResult => {
  const [result, setResult] = useState<PasswordValidationResult>({
    isValid: false,
    strength: '',
    requirements: [],
  });

  useEffect(() => {
    const requirements: PasswordRequirement[] = [
      { id: 'length', label: 'At least 8 characters', met: password.length >= 8 },
      { id: 'uppercase', label: 'At least 1 uppercase letter', met: /[A-Z]/.test(password) },
      { id: 'number', label: 'At least 1 number', met: /\d/.test(password) },
      { id: 'special', label: 'At least 1 special character', met: /[^A-Za-z0-9]/.test(password) },
    ];

    const metCount = requirements.filter((r) => r.met).length;
    let strength: 'weak' | 'medium' | 'strong' | '' = '';

    if (password) {
      if (metCount === 4) {
        strength = 'strong';
      } else if (metCount >= 2) {
        strength = 'medium';
      } else {
        strength = 'weak';
      }
    }

    setResult({
      isValid: metCount === 4,
      strength,
      requirements,
    });
  }, [password]);

  return result;
};
