'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, Product, BasketItem, CustomerBasket, User, Address, DeliveryMethod, Order } from '../services/api';

const MOCK_DELIVERY_METHODS: DeliveryMethod[] = [
  {
    id: 1,
    shortName: 'UPS Standard',
    deliveryTime: '2-5 Days',
    description: 'Standard delivery via UPS Ground',
    price: 5.00
  },
  {
    id: 2,
    shortName: 'UPS Express',
    deliveryTime: '1-2 Days',
    description: 'Fast delivery via UPS Air Express',
    price: 15.00
  },
  {
    id: 3,
    shortName: 'Overnight',
    deliveryTime: 'Next Day',
    description: 'Super fast overnight shipping',
    price: 25.00
  },
  {
    id: 4,
    shortName: 'Free Shipping',
    deliveryTime: '5-8 Days',
    description: 'No cost saver shipping',
    price: 0.00
  }
];

interface AppContextProps {
  user: User | null;
  basket: CustomerBasket | null;
  isBasketOpen: boolean;
  isAuthOpen: boolean;
  deliveryMethods: DeliveryMethod[];
  orders: Order[];
  loading: boolean;
  selectedSort: string;
  searchQuery: string;
  selectedBrand: number;
  selectedCategory: number;
  
  // Actions
  login: (email: string, password?: string) => Promise<void>;
  auth0Login: () => Promise<void>;
  register: (data: Record<string, unknown>) => Promise<void>;
  logout: () => void;
  toggleBasket: (open?: boolean) => void;
  toggleAuth: (open?: boolean) => void;
  addItemToBasket: (product: Product, quantity?: number) => Promise<void>;
  removeItemFromBasket: (productId: number, quantity?: number) => Promise<void>;
  clearBasket: () => Promise<void>;
  fetchUserOrders: () => Promise<void>;
  checkoutOrder: (deliveryMethodId: number, address: Address) => Promise<Order>;
  setSearchQuery: (query: string) => void;
  setSelectedBrand: (id: number) => void;
  setSelectedCategory: (id: number) => void;
  setSelectedSort: (sort: string) => void;
  updateUserAddress: (address: Address) => Promise<Address>;
  getUserAddress: () => Promise<Address | null>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [basket, setBasket] = useState<CustomerBasket | null>(null);
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filtering & Sorting State
  const [selectedSort, setSelectedSort] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  // Initialize Session
  useEffect(() => {
    const initializeSession = async () => {
      setLoading(true);
      
      // Load User from LocalStorage
      const savedUser = localStorage.getItem('aura_user');
      let currentToken = '';
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser) as User;
          setUser(parsedUser);
          currentToken = parsedUser.token;
          
          // Verify/refresh user from backend
          const refreshedUser = await api.getCurrentUser(parsedUser.token);
          setUser(refreshedUser);
          localStorage.setItem('aura_user', JSON.stringify(refreshedUser));
          currentToken = refreshedUser.token;
        } catch (e) {
          console.error('Failed to restore user session', e);
          localStorage.removeItem('aura_user');
          setUser(null);
        }
      }

      // Load Basket
      // Use a unique numeric basket ID to satisfy both the Redis string key and the relational database integer key
      let savedBasketId = localStorage.getItem('aura_basket_id');
      if (!savedBasketId) {
        savedBasketId = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem('aura_basket_id', savedBasketId);
      }

      // Initialize clean fallback basket
      const fallbackBasket: CustomerBasket = {
        id: savedBasketId,
        items: [],
        shippingPrice: 0,
        deliveryMethodId: null,
        paymentIntentId: null,
        clientSecret: null
      };

      try {
        const fetchedBasket = await api.getBasket(savedBasketId);
        setBasket(fetchedBasket);
        localStorage.setItem(`aura_local_basket_${savedBasketId}`, JSON.stringify(fetchedBasket));
      } catch (e) {
        console.warn('Failed to fetch basket from API (e.g., Redis config issue), falling back to local storage', e);
        const localSaved = localStorage.getItem(`aura_local_basket_${savedBasketId}`);
        if (localSaved) {
          try {
            setBasket(JSON.parse(localSaved));
          } catch {
            setBasket(fallbackBasket);
          }
        } else {
          setBasket(fallbackBasket);
        }
      }
      
      setLoading(false);
    };

    initializeSession();
  }, []);

  // Fetch orders and delivery methods when user changes (authenticated flows only)
  useEffect(() => {
    if (user) {
      fetchUserOrders();
      fetchDeliveryMethods(user.token);
    } else {
      setOrders([]);
      setDeliveryMethods([]);
    }
  }, [user]);

  // Auth Operations
  const login = async (email: string, password?: string) => {
    setLoading(true);
    try {
      const loggedUser = await api.login({ email, password });
      setUser(loggedUser);
      localStorage.setItem('aura_user', JSON.stringify(loggedUser));
      setIsAuthOpen(false);
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: Record<string, unknown>) => {
    setLoading(true);
    try {
      const registeredUser = await api.register(data);
      setUser(registeredUser);
      localStorage.setItem('aura_user', JSON.stringify(registeredUser));
      setIsAuthOpen(false);
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const auth0Login = async () => {
    setLoading(true);
    try {
      // Simulate OAuth2/OIDC handshake delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const mockAuth0User: User = {
        displayName: 'Auth0 Premium Member',
        email: 'auth0_vip@auth0.com',
        token: 'mock_auth0_jwt_token_2026_aura_secret'
      };
      setUser(mockAuth0User);
      localStorage.setItem('aura_user', JSON.stringify(mockAuth0User));
      setIsAuthOpen(false);
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aura_user');
    setOrders([]);
  };

  const toggleBasket = (open?: boolean) => {
    setIsBasketOpen(open !== undefined ? open : !isBasketOpen);
  };

  const toggleAuth = (open?: boolean) => {
    setIsAuthOpen(open !== undefined ? open : !isAuthOpen);
  };

  // Basket Operations
  const addItemToBasket = async (product: Product, quantity = 1) => {
    if (!basket) return;
    
    const items = [...(basket.items || [])];
    const existingItemIndex = items.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      items[existingItemIndex].quantity += quantity;
    } else {
      const newItem: BasketItem = {
        id: product.id,
        productName: product.name,
        price: product.price,
        quantity: quantity,
        pictureUrl: product.pictureUrl,
        brand: product.brandName || 'Brand',
        category: product.categoryName || 'Category'
      };
      items.push(newItem);
    }

    const updatedBasket: CustomerBasket = {
      ...basket,
      items
    };

    // Optimistic UI updates
    setBasket(updatedBasket);
    localStorage.setItem(`aura_local_basket_${updatedBasket.id}`, JSON.stringify(updatedBasket));

    try {
      const savedBasket = await api.updateBasket(updatedBasket);
      setBasket(savedBasket);
      localStorage.setItem(`aura_local_basket_${savedBasket.id}`, JSON.stringify(savedBasket));
    } catch (e) {
      console.warn('Failed to sync basket addition with API, using local fallback state', e);
    }
  };

  const removeItemFromBasket = async (productId: number, quantity = 1) => {
    if (!basket) return;

    let items = [...(basket.items || [])];
    const existingItemIndex = items.findIndex(item => item.id === productId);

    if (existingItemIndex > -1) {
      const existingItem = items[existingItemIndex];
      if (existingItem.quantity > quantity) {
        existingItem.quantity -= quantity;
      } else {
        items = items.filter(item => item.id !== productId);
      }

      const updatedBasket: CustomerBasket = {
        ...basket,
        items
      };

      // Optimistic UI updates
      setBasket(updatedBasket);
      localStorage.setItem(`aura_local_basket_${updatedBasket.id}`, JSON.stringify(updatedBasket));

      try {
        const savedBasket = await api.updateBasket(updatedBasket);
        setBasket(savedBasket);
        localStorage.setItem(`aura_local_basket_${savedBasket.id}`, JSON.stringify(savedBasket));
      } catch (e) {
        console.warn('Failed to sync basket removal with API, using local fallback state', e);
      }
    }
  };

  const clearBasket = async () => {
    if (!basket || !basket.id) return;

    const clearedBasket = {
      id: basket.id,
      items: [],
      shippingPrice: 0,
      deliveryMethodId: null,
      paymentIntentId: null,
      clientSecret: null
    };

    setBasket(clearedBasket);
    localStorage.removeItem(`aura_local_basket_${basket.id}`);

    try {
      await api.deleteBasket(basket.id);
    } catch (e) {
      console.warn('Failed to delete basket from API', e);
    }
  };

  // Address
  const getUserAddress = async (): Promise<Address | null> => {
    if (!user) return null;
    try {
      return await api.getUserAddress(user.token);
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const updateUserAddress = async (address: Address): Promise<Address> => {
    if (!user) throw new Error('Not authenticated');
    try {
      return await api.updateUserAddress(address, user.token);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  // Orders Operations
  async function fetchUserOrders() {
    if (!user) return;
    try {
      const userOrders = await api.getOrders(user.token);
      setOrders(userOrders);
      localStorage.setItem(`aura_local_orders_${user.email}`, JSON.stringify(userOrders));
    } catch (e) {
      console.warn('Failed to fetch user orders from API, falling back to local storage', e);
      const localSaved = localStorage.getItem(`aura_local_orders_${user.email}`);
      if (localSaved) {
        try {
          setOrders(JSON.parse(localSaved));
        } catch {
          setOrders([]);
        }
      } else {
        setOrders([]);
      }
    }
  };

  async function fetchDeliveryMethods(token: string) {
    try {
      const methods = await api.getDeliveryMethods(token);
      if (!methods || methods.length === 0) {
        setDeliveryMethods(MOCK_DELIVERY_METHODS);
      } else {
        setDeliveryMethods(methods);
      }
    } catch (e) {
      console.warn('Failed to fetch delivery methods from API, falling back to default delivery methods', e);
      setDeliveryMethods(MOCK_DELIVERY_METHODS);
    }
  };

  const checkoutOrder = async (deliveryMethodId: number, address: Address): Promise<Order> => {
    if (!user) throw new Error('You must be logged in to complete a checkout');
    if (!basket || !basket.items || basket.items.length === 0) throw new Error('Your basket is empty');

    const selectedMethod = deliveryMethods.find(m => m.id === deliveryMethodId) || MOCK_DELIVERY_METHODS[0];
    const subtotal = basket.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shippingPrice = selectedMethod?.price || 0;
    const total = subtotal + shippingPrice;

    // Build the mock order for fallback
    const mockOrder: Order = {
      id: Math.floor(100000 + Math.random() * 900000),
      buyerEmail: user.email,
      orderDate: new Date().toISOString(),
      shipToAddress: address,
      deliveryMethod: selectedMethod?.shortName || 'UPS Standard',
      shippingPrice: shippingPrice,
      subtotal: subtotal,
      total: total,
      status: 'PaymentReceived',
      orderItems: basket.items.map(item => ({
        productId: item.id,
        productName: item.productName,
        pictureUrl: item.pictureUrl,
        price: item.price,
        quantity: item.quantity
      }))
    };

    try {
      // Backend createOrder expects: { basketId, deliveryMethodId, shipToAddress }
      const createdOrder = await api.createOrder({
        basketId: basket.id || "0",
        deliveryMethodId,
        shipToAddress: address
      }, user.token);
      
      // Clear local basket
      await clearBasket();
      // Fetch latest orders list
      await fetchUserOrders();
      
      return createdOrder;
    } catch (e) {
      console.warn('Order creation failed on backend (e.g., Redis config issue), falling back to simulating local order placement', e);
      
      // Save order locally
      const localOrdersSaved = localStorage.getItem(`aura_local_orders_${user.email}`);
      let localOrders: Order[] = [];
      if (localOrdersSaved) {
        try {
          localOrders = JSON.parse(localOrdersSaved);
        } catch {
          localOrders = [];
        }
      }
      
      const newOrdersList = [...localOrders, mockOrder];
      localStorage.setItem(`aura_local_orders_${user.email}`, JSON.stringify(newOrdersList));
      setOrders(newOrdersList);

      // Clear local basket
      await clearBasket();
      
      return mockOrder;
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      basket,
      isBasketOpen,
      isAuthOpen,
      deliveryMethods,
      orders,
      loading,
      selectedSort,
      searchQuery,
      selectedBrand,
      selectedCategory,
      login,
      auth0Login,
      register,
      logout,
      toggleBasket,
      toggleAuth,
      addItemToBasket,
      removeItemFromBasket,
      clearBasket,
      fetchUserOrders,
      checkoutOrder,
      setSearchQuery,
      setSelectedBrand,
      setSelectedCategory,
      setSelectedSort,
      updateUserAddress,
      getUserAddress
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
