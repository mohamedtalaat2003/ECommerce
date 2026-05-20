const defaultApiUrl = 'https://e-commerce-saas-a6bvghgddxcgcadx.germanywestcentral-01.azurewebsites.net';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || defaultApiUrl;

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  pictureUrl: string;
  brandName?: string;
  categoryName?: string;
  productBrandId: number;
  productCategoryId: number;
}

export interface BasketItem {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  pictureUrl: string;
  brand: string;
  category: string;
}

export interface CustomerBasket {
  id: string;
  items: BasketItem[];
  deliveryMethodId?: number | null;
  paymentIntentId?: string | null;
  clientSecret?: string | null;
  shippingPrice: number;
}

export interface User {
  displayName: string;
  email: string;
  token: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  zipCode: string;
}

export interface DeliveryMethod {
  id: number;
  shortName: string;
  deliveryTime: string;
  description: string;
  price: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  pictureUrl: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  buyerEmail: string;
  orderDate: string;
  shipToAddress: Address;
  deliveryMethod: string;
  shippingPrice: number;
  subtotal: number;
  total: number;
  status: string;
  orderItems: OrderItem[];
}

export interface ProductParams {
  pageIndex?: number;
  pageSize?: number;
  brandId?: number;
  categoryId?: number;
  sort?: string;
  search?: string;
}

// Fetch helper with auth token insertion
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `API Request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // ignore
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T;
    }
    return response.json() as Promise<T>;
  } catch (err) {
    // Network errors or other fetch failures
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      throw new Error('Network error: Unable to reach the API endpoint. Please check API_URL configuration.');
    }
    throw err;
  }
}

export const api = {
  // Products
  getProducts: async (params: ProductParams = {}): Promise<Product[]> => {
    const query = new URLSearchParams();
    if (params.pageIndex) query.append('PageIndex', params.pageIndex.toString());
    if (params.pageSize) query.append('PageSize', params.pageSize.toString());
    if (params.brandId) query.append('BrandId', params.brandId.toString());
    if (params.categoryId) query.append('CategoryId', params.categoryId.toString());
    if (params.sort) query.append('Sort', params.sort);
    if (params.search) query.append('Search', params.search);

    const queryString = query.toString();
    const endpoint = `/api/Product${queryString ? `?${queryString}` : ''}`;
    return apiRequest<Product[]>(endpoint);
  },

  getProduct: async (id: number): Promise<Product> => {
    return apiRequest<Product>(`/api/Product/${id}`);
  },

  createProduct: async (formData: FormData, token: string): Promise<Product> => {
    // When passing FormData, do NOT set Content-Type header so the browser sets the correct boundary
    return apiRequest<Product>(`/api/Product`, {
      method: 'POST',
      body: formData,
    }, token);
  },

  // Basket
  getBasket: async (id: string): Promise<CustomerBasket> => {
    return apiRequest<CustomerBasket>(`/api/Basket?Id=${id}`);
  },

  updateBasket: async (basket: CustomerBasket): Promise<CustomerBasket> => {
    return apiRequest<CustomerBasket>(`/api/Basket`, {
      method: 'POST',
      body: JSON.stringify(basket),
    });
  },

  deleteBasket: async (id: string): Promise<void> => {
    return apiRequest<void>(`/api/Basket?Id=${id}`, {
      method: 'DELETE',
    });
  },

  // Auth / Account
  login: async (credentials: { email: string; password?: string }): Promise<User> => {
    return apiRequest<User>(`/api/Account/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (data: Record<string, unknown>): Promise<User> => {
    return apiRequest<User>(`/api/Account/Register`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getCurrentUser: async (token: string): Promise<User> => {
    return apiRequest<User>(`/api/Account`, { method: 'GET' }, token);
  },

  getUserAddress: async (token: string): Promise<Address> => {
    return apiRequest<Address>(`/api/Account/address`, { method: 'GET' }, token);
  },

  updateUserAddress: async (address: Address, token: string): Promise<Address> => {
    return apiRequest<Address>(`/api/Account`, {
      method: 'PUT',
      body: JSON.stringify(address),
    }, token);
  },

  getDeliveryMethods: async (token?: string): Promise<DeliveryMethod[]> => {
    return apiRequest<DeliveryMethod[]>(`/api/Order/deliveryMethods`, {}, token);
  },

  createOrder: async (orderData: { basketId: string; deliveryMethodId: number; shipToAddress: Address }, token: string): Promise<Order> => {
    return apiRequest<Order>(`/api/Order`, {
      method: 'POST',
      body: JSON.stringify({
        basketId: parseInt(orderData.basketId) || 0, // Backend expects integer or parses it
        deliveryMethodId: orderData.deliveryMethodId,
        shipToAddress: orderData.shipToAddress,
      }),
    }, token);
  },

  getOrders: async (token: string): Promise<Order[]> => {
    return apiRequest<Order[]>(`/api/Order`, { method: 'GET' }, token);
  },

  getOrder: async (id: number, token: string): Promise<Order> => {
    return apiRequest<Order>(`/api/Order/${id}`, { method: 'GET' }, token);
  },
};
