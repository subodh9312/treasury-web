import { FormGroup } from "@angular/forms";

export function notBlank(controlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];

    if (control.errors && !control.errors.notBlank) {
      // return if another validator has already found an error on the control
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value.trim() === '') {
      control.setErrors({ notBlank: true });
    } else {
      control.setErrors(null);
    }
  };
}

export function mustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
};

export function checkQuantity(controlName: string, quantity: number) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];

    if (control.errors && !control.errors.invalidQuantity) {
      // return if another validator has already found an error on the control
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value > quantity) {
      control.setErrors({ invalidQuantity: true });
    } else {
      control.setErrors(null);
    }
  };
};

export function checkRange(controlName: string, minValue: number, maxValue: number) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];

    if (control.errors && !control.errors.outOfRange) {
      // return if another validator has already found an error on the control
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value < minValue || control.value > maxValue) {
      control.setErrors({ outOfRange: true });
    } else {
      control.setErrors(null);
    }
  };
};

export function notZero(controlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];

    if (control.errors && !control.errors.notZero) {
      // return if another validator has already found an error on the control
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value <= 0) {
      control.setErrors({ notZero: true });
    } else {
      control.setErrors(null);
    }
  };
};

