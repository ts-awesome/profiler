import {IProfilingLog} from "../interfaces";

function pad(str: string, length: number, char = ' '): string {
  return str + Array(Math.max( 0, length - str.length)).fill(char).join('');
}

const scales = ['', 's', 'm']
const factors = [1000, 60, 60]

function formatTime(time: number): string {
  if (time < 5) return time.toFixed(3)
  if (time < 50) return time.toFixed(2)

  let scale = 0
  while (scale < factors.length && time > factors[scale]) {
    time /= factors[scale]
    scale++
  }
  return `${time.toFixed(1)}${scales[scale]}`;
}

export function consoleReporter(logs: readonly IProfilingLog[]): readonly string[] {
  return [
    pad('', 80, '-'),
    [
      ' ',
      pad('metric', 18),
      '| ',
      pad('group', 18),
      '| ',
      pad('time', 10),
      '| ',
      pad('description', 27),
    ].join(''),
    pad('', 80, '-'),
    ...logs.map(({metric, group, description, time}) => [
      ' ',
      pad(metric, 18),
      '| ',
      pad(group || '', 18),
      '| ',
      pad(formatTime(time), 10),
      '| ',
      pad(description || '', 27),
    ].join('')),
    pad('', 80, '-'),
  ];
}
