import {openNumberPage} from './utils';

describe('Number | maximumFractionDigits', () => {
    describe('forbids to type more fractional digits than `maximumFractionDigits` (it is equal to 4)', () => {
        beforeEach(() => {
            openNumberPage('decimalSeparator=,&maximumFractionDigits=4');
        });

        it('Empty input => Type 0,123456789 => 0,1234', () => {
            cy.get('@input')
                .type('0,1234')
                .should('have.value', '0,1234')
                .should('have.prop', 'selectionStart', '0,1234'.length)
                .should('have.prop', 'selectionEnd', '0,1234'.length);
        });

        it('Empty input => Type 0,4242000000 => 0,4242', () => {
            cy.get('@input')
                .type('0,4242000000')
                .should('have.value', '0,4242')
                .should('have.prop', 'selectionStart', '0,4242'.length)
                .should('have.prop', 'selectionEnd', '0,4242'.length);
        });

        it('Empty input => Type 0,42420000001 => 0,4242', () => {
            cy.get('@input')
                .type('0,42420000001')
                .should('have.value', '0,4242')
                .should('have.prop', 'selectionStart', '0,4242'.length)
                .should('have.prop', 'selectionEnd', '0,4242'.length);
        });

        [',', '.', 'б', 'ю'].forEach((separator) => {
            it(`123|456789 => Type ${separator} => 123,4567`, () => {
                cy.get('@input')
                    .type('123|456789')
                    .type('{moveToStart}')
                    .type('{rightArrow}'.repeat(3))
                    .should('have.value', '123 456 789')
                    .should('have.prop', 'selectionStart', '123'.length)
                    .should('have.prop', 'selectionEnd', '123'.length)
                    .type(separator)
                    .should('have.value', '123,4567')
                    .should('have.prop', 'selectionStart', '123,'.length)
                    .should('have.prop', 'selectionEnd', '123,'.length);
            });
        });
    });

    describe('rejects decimal separator if `maximumFractionDigits` is equal to 0', () => {
        it('empty input => Type "," => Empty input', () => {
            openNumberPage('decimalSeparator=,&maximumFractionDigits=0');
            cy.get('@input').type(',').should('have.value', '');
        });

        it('Type "5," => "5"', () => {
            openNumberPage('decimalSeparator=,&maximumFractionDigits=0');

            cy.get('@input')
                .type('5,')
                .should('have.value', '5')
                .should('have.prop', 'selectionStart', 1)
                .should('have.prop', 'selectionEnd', 1);
        });

        describe('dont rejects thousand separator if it is equal to decimal separator (for maximumFractionDigits=0 value of decimal separator does not matter)', () => {
            it('simple typing', () => {
                openNumberPage(
                    'maximumFractionDigits=0&thousandSeparator=.&decimalSeparator=.',
                );

                cy.get('@input')
                    .type('1234')
                    .should('have.value', '1.234')
                    .should('have.prop', 'selectionStart', '1.234'.length)
                    .should('have.prop', 'selectionEnd', '1.234'.length);
            });

            it('paste from clipboard', () => {
                openNumberPage(
                    'maximumFractionDigits=0&thousandSeparator=.&decimalSeparator=.',
                );

                cy.get('@input')
                    .paste('1.234')
                    .should('have.value', '1.234')
                    .should('have.prop', 'selectionStart', '1.234'.length)
                    .should('have.prop', 'selectionEnd', '1.234'.length);
            });
        });
    });

    describe('keeps untouched decimal part if `maximumFractionDigits: Infinity`', () => {
        it('0,123456789', () => {
            openNumberPage('decimalSeparator=,&maximumFractionDigits=Infinity');

            cy.get('@input')
                .type('0,123456789')
                .should('have.value', '0,123456789')
                .should('have.prop', 'selectionStart', '0,123456789'.length)
                .should('have.prop', 'selectionEnd', '0,123456789'.length);
        });

        it('0,0000000001', () => {
            openNumberPage('decimalSeparator=,&maximumFractionDigits=Infinity');

            cy.get('@input')
                .type('0,0000000001') // 1e-10
                .should('have.value', '0,0000000001')
                .should('have.prop', 'selectionStart', '0,0000000001'.length)
                .should('have.prop', 'selectionEnd', '0,0000000001'.length)
                .blur()
                .wait(100) // to be sure that value is not changed even in case of some async validation
                .should('have.value', '0,0000000001');
        });
    });
});
