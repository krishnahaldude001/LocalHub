'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ShopActivationMessage from '@/components/shop-activation-message';

interface Shop {
  id: string;
  name: string;
  slug: string;
  description: string;
  ownerName: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  area: string;
  category: string;
  businessHours: string;
  image: string;
  status: string;
  isVerified: boolean;
  isActive: boolean;
  rating: number;
  totalOrders: number;
  deals: Deal[];
  orders: Order[];
}

interface Deal {
  id: string;
  title: string;
  description: string;
  price: number;
  salePrice: number;
  category: string;
  discountType: string;
  isActive: boolean;
  viewCount: number;
  createdAt: string;
  orders: Order[];
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  customerMessage?: string;
  quantity: number;
  totalAmount: number;
  status: string;
  orderType?: string;
  createdAt: string;
  deal?: {
    id: string;
    title: string;
  };
}

export default function ShopDashboard() {
  const params = useParams();
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('deals');

  useEffect(() => {
    if (params.slug) {
      fetchShop();
    }
  }, [params.slug]);

  const fetchShop = async () => {
    try {
      const response = await fetch(`/api/shops/${params.slug}`);
      if (response.ok) {
        const shopData = await response.json();
        setShop(shopData);
      } else {
        router.push('/shop/register');
      }
    } catch (error) {
      console.error('Error fetching shop:', error);
      router.push('/shop/register');
    } finally {
      setLoading(false);
    }
  };

  const handleDealStatusToggle = async (dealId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        fetchShop(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating deal status:', error);
    }
  };

  const handleDeleteDeal = async (dealId: string) => {
    if (!confirm('Are you sure you want to delete this deal? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Deal deleted successfully!');
        fetchShop(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete deal');
      }
    } catch (error) {
      console.error('Error deleting deal:', error);
      alert('Failed to delete deal. Please try again.');
    }
  };

  const handleOrderStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert(`Order ${newStatus} successfully!`);
        fetchShop(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Shop Not Found</h1>
          <Link href="/shop/register" className="text-blue-600 hover:text-blue-500">
            Register your shop
          </Link>
        </div>
      </div>
    );
  }

  const totalOrders = shop.orders.length;
  const totalRevenue = shop.orders.reduce((sum, order) => sum + order.totalAmount, 0);

  // Show activation message if shop is not active
  if (shop.status !== 'active') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <ShopActivationMessage 
            status={shop.status as 'pending' | 'active' | 'suspended' | 'rejected'}
            shopName={shop.name}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{shop.name}</h1>
                <p className="text-gray-600">{shop.area} • {shop.category}</p>
                {!shop.isVerified && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending Verification
                    </span>
                  </div>
                )}
              </div>
              <div className="flex space-x-4">
                <Link
                  href={`/shop/${shop.slug}/deals/new`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Add New Deal
                </Link>
                <Link
                  href={`/shop/${shop.slug}`}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
                >
                  View Shop
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Deals</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {shop.deals.filter(deal => deal.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">₹{totalRevenue.toFixed(0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-semibold text-gray-900">{shop.rating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('deals')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'deals'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Deals ({shop.deals.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Orders ({totalOrders})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'deals' && (
              <div className="space-y-4">
                {shop.deals.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No deals yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating your first deal.</p>
                    <div className="mt-6">
                      <Link
                        href={`/shop/${shop.slug}/deals/new`}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Add New Deal
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shop.deals.map((deal) => (
                      <div key={deal.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">{deal.title}</h3>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDealStatusToggle(deal.id, deal.isActive)}
                              className={`px-2 py-1 text-xs rounded-full ${
                                deal.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {deal.isActive ? 'Active' : 'Inactive'}
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{deal.description}</p>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-semibold text-green-600">₹{deal.salePrice}</span>
                          <span className="text-sm text-gray-500 line-through">₹{deal.price}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                          <span>{deal.viewCount} views</span>
                          <span>{deal.orders.length} orders</span>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            href={`/shop/${shop.slug}/deals/${deal.id}/edit`}
                            className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded-md hover:bg-blue-700 transition duration-200 text-sm"
                          >
                            Edit Deal
                          </Link>
                          <button
                            onClick={() => handleDeleteDeal(deal.id)}
                            className="flex-1 bg-red-600 text-white text-center py-2 px-3 rounded-md hover:bg-red-700 transition duration-200 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                {totalOrders === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Orders will appear here when customers place them.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {shop.orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-gray-900">{order.deal?.title || 'Deal not found'}</h3>
                            <p className="text-sm text-gray-600">Order #{order.id.slice(-8)}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">👤 Customer:</span>
                              <span className="text-gray-900">{order.customerName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">📞 Phone:</span>
                              <a href={`tel:${order.customerPhone}`} className="text-blue-600 hover:underline">
                                {order.customerPhone}
                              </a>
                            </div>
                            {order.customerEmail && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-700">📧 Email:</span>
                                <a href={`mailto:${order.customerEmail}`} className="text-blue-600 hover:underline">
                                  {order.customerEmail}
                                </a>
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">💰 Amount:</span>
                              <span className="text-green-600 font-semibold">₹{order.totalAmount}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">📦 Type:</span>
                              <span className="text-gray-900">{order.orderType || 'COD'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">📅 Ordered:</span>
                              <span className="text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-2">
                            <span className="font-medium text-gray-700">📍 Address:</span>
                            <span className="text-gray-900">{order.customerAddress}</span>
                          </div>
                          {order.customerMessage && (
                            <div className="flex items-start gap-2 mt-2">
                              <span className="font-medium text-gray-700">💬 Message:</span>
                              <span className="text-gray-900">{order.customerMessage}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="mt-4 flex gap-2">
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleOrderStatusUpdate(order.id, 'confirmed')}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors"
                            >
                              ✓ Confirm Order
                            </button>
                          )}
                          {order.status === 'confirmed' && (
                            <button
                              onClick={() => handleOrderStatusUpdate(order.id, 'delivered')}
                              className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full hover:bg-green-200 transition-colors"
                            >
                              🚚 Mark Delivered
                            </button>
                          )}
                          <a
                            href={`tel:${order.customerPhone}`}
                            className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full hover:bg-gray-200 transition-colors"
                          >
                            📞 Call Customer
                          </a>
                          {order.customerEmail && (
                            <a
                              href={`mailto:${order.customerEmail}`}
                              className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full hover:bg-gray-200 transition-colors"
                            >
                              📧 Email
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
