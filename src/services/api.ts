const BASE_URL = 'https://tamarijewellersapi.godavariwave.com/website_api';

// API Response Types
export interface Category {
  id: number;
  category_name: string;
  category_image: string;
}

export interface Subcategory {
  id: number;
  subcategory_name: string;
  category_id: number;
}

export interface CategoryWithSubcategories {
  id: number;
  category_name: string;
  category_image: string;
  subcategories: Subcategory[];
}

export interface Product {
  id: number;
  product_name: string;
  product_image: string;
  price: number;
  category_id: number;
  subcategory_id?: number;
  description?: string;
  images?: string[];
  specifications?: any;
  material_color?: string;
}

export interface ProductDetail extends Product {
  is_wishlist: boolean;
  product_images: string[];
  product_specifications: any;
  related_products?: Product[];
  sku_id?: string;
  gross_weight?: string;
  net_weight?: string;
  karat?: number;
  material_color?: string;
  metal_name?: string;
  diamond_weight?: string;
  diamond_clarity?: string;
  diamond_color?: string;
  category_name?: string;
}

export interface Banner {
  id: number;
  banner_image: string;
  banner_title?: string;
  banner_description?: string;
}

export interface BannerVideo {
  id: number;
  video_url: string;
  video_title?: string;
  video_description?: string;
}

export interface Brand {
  id: number;
  brand_name: string;
  brand_image: string;
}

export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  product_name: string;
  product_image: string;
}

export interface Order {
  id: string;
  order_id: string;
  order_date: string;
  total_amount: number;
  order_status: string;
  items: OrderItem[];
  delivery_address?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface Review {
  id: number;
  user_id: number;
  user_name: string;
  rating: number;
  review: string;
  created_at: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user_id?: number;
  token?: string;
}

// API Functions
export const apiService = {
  // Authentication
  // Check User Status
  async checkUserStatus(phone: string): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/checkuserstatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to check user status:', error);
      // Return a mock response for development
      return {
        success: true,
        status: 'not_registered', // 'registered', 'pending', 'not_registered'
        message: 'User not found. Please signup first.'
      };
    }
  },

  async getUserLoginOTP(phone: string): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/getuserloginotp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to send OTP:', error);
      // Return a mock success response for development
      return {
        success: true,
        message: 'OTP sent successfully (Demo Mode)',
        otp: '123456' // For development only
      };
    }
  },

  async customerLogin(phone: string, otp: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${BASE_URL}/customerlogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to login:', error);
      // Return a mock success response for development
      if (otp === '123456') {
        return {
          success: true,
          message: 'Login successful (Demo Mode)',
          user_id: 123,
          token: 'demo_token_456'
        };
      } else {
        return {
          success: false,
          message: 'Invalid OTP. Use 123456 for demo.'
        };
      }
    }
  },

  // Categories & Products
  async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${BASE_URL}/getcategory`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || data.categories || [];
    } catch (error) {
      console.warn('Failed to fetch categories, using fallback data:', error);
      // Return fallback data when API fails
      return [
        {
          id: 1,
          category_name: 'Rings',
          category_image: '/src/assets/product-image.png'
        },
        {
          id: 2,
          category_name: 'Necklaces',
          category_image: '/src/assets/chain.png'
        },
        {
          id: 3,
          category_name: 'Earrings',
          category_image: '/src/assets/product-image.png'
        },
        {
          id: 4,
          category_name: 'Bracelets',
          category_image: '/src/assets/chain.png'
        },
        {
          id: 5,
          category_name: 'Bangles',
          category_image: '/src/assets/product-image.png'
        }
      ];
    }
  },

  async getCategoriesWithSubcategories(): Promise<CategoryWithSubcategories[]> {
    try {
      const response = await fetch(`${BASE_URL}/getcategorieswithsubcategories`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || data.categories || [];
    } catch (error) {
      console.warn('Failed to fetch categories with subcategories, using fallback data:', error);
      // Return fallback data when API fails
      return [
        {
          id: 1,
          category_name: 'Rings',
          category_image: '/src/assets/product-image.png',
          subcategories: [
            { id: 1, subcategory_name: 'Engagement Rings', category_id: 1 },
            { id: 2, subcategory_name: 'Wedding Rings', category_id: 1 }
          ]
        },
        {
          id: 2,
          category_name: 'Necklaces',
          category_image: '/src/assets/chain.png',
          subcategories: [
            { id: 3, subcategory_name: 'Gold Chains', category_id: 2 },
            { id: 4, subcategory_name: 'Pendant Sets', category_id: 2 }
          ]
        },
        {
          id: 3,
          category_name: 'Earrings',
          category_image: '/src/assets/product-image.png',
          subcategories: [
            { id: 5, subcategory_name: 'Stud Earrings', category_id: 3 },
            { id: 6, subcategory_name: 'Drop Earrings', category_id: 3 }
          ]
        }
      ];
    }
  },

  async getSubcategory(categoryId: number): Promise<Subcategory[]> {
    const response = await fetch(`${BASE_URL}/getsubcategory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categoryId }),
    });
    const data = await response.json();
    return data.data || [];
  },

  async getProducts(categoryId?: number, page: number = 1): Promise<{ products: Product[], total: number }> {
    try {
      const response = await fetch(`${BASE_URL}/getproducts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryId: categoryId || '', page }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const products = (data.data || []).map((p: any) => ({
        ...p,
        product_image: p.product_main_image || p.product_image,
        price: p.total_price || p.price
      }));
      const total = data.total || products.length;

      // If we are on the first page and there are more products, fetch all pages
      if (page === 1 && total > products.length) {
        const totalPages = Math.ceil(total / products.length);
        const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
        const remainingResults = await Promise.all(
          remainingPages.map(p => this.getProducts(categoryId, p))
        );
        const allProducts = products.concat(...remainingResults.map(r => r.products));
        return { products: allProducts, total };
      }

      return { products, total };
    } catch (error) {
      console.warn('Failed to fetch products, using fallback data:', error);
      // Return fallback data when API fails
      const fallbackProducts = [
        {
          id: 1,
          product_name: '2 Carat Oval Shape Diamond Ring With Halo Setting',
          product_image: '/src/assets/trending1.png',
          price: 189000,
          category_id: categoryId || 1,
          subcategory_id: 1,
          material_color: 'Yellow'
        },
        {
          id: 2,
          product_name: 'Classic Solitaire Engagement Ring',
          product_image: '/src/assets/trending2.png',
          price: 125000,
          category_id: categoryId || 1,
          subcategory_id: 2,
          material_color: 'White'
        },
        {
          id: 3,
          product_name: 'Vintage Style Diamond Band',
          product_image: '/src/assets/trending1.png',
          price: 95000,
          category_id: categoryId || 2,
          subcategory_id: 3,
          material_color: 'Rose'
        },
        {
          id: 4,
          product_name: 'Modern Eternity Ring with Baguette Diamonds',
          product_image: '/src/assets/trending2.png',
          price: 275000,
          category_id: categoryId || 1,
          subcategory_id: 1,
          material_color: 'White'
        },
        {
          id: 5,
          product_name: 'Rose Gold Floral Design Earring',
          product_image: '/src/assets/trending1.png',
          price: 65000,
          category_id: categoryId || 3,
          subcategory_id: 5,
          material_color: 'Rose'
        },
        {
          id: 6,
          product_name: 'White Gold Teardrop Necklace',
          product_image: '/src/assets/trending2.png',
          price: 85000,
          category_id: categoryId || 2,
          subcategory_id: 4,
          material_color: 'White'
        },
        {
          id: 7,
          product_name: 'Yellow Gold Chain Bracelet',
          product_image: '/src/assets/trending1.png',
          price: 45000,
          category_id: categoryId || 4,
          subcategory_id: 6,
          material_color: 'Yellow'
        },
        {
          id: 8,
          product_name: 'Diamond Stud Earrings',
          product_image: '/src/assets/trending2.png',
          price: 155000,
          category_id: categoryId || 3,
          subcategory_id: 5,
          material_color: 'White'
        },
        {
          id: 9,
          product_name: 'Gold Pendant Necklace',
          product_image: '/src/assets/trending1.png',
          price: 75000,
          category_id: categoryId || 2,
          subcategory_id: 4,
          material_color: 'Yellow'
        },
        {
          id: 10,
          product_name: 'Platinum Wedding Band',
          product_image: '/src/assets/trending2.png',
          price: 195000,
          category_id: categoryId || 1,
          subcategory_id: 2,
          material_color: 'White'
        }
      ];
      
      // Filter by category if specified
      const filteredProducts = categoryId 
        ? fallbackProducts.filter(p => p.category_id === categoryId)
        : fallbackProducts;
      
      return {
        products: filteredProducts,
        total: filteredProducts.length
      };
    }
  },

  async getFilteredProducts(filters: {
    categoryIds?: number[];
    subcategoryIds?: number[];
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    page?: number;
  }): Promise<{ products: Product[], total: number }> {
    try {
      const response = await fetch(`${BASE_URL}/getfilteredproducts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        products: (data.data || []).map((p: any) => ({
          ...p,
          product_image: p.product_main_image || p.product_image,
          price: p.total_price || p.price
        })),
        total: data.total || 0
      };
    } catch (error) {
      console.warn('Filtered products API not available, using fallback filtering:', error);
      // Fallback to regular getProducts and filter client-side
      const allProducts = await this.getProducts();
      return allProducts;
    }
  },

  async getProductDetails(productId: number, userId?: number): Promise<ProductDetail> {
    try {
      const response = await fetch(`${BASE_URL}/getproductdetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          product_id: productId, 
          user_id: userId || ""
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const p = Array.isArray(data.data) ? data.data[0] : data.data;
      
      if (!p) {
        throw new Error('Product not found in API response');
      }
      
      return {
        ...p,
        id: p.id,
        product_id: p.id,
        product_name: p.product_name,
        product_image: p.product_main_image || p.product_image,
        price: p.total_price || p.price,
        description: p.product_description || p.description,
        is_wishlist: p.wishlist_flag === 1,
        product_images: [p.product_main_image, p.image1, p.image2, p.image3].filter(img => img && img !== "") || p.product_images || [],
        product_specifications: {
          metal: `${p.metal_name || ''} ${p.karat || ''}KT ${p.material_color || ''}`,
          weight: `${p.gross_weight || ''} gm`,
          diamond: p.has_diamond ? `${p.diamond_weight || ''} cts ${p.diamond_clarity || ''} ${p.diamond_color || ''}` : 'No Diamond',
          size: p.has_sizes ? (p.sizes?.map((s: any) => s.size).join(', ') || 'Available') : 'Standard'
        },
        sku_id: p.sku_id,
        gross_weight: p.gross_weight,
        karat: p.karat,
        material_color: p.material_color,
        metal_name: p.metal_name,
        diamond_weight: p.diamond_weight,
        diamond_clarity: p.diamond_clarity,
        diamond_color: p.diamond_color,
        category_name: p.category_name
      };
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      throw error;
    }
  },

  async getTopProducts(limit: number = 10): Promise<Product[]> {
    try {
      const response = await fetch(`${BASE_URL}/gettopproducts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ limit }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return (data.data || []).map((p: any) => ({
        ...p,
        product_image: p.product_main_image || p.product_image,
        price: p.total_price || p.price
      }));
    } catch (error) {
      console.warn('Failed to fetch top products, using fallback data:', error);
      // Return fallback data when API fails
      return [
        {
          id: 1,
          product_name: 'Elegant Gold Necklace',
          product_image: '/src/assets/trending1.png',
          price: 125000,
          category_id: 1
        },
        {
          id: 2,
          product_name: 'Diamond Earrings',
          product_image: '/src/assets/trending2.png',
          price: 85000,
          category_id: 2
        },
        {
          id: 3,
          product_name: 'Gold Bracelet',
          product_image: '/src/assets/trending1.png',
          price: 65000,
          category_id: 1
        },
        {
          id: 4,
          product_name: 'Pearl Ring',
          product_image: '/src/assets/trending2.png',
          price: 45000,
          category_id: 3
        }
      ];
    }
  },

  async getRecommendedProducts(limit: number = 10): Promise<Product[]> {
    try {
      const response = await fetch(`${BASE_URL}/getrecommendedproducts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ limit }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return (data.data || []).map((p: any) => ({
        ...p,
        product_image: p.product_main_image || p.product_image,
        price: p.total_price || p.price
      }));
    } catch (error) {
      console.warn('Failed to fetch recommended products, using fallback data:', error);
      // Return fallback data when API fails
      return [
        {
          id: 101,
          product_name: 'Recommended Gold Ring',
          product_image: '/src/assets/trending1.png',
          price: 75000,
          category_id: 1
        },
        {
          id: 102,
          product_name: 'Recommended Diamond Necklace',
          product_image: '/src/assets/trending2.png',
          price: 150000,
          category_id: 2
        },
        {
          id: 103,
          product_name: 'Recommended Pearl Earrings',
          product_image: '/src/assets/trending1.png',
          price: 55000,
          category_id: 3
        },
        {
          id: 104,
          product_name: 'Recommended Silver Bracelet',
          product_image: '/src/assets/trending2.png',
          price: 35000,
          category_id: 4
        }
      ];
    }
  },

  // Banners & Media
  async getBanners(): Promise<Banner[]> {
    try {
      const response = await fetch(`${BASE_URL}/getbanners`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.warn('Failed to fetch banners, using fallback data:', error);
      return [];
    }
  },

  async getBannerVideos(): Promise<BannerVideo[]> {
    try {
      const response = await fetch(`${BASE_URL}/getbannervideos`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // Map backend fields (video/video_url) to a consistent shape
      return (data.data || data.videos || [])
        .map((v: any) => ({
          id: v.id ?? v.video_id ?? 0,
          video_url: v.video || v.video_url || "",
          video_title: v.video_title || v.title || "",
          video_description: v.video_description || v.description || ""
        }))
        .filter((v: BannerVideo) => Boolean(v.video_url));
    } catch (error) {
      console.warn('Failed to fetch banner videos, using fallback data:', error);
      // Return fallback data when API fails
      return [
        {
          id: 1,
          video_url: "https://www.youtube.com/watch?v=y7HeCZiCPOQ",
          video_title: "TAMIRI JEWELLERY PRIVATE LIMITED TAMIRI SRIKANTH RECEIVED Raj News...",
        },
        {
          id: 2, 
          video_url: "https://www.youtube.com/watch?v=y7HeCZiCPOQ",
          video_title: "జ్యువెలరీ వ్యాపారం అంత సులువు కాదు - Tamiri Jewellery MD Tamiri Srikanth",
        },
        {
          id: 3,
          video_url: "https://www.youtube.com/watch?v=y7HeCZiCPOQ", 
          video_title: "నాణ్యత, నమ్మకమే మా బిజినెస్ సీక్రెట్స్ | Tamiri Jewellery MD Tamiri Srikanth Fac...",
        },
        {
          id: 4,
          video_url: "https://www.youtube.com/watch?v=y7HeCZiCPOQ",
          video_title: "Amazing diamond ring! The brilliance of the stone catches the light beautifully...",
        },
      ];
    }
  },

  async getBrands(): Promise<Brand[]> {
    try {
      const response = await fetch(`${BASE_URL}/getbrands`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.warn('Failed to fetch brands:', error);
      return [];
    }
  },

  // Orders
  async placeOrder(orderData: {
    userId: number;
    items: any[];
    totalAmount: number;
    deliveryAddress: string;
  }): Promise<any> {
    const response = await fetch(`${BASE_URL}/orderplaced`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return response.json();
  },

  async getUserOrders(userId: number): Promise<Order[]> {
    try {
      const response = await fetch(`${BASE_URL}/getuserorders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.warn('Failed to fetch user orders:', error);
      return [];
    }
  },

  async getOrderDetails(orderId: string): Promise<Order | null> {
    try {
      const response = await fetch(`${BASE_URL}/getorderdetails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.data?.[0] || data.data || null;
    } catch (error) {
      console.warn('Failed to fetch order details:', error);
      return null;
    }
  },

  async generateOrderId(userId: number): Promise<string | null> {
    try {
      const response = await fetch(`${BASE_URL}/generateorderid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.orderId || data.data?.orderId || null;
    } catch (error) {
      console.warn('Failed to generate order ID:', error);
      return null;
    }
  },

  // Reviews
  async addProductReview(reviewData: {
    userId: number;
    productId: number;
    rating: number;
    review: string;
  }): Promise<any> {
    const response = await fetch(`${BASE_URL}/postuserreviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    return response.json();
  },

  async getProductReviews(productId: number): Promise<Review[]> {
    try {
      const response = await fetch(`${BASE_URL}/postuserreviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.warn('Failed to fetch product reviews:', error);
      return [];
    }
  },

  // User Profile
  async getUserProfile(userId: number): Promise<UserProfile | null> {
    try {
      const response = await fetch(`${BASE_URL}/getuserprofile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.data?.[0] || data.data || null;
    } catch (error) {
      console.warn('Failed to fetch user profile:', error);
      return null;
    }
  },

  async updateUserProfile(profileData: {
    userId: number;
    name?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  }): Promise<any> {
    const response = await fetch(`${BASE_URL}/updateuserprofile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    return response.json();
  },

  // Cart
  async addToCart(userId: number, productId: number, quantity: number = 1): Promise<any> {
    const response = await fetch(`${BASE_URL}/addusercartitems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, productId, quantity }),
    });
    return response.json();
  },

  async getCartItems(userId: number): Promise<any> {
    const response = await fetch(`${BASE_URL}/getusercartitems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    return response.json();
  },

  async deleteCartItem(userId: number, cartItemId: number): Promise<any> {
    const response = await fetch(`${BASE_URL}/deleteusercartitems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, cartItemId }),
    });
    return response.json();
  },

  async getCartCount(userId: number): Promise<number> {
    const response = await fetch(`${BASE_URL}/getcartcount`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    return data.data?.count || data.count || 0;
  },

  // Wishlist
  async addToWishlist(userId: number, productId: number): Promise<any> {
    const response = await fetch(`${BASE_URL}/adduserwishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, productId }),
    });
    return response.json();
  },

  async getWishlist(userId: number): Promise<any> {
    const response = await fetch(`${BASE_URL}/getuserwishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    return response.json();
  },

  async deleteWishlistItem(userId: number, wishlistItemId: number): Promise<any> {
    const response = await fetch(`${BASE_URL}/deleteuserwishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, wishlistItemId }),
    });
    return response.json();
  },

  // Pricing
  async getDailyMetalRates(): Promise<any> {
    const response = await fetch(`${BASE_URL}/getdailymetalrates`);
    return response.json();
  },

  // Application Data
  async getApplicationData(): Promise<any> {
    const response = await fetch(`${BASE_URL}/getapplicationdata`);
    return response.json();
  },

  // B2B Form
  async submitB2BForm(formData: any): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/postbtobform`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to submit B2B form:', error);
      throw error;
    }
  },

  // B2C Form
  async submitB2CForm(formData: any): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/postbtocform`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to submit B2C form:', error);
      throw error;
    }
  },

  // Appointment
  async submitAppointment(formData: any): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/postappointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to submit appointment:', error);
      throw error;
    }
  }
};

export default apiService;
