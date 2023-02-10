import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DemoPath} from '@demo/path';
import {TuiDocExample} from '@taiga-ui/addon-doc';

@Component({
    selector: 'phone-doc',
    templateUrl: './phone-doc.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneDocComponent {
    readonly maskExpressionDocPage = `/${DemoPath.MaskExpression}`;
    readonly processorsDocPage = `/${DemoPath.Processors}`;

    readonly usPhoneExample1: TuiDocExample = {
        MaskitoOptions: import('./examples/1-us-phone/mask.ts?raw'),
    };

    readonly ruPhoneExample2: TuiDocExample = {
        MaskitoOptions: import('./examples/2-ru-phone/mask.ts?raw'),
        TypeScript: import('./examples/2-ru-phone/component.ts?raw'),
        HTML: import('./examples/2-ru-phone/template.html?raw'),
    };
}