import { describe, it, expect, vi, beforeEach } from 'vitest';
import { writeFileSync, existsSync, readFileSync } from 'node:fs';
import { getTeaByName, saveTea, generateNewTeaId } from './saver';

vi.mock('node:fs');

let listOfTeas;

beforeEach(() => {
  vi.clearAllMocks();

  listOfTeas = [
    { id: 1, name: '404 Tea Not Found', description: 'When you need tea but can’t find one that hits right. A comforting blend that says page may be gone, but you got this. 🛠️☕️' },
    { id: 2, name: 'Merge Conflict Mint', description: 'For the moments when your mind is as tangled as your Git branches. This mint tea brings harmony to the chaos. 🌿🔀' },
  ];

  existsSync.mockReturnValue(true);
  readFileSync.mockReturnValue(JSON.stringify(listOfTeas));
});

describe('getTeaByName', () => {
  it('should return the tea with the given name', () => {
    const tea = getTeaByName('404 Tea Not Found');
    expect(tea).toEqual(listOfTeas[0]);
  });

  it('should return undefined if no tea with the given name exists', () => {
    const currentTea = getTeaByName('Debugger Brew');
    expect(currentTea).toBeUndefined();
  });

  it('should return undefined if the data file does not exist', () => {
    existsSync.mockReturnValue(false);
    const currentTea = getTeaByName('404 Tea Not Found');
    expect(currentTea).toBeUndefined();
  });
});

describe('saveTea', () => {
  it('should save a new tea if name and id are unique', () => {
    const newTea = { id: 3, name: 'Clearly not a Matcha', description: 'A Japanese green tea that swipes you right into a zen state… but is it really matcha? Only the grand sage knows. 🧘🍵' };
    writeFileSync.mockImplementation(() => {});

    saveTea(newTea);

    expect(writeFileSync).toHaveBeenCalledWith(
        'data.json',
        JSON.stringify([...listOfTeas, newTea], null, 2)
    );
  });

  it('should throw an error if a tea with the same name already exists', () => {
    const newTea = { id: 2, name: '404 Tea Not Found', description: 'A strong tea' };

    expect(() => saveTea(newTea)).toThrow('Tea with name 404 Tea Not Found already exists');
  });

  it('should throw an error if a tea with the same id already exists', () => {
    const newTea = { id: 1, name: 'Debugger Brew', description: 'A strong tea for when you’ve hit console.log(‘why tho’) too many times. One sip, and you’ll feel ready to tackle any bug. 🐛🍵' };

    expect(() => saveTea(newTea)).toThrow('Tea with id 1 already exists');
  });
});

describe('generateNewTeaId', () => {
  it('should generate a unique id', () => {
    const now = Date.now();
    vi.spyOn(global.Date, 'now').mockImplementation(() => now);

    const id = generateNewTeaId();
    expect(id).toBe(now);
  });
});
