
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Minus, DollarSign, Percent } from 'lucide-react';

interface ProductData {
  productId: string;
  materialName: string;
  unitPrice: number;
  gstPercentage: number;
  travelingCost: number;
  quantity: number;
  discountPercentage: number;
}

interface CalculationResultProps {
  productData: ProductData;
  totalPrice: number;
  discountAmount: number;
  gstAmount: number;
  finalAmount: number;
}

const CalculationResult: React.FC<CalculationResultProps> = ({ 
  productData, 
  totalPrice,
  discountAmount,
  gstAmount,
  finalAmount 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const subtotalAfterDiscount = totalPrice - discountAmount;

  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-xl">
          <TrendingUp className="w-6 h-6" />
          Calculation Results
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {productData.productId && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Product Information</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">ID:</span> {productData.productId}</p>
              <p><span className="font-medium">Material:</span> {productData.materialName}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span className="font-medium text-gray-700">Unit Price × Quantity</span>
            <span className="text-lg font-semibold text-blue-600">
              {formatCurrency(productData.unitPrice)} × {productData.quantity}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-blue-100 rounded-lg">
            <span className="font-medium text-gray-700">Total Price</span>
            <Badge variant="secondary" className="text-lg font-bold bg-blue-600 text-white px-3 py-1">
              {formatCurrency(totalPrice)}
            </Badge>
          </div>

          {productData.discountPercentage > 0 && (
            <div className="border-l-4 border-orange-400 pl-4 space-y-2">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                <Percent className="w-4 h-4 text-orange-500" />
                Discount ({productData.discountPercentage}%)
              </h4>
              <div className="flex justify-between text-sm">
                <span>Discount Amount:</span>
                <span className="text-orange-600">-{formatCurrency(discountAmount)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>After Discount:</span>
                <span className="text-gray-800">{formatCurrency(subtotalAfterDiscount)}</span>
              </div>
            </div>
          )}

          <div className="border-l-4 border-red-400 pl-4 space-y-2">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <Minus className="w-4 h-4 text-red-500" />
              Deductions
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>GST ({productData.gstPercentage}%):</span>
                <span className="text-red-600">-{formatCurrency(gstAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Traveling Cost:</span>
                <span className="text-red-600">-{formatCurrency(productData.travelingCost)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Final Amount
              </span>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(finalAmount)}
                </div>
                {finalAmount < 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Amount is negative
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-1">Calculation Formula:</p>
            <p>Step 1: Total = Unit Price × Quantity</p>
            <p>Step 2: After Discount = Total - (Total × Discount %)</p>
            <p>Step 3: GST = After Discount × GST %</p>
            <p>Step 4: Final = After Discount - GST - Traveling Cost</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculationResult;
