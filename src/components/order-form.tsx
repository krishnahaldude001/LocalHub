'use client';

import { useState } from 'react';

interface OrderFormProps {
  deal: {
    id: string;
    title: string;
    salePrice: number;
    shop: {
      name: string;
      phone: string;
      whatsapp: string;
    };
  };
  onOrderPlaced?: (order: any) => void;
}

export default function OrderForm({ deal, onOrderPlaced }: OrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    quantity: 1,
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dealId: deal.id,
          ...formData
        }),
      });

      if (response.ok) {
        const order = await response.json();
        alert('Order placed successfully! The shop will contact you soon.');
        setFormData({
          customerName: '',
          customerPhone: '',
          customerAddress: '',
          quantity: 1,
          notes: ''
        });
        setShowForm(false);
        if (onOrderPlaced) {
          onOrderPlaced(order);
        }
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = deal.salePrice * formData.quantity;

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Place Order - Cash on Delivery
        </h3>
        <p className="text-gray-600">
          Order from <span className="font-medium">{deal.shop.name}</span>
        </p>
      </div>

      {!showForm ? (
        <div className="text-center">
          <div className="mb-4">
            <p className="text-2xl font-bold text-green-600">₹{deal.salePrice}</p>
            <p className="text-sm text-gray-500">per item</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            Order Now (COD)
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Pay when you receive the item
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Customer Name */}
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              required
              value={formData.customerName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="customerPhone"
              name="customerPhone"
              required
              value={formData.customerPhone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+91 98765 43210"
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Address *
            </label>
            <textarea
              id="customerAddress"
              name="customerAddress"
              required
              rows={3}
              value={formData.customerAddress}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter complete delivery address"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any special instructions..."
            />
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Item Price:</span>
              <span className="text-sm">₹{deal.salePrice}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Quantity:</span>
              <span className="text-sm">{formData.quantity}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Total Amount:</span>
                <span className="font-bold text-lg text-green-600">₹{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            By placing this order, you agree to pay ₹{totalAmount} when you receive the item.
          </p>
        </form>
      )}

      {/* Contact Shop */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Shop Directly</h4>
        <div className="flex space-x-3">
          <a
            href={`tel:${deal.shop.phone}`}
            className="flex-1 bg-green-600 text-white py-2 px-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 text-center text-sm"
          >
            📞 Call
          </a>
          {deal.shop.whatsapp && (
            <a
              href={`https://wa.me/${deal.shop.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-500 text-white py-2 px-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 text-center text-sm"
            >
              💬 WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
