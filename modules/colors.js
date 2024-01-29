// Effects for stdout.
const blinkPrefix = "\x1b[5m";
const cyanPrefix = "\x1b[36m";
const greenPrefix = "\x1b[32m";
const yellowPrefix = "\x1b[33m";
const redPrefix = "\x1b[31m";
const colorEscape = "\x1b[0m";

export const blink = (str) => `${blinkPrefix}${str}${colorEscape}`;
export const cyan = (str) => `${cyanPrefix}${str}${colorEscape}`;
export const green = (str) => `${greenPrefix}${str}${colorEscape}`;
export const yellow = (str) => `${yellowPrefix}${str}${colorEscape}`;
export const red = (str) => `${redPrefix}${str}${colorEscape}`;
