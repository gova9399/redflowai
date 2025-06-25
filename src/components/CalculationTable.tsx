
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Save, X, Download, Send } from 'lucide-react';
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

interface CalculationTableProps {
  productData: ProductData;
  totalPrice: number;
  discountAmount: number;
  gstAmount: number;
  finalAmount: number;
  onProductUpdate: (updatedData: ProductData) => void;
}

const CalculationTable: React.FC<CalculationTableProps> = ({
  productData,
  totalPrice,
  discountAmount,
  gstAmount,
  finalAmount,
  onProductUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(productData);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleSave = () => {
    onProductUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(productData);
    setIsEditing(false);
  };

  const exportToExcel = () => {
    const exportData = [
      { Field: 'Product ID', Value: productData.productId, Type: 'Text' },
      { Field: 'Material Name', Value: productData.materialName, Type: 'Text' },
      { Field: 'Unit Price', Value: productData.unitPrice, Type: 'Currency' },
      { Field: 'Quantity', Value: productData.quantity, Type: 'Number' },
      { Field: 'Discount %', Value: productData.discountPercentage, Type: 'Percentage' },
      { Field: 'GST %', Value: productData.gstPercentage, Type: 'Percentage' },
      { Field: 'Traveling Cost', Value: productData.travelingCost, Type: 'Currency' },
      { Field: '', Value: '', Type: '' },
      { Field: 'CALCULATIONS', Value: '', Type: '' },
      { Field: 'Total Price', Value: totalPrice, Type: 'Currency' },
      { Field: 'Discount Amount', Value: discountAmount, Type: 'Currency' },
      { Field: 'GST Amount', Value: gstAmount, Type: 'Currency' },
      { Field: 'Final Amount', Value: finalAmount, Type: 'Currency' },
    ];

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Product Calculation');
    XLSX.writeFile(wb, `calculation_${productData.productId || 'data'}.xlsx`);
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
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert('Data sent to cloud successfully!');
      } else {
        throw new Error('Failed to send data');
      }
    } catch (error) {
      console.error('Error sending data:', error);
      alert('Failed to send data to cloud. Please try again.');
    }
  };

  const subtotalAfterDiscount = totalPrice - discountAmount;

  return (
    <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between text-xl">
          <span>Excel-Style Calculation Sheet</span>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
            <Button
              onClick={exportToExcel}
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={sendToCloud}
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Send className="w-4 h-4 mr-2" />
              Cloud
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-bold text-gray-800 w-1/3">Field</TableHead>
              <TableHead className="font-bold text-gray-800 w-1/3">Value</TableHead>
              <TableHead className="font-bold text-gray-800 w-1/3">Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-blue-50/50">
              <TableCell className="font-medium">Product ID</TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    value={editData.productId}
                    onChange={(e) => setEditData({...editData, productId: e.target.value})}
                    className="h-8"
                  />
                ) : (
                  <span>{productData.productId || 'Not specified'}</span>
                )}
              </TableCell>
              <TableCell><Badge variant="secondary">Text</Badge></TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell className="font-medium">Material Name</TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    value={editData.materialName}
                    onChange={(e) => setEditData({...editData, materialName: e.target.value})}
                    className="h-8"
                  />
                ) : (
                  <span>{productData.materialName || 'Not specified'}</span>
                )}
              </TableCell>
              <TableCell><Badge variant="secondary">Text</Badge></TableCell>
            </TableRow>

            <TableRow className="bg-blue-50/50">
              <TableCell className="font-medium">Unit Price</TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editData.unitPrice}
                    onChange={(e) => setEditData({...editData, unitPrice: parseFloat(e.target.value) || 0})}
                    className="h-8"
                  />
                ) : (
                  <span className="font-medium text-green-600">{formatCurrency(productData.unitPrice)}</span>
                )}
              </TableCell>
              <TableCell><Badge variant="outline" className="bg-green-100">Currency</Badge></TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-medium">Quantity</TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editData.quantity}
                    onChange={(e) => setEditData({...editData, quantity: parseInt(e.target.value) || 0})}
                    className="h-8"
                  />
                ) : (
                  <span className="font-medium">{productData.quantity} units</span>
                )}
              </TableCell>
              <TableCell><Badge variant="outline" className="bg-blue-100">Number</Badge></TableCell>
            </TableRow>

            <TableRow className="bg-blue-50/50">
              <TableCell className="font-medium">Discount Rate</TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editData.discountPercentage}
                    onChange={(e) => setEditData({...editData, discountPercentage: parseFloat(e.target.value) || 0})}
                    className="h-8"
                  />
                ) : (
                  <span className="font-medium text-orange-600">{productData.discountPercentage}%</span>
                )}
              </TableCell>
              <TableCell><Badge variant="outline" className="bg-orange-100">Percentage</Badge></TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-medium">GST Rate</TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editData.gstPercentage}
                    onChange={(e) => setEditData({...editData, gstPercentage: parseFloat(e.target.value) || 0})}
                    className="h-8"
                  />
                ) : (
                  <span className="font-medium text-red-600">{productData.gstPercentage}%</span>
                )}
              </TableCell>
              <TableCell><Badge variant="outline" className="bg-red-100">Percentage</Badge></TableCell>
            </TableRow>

            <TableRow className="bg-blue-50/50">
              <TableCell className="font-medium">Traveling Cost</TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editData.travelingCost}
                    onChange={(e) => setEditData({...editData, travelingCost: parseFloat(e.target.value) || 0})}
                    className="h-8"
                  />
                ) : (
                  <span className="font-medium text-purple-600">{formatCurrency(productData.travelingCost)}</span>
                )}
              </TableCell>
              <TableCell><Badge variant="outline" className="bg-purple-100">Currency</Badge></TableCell>
            </TableRow>

            {/* Calculation Results */}
            <TableRow className="border-t-2 border-gray-300">
              <TableCell className="font-bold text-lg bg-gray-100" colSpan={3}>
                CALCULATION RESULTS
              </TableCell>
            </TableRow>

            <TableRow className="bg-green-50">
              <TableCell className="font-bold">Total Price</TableCell>
              <TableCell className="font-bold text-green-700 text-lg">{formatCurrency(totalPrice)}</TableCell>
              <TableCell><Badge className="bg-green-600">Calculated</Badge></TableCell>
            </TableRow>

            <TableRow className="bg-orange-50">
              <TableCell className="font-bold">Discount Amount</TableCell>
              <TableCell className="font-bold text-orange-700">-{formatCurrency(discountAmount)}</TableCell>
              <TableCell><Badge className="bg-orange-600">Calculated</Badge></TableCell>
            </TableRow>

            <TableRow className="bg-blue-50">
              <TableCell className="font-bold">After Discount</TableCell>
              <TableCell className="font-bold text-blue-700">{formatCurrency(subtotalAfterDiscount)}</TableCell>
              <TableCell><Badge className="bg-blue-600">Calculated</Badge></TableCell>
            </TableRow>

            <TableRow className="bg-red-50">
              <TableCell className="font-bold">GST Amount</TableCell>
              <TableCell className="font-bold text-red-700">-{formatCurrency(gstAmount)}</TableCell>
              <TableCell><Badge className="bg-red-600">Calculated</Badge></TableCell>
            </TableRow>

            <TableRow className="bg-purple-50">
              <TableCell className="font-bold">Traveling Cost</TableCell>
              <TableCell className="font-bold text-purple-700">-{formatCurrency(productData.travelingCost)}</TableCell>
              <TableCell><Badge className="bg-purple-600">Fixed Cost</Badge></TableCell>
            </TableRow>

            <TableRow className="bg-gradient-to-r from-emerald-100 to-teal-100 border-t-2 border-emerald-300">
              <TableCell className="font-bold text-xl">FINAL AMOUNT</TableCell>
              <TableCell className="font-bold text-2xl text-emerald-700">{formatCurrency(finalAmount)}</TableCell>
              <TableCell><Badge className="bg-emerald-600 text-white">RESULT</Badge></TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {isEditing && (
          <div className="p-4 bg-gray-50 border-t flex gap-2">
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button onClick={handleCancel} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalculationTable;
