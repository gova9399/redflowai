
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, Package, DollarSign, Truck, Receipt, Percent, Download, Send, Edit } from 'lucide-react';
import CalculationResult from './CalculationResult';
import * as XLSX from 'xlsx';

interface ProductData {
  productId: string;
  materialName: string;
  unitPrice: number;
  gstPercentage: number;
  travelingCost: number;
  quantity: number;
  discountPercentage: number;
}

const ProductCalculator = () => {
  const [productData, setProductData] = useState<ProductData>({
    productId: '',
    materialName: '',
    unitPrice: 0,
    gstPercentage: 0,
    travelingCost: 0,
    quantity: 0,
    discountPercentage: 0,
  });

  const [isEditing, setIsEditing] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  useEffect(() => {
    const total = productData.unitPrice * productData.quantity;
    const discount = (total * productData.discountPercentage) / 100;
    const subtotalAfterDiscount = total - discount;
    const gst = (subtotalAfterDiscount * productData.gstPercentage) / 100;
    const final = subtotalAfterDiscount - gst - productData.travelingCost;
    
    setTotalPrice(total);
    setDiscountAmount(discount);
    setGstAmount(gst);
    setFinalAmount(final);
  }, [productData]);

  const handleInputChange = (field: keyof ProductData, value: string | number) => {
    setProductData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const exportToExcel = () => {
    const exportData = {
      'Product ID': productData.productId,
      'Material Name': productData.materialName,
      'Unit Price': productData.unitPrice,
      'Quantity': productData.quantity,
      'Total Price': totalPrice,
      'Discount %': productData.discountPercentage,
      'Discount Amount': discountAmount,
      'GST %': productData.gstPercentage,
      'GST Amount': gstAmount,
      'Traveling Cost': productData.travelingCost,
      'Final Amount': finalAmount,
      'Export Date': new Date().toLocaleDateString()
    };

    const ws = XLSX.utils.json_to_sheet([exportData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Product Calculation');
    XLSX.writeFile(wb, `product_calculation_${productData.productId || 'data'}.xlsx`);
  };

  const sendToCloud = async () => {
    const dataToSend = {
      ...productData,
      totalPrice,
      discountAmount,
      gstAmount,
      finalAmount,
      timestamp: new Date().toISOString()
    };

    try {
      // Simulating cloud API call - replace with your actual endpoint
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert('Data sent to cloud successfully!');
        console.log('Data sent:', dataToSend);
      } else {
        throw new Error('Failed to send data');
      }
    } catch (error) {
      console.error('Error sending data:', error);
      alert('Failed to send data to cloud. Please try again.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Form */}
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between text-xl">
            <div className="flex items-center gap-2">
              <Calculator className="w-6 h-6" />
              Product Details
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? 'Lock' : 'Edit'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="productId" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Package className="w-4 h-4" />
              Product ID
            </Label>
            <Input
              id="productId"
              type="text"
              placeholder="Enter product ID"
              value={productData.productId}
              onChange={(e) => handleInputChange('productId', e.target.value)}
              disabled={!isEditing}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="materialName" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Package className="w-4 h-4" />
              Material Name
            </Label>
            <Input
              id="materialName"
              type="text"
              placeholder="Enter material name"
              value={productData.materialName}
              onChange={(e) => handleInputChange('materialName', e.target.value)}
              disabled={!isEditing}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitPrice" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <DollarSign className="w-4 h-4" />
                Unit Price ($)
              </Label>
              <Input
                id="unitPrice"
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={productData.unitPrice || ''}
                onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
                disabled={!isEditing}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Package className="w-4 h-4" />
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                placeholder="0"
                min="0"
                value={productData.quantity || ''}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                disabled={!isEditing}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discountPercentage" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Percent className="w-4 h-4" />
                Discount (%)
              </Label>
              <Input
                id="discountPercentage"
                type="number"
                placeholder="0"
                min="0"
                max="100"
                step="0.1"
                value={productData.discountPercentage || ''}
                onChange={(e) => handleInputChange('discountPercentage', parseFloat(e.target.value) || 0)}
                disabled={!isEditing}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gstPercentage" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Receipt className="w-4 h-4" />
                GST (%)
              </Label>
              <Input
                id="gstPercentage"
                type="number"
                placeholder="0"
                min="0"
                max="100"
                step="0.1"
                value={productData.gstPercentage || ''}
                onChange={(e) => handleInputChange('gstPercentage', parseFloat(e.target.value) || 0)}
                disabled={!isEditing}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="travelingCost" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Truck className="w-4 h-4" />
              Traveling Cost ($)
            </Label>
            <Input
              id="travelingCost"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={productData.travelingCost || ''}
              onChange={(e) => handleInputChange('travelingCost', parseFloat(e.target.value) || 0)}
              disabled={!isEditing}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={exportToExcel}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
            <Button 
              onClick={sendToCloud}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Send to Cloud
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calculation Results */}
      <CalculationResult
        productData={productData}
        totalPrice={totalPrice}
        discountAmount={discountAmount}
        gstAmount={gstAmount}
        finalAmount={finalAmount}
      />
    </div>
  );
};

export default ProductCalculator;
