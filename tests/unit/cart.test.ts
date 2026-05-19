import { describe, it, expect } from 'vitest';
import { useCartStore } from '../../app/stores/cart';

describe('Pinia Cart Store', () => {
  const mockItem = {
    id: 1,
    productId: 101,
    title: 'Сатору Годжо: Hollow Purple Ver.',
    variantName: 'Масштаб 1/7',
    variantId: 201,
    price: 18900,
    quantity: 1,
    imageUrl: '/images/gojo.png',
  };

  const mockItem2 = {
    id: 2,
    productId: 102,
    title: 'Аска Лэнгли (Test Suit Ver.)',
    variantName: 'Стандарт',
    variantId: 202,
    price: 15500,
    quantity: 2,
    imageUrl: '/images/asuka.png',
  };

  it('should initialize with an empty cart and closed drawer', () => {
    const cart = useCartStore();
    expect(cart.items).toEqual([]);
    expect(cart.isOpen).toBe(false);
    expect(cart.totalItems).toBe(0);
    expect(cart.totalPrice).toBe(0);
  });

  it('should add a new item to the cart', () => {
    const cart = useCartStore();
    cart.addItem(mockItem);
    expect(cart.items.length).toBe(1);
    expect(cart.items[0]).toEqual(mockItem);
    expect(cart.totalItems).toBe(1);
    expect(cart.totalPrice).toBe(18900);
  });

  it('should increment quantity when adding an existing variant item', () => {
    const cart = useCartStore();
    cart.addItem(mockItem);
    cart.addItem({ ...mockItem, quantity: 2 });
    
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].quantity).toBe(3);
    expect(cart.totalItems).toBe(3);
    expect(cart.totalPrice).toBe(18900 * 3);
  });

  it('should remove an item by variant ID', () => {
    const cart = useCartStore();
    cart.addItem(mockItem);
    cart.addItem(mockItem2);
    
    expect(cart.items.length).toBe(2);
    
    cart.removeItem(mockItem.variantId);
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].variantId).toBe(mockItem2.variantId);
  });

  it('should increment item quantity via actions', () => {
    const cart = useCartStore();
    cart.addItem(mockItem);
    
    cart.incrementQuantity(mockItem.variantId);
    expect(cart.items[0].quantity).toBe(2);
    expect(cart.totalItems).toBe(2);
  });

  it('should decrement item quantity, and remove item if quantity drops to 0', () => {
    const cart = useCartStore();
    cart.addItem({ ...mockItem, quantity: 2 });
    
    cart.decrementQuantity(mockItem.variantId);
    expect(cart.items[0].quantity).toBe(1);
    
    cart.decrementQuantity(mockItem.variantId);
    expect(cart.items).toEqual([]);
    expect(cart.totalItems).toBe(0);
  });

  it('should clear all items in the cart', () => {
    const cart = useCartStore();
    cart.addItem(mockItem);
    cart.addItem(mockItem2);
    
    expect(cart.items.length).toBe(2);
    cart.clear();
    expect(cart.items).toEqual([]);
    expect(cart.totalItems).toBe(0);
  });

  it('should toggle the cart drawer visibility', () => {
    const cart = useCartStore();
    
    cart.toggleCart();
    expect(cart.isOpen).toBe(true);
    
    cart.toggleCart();
    expect(cart.isOpen).toBe(false);
    
    cart.toggleCart(true);
    expect(cart.isOpen).toBe(true);
    
    cart.toggleCart(true);
    expect(cart.isOpen).toBe(true);
  });
});
