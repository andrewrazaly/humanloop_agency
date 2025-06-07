import { renderHook, act } from '@testing-library/react';
import { reducer, useToast } from './use-toast';

describe('reducer', () => {
  it('handles ADD_TOAST and DISMISS_TOAST', () => {
    const initial = { toasts: [] };
    const toast = { id: '1', title: 'hello', open: true } as any;
    const added = reducer(initial, { type: 'ADD_TOAST', toast });
    expect(added.toasts).toHaveLength(1);
    expect(added.toasts[0]).toMatchObject({ id: '1', title: 'hello', open: true });

    const dismissed = reducer(added, { type: 'DISMISS_TOAST', toastId: '1' });
    expect(dismissed.toasts[0].open).toBe(false);
  });
});

describe('useToast hook', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('can add and dismiss toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'test' });
    });

    expect(result.current.toasts).toHaveLength(1);
    const id = result.current.toasts[0].id;

    act(() => {
      result.current.dismiss(id);
    });

    expect(result.current.toasts[0].open).toBe(false);
  });

  it('does not accumulate listeners on state updates', () => {
    let renders = 0;
    const { result } = renderHook(() => {
      renders += 1;
      return useToast();
    });

    act(() => {
      result.current.toast({ title: 'first' });
    });
    const afterFirst = renders;

    act(() => {
      result.current.toast({ title: 'second' });
    });
    const afterSecond = renders;

    expect(afterSecond - afterFirst).toBe(1);
  });
});
