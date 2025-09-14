'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Shop {
  id: string;
  name: string;
  slug: string;
  description: string;
  area: string;
  category: string;
  isVerified: boolean;
  isActive: boolean;
  rating: number;
  deals: Deal[];
  _count: {
    deals: number;
    orders: number;
  };
}

interface Deal {
  id: string;
  title: string;
  price: number;
  salePrice: number;
  isActive: boolean;
}

export default function MyShopsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    fetchShops();
  }, [session, status, router]);

  const fetchShops = async () => {
    try {
      const response = await fetch('/api/user/shops');
      if (response.ok) {
        const data = await response.json();
        setShops(data.shops);
      } else {
        console.error('Failed to fetch shops');
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your shops...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Shop</h1>
                <p className="text-gray-600">Manage your registered shop and deals</p>
              </div>
              {shops.length === 0 && (
                <Link
                  href="/shop/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Register New Shop
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {shops.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No shop registered yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by registering your shop.</p>
            <div className="mt-6">
              <Link
                href="/shop/register"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Register Your Shop
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <div key={shop.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{shop.name}</h3>
                    <div className="flex space-x-2">
                      {shop.isVerified && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      )}
                      {!shop.isActive && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">{shop.description}</p>
                  <p className="text-gray-500 text-sm mb-4">{shop.area} • {shop.category}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{shop._count.deals}</span> deals
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{shop._count.orders}</span> orders
                    </div>
                    <div className="text-sm text-gray-500">
                      ⭐ {shop.rating.toFixed(1)}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link
                      href={`/shop/${shop.slug}/dashboard`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 text-sm"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href={`/shop/${shop.slug}`}
                      className="flex-1 bg-gray-600 text-white text-center py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200 text-sm"
                    >
                      View Shop
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
