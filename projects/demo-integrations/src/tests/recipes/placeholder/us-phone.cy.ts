import {DemoPath} from '@demo/constants';

describe('Placeholder | US phone', () => {
    beforeEach(() => {
        cy.visit(DemoPath.Placeholder);
        cy.get('#phone input')
            .should('be.visible')
            .first()
            .should('have.value', '')
            .focus()
            .should('have.value', '+1 (   ) ___-____')
            .should('have.prop', 'selectionStart', '+1'.length)
            .should('have.prop', 'selectionEnd', '+1'.length)
            .as('input');
    });

    describe('basic typing (1 character per keydown)', () => {
        const tests = [
            // [Typed value, Masked value, valueWithoutPlaceholder]
            ['2', '+1 (2  ) ___-____', '+1 (2'],
            ['21', '+1 (21 ) ___-____', '+1 (21'],
            ['212', '+1 (212) ___-____', '+1 (212'],
            ['2125', '+1 (212) 5__-____', '+1 (212) 5'],
            ['21255', '+1 (212) 55_-____', '+1 (212) 55'],
            ['212555', '+1 (212) 555-____', '+1 (212) 555'],
            ['2125552', '+1 (212) 555-2___', '+1 (212) 555-2'],
            ['21255523', '+1 (212) 555-23__', '+1 (212) 555-23'],
            ['212555236', '+1 (212) 555-236_', '+1 (212) 555-236'],
            ['2125552368', '+1 (212) 555-2368', '+1 (212) 555-2368'],
        ] as const;

        tests.forEach(([typed, masked, valueWithoutPlaceholder]) => {
            it(`Type ${typed} => ${masked}`, () => {
                cy.get('@input')
                    .type(typed)
                    .should('have.value', masked)
                    .should('have.prop', 'selectionStart', valueWithoutPlaceholder.length)
                    .should('have.prop', 'selectionEnd', valueWithoutPlaceholder.length)
                    .blur()
                    .should('have.value', valueWithoutPlaceholder);
            });
        });
    });

    it('Can type 1 after country code +1', () => {
        cy.get('@input')
            .type('1')
            .should('have.value', '+1 (1  ) ___-____')
            .should('have.prop', 'selectionStart', '+1 (1'.length)
            .should('have.prop', 'selectionEnd', '+1 (1'.length);
    });

    it('cannot erase country code +1', () => {
        cy.get('@input')
            .type('{backspace}'.repeat(10))
            .should('have.value', '+1 (   ) ___-____')
            .type('{selectAll}{backspace}')
            .should('have.value', '+1 (   ) ___-____')
            .type('{selectAll}{del}')
            .should('have.value', '+1 (   ) ___-____')
            .should('have.prop', 'selectionStart', '+1'.length)
            .should('have.prop', 'selectionEnd', '+1'.length);
    });

    it('cannot move caret outside actual value', () => {
        cy.get('@input')
            .type('{rightArrow}')
            .should('have.prop', 'selectionStart', '+1'.length)
            .should('have.prop', 'selectionEnd', '+1'.length)
            .type('{selectAll}')
            .should('have.prop', 'selectionStart', 0)
            .should('have.prop', 'selectionEnd', '+1'.length);
    });

    it('Value contains only country code and placeholder => Blur => Value is empty', () => {
        cy.get('@input')
            .focus()
            .should('have.value', '+1 (   ) ___-____')
            .blur()
            .should('have.value', '');
    });

    describe('caret navigation on attempt to erase fixed character', () => {
        beforeEach(() => {
            cy.get('@input')
                .type('2125552')
                .should('have.value', '+1 (212) 555-2___')
                .should('have.prop', 'selectionStart', '+1 (212) 555-2'.length)
                .should('have.prop', 'selectionEnd', '+1 (212) 555-2'.length);
        });

        it('+1 (212) 555-|2___ => Backspace => +1 (212) 555|-2___', () => {
            cy.get('@input')
                .type('{leftArrow}{backspace}')
                .should('have.value', '+1 (212) 555-2___')
                .should('have.prop', 'selectionStart', '+1 (212) 555'.length)
                .should('have.prop', 'selectionEnd', '+1 (212) 555'.length);
        });

        it('+1 (212) 555|-2___ => Delete => +1 (212) 555-|2___', () => {
            cy.get('@input')
                .type('{leftArrow}'.repeat(2))
                .should('have.prop', 'selectionStart', '+1 (212) 555'.length)
                .should('have.prop', 'selectionEnd', '+1 (212) 555'.length)
                .type('{del}')
                .should('have.value', '+1 (212) 555-2___')
                .should('have.prop', 'selectionStart', '+1 (212) 555-'.length)
                .should('have.prop', 'selectionEnd', '+1 (212) 555-'.length);
        });

        it('+1 (212) |555-2___ => Backspace x2 => +1 (212|) 555-2___', () => {
            cy.get('@input')
                .type('{leftArrow}'.repeat('555-2'.length))
                .type('{backspace}')
                .should('have.value', '+1 (212) 555-2___')
                .should('have.prop', 'selectionStart', '+1 (212)'.length)
                .should('have.prop', 'selectionEnd', '+1 (212)'.length)
                .type('{backspace}')
                .should('have.value', '+1 (212) 555-2___')
                .should('have.prop', 'selectionStart', '+1 (212'.length)
                .should('have.prop', 'selectionEnd', '+1 (212'.length);
        });

        it('+1 (212|) 555-2___ => Delete => +1 (212) |555-2___', () => {
            cy.get('@input')
                .type('{leftArrow}'.repeat(') 555-2'.length))
                .should('have.prop', 'selectionStart', '+1 (212'.length)
                .should('have.prop', 'selectionEnd', '+1 (212'.length)
                .type('{del}')
                .should('have.value', '+1 (212) 555-2___')
                .should('have.prop', 'selectionStart', '+1 (212) '.length)
                .should('have.prop', 'selectionEnd', '+1 (212) '.length);
        });
    });
});
