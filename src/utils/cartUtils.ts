// Cart utility functions
import { apiService } from '../services/api';
import { authService } from '../services/auth';

// Custom events for cart and wishlist updates
export const CART_UPDATE_EVENT = 'cartUpdate';
export const WISHLIST_UPDATE_EVENT = 'wishlistUpdate';

// Dispatch cart update event
export const dispatchCartUpdate = () => {
  window.dispatchEvent(new CustomEvent(CART_UPDATE_EVENT));
};

// Dispatch wishlist update event
export const dispatchWishlistUpdate = () => {
  window.dispatchEvent(new CustomEvent(WISHLIST_UPDATE_EVENT));
};

// Fetch a map of product_id -> wishlist_id for the current user + role
export const getWishlistProductMap = async (): Promise<Map<number, number>> => {
  const user = authService.getCurrentUser();
  if (!user?.id) return new Map();
  try {
    const res = await apiService.getWishlist(user.id, user.role);
    if (res.success && Array.isArray(res.data)) {
      return new Map(res.data.map((i: any) => [Number(i.product_id), Number(i.wishlist_id ?? i.id)]));
    }
    return new Map();
  } catch (error) {
    console.error('Failed to load wishlist map:', error);
    return new Map();
  }
};

// Toggle wishlist state for a product. Returns the new state.
export const toggleWishlistWithUpdate = async (
  productId: number,
  sizeId: number = 0
): Promise<{ success: boolean; inWishlist: boolean; message?: string }> => {
  const user = authService.getCurrentUser();
  if (!user?.id) {
    return { success: false, inWishlist: false, message: 'login-required' };
  }

  try {
    const map = await getWishlistProductMap();
    const existingId = map.get(productId);

    if (existingId) {
      const res = await apiService.deleteWishlistItem(user.id, existingId);
      if (res.success) {
        dispatchWishlistUpdate();
        return { success: true, inWishlist: false };
      }
      return { success: false, inWishlist: true, message: 'Failed to remove from wishlist' };
    }

    const res = await apiService.addToWishlist(user.id, productId, sizeId, user.role);
    if (res.success || res.alreadyExists) {
      dispatchWishlistUpdate();
      return { success: true, inWishlist: true };
    }
    return { success: false, inWishlist: false, message: res.message || 'Failed to add to wishlist' };
  } catch (error) {
    console.error('Toggle wishlist failed:', error);
    return { success: false, inWishlist: false, message: 'Network error' };
  }
};

// Get current cart count
export const getCurrentCartCount = async (): Promise<number> => {
  const user = authService.getCurrentUser();
  if (!user?.id) return 0;

  try {
    return await apiService.getCartCount(user.id, user.role);
  } catch (error) {
    console.error('Failed to fetch cart count:', error);
    return 0;
  }
};

// Add item to cart and dispatch update
export const addToCartWithUpdate = async (productId: number, quantity: number = 1, sizeId: number = 0): Promise<boolean> => {
  const user = authService.getCurrentUser();
  if (!user?.id) return false;

  try {
    const response = await apiService.addToCart(user.id, productId, quantity, sizeId, user.role);
    if (response.success) {
      dispatchCartUpdate();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to add to cart:', error);
    return false;
  }
};

// Remove item from cart and dispatch update
export const removeFromCartWithUpdate = async (cartItemId: number): Promise<boolean> => {
  const user = authService.getCurrentUser();
  if (!user?.id) return false;
  
  try {
    const response = await apiService.deleteCartItem(user.id, cartItemId);
    if (response.success) {
      dispatchCartUpdate();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to remove from cart:', error);
    return false;
  }
};