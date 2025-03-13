/**
 * Mock data for Storybook API states and simulation
 * 
 * This file contains sample data structures that mirror expected API responses
 * for various components in the BeautyCRM Pro system.
 */

// Client data mock responses
export const clientsMockData = {
  clients: [
    {
      id: "1",
      firstName: "Emily",
      lastName: "Smith",
      email: "emily.smith@example.com",
      phone: "555-123-4567",
      address: "123 Beauty Ave, Suite 100",
      hairType: "Curly",
      skinType: "Sensitive",
      allergies: "None",
      preferredTreatments: "Color & Trim",
      birthday: "1990-05-15T00:00:00Z",
      createdAt: "2025-01-15T09:30:00Z",
      updatedAt: "2025-04-10T14:15:00Z"
    },
    {
      id: "2",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "555-987-6543",
      address: "456 Salon Street",
      hairType: "Straight",
      skinType: "Oily",
      allergies: "Sulfates",
      preferredTreatments: "Basic Cut",
      birthday: "1985-10-25T00:00:00Z",
      createdAt: "2025-02-20T10:45:00Z",
      updatedAt: "2025-05-01T16:30:00Z"
    },
    {
      id: "3",
      firstName: "Sarah",
      lastName: "Wilson",
      email: "sarah.wilson@example.com",
      phone: "555-456-7890",
      address: "789 Style Blvd",
      hairType: "Wavy",
      skinType: "Combination",
      allergies: "Fragrance",
      preferredTreatments: "Highlights & Cut",
      birthday: "1988-07-12T00:00:00Z",
      createdAt: "2025-03-05T13:20:00Z",
      updatedAt: "2025-05-05T11:10:00Z"
    }
  ]
};

// Appointment data mock responses
export const appointmentsMockData = {
  appointments: [
    {
      id: "appt-1",
      date: "2025-05-25T10:00:00Z",
      endDate: "2025-05-25T11:00:00Z",
      duration: 60,
      providerId: "stylist-a",
      providerName: "Stylist A",
      clientId: "1",
      clientName: "Emily Smith",
      serviceType: "Haircut",
      status: "CONFIRMED",
      notes: "Regular client, prefers minimum small talk",
      createdAt: "2025-05-01T14:30:00Z",
      updatedAt: "2025-05-01T14:30:00Z"
    },
    {
      id: "appt-2",
      date: "2025-05-25T11:30:00Z",
      endDate: "2025-05-25T13:00:00Z",
      duration: 90,
      providerId: "stylist-b",
      providerName: "Stylist B",
      clientId: "2",
      clientName: "John Doe",
      serviceType: "Color Treatment",
      status: "CONFIRMED",
      notes: "First time for color treatment",
      createdAt: "2025-05-02T09:15:00Z",
      updatedAt: "2025-05-02T09:15:00Z"
    },
    {
      id: "appt-3",
      date: "2025-05-26T14:00:00Z",
      endDate: "2025-05-26T14:45:00Z",
      duration: 45,
      providerId: "stylist-a",
      providerName: "Stylist A",
      clientId: "3",
      clientName: "Sarah Wilson",
      serviceType: "Blowout",
      status: "PENDING",
      notes: "",
      createdAt: "2025-05-03T11:30:00Z",
      updatedAt: "2025-05-03T11:30:00Z"
    }
  ]
};

// Transaction data mock responses
export const transactionsMockData = {
  transactions: [
    {
      id: "1",
      date: "2025-05-20T10:30:00Z",
      type: "Service",
      amount: 75.00,
      paymentMethod: "Card",
      tip: 10.00,
      notes: "Rebooked",
      clientId: "1",
      clientName: "Emily Smith",
      serviceName: "Haircut",
      productName: null,
      createdAt: "2025-05-20T10:45:00Z",
      updatedAt: "2025-05-20T10:45:00Z"
    },
    {
      id: "2",
      date: "2025-05-20T14:15:00Z",
      type: "Retail",
      amount: 35.50,
      paymentMethod: "Cash",
      tip: null,
      notes: "Upsell completed",
      clientId: "1",
      clientName: "Emily Smith",
      serviceName: null,
      productName: "Shampoo Deluxe",
      createdAt: "2025-05-20T14:20:00Z",
      updatedAt: "2025-05-20T14:20:00Z"
    },
    {
      id: "3",
      date: "2025-05-21T09:00:00Z",
      type: "Service",
      amount: 120.00,
      paymentMethod: "Card",
      tip: 20.00,
      notes: "",
      clientId: "2",
      clientName: "John Doe",
      serviceName: "Color Treatment",
      productName: null,
      createdAt: "2025-05-21T10:10:00Z",
      updatedAt: "2025-05-21T10:10:00Z"
    }
  ]
};

// Inventory data mock responses
export const inventoryMockData = {
  products: [
    {
      id: "1",
      name: "Shampoo Deluxe",
      sku: "SH-001",
      quantity: 25,
      lowStockThreshold: 10,
      vendor: {
        name: "BeautySupply Inc.",
        contact: "supplier@beautysupply.com",
        lastOrderDate: "2025-05-01T00:00:00Z",
        notes: "Premium supplier for hair products"
      },
      createdAt: "2025-01-15T00:00:00Z",
      updatedAt: "2025-05-10T00:00:00Z"
    },
    {
      id: "2",
      name: "Conditioner Plus",
      sku: "CN-002",
      quantity: 8,
      lowStockThreshold: 10,
      vendor: {
        name: "BeautySupply Inc.",
        contact: "supplier@beautysupply.com",
        lastOrderDate: "2025-05-01T00:00:00Z",
        notes: ""
      },
      createdAt: "2025-01-15T00:00:00Z",
      updatedAt: "2025-05-10T00:00:00Z"
    },
    {
      id: "3",
      name: "Hair Color - Blonde",
      sku: "HC-003",
      quantity: 15,
      lowStockThreshold: 5,
      vendor: {
        name: "ColorTech Products",
        contact: "orders@colortech.com",
        lastOrderDate: "2025-04-15T00:00:00Z",
        notes: "Order in bulk for discount"
      },
      createdAt: "2025-02-10T00:00:00Z",
      updatedAt: "2025-05-05T00:00:00Z"
    }
  ]
};

// Campaign data mock responses
export const campaignsMockData = {
  campaigns: [
    {
      id: "1",
      name: "Summer Glow Promo",
      targetSegment: "FREQUENT_BOOKER",
      messageTemplate: "Enjoy 20% off your next treatment!",
      scheduleDate: "2025-06-01T00:00:00Z",
      offerDetails: "Valid at all locations until 2025-07-01",
      status: "draft",
      createdAt: "2025-05-10T13:45:00Z",
      updatedAt: "2025-05-10T13:45:00Z"
    },
    {
      id: "2",
      name: "New Client Discount",
      targetSegment: "NEW_CLIENT",
      messageTemplate: "Welcome to our salon! Get 15% off your first visit.",
      scheduleDate: "2025-05-25T00:00:00Z",
      offerDetails: "For first-time clients only. Valid for 30 days from receipt.",
      status: "scheduled",
      createdAt: "2025-05-05T10:30:00Z",
      updatedAt: "2025-05-08T16:20:00Z"
    },
    {
      id: "3",
      name: "Re-engagement Campaign",
      targetSegment: "AT_RISK",
      messageTemplate: "We miss you! Come back and receive a complimentary treatment upgrade.",
      scheduleDate: "2025-06-15T00:00:00Z",
      offerDetails: "For clients who haven't visited in 3+ months. Expires 2025-07-15.",
      status: "draft",
      createdAt: "2025-05-12T09:15:00Z",
      updatedAt: "2025-05-12T09:15:00Z"
    }
  ]
};

// Service formula data mock responses
export const serviceFormulasMockData = {
  formulas: [
    {
      id: "1",
      name: "Hair Color Deluxe",
      ingredients: "Base Color 20ml, Developer 30ml",
      technique: "Apply evenly starting from roots",
      beforeChecklist: [
        { id: "before-1", text: "Client consultation complete", checked: true },
        { id: "before-2", text: "Tools and equipment prepared", checked: true },
        { id: "before-3", text: "Patch test performed", checked: false }
      ],
      duringChecklist: [
        { id: "during-1", text: "Process timing monitored", checked: true },
        { id: "during-2", text: "Client comfort checked", checked: true },
        { id: "during-3", text: "Mid-process rinse checked", checked: false }
      ],
      afterChecklist: [
        { id: "after-1", text: "Results reviewed with client", checked: false },
        { id: "after-2", text: "Home care instructions provided", checked: false },
        { id: "after-3", text: "Post-application conditioning done", checked: true }
      ],
      createdAt: "2025-04-10T14:30:00Z",
      updatedAt: "2025-05-05T11:15:00Z"
    },
    {
      id: "2",
      name: "Balayage Highlights",
      ingredients: "Lightener 15g, Developer 30ml, Bond Protector 5ml",
      technique: "Freehand painting technique with foils on selected sections",
      beforeChecklist: [
        { id: "before-1", text: "Hair analysis completed", checked: true },
        { id: "before-2", text: "Color history reviewed", checked: true }
      ],
      duringChecklist: [
        { id: "during-1", text: "Processing monitored every 10 minutes", checked: false }
      ],
      afterChecklist: [
        { id: "after-1", text: "Toner applied", checked: false },
        { id: "after-2", text: "Special aftercare explained", checked: false }
      ],
      createdAt: "2025-04-15T09:45:00Z",
      updatedAt: "2025-05-02T16:20:00Z"
    }
  ]
};

// A utility function to simulate API loading delay
export const delayedResponse = <T>(data: T, delayMs = 1000): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delayMs);
  });
};

// A utility function to simulate API errors
export const errorResponse = (errorMessage = "An error occurred", statusCode = 500): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject({
        message: errorMessage,
        statusCode,
      });
    }, 1000);
  });
};

// Export all mock data for easy access
export const mockApiData = {
  clients: clientsMockData,
  appointments: appointmentsMockData,
  transactions: transactionsMockData,
  inventory: inventoryMockData,
  campaigns: campaignsMockData,
  serviceFormulas: serviceFormulasMockData
}; 