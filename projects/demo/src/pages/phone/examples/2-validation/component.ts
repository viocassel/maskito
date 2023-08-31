import {ChangeDetectionStrategy, Component} from '@angular/core';
import {
    AbstractControl,
    FormControl,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';
import {TuiValidationError} from '@taiga-ui/cdk';
import {CountryCode, isValidPhoneNumber} from 'libphonenumber-js/max';

import mask from './mask';

function phoneValidator(countryCode: CountryCode): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const valid = isValidPhoneNumber(control.value, countryCode);

        return valid ? null : new TuiValidationError('Invalid number');
    };
}

@Component({
    selector: 'phone-doc-example-2',
    template: `
        <tui-input
            tuiTextfieldCustomContent="tuiIconPhoneLarge"
            [style.max-width.rem]="30"
            [formControl]="control"
        >
            Basic
            <input
                tuiTextfield
                autocomplete="tel"
                inputmode="tel"
                [maskito]="mask"
            />
        </tui-input>
        <tui-error
            [formControl]="control"
            [error]="[] | tuiFieldError | async"
        ></tui-error>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneMaskDocExample2 {
    readonly control = new FormControl('+36 20 123-3122', phoneValidator('HU'));
    readonly mask = mask;
}