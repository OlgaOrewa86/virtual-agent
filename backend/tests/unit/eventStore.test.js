import { addEvent, getEvents, clearEvents } from '../../src/store/eventStore.js';

describe('Event Store', () => {
  beforeEach(() => {
    clearEvents();
  });

  it('adds an event to the store', () => {
    addEvent({ type: 'test_event', payload: { a: 1 } });

    const events = getEvents();
    expect(events.length).toBe(1);
    expect(events[0].type).toBe('test_event');
    expect(events[0].payload).toEqual({ a: 1 });
  });

  it('stores multiple events in order', () => {
    addEvent({ type: 'first' });
    addEvent({ type: 'second' });

    const events = getEvents();
    expect(events.length).toBe(2);
    expect(events[0].type).toBe('first');
    expect(events[1].type).toBe('second');
  });

  it('clears all events', () => {
    addEvent({ type: 'something' });
    addEvent({ type: 'another' });

    clearEvents();
    const events = getEvents();

    expect(events.length).toBe(0);
  });
});
