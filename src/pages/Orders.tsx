import { useState, useEffect } from 'react';
import { apiService, type Order } from '../services/api';
import { authService } from '../services/auth';

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const user = authService.getCurrentUser();
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await apiService.getUserOrders(user.id);
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'green';
      case 'shipped':
      case 'in transit': return 'blue';
      case 'processing':
      case 'order placed': return 'yellow';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchOrders}
            className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!authService.isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">🔐</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-8">You need to login to view your orders</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusColor = getStatusColor(order.order_status);
              return (
                <div key={order.order_id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center text-3xl overflow-hidden">
                        {order.items?.[0]?.product_image ? (
                          <img src={order.items[0].product_image} alt="product" className="w-full h-full object-cover" />
                        ) : '💍'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Order #{order.order_id}</p>
                        <p className="text-sm text-gray-500">{order.order_date} • {order.items?.length || 0} item(s)</p>
                      </div>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        statusColor === 'green'
                          ? 'bg-green-100 text-green-700'
                          : statusColor === 'blue'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {order.order_status}
                    </span>
                  </div>

                  {/* Order Details */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-yellow-600">₹{order.total_amount?.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="flex gap-3">
                        <button className="border-2 border-yellow-600 text-yellow-600 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-50 transition">
                          Track Order
                        </button>
                        {order.order_status.toLowerCase() === 'delivered' && (
                          <button className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition">
                            Download Invoice
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Order Timeline */}
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="font-semibold text-gray-700 mb-4">Order Status</h3>
                      <div className="flex items-center justify-between">
                        {['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map(
                          (step, index) => {
                            const steps = ['order placed', 'processing', 'shipped', 'out for delivery', 'delivered'];
                            const currentStatusIndex = steps.indexOf(order.order_status.toLowerCase());
                            const isActive = index <= currentStatusIndex;
                            return (
                              <div key={step} className="flex flex-col items-center">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    isActive ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-400'
                                  }`}
                                >
                                  {isActive && index < currentStatusIndex ? '✓' : index + 1}
                                </div>
                                <p className="text-xs text-gray-600 mt-2 text-center max-w-[80px]">
                                  {step}
                                </p>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="text-8xl mb-6">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">Start shopping to see your orders here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
