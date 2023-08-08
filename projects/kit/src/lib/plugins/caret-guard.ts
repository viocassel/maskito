import {MaskitoPlugin} from '@maskito/core';

import {clamp, getFocused} from '../utils';

export function maskitoCaretGuard(
    guard: (
        value: string,
        selection: readonly [from: number, to: number],
    ) => [from: number, to: number],
): MaskitoPlugin {
    return element => {
        const document = element.ownerDocument;
        let isPointerDown = 0;
        const onPointerDown = (): number => isPointerDown++;
        const onPointerUp = (): number => isPointerDown--;

        const listener = (): void => {
            if (getFocused(document) !== element) {
                return;
            }

            if (isPointerDown) {
                return document.addEventListener('mouseup', listener, {
                    once: true,
                    passive: true,
                });
            }

            const start = element.selectionStart || 0;
            const end = element.selectionEnd || 0;
            const [fromLimit, toLimit] = guard(element.value, [start, end]);

            if (fromLimit > start || toLimit < end) {
                element.setSelectionRange(
                    clamp(start, fromLimit, toLimit),
                    clamp(end, fromLimit, toLimit),
                );
            }
        };

        document.addEventListener('selectionchange', listener, {passive: true});
        document.addEventListener('mousedown', onPointerDown, {passive: true});
        document.addEventListener('mouseup', onPointerUp, {passive: true});

        return () => {
            document.removeEventListener('selectionchange', listener);
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('mouseup', onPointerUp);
        };
    };
}