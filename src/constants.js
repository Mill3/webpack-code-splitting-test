export const TRANSITION_BASE = 150;
export const TRANSITION_LEAVE_DURATION = TRANSITION_BASE;
export const TRANSITION_LEAVE_DELAY = TRANSITION_BASE / 2;
export const TRANSITION_ENTER_DELAY = TRANSITION_BASE / 2;
export const TRANSITION_ENTER_DURATION = TRANSITION_BASE;

export const SLEEP = ms => new Promise(resolve => setTimeout(resolve, ms));