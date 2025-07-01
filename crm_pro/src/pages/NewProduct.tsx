import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { Product } from '@/models/Product';
import { useAuth } from '@/contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { postProduct } from '@/api/api_products';

const NewProduct = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        type: 'Digital',
        price: '',
        description: '',
        stock: ''
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.type) {
            toast({
                title: "Error",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        const productParsed: Product = {
            name: formData.name,
            type: formData.type as 'Digital' | 'Service' | 'Hardware',
            price: formData.price ? parseFloat(formData.price) : undefined,
            description: formData.description || undefined,
            stock: formData.stock ? parseInt(formData.stock, 10) : undefined
        };

        const product = await postProduct(user, productParsed);

        if (product instanceof Error) {
            toast({
                title: "Error",
                description: product.message || "Failed to create product.",
                variant: "destructive",
            });
            return;
        }

        toast({
            title: "Product Created",
            description: `The new product ${product.name} has been successfully added.`,
        });

        navigate('/products');
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="text-primary-600 hover:text-primary-800"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-primary-900">Add New Product</h1>
                    <p className="text-primary-600 mt-1">Fill in the product information to add it to your CRM</p>
                </div>
            </div>

            <div className="max-w-2xl">
                <Card className="border-primary-200">
                    <CardHeader>
                        <CardTitle className="text-primary-900">Product Information</CardTitle>
                        <CardDescription className="text-primary-600">
                            Enter the basic information about your new product
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-primary-700">Product Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Enter product name"
                                    className="border-primary-300 focus:border-primary-500"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type" className="text-primary-700">Type *</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => handleInputChange('type', value)}
                                >
                                    <SelectTrigger className="border-primary-300 focus:border-primary-500">
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Digital">Digital</SelectItem>
                                        <SelectItem value="Service">Service</SelectItem>
                                        <SelectItem value="Hardware">Hardware</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-primary-700">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => handleInputChange('price', e.target.value)}
                                    placeholder="Enter price"
                                    className="border-primary-300 focus:border-primary-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-primary-700">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Add a description for the product"
                                    className="border-primary-300 focus:border-primary-500 min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stock" className="text-primary-700">Stock</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => handleInputChange('stock', e.target.value)}
                                    placeholder="Enter stock quantity"
                                    className="border-primary-300 focus:border-primary-500"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="submit"
                                    className="bg-primary-500 hover:bg-primary-600"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Product
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate(-1)}
                                    className="border-primary-300 text-primary-700 hover:bg-primary-100"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default NewProduct;
