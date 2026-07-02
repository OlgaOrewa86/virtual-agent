import { buildResponse } from '../../src/utils/responseBuilder.js';

describe('Response Builder', () => {
  it('builds a basic response with required fields', () => {
    const res = buildResponse({
      text: 'Hello!',
      intent: 'smalltalk'
    });

    expect(res.text).toBe('Hello!');
    expect(res.intent).toBe('smalltalk');

    // defaults
    expect(res.entities).toEqual({});
    expect(res.source).toBe('rule');
    expect(res.card).toBeNull();
    expect(res.buttons).toBeNull();
    expect(res.list).toBeNull();
    expect(res.image).toBeNull();
    expect(res.product).toBeNull();
    expect(res.startPolling).toBe(false);

    // timestamp should exist and be ISO formatted
    expect(typeof res.timestamp).toBe('string');
    expect(() => new Date(res.timestamp)).not.toThrow();
  });

  it('includes entities when provided', () => {
    const res = buildResponse({
      text: 'Order found',
      intent: 'order_status',
      entities: { orderNumber: '12345' }
    });

    expect(res.entities).toEqual({ orderNumber: '12345' });
  });

  it('supports card objects', () => {
    const card = { type: 'info', title: 'Product Details' };

    const res = buildResponse({
      text: 'Here is your product',
      intent: 'product_lookup',
      card
    });

    expect(res.card).toEqual(card);
  });

  it('supports buttons', () => {
    const buttons = [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' }
    ];

    const res = buildResponse({
      text: 'Do you want to continue?',
      intent: 'faq',
      buttons
    });

    expect(res.buttons).toEqual(buttons);
  });

  it('supports list items', () => {
    const list = [
      { title: 'Item A', value: 'A' },
      { title: 'Item B', value: 'B' }
    ];

    const res = buildResponse({
      text: 'Here are your items',
      intent: 'list_products',
      list
    });

    expect(res.list).toEqual(list);
  });

  it('supports image field', () => {
    const res = buildResponse({
      text: 'Here is an image',
      intent: 'faq',
      image: 'https://example.com/image.png'
    });

    expect(res.image).toBe('https://example.com/image.png');
  });

  it('supports product object', () => {
    const product = {
      id: 1,
      title: 'iPhone 15',
      price: 1500
    };

    const res = buildResponse({
      text: 'Product info',
      intent: 'product_lookup',
      product
    });

    expect(res.product).toEqual(product);
  });

  it('supports startPolling flag', () => {
    const res = buildResponse({
      text: 'Polling started',
      intent: 'order_status',
      startPolling: true
    });

    expect(res.startPolling).toBe(true);
  });
});
