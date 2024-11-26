import { trigger, state, style, transition, animate } from '@angular/animations';

export const fadeInOutHeightAnimation = trigger('fadeInOutHeight', [
    state('void', style({ opacity: 0, height: '0px' })),
    transition(':enter', [
        style({ opacity: 0, height: '0px' }),
        animate('0.3s ease-out', style({ opacity: 1, height: '*' }))
    ]),
    transition(':leave', [
        animate('0.3s ease-in', style({ opacity: 0, height: '0px' }))
    ])
]);

export const fadeInOutAnimation = trigger('fadeInOut', [
    state('void', style({ opacity: 0 })),
    transition(':enter, :leave', [
        animate('0.5s ease-in-out')
    ]),
]);