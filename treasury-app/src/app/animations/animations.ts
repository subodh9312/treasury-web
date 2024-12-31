import { trigger, state, style, transition, animate } from '@angular/animations';


export const onExpanded = trigger('onExpanded', [
  state('close',
    style({
      'width': '0px'
    })
  ),
  state('open',
    style({
      'width': '230px',
      'padding': '20px'
    })
  ),
  transition('close => open', animate('250ms ease-in')),
  transition('open => close', animate('250ms ease-in')),
]);


export const onMainContentChange = trigger('onMainContentChange', [
  state('close',
    style({
      'margin-left': '0px'
    })
  ),
  state('open',
    style({
      'margin-left': '230px'
    })
  ),
  transition('close => open', animate('250ms ease-in')),
  transition('open => close', animate('250ms ease-in')),
]);

export const onMainScreen = trigger('onMainScreen', [
  state('close',
    style({
      'opacity': '0'
    })
  ),
  state('open',
    style({
      'opacity': '0.9'
    })
  ),
  transition('close => open', animate('500ms ease-in', style({ opacity: 0.9 }))),
  transition('open => close', animate('500ms ease-in', style({ opacity: 0 }))),
])
