
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, Package, DollarSign, Truck, Receipt, Percent, ArrowLeft } from 'lucide-react';
import CalculationTable from './CalculationTable';

interface ProductData {
  productId: string;
  materialName: string;
  unitPrice: number;
  gstPercentage: number;
  travelingCost: number;
  quantity: number;
  discountPercentage: number;
}

interface ProductCalculatorProps {
  onBack?: () => void;
}

const ProductCalculator: React.FC<ProductCalculatorProps> = ({ onBack }) => {
  const [productData, setProductData] = useState<ProductData>({
    productId: '',
    materialName: '',
    unitPrice: 0,
    gstPercentage: 0,
    travelingCost: 0,
    quantity: 0,
    discountPercentage: 0,
  });

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

  const handleProductUpdate = (updatedData: ProductData) => {
    setProductData(updatedData);
  };

  return (
    <div className="space-y-8">
      {onBack && (
        <Button 
          onClick={onBack}
          variant="outline"
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      )}
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calculator className="w-6 h-6" />
              Product Details
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
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unitPrice" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <DollarSign className="w-4 h-4" />
                  Unit Price (₹)
                </Label>
                <Input
                  id="unitPrice"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={productData.unitPrice || ''}
                  onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="travelingCost" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Truck className="w-4 h-4" />
                Traveling Cost (₹)
              </Label>
              <Input
                id="travelingCost"
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={productData.travelingCost || ''}
                onChange={(e) => handleInputChange('travelingCost', parseFloat(e.target.value) || 0)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Excel-Style Calculation Results */}
        <CalculationTable
          productData={productData}
          totalPrice={totalPrice}
          discountAmount={discountAmount}
          gstAmount={gstAmount}
          finalAmount={finalAmount}
          onProductUpdate={handleProductUpdate}
        />
      </div>
    </div>
  );
};

export default ProductCalculator;
