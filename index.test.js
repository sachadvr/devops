import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addTea } from './index';
import { generateNewTeaId, getTeaByName, saveTea } from './saver';

vi.mock('./saver');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('addTea', () => {
  it('should create a new tea if the tea name does not exist', () => {
    const tea = { id: 1, name: 'Hotfix Hibiscus', description: 'This tea is fast, furious, and probably not tested held together with duct tape. Ship it fast! 🛠️🌺🍵' };
    const teaNotExistingId = 217366;

    getTeaByName.mockReturnValue(undefined);
    generateNewTeaId.mockReturnValue(teaNotExistingId);
    saveTea.mockImplementation(() => { });

    const result = addTea({ name: 'Hotfix Hibiscus', description: 'This tea is fast, furious, and probably not tested held together with duct tape. Ship it fast! 🛠️🌺🍵' });

    expect(result).toEqual({ success: true });
    expect(generateNewTeaId).toHaveBeenCalled();
    expect(saveTea).toHaveBeenCalledWith({ ...tea, id: teaNotExistingId });
  });

  it('should update an existing tea if they have the same name', () => {
    const existingTea = { id: 1, name: 'Lazy Load Lemon', description: 'Perfect for a remote monday 🐌' };
    const updatedTea = { name: 'Lazy Load Lemon', description: 'Perfect when you hang out a bit too much on Sunday nights (especially rue des Fossés) 💥' };
    getTeaByName.mockReturnValue(existingTea);
    saveTea.mockImplementation(() => {});

    const result = addTea(updatedTea);

    expect(result).toEqual({ success: true });
    expect(generateNewTeaId).not.toHaveBeenCalled();
    expect(saveTea).toHaveBeenCalledWith({ ...updatedTea, id: existingTea.id });
  });

  it('should return false if saveTea throws an error', () => {
    const teaDto = { name: 'Gray Tea' };
    const newId = 12345;

    getTeaByName.mockReturnValue(undefined);
    generateNewTeaId.mockReturnValue(newId);

    saveTea.mockImplementationOnce(() => { throw new Error('throw error') });

    const result = addTea(teaDto);

    expect(result).toEqual({ success: false });
    expect(generateNewTeaId).toHaveBeenCalled();
    expect(saveTea).toHaveBeenCalledWith({ ...teaDto, id: newId });
  });
});
