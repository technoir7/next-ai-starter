import type { Meta, StoryObj } from '@storybook/react';
import { InventoryDashboard, type ProductData } from '../components/InventoryDashboard';

const meta: Meta<typeof InventoryDashboard> = {
  title: 'Inventory/InventoryDashboard',
  component: InventoryDashboard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InventoryDashboard>;

// Sample product data
const sampleProducts: ProductData[] = [
  {
    id: '1',
    name: 'Shampoo Deluxe',
    sku: 'SH-001',
    quantity: 25,
    lowStockThreshold: 10,
    vendor: {
      name: 'BeautySupply Inc.',
      contact: 'supplier@beautysupply.com',
      lastOrderDate: new Date('2025-05-01'),
      notes: 'Premium supplier for hair products',
    },
  },
  {
    id: '2',
    name: 'Conditioner Plus',
    sku: 'CN-002',
    quantity: 8,
    lowStockThreshold: 10,
    vendor: {
      name: 'BeautySupply Inc.',
      contact: 'supplier@beautysupply.com',
      lastOrderDate: new Date('2025-05-01'),
    },
  },
  {
    id: '3',
    name: 'Hair Color - Blonde',
    sku: 'HC-003',
    quantity: 15,
    lowStockThreshold: 5,
    vendor: {
      name: 'ColorTech Products',
      contact: 'orders@colortech.com',
      lastOrderDate: new Date('2025-04-15'),
      notes: 'Order in bulk for discount',
    },
  },
  {
    id: '4',
    name: 'Styling Gel - Strong Hold',
    sku: 'SG-004',
    quantity: 18,
    lowStockThreshold: 5,
    vendor: {
      name: 'StyleMasters Co.',
      lastOrderDate: new Date('2025-04-10'),
    },
  },
  {
    id: '5',
    name: 'Heat Protectant Spray',
    sku: 'HP-005',
    quantity: 3,
    lowStockThreshold: 5,
    vendor: {
      name: 'HairSafe Products',
      contact: 'info@hairsafe.com',
      lastOrderDate: new Date('2025-03-22'),
    },
  },
];

// Empty inventory state
export const EmptyInventory: Story = {
  name: 'InventoryDashboard – Empty Inventory',
  args: {
    products: [],
    onAddProduct: (product) => console.log('Add product:', product),
    onEditProduct: (product) => console.log('Edit product:', product),
    onDeleteProduct: (productId) => console.log('Delete product:', productId),
    onScanBarcode: () => console.log('Barcode scan initiated'),
  },
};

// Normal state with products
export const NormalState: Story = {
  name: 'InventoryDashboard – Normal State',
  args: {
    products: sampleProducts,
    onAddProduct: (product) => console.log('Add product:', product),
    onEditProduct: (product) => console.log('Edit product:', product),
    onDeleteProduct: (productId) => console.log('Delete product:', productId),
    onScanBarcode: () => console.log('Barcode scan initiated'),
  },
};

// Vendor details overlay state
export const VendorDetailsOverlay: Story = {
  name: 'InventoryDashboard – Vendor Details Overlay',
  render: () => {
    return (
      <div className="space-y-4 max-w-6xl">
        <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 p-4 rounded-md">
          <h3 className="text-blue-800 dark:text-blue-200 font-medium">Vendor Details Demo</h3>
          <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
            Click on the information icon next to a vendor name to view detailed vendor information.
          </p>
        </div>
        
        <InventoryDashboard 
          products={sampleProducts}
          onAddProduct={(product) => console.log('Add product:', product)}
          onEditProduct={(product) => console.log('Edit product:', product)}
          onDeleteProduct={(productId) => console.log('Delete product:', productId)}
          onScanBarcode={() => console.log('Barcode scan initiated')}
        />
      </div>
    );
  },
}; 