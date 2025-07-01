import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { Service } from '@/models/Service';
import { postService } from '@/api/api_services';
import { useAuth } from '@/contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const NewService = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        type: 'Development',
        price: '',
        description: '',
        duration: ''
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

        const serviceParsed: Service = {
            name: formData.name,
            type: formData.type as 'Development' | 'Design' | 'Marketing' | 'Security',
            price: formData.price ? parseFloat(formData.price) : undefined,
            description: formData.description || undefined,
            duration: formData.duration || undefined
        };

        const service = await postService(user, serviceParsed);

        if (service instanceof Error) {
            toast({
                title: "Error",
                description: service.message || "Failed to create service.",
                variant: "destructive",
            });
            return;
        }

        toast({
            title: "Service Created",
            description: `The new service ${service.name} has been successfully added.`,
        });

        navigate('/services');
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
                    <h1 className="text-3xl font-bold text-primary-900">Add New Service</h1>
                    <p className="text-primary-600 mt-1">Fill in the service information to add it to your CRM</p>
                </div>
            </div>

            <div className="max-w-2xl">
                <Card className="border-primary-200">
                    <CardHeader>
                        <CardTitle className="text-primary-900">Service Information</CardTitle>
                        <CardDescription className="text-primary-600">
                            Enter the basic information about your new service
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-primary-700">Service Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Enter service name"
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
                                        <SelectItem value="Development">Development</SelectItem>
                                        <SelectItem value="Design">Design</SelectItem>
                                        <SelectItem value="Marketing">Marketing</SelectItem>
                                        <SelectItem value="Security">Security</SelectItem>
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
                                    placeholder="Add a description for the service"
                                    className="border-primary-300 focus:border-primary-500 min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="duration" className="text-primary-700">Duration</Label>
                                <Input
                                    id="duration"
                                    value={formData.duration}
                                    onChange={(e) => handleInputChange('duration', e.target.value)}
                                    placeholder="Enter duration (e.g., 2 days)"
                                    className="border-primary-300 focus:border-primary-500"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="submit"
                                    className="bg-primary-500 hover:bg-primary-600"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Service
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

export default NewService;
