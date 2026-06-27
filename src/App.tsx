/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { ScreenType, MenuItem, CartItem, Customizations, OrderDetails } from './types';
import { MENU_ITEMS } from './data';
import { api } from './api';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import MenuView from './components/MenuView';
import ProductDetailView from './components/ProductDetailView';
import CheckoutView from './components/CheckoutView';
import OrderTrackingView from './components/OrderTrackingView';
import OurStoryView from './components/OurStoryView';
import LocationsView from './components/LocationsView';
import RewardsView from './components/RewardsView';
import CartDrawer from './components/CartDrawer';
import AdminView from './components/AdminView';

export default function App() {
  const [currentScreen, setScreen] = useState<ScreenType>(
    window.location.pathname === '/admin' ? 'admin' : 'home',
  );
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('unassuming-cart') ?? '[]'); } catch { return []; }
  });
  const [activeProduct, setActiveProduct] = useState<MenuItem>(MENU_ITEMS[0]);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Selector for customized product details
  const selectProduct = (productId: string) => {
    const found = menuItems.find(item => item.id === productId);
    if (found) {
      setActiveProduct(found);
      setScreen('product-detail');
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    api.get<MenuItem[]>('/api/catalog').then((items) => {
      const available = items.filter((item) => item.available !== false);
      setMenuItems(available);
      if (available.length) setActiveProduct(available[0]);
    }).catch(() => { /* Keep seeded static catalog while API starts. */ });
  }, []);

  useEffect(() => {
    localStorage.setItem('unassuming-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('order');
    const rewardsToken = new URLSearchParams(window.location.search).get('rewards');
    if (token) {
      api.get<OrderDetails>(`/api/orders/track/${encodeURIComponent(token)}`).then((order) => {
        setOrderDetails({ ...order, trackingToken: token });
        setScreen('order-tracking');
      }).catch(() => {});
    } else if (rewardsToken) {
      setScreen('rewards');
    }
  }, []);

  // Add Item to Cart
  const handleAddToCart = (item: MenuItem, quantity: number, customizations: Customizations) => {
    // Calculate customization price
    let basePrice = item.price;
    if (item.category === 'burgers') {
      customizations.extras.forEach(extra => {
        if (extra === 'Extra Wagyu Patty') basePrice += 3.50;
        if (extra === 'Extra Cheddar Cheese') basePrice += 1.00;
        if (extra === 'Applewood Crispy Bacon') basePrice += 2.00;
        if (extra === 'Fried Organic Egg') basePrice += 1.50;
      });
    } else if (item.category === 'sides' && item.id.includes('fries')) {
      customizations.extras.forEach(extra => {
        if (extra === 'Add White Truffle Oil') basePrice += 1.50;
        if (extra === 'Extra Shaved Parmesan') basePrice += 1.00;
      });
    }

    // Generate unique id based on options
    const optionsHash = [
      customizations.pattyDoneness || '',
      ...[...customizations.holdIngredients].sort(),
      ...[...customizations.extras].sort()
    ].join('|');

    const cartId = `${item.id}-${optionsHash}`;

    setCart(prevCart => {
      const existingIdx = prevCart.findIndex(i => i.cartId === cartId);
      if (existingIdx > -1) {
        const newCart = [...prevCart];
        newCart[existingIdx] = {
          ...newCart[existingIdx],
          quantity: newCart[existingIdx].quantity + quantity
        };
        return newCart;
      } else {
        return [
          ...prevCart,
          {
            cartId,
            menuItem: item,
            quantity,
            customizations,
            priceAtAddition: basePrice
          }
        ];
      }
    });
  };

  // Quick Add Item from Menu (adds with defaults)
  const quickAddToCart = (item: MenuItem) => {
    const defaultCustom: Customizations = {
      pattyDoneness: item.category === 'burgers' ? 'Medium Well' : undefined,
      holdIngredients: [],
      extras: []
    };
    handleAddToCart(item, 1, defaultCustom);
    setIsCartOpen(true); // Open drawer instantly to show the visual update!
  };

  // Quick Add from Product Detail Upsells
  const quickAddUpsell = (itemId: string) => {
    const found = menuItems.find(item => item.id === itemId);
    if (found) {
      quickAddToCart(found);
    }
  };

  // Adjust portion quantity in drawer
  const onUpdateQuantity = (cartId: string, delta: number) => {
    setCart(prevCart =>
      prevCart
        .map(item => {
          if (item.cartId === cartId) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter(item => item.quantity > 0)
    );
  };

  // Remove completely from cart drawer
  const onRemoveItem = (cartId: string) => {
    setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
  };

  // Triggers checkout action and hides side cart
  const onCheckoutClick = () => {
    setIsCartOpen(false);
    setScreen('checkout');
    window.scrollTo(0, 0);
  };

  // Place order action
  const onPlaceOrder = (details: OrderDetails) => {
    setOrderDetails(details);
    setCart([]); // Clear cart upon successful checkout
    setScreen('order-tracking');
    window.scrollTo(0, 0);
  };

  const resetAppletState = () => {
    setCart([]);
    setOrderDetails(null);
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeView
            setScreen={setScreen}
            selectProduct={selectProduct}
            menuItems={menuItems}
          />
        );
      case 'menu':
        return (
          <MenuView
            menuItems={menuItems}
            setScreen={setScreen}
            selectProduct={selectProduct}
            quickAddToCart={quickAddToCart}
          />
        );
      case 'product-detail':
        return (
          <ProductDetailView
            product={activeProduct}
            setScreen={setScreen}
            onAddToCart={handleAddToCart}
            quickAddUpsell={quickAddUpsell}
            menuItems={menuItems}
          />
        );
      case 'checkout':
        return (
          <CheckoutView
            cart={cart}
            setScreen={setScreen}
            onPlaceOrder={onPlaceOrder}
            clearCart={resetAppletState}
          />
        );
      case 'order-tracking':
        return (
          <OrderTrackingView
            orderDetails={orderDetails}
            setScreen={setScreen}
            resetAppletState={resetAppletState}
          />
        );
      case 'our-story':
        return <OurStoryView />;
      case 'locations':
        return <LocationsView />;
      case 'rewards':
        return <RewardsView />;
      case 'admin':
        return <AdminView />;
      default:
        return (
          <HomeView
            setScreen={setScreen}
            selectProduct={selectProduct}
            menuItems={menuItems}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 text-zinc-900 font-sans" id="app-viewport">
      {/* Global Navigation Header */}
      {currentScreen !== 'admin' && <Header
        currentScreen={currentScreen}
        setScreen={setScreen}
        cart={cart}
        toggleCart={() => setIsCartOpen(!isCartOpen)}
      />}

      {/* Main Screen Outlet */}
      <main className="flex-grow">
        {renderActiveScreen()}
      </main>

      {/* Persistent Shopping Cart Drawer */}
      {currentScreen !== 'admin' && <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onCheckoutClick={onCheckoutClick}
      />}

      {/* Global Brand Footer */}
      {currentScreen !== 'admin' && <Footer setScreen={setScreen} />}
    </div>
  );
}
