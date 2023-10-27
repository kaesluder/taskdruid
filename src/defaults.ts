export const defaultPriorityUrgencyMap = new Map(
  Object.entries({ PENDING: 0, HOLD: -5, DONE: -10 })
);

export const defaultTagUrgencyMap = new Map(
  Object.entries({ next: 10, started: 10 })
);
