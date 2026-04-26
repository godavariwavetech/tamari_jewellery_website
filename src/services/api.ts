const BASE_URL = import.meta.env.VITE_BASE_URL  || 'https://tamarijewellersapi.godavariwave.com/website_api';


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
  product_image_hover?: string;
  price: number;
  total_price?: number; // Add this optional field
  category_id: number;
  category_name?: string;
  subcategory_id?: number;
  subcategory_name?: string;
  description?: string;
  images?: string[];
  specifications?: any;
  material_color?: string;
  metal_name?: string;
  has_diamond?: number;
  gender?: string;
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
  subcategory_name?: string;
  has_sizes?: number;
  sizes?: Array<{ id: number; size: string }>;
  sizechart_image?: string;
  // Additional product attributes from z_all_products used in the Product Detail tab
  jewellery_type?: string;
  collection?: string;
  occasion?: string;
  no_of_diamonds?: number | string;
  diamond_setting?: string;
  diamond_shape?: string;
  stone_details?: Array<{ stone_name?: string; stone_weight?: string | number; stone_charges?: string | number }>;
  // Price breakup components computed by the backend (getproductdetails)
  metal_value?: number;
  metal_rate?: number;
  rate_per_gram?: number;       // raw 24K per-gram rate (unrounded source for karat scaling)
  diamond_value?: number;
  diamond_rate_per_ct?: number;
  stone_value?: number;
  has_stone?: number;
  makingcharges?: number;       // making_charges + VA amount (already combined)
  making_charges?: number;      // raw making_charges from DB (before VA)
  VA_percentage?: number;       // value addition %, used to recompute on purity change
  sub_total?: number;
  gst_percentage?: number;
  gst_amount?: number;
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

export type AccountRole = 'b2c' | 'b2b';

export interface LoginResponse {
  success: boolean;
  message: string;
  user_id?: number;
  token?: string;
  role?: AccountRole;
  name?: string;
  email?: string;
}

// API Functions
export const apiService = {
  // Authentication
  // Check User Status
  async checkUserStatus(phone: string): Promise<{ success: boolean; status: 'registered' | 'not_registered' | 'pending'; accounts: Array<'b2c' | 'b2b'>; message: string }> {
    try {
      const response = await fetch(`${BASE_URL}/checkuserstatus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: !!data.success,
        status: data.status,
        accounts: Array.isArray(data.accounts) ? data.accounts : [],
        message: data.message || '',
      };
    } catch (error) {
      console.error('Failed to check user status:', error);
      return {
        success: true,
        status: 'not_registered',
        accounts: [],
        message: 'User not found. Please signup first.',
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
        body: JSON.stringify({ customer_mobile_number: phone, phone }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: data.status === 200,
        message: data.message || 'OTP sent',
        user_ind: data.user_ind,
        loginotp: data.loginotp,
      };
    } catch (error) {
      console.error('Failed to send OTP:', error);
      return {
        success: true,
        message: 'OTP sent successfully (Demo Mode)',
        otp: '123456'
      };
    }
  },

  async customerLogin(phone: string, otp: string, role: AccountRole = 'b2c'): Promise<LoginResponse> {
    try {
      const response = await fetch(`${BASE_URL}/customerlogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_mobile_number: phone,
          customer_otp: otp,
          phone,
          otp,
          role,
          account_type: role,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 200 && (data.success || data.user_id || data.data?.customer_id)) {
        const customerId = data.user_id ?? data.data?.customer_id;
        const resolvedRole: AccountRole = (data.role || data.data?.role || role) === 'b2b' ? 'b2b' : 'b2c';
        return {
          success: true,
          message: data.message || 'Login successful',
          user_id: customerId,
          token: data.token || `sess-${resolvedRole}-${customerId}-${Date.now()}`,
          role: resolvedRole,
          name: data.data?.customer_name || '',
          email: data.data?.customer_email || '',
        };
      }

      return {
        success: false,
        message: data.message || 'Invalid OTP',
      };
    } catch (error) {
      console.error('Failed to login:', error);
      if (otp === '123456') {
        return {
          success: true,
          message: 'Login successful (Demo Mode)',
          user_id: 123,
          token: 'demo_token_456',
          role,
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
      console.log('Categories API response:', data); // Debug log
      return data.data || data.categories || data || [];
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
        },
        {
          id: 6,
          category_name: 'Pendants',
          category_image: '/src/assets/chain.png'
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
      console.log('Categories with subcategories API response:', data); // Debug log
      return data.data || data.categories || data || [];
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
        },
        {
          id: 4,
          category_name: 'Bracelets',
          category_image: '/src/assets/chain.png',
          subcategories: [
            { id: 7, subcategory_name: 'Gold Bracelets', category_id: 4 },
            { id: 8, subcategory_name: 'Diamond Bracelets', category_id: 4 }
          ]
        },
        {
          id: 5,
          category_name: 'Bangles',
          category_image: '/src/assets/product-image.png',
          subcategories: [
            { id: 9, subcategory_name: 'Gold Bangles', category_id: 5 },
            { id: 10, subcategory_name: 'Designer Bangles', category_id: 5 }
          ]
        },
        {
          id: 6,
          category_name: 'Pendants',
          category_image: '/src/assets/chain.png',
          subcategories: [
            { id: 11, subcategory_name: 'Gold Pendants', category_id: 6 },
            { id: 12, subcategory_name: 'Diamond Pendants', category_id: 6 }
          ]
        }
      ];
    }
  },

  async getSubcategory(categoryId: number): Promise<Subcategory[]> {
    try {
      const response = await fetch(`${BASE_URL}/getsubcategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryId }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Subcategories for category ${categoryId}:`, data); // Debug log
      return data.data || data.subcategories || [];
    } catch (error) {
      console.warn(`Failed to fetch subcategories for category ${categoryId}:`, error);
      // Return fallback subcategories based on category
      const fallbackSubcategories: Record<number, Subcategory[]> = {
        1: [
          { id: 1, subcategory_name: 'Engagement Rings', category_id: 1 },
          { id: 2, subcategory_name: 'Wedding Rings', category_id: 1 }
        ],
        2: [
          { id: 3, subcategory_name: 'Gold Chains', category_id: 2 },
          { id: 4, subcategory_name: 'Pendant Sets', category_id: 2 }
        ],
        3: [
          { id: 5, subcategory_name: 'Stud Earrings', category_id: 3 },
          { id: 6, subcategory_name: 'Drop Earrings', category_id: 3 }
        ],
        4: [
          { id: 7, subcategory_name: 'Gold Bracelets', category_id: 4 },
          { id: 8, subcategory_name: 'Diamond Bracelets', category_id: 4 }
        ],
        5: [
          { id: 9, subcategory_name: 'Gold Bangles', category_id: 5 },
          { id: 10, subcategory_name: 'Designer Bangles', category_id: 5 }
        ],
        6: [
          { id: 11, subcategory_name: 'Gold Pendants', category_id: 6 },
          { id: 12, subcategory_name: 'Diamond Pendants', category_id: 6 }
        ]
      };
      return fallbackSubcategories[categoryId] || [];
    }
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
        id: p.id || p.product_id,
        product_name: p.product_name,
        product_image: p.product_main_image || p.product_image,
        product_image_hover: p.image1 || p.image2 || p.image3 || undefined,
        price: p.total_price || p.price || 0,
        category_id: p.category_id,
        category_name: p.category_name,
        subcategory_id: p.subcategory_id,
        subcategory_name: p.subcategory_name,
        material_color: p.material_color,
        metal_name: p.metal_name,
        has_diamond: p.has_diamond,
        gender: p.gender,
        description: p.product_description || p.description
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
    console.log(userId,"userrrrid")
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

  async getTopProducts(limit: number = 10, userId?: number): Promise<Product[]> {
    try {
      const response = await fetch(`${BASE_URL}/gettopproducts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          limit,
          user_id: userId ? userId.toString() : ""
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Top products API response:', data); // Debug log
      
      return (data.data || []).map((p: any) => ({
        ...p,
        id: p.id || p.product_id,
        product_name: p.product_name,
        product_image: p.product_main_image || p.product_image,
        price: p.total_price || p.price || 0,
        total_price: p.total_price || p.price || 0,
        category_id: p.category_id,
        subcategory_id: p.subcategory_id,
        material_color: p.material_color
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
          total_price: 125000,
          category_id: 1,
          material_color: 'Yellow'
        },
        {
          id: 2,
          product_name: 'Diamond Earrings',
          product_image: '/src/assets/trending2.png',
          price: 85000,
          total_price: 85000,
          category_id: 2,
          material_color: 'White'
        },
        {
          id: 3,
          product_name: 'Gold Bracelet',
          product_image: '/src/assets/trending1.png',
          price: 65000,
          total_price: 65000,
          category_id: 1,
          material_color: 'Rose'
        },
        {
          id: 4,
          product_name: 'Pearl Ring',
          product_image: '/src/assets/trending2.png',
          price: 45000,
          total_price: 45000,
          category_id: 3,
          material_color: 'White'
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
  //   Captures the currency the user was shopping in + the rate at that moment.
  //   The backend stores these on order_lst_t.order_currency / exchange_rate_at_order.
  //   Amount columns are still in INR — these two fields are historical metadata so
  //   the order can be correctly repriced, reported (FIRC), and later settled through
  //   Razorpay International without any data migration.
  async placeOrder(orderData: {
    userId: number;
    items: any[];
    totalAmount: number;
    deliveryAddress: string;
    /** ISO 4217 code the user was viewing, e.g. 'INR' or 'USD'. Defaults to INR server-side if omitted. */
    order_currency?: string;
    /** 1 INR = X of order_currency at checkout. Defaults to 1 server-side for INR. */
    exchange_rate_at_order?: number;
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
  async getUserProfile(userId: number, role: AccountRole = 'b2c'): Promise<UserProfile | null> {
    try {
      const response = await fetch(`${BASE_URL}/userprofiledetails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, userId, role, account_type: role }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const row = data.data?.[0] || data.data || null;
      if (!row) return null;
      return {
        id: row.id ?? userId,
        name: row.customer_name || row.name || row.legal_buss_name || '',
        email: row.customer_email || row.email || '',
        phone: row.customer_mobile_number || row.phone || '',
        address: row.address,
        city: row.city,
        state: row.state,
        pincode: row.pincode,
      };
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
  async addToCart(userId: number, productId: number, quantity: number = 1, sizeId: number = 0, role: AccountRole = 'b2c'): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/addusercartitems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
          size_id: sizeId,
          quantity,
          role,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 409 || data.code === 'ITEM_ALREADY_EXISTS') {
        return { success: false, alreadyExists: true, message: data.message || 'Item already in cart' };
      }
      return {
        success: response.ok && data.status === 200,
        message: data.message,
        data: data.data,
      };
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return { success: false, message: 'Failed to add to cart' };
    }
  },

  async getCartItems(userId: number, role: AccountRole = 'b2c'): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/getusercartitems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, role }),
      });
      const data = await response.json();
      const rows = Array.isArray(data.data) ? data.data : [];
      return {
        success: data.status === 200,
        data: rows.map((item: any) => ({
          ...item,
          product_image: item.product_main_image || item.product_image,
          price: item.total_price ?? item.price ?? 0,
        })),
      };
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
      return { success: false, data: [] };
    }
  },

  async deleteCartItem(_userId: number, cartItemId: number): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/deleteusercartitems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart_id: cartItemId }),
      });
      const data = await response.json().catch(() => ({}));
      return { success: response.ok && data.status === 200, data: data.data };
    } catch (error) {
      console.error('Failed to delete cart item:', error);
      return { success: false };
    }
  },

  async getCartCount(userId: number, role: AccountRole = 'b2c'): Promise<number> {
    try {
      const response = await fetch(`${BASE_URL}/getcartcount`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, role }),
      });
      const data = await response.json();
      return Number(data.data?.[0]?.items ?? data.data?.items ?? data.count ?? 0);
    } catch (error) {
      console.warn('Failed to fetch cart count:', error);
      return 0;
    }
  },

  // Wishlist
  async addToWishlist(userId: number, productId: number, sizeId: number = 0, role: AccountRole = 'b2c'): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/adduserwishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
          size_id: sizeId,
          role,
        }),
      });
      const data = await response.json().catch(() => ({}));
      return {
        success: response.ok && data.status === 200,
        alreadyExists: !!data.already_exists,
        message: data.message,
        data: data.data,
      };
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      return { success: false, message: 'Failed to add to wishlist' };
    }
  },

  async getWishlist(userId: number, role: AccountRole = 'b2c'): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/getuserwishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, role }),
      });
      const data = await response.json();
      const rows = Array.isArray(data.data) ? data.data : [];
      return {
        success: data.status === 200,
        data: rows.map((item: any) => ({
          ...item,
          id: item.wishlist_id ?? item.id,
          wishlist_id: item.wishlist_id ?? item.id,
          product_id: item.product_id,
          product_name: item.product_name,
          product_image: item.product_main_image || item.product_image,
          price: item.total_price ?? item.price ?? 0,
        })),
      };
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      return { success: false, data: [] };
    }
  },

  async deleteWishlistItem(_userId: number, wishlistItemId: number): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/deleteuserwishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wishlist_id: wishlistItemId }),
      });
      const data = await response.json().catch(() => ({}));
      return { success: response.ok && data.status === 200, data: data.data };
    } catch (error) {
      console.error('Failed to delete wishlist item:', error);
      return { success: false };
    }
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

  // Currencies — returns every currency marked active in currency_rates_t.
  //   INR is always first. USD follows. Used by CurrencyContext to
  //   populate the Header dropdown and compute display conversions.
  async getCurrencies(): Promise<Array<{ code: string; symbol: string; rate_from_inr: number; decimals: number; locale: string }>> {
    try {
      const response = await fetch(`${BASE_URL}/getcurrencies`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const rows = Array.isArray(data.data) ? data.data : [];
      return rows.map((r: any) => ({
        code: r.code,
        symbol: r.symbol,
        rate_from_inr: Number(r.rate_from_inr),
        decimals: Number(r.decimals),
        locale: r.locale,
      }));
    } catch (err) {
      console.warn('Failed to fetch currencies, defaulting to INR only:', err);
      return [{ code: 'INR', symbol: '₹', rate_from_inr: 1, decimals: 0, locale: 'en-IN' }];
    }
  },

  // B2B Form
  async submitB2BForm(formData: any): Promise<any> {
    try {
      console.log('Submitting B2B form data:', formData);
      
      // Ensure all required fields are strings
      const cleanedData = {
        legal_buss_name: String(formData.legal_buss_name || ''),
        buss_type: String(formData.buss_type || ''),
        gstin: String(formData.gstin || ''),
        gst_image: String(formData.gst_image || ''),
        pan_num: String(formData.pan_num || ''),
        pan_imag: String(formData.pan_imag || ''),
        buildin_no: String(formData.buildin_no || ''),
        street: String(formData.street || ''),
        locality: String(formData.locality || ''),
        city: String(formData.city || ''),
        district: String(formData.district || ''),
        state: String(formData.state || ''),
        pincode: String(formData.pincode || ''),
        name: String(formData.name || ''),
        role: String(formData.role || ''),
        phn_numb: String(formData.phn_numb || ''),
        email: String(formData.email || ''),
        whatsapp_num: String(formData.whatsapp_num || ''),
        usename: String(formData.usename || ''),
        createddate: String(formData.createddate || new Date().toISOString())
      };
      
      console.log('Cleaned B2B form data:', cleanedData);
      
      const response = await fetch(`${BASE_URL}/postbtobform`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });
      
      console.log('B2B API Response status:', response.status);

      // If response is OK (200-299), inspect the inner status field — backend uses
      // HTTP 200 for everything and signals real status in the JSON body (e.g. 409 for
      // duplicate phone). Treat any inner status != 200 as a user-facing error.
      if (response.ok) {
        try {
          const result = await response.json();
          console.log('B2B API Success response:', result);
          if (result && typeof result.status === 'number' && result.status !== 200) {
            throw new Error(result.message || 'B2B form submission failed');
          }
          return {
            success: true,
            message: 'B2B form submitted successfully. Admin acceptance is pending.',
            data: result
          };
        } catch (parseError: any) {
          // Re-throw thrown user-facing errors (duplicate phone etc.) instead of
          // swallowing them as "no JSON body".
          if (parseError instanceof Error && parseError.message && !parseError.message.startsWith('Unexpected')) {
            throw parseError;
          }
          // If JSON parsing fails but response is OK, still consider it success
          console.log('B2B API response is not JSON but status is OK');
          return {
            success: true,
            message: 'B2B form submitted successfully. Admin acceptance is pending.'
          };
        }
      } else {
        // Handle error responses
        const errorText = await response.text();
        console.error('B2B API Error response:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Failed to submit B2B form:', error);
      throw error;
    }
  },

  // B2C Form
  async submitB2CForm(formData: any): Promise<any> {
    try {
      console.log('Submitting B2C form data:', formData);
      
      // Ensure all required fields are strings
      const cleanedData = {
        surname: String(formData.surname || ''),
        full_name: String(formData.full_name || ''),
        email: String(formData.email || ''),
        phn_number: String(formData.phn_number || ''),
        aadhar_num: String(formData.aadhar_num || ''),
        aadhar_img: String(formData.aadhar_img || ''),
        pan_number: String(formData.pan_number || ''),
        pan_img: String(formData.pan_img || ''),
        building_no: String(formData.building_no || ''),
        street: String(formData.street || ''),
        locality: String(formData.locality || ''),
        city: String(formData.city || ''),
        district: String(formData.district || ''),
        state: String(formData.state || ''),
        pincode: String(formData.pincode || ''),
        createddate: String(formData.createddate || new Date().toISOString())
      };
      
      console.log('Cleaned B2C form data:', cleanedData);
      
      const response = await fetch(`${BASE_URL}/postbtocform`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });
      
      console.log('B2C API Response status:', response.status);

      // If response is OK (200-299), inspect the inner status — backend always uses
      // HTTP 200 and signals real status in the JSON body (e.g. 409 for duplicate phone).
      if (response.ok) {
        try {
          const result = await response.json();
          console.log('B2C API Success response:', result);
          if (result && typeof result.status === 'number' && result.status !== 200) {
            throw new Error(result.message || 'B2C form submission failed');
          }
          return {
            success: true,
            message: 'B2C form submitted successfully. Admin acceptance is pending.',
            data: result
          };
        } catch (parseError: any) {
          // Re-throw thrown user-facing errors (duplicate phone etc.) so the form
          // can display them — only swallow genuine "body wasn't JSON" errors.
          if (parseError instanceof Error && parseError.message && !parseError.message.startsWith('Unexpected')) {
            throw parseError;
          }
          console.log('B2C API response is not JSON but status is OK');
          return {
            success: true,
            message: 'B2C form submitted successfully. Admin acceptance is pending.'
          };
        }
      } else {
        // Handle error responses
        const errorText = await response.text();
        console.error('B2C API Error response:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }
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
