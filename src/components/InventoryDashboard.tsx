"use client";

import { useState, useEffect, useMemo } from 'react';
import { Search, Scan, ShoppingBag, Plus, Info, X, Trash, AlertTriangle } from 'lucide-react';

// Define the product data type
export interface ProductData {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  lowStockThreshold: number;
  vendor: {
    name: string;
    contact?: string;
    lastOrderDate?: Date;
    notes?: string;
  };
}

// Define the dashboard props
interface InventoryDashboardProps {
  products?: ProductData[];
  onAddProduct?: (product: Omit<ProductData, 'id'>) => void;
  onEditProduct?: (product: ProductData) => void;
  onDeleteProduct?: (productId: string) => void;
  onScanBarcode?: () => void;
  isLoading?: boolean;
}

export const InventoryDashboard = ({
  products = [],
  onAddProduct = () => {},
  onEditProduct = () => {},
  onDeleteProduct = () => {},
  onScanBarcode = () => {},
  isLoading = false
}: InventoryDashboardProps) => {
  // State for search query
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // State for the vendor details overlay
  const [selectedVendor, setSelectedVendor] = useState<ProductData['vendor'] | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  // State for barcode scanning simulation
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  
  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    
    const query = searchQuery.toLowerCase();
    return products.filter(
      product => 
        product.name.toLowerCase().includes(query) || 
        product.sku.toLowerCase().includes(query) ||
        product.vendor.name.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  // Simulate barcode scanning
  const handleScanClick = () => {
    setIsScanning(true);
    onScanBarcode();
    
    // Simulate a scanning delay and result
    setTimeout(() => {
      const mockScanResult = `SH-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      setScanResult(mockScanResult);
      setIsScanning(false);
      
      // Update search with scan result
      setSearchQuery(mockScanResult);
    }, 1500);
  };

  // Show vendor details
  const handleVendorInfoClick = (product: ProductData) => {
    setSelectedVendor(product.vendor);
    setSelectedProductId(product.id);
  };

  // Close vendor details
  const handleCloseVendorDetails = () => {
    setSelectedVendor(null);
    setSelectedProductId(null);
  };

  // Determine if a product is low on stock
  const isLowStock = (product: ProductData) => {
    return product.quantity <= product.lowStockThreshold;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Dashboard Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Inventory Management</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Track and manage your salon product inventory
        </p>
      </div>

      {/* Search and Actions Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name, SKU, or vendor..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleScanClick}
              disabled={isScanning}
              className="px-4 py-2 flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:bg-purple-400"
            >
              {isScanning ? (
                <span className="flex items-center">
                  <span className="animate-pulse">Scanning...</span>
                </span>
              ) : (
                <span className="flex items-center">
                  <Scan className="h-5 w-5 mr-1" />
                  Scan Barcode
                </span>
              )}
            </button>
            <button 
              onClick={() => {/* Show add product modal */}}
              className="px-4 py-2 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              <Plus className="h-5 w-5 mr-1" />
              Add Product
            </button>
          </div>
        </div>
        
        {/* Scan Result */}
        {scanResult && (
          <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md flex items-center justify-between">
            <span className="flex items-center">
              <Scan className="h-4 w-4 mr-1" />
              Scan Result: <span className="font-medium ml-1">{scanResult}</span>
            </span>
            <button 
              onClick={() => setScanResult(null)}
              className="text-blue-800 dark:text-blue-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No products available</h3>
            <p className="text-gray-600 dark:text-gray-400">Please add inventory to get started.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Product Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  SKU
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Vendor
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <tr 
                  key={product.id} 
                  className={`${
                    isLowStock(product) ? 'bg-red-50 dark:bg-red-900/20' : ''
                  } hover:bg-gray-50 dark:hover:bg-gray-750`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{product.sku}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{product.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isLowStock(product) ? (
                      <div className="flex items-center text-sm text-red-600 dark:text-red-400">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        <span>Reorder soon</span>
                      </div>
                    ) : (
                      <div className="text-sm text-green-600 dark:text-green-400">In Stock</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-900 dark:text-white">{product.vendor.name}</div>
                      <button 
                        onClick={() => handleVendorInfoClick(product)}
                        className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Info className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => onEditProduct(product)}
                      className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Vendor Details Overlay */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Vendor Details
              </h3>
              <button 
                onClick={handleCloseVendorDetails}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Vendor Name</p>
                  <p className="text-gray-900 dark:text-white">{selectedVendor.name}</p>
                </div>
                {selectedVendor.contact && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact</p>
                    <p className="text-gray-900 dark:text-white">{selectedVendor.contact}</p>
                  </div>
                )}
                {selectedVendor.lastOrderDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Order Date</p>
                    <p className="text-gray-900 dark:text-white">
                      {selectedVendor.lastOrderDate.toLocaleDateString()}
                    </p>
                  </div>
                )}
                {selectedVendor.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</p>
                    <p className="text-gray-900 dark:text-white">{selectedVendor.notes}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleCloseVendorDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryDashboard; 