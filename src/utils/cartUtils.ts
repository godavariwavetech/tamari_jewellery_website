// Cart utility functions
import { apiService } from '../services/api';
import { authService } from '../services/auth';

// Custom event for cart updates
export const CART_UPDATE_EVENT = 'cartUpdate';

// Dispatch cart update event
export const dispatchCartUpdate = () => {
  window.dispatchEvent(new CustomEvent(CART_UPDATE_EVENT));
};

// Get current cart count
export const getCurrentCartCount = async (): Promise<number> => {
  const user = authService.getCurrentUser();
  if (!user?.id) return 0;
  
  try {
    return await apiService.getCartCount(user.id);
  } catch (error) {
    console.error('Failed to fetch cart count:', error);
    return 0;
  }
};

// Add item to cart and dispatch update
export const addToCartWithUpdate = async (productId: number, quantity: number = 1): Promise<boolean> => {
  const user = authService.getCurrentUser();
  if (!user?.id) return false;
  
  try {
    const response = await apiService.addToCart(user.id, productId, quantity);
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