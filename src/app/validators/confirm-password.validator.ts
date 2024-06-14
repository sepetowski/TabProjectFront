import { AbstractControl, ValidatorFn } from '@angular/forms';

export const validateConfirmPassword: ValidatorFn = (
  control: AbstractControl
) => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password !== confirmPassword) return { notMatched: true };

  return null;
};
