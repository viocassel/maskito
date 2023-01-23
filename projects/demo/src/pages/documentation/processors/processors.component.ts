import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DemoPath} from '@demo/routes';

@Component({
    selector: 'processors-doc-page',
    templateUrl: './processors.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessorsDocPageComponent {
    readonly elementStateDemo = import('./examples/element-state-demo.md?raw');
    readonly preprocessorFirstArgDemo = import(
        './examples/preprocessor-first-arg-demo.md?raw'
    );

    readonly preprocessorsSecondArgDemo = import(
        './examples/processor-second-arg-demo.md?raw'
    );

    readonly preprocessorInActionDemo = import(
        './examples/preprocessor-in-action-demo.md?raw'
    );

    readonly postprocessorInActionDemo = import(
        './examples/postprocessor-in-action.md?raw'
    );

    readonly maskitoPipeDemo = import('./examples/maskito-pipe-demo.md?raw');

    readonly maskExpressionDocPage = `/${DemoPath.MaskExpression}`;
    readonly overwriteModeDocPage = `/${DemoPath.OverwriteMode}`;
}