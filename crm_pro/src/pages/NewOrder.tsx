import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDataContext } from '@/contexts/DataContext';
import { Service } from '@/models/Service';
import { Product } from '@/models/Product';
import { Client } from '@/models/Client';
import { Order } from '@/models/Order';
import { postOrder } from '@/api/api_orders';

const NewOrder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { clients, fetchClients, services, fetchServices, products, fetchProducts } = useDataContext();
  const preselectedClientId = searchParams.get('client');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      await fetchClients();
      await fetchServices();
      await fetchProducts();
    }
    fetchData();
  }, [user]);

  const [formData, setFormData] = useState({
    clientId: preselectedClientId || '',
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    //estimatedValue: '',
    status: 'Pending'
  });

  const convertFromToOrder = (data: any): Order => {
    return {
      client_id: data.clientId ? parseInt(data.clientId, 10) : null,
      order_date: new Date(),
      status: data.status || 'Pending',
      total_amount: calculateTotal(),
      title: data.title || null,
      priority: data.priority || 'Low',
      due_date: data.dueDate ? new Date(data.dueDate) : null,
      created_date: new Date(),
      description: data.description || '',

      services: selectedServices,
      products: selectedProducts,
    } as Order;
  }

  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addService = (service: Service) => {
    if (!selectedServices.includes(service)) {
      setSelectedServices(prev => [...prev, service]);
    }
  };

  const removeService = (service: Service) => {
    setSelectedServices(prev => prev.filter(id => id.service_id !== service.service_id));
  };

  const addProduct = (product: Product) => {
    if (!selectedProducts.includes(product)) {
      setSelectedProducts(prev => [...prev, product]);
    }
  };

  const removeProduct = (product: Product) => {
    setSelectedProducts(prev => prev.filter(id => id.product_id !== product.product_id));
  };

  const calculateTotal = () => {
    const servicesTotal = selectedServices.reduce((sum, service) => {
      return sum + (service?.price || 0);
    }, 0);

    const productsTotal = selectedProducts.reduce((sum, product) => {
      return sum + (product?.price || 0);
    }, 0);

    return servicesTotal + productsTotal;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientId || !formData.title) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const orderData = convertFromToOrder(formData);
      const response = await postOrder(user, orderData);

      if (response instanceof Error) {
        toast({
          title: "Error",
          description: response.message || "Failed to create order.",
          variant: "destructive",
        });
        return;
      }

      const newOrder = response as Order;

      toast({
        title: "Order Created",
        description: `The new order #${newOrder.order_id} has been successfully created.`,
      });

      navigate('/orders');
    }
    catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order. Please try again. If the problem persists, please contact support.",
        variant: "destructive",
      });
      console.error("Error creating order:", error);
      return;
    }
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
          <h1 className="text-3xl font-bold text-primary-900">Create New Order</h1>
          <p className="text-primary-600 mt-1">Fill in the details to create a new order for your client</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="border-primary-200">
            <CardHeader>
              <CardTitle className="text-primary-900">Order Details</CardTitle>
              <CardDescription className="text-primary-600">
                Basic information about the order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client" className="text-primary-700">Client *</Label>
                  <Select value={formData.clientId} onValueChange={(value) => handleInputChange('clientId', value)}>
                    <SelectTrigger className="border-primary-300 focus:border-primary-500">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.client_id} value={client.client_id.toString()}>
                          {client.name}
                          {client.company ? ` - ${client.company}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-primary-700">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger className="border-primary-300 focus:border-primary-500">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-primary-700">Order Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter order title"
                  className="border-primary-300 focus:border-primary-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-primary-700">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the order requirements"
                  className="border-primary-300 focus:border-primary-500 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate" className="text-primary-700">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="border-primary-300 focus:border-primary-500"
                  />
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor="estimatedValue" className="text-primary-700">Estimated Value</Label>
                  <Input
                    id="estimatedValue"
                    type="number"
                    value={formData.estimatedValue}
                    onChange={(e) => handleInputChange('estimatedValue', e.target.value)}
                    placeholder="0.00"
                    className="border-primary-300 focus:border-primary-500"
                  />
                </div> */}
              </div>
            </CardContent>
          </Card>

          {/* Services Selection */}
          <Card className="border-primary-200">
            <CardHeader>
              <CardTitle className="text-primary-900">Services</CardTitle>
              <CardDescription className="text-primary-600">
                Select services to include in this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedServices.length > 0 && (
                  <div>
                    <Label className="text-primary-700 mb-2 block">Selected Services:</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedServices.map((service) => {
                        return (
                          <Badge key={service.service_id} variant="default" className="bg-primary-500">
                            {service?.name} - ${service?.price}
                            <button
                              type="button"
                              onClick={() => removeService(service)}
                              className="ml-2 hover:text-red-300"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-primary-700 mb-2 block">Available Services:</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {services.filter(service => !selectedServices.includes(service)).map((service) => (
                      <Button
                        key={service.service_id}
                        type="button"
                        variant="outline"
                        onClick={() => addService(service)}
                        className="justify-start border-primary-300 text-primary-700 hover:bg-primary-100"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {service.name} - ${service.price}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Selection */}
          <Card className="border-primary-200">
            <CardHeader>
              <CardTitle className="text-primary-900">Products</CardTitle>
              <CardDescription className="text-primary-600">
                Select products to include in this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedProducts.length > 0 && (
                  <div>
                    <Label className="text-primary-700 mb-2 block">Selected Products:</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProducts.map((product) => {
                        return (
                          <Badge key={product.product_id} variant="default" className="bg-primary-500">
                            {product?.name} - ${product?.price}
                            <button
                              type="button"
                              onClick={() => removeProduct(product)}
                              className="ml-2 hover:text-red-300"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-primary-700 mb-2 block">Available Products:</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {products.filter(product => !selectedProducts.includes(product)).map((product) => (
                      <Button
                        key={product.product_id}
                        type="button"
                        variant="outline"
                        onClick={() => addProduct(product)}
                        className="justify-start border-primary-300 text-primary-700 hover:bg-primary-100"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {product.name} - ${product.price}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="border-primary-200 sticky top-6">
            <CardHeader>
              <CardTitle className="text-primary-900">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {selectedServices.length > 0 && (
                  <div>
                    <p className="font-medium text-primary-700 mb-1">Services:</p>
                    {selectedServices.map((service) => {
                      return (
                        <div key={service.service_id} className="flex justify-between text-sm">
                          <span className="text-primary-600">{service?.name}</span>
                          <span className="font-medium">${service?.price}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedProducts.length > 0 && (
                  <div>
                    <p className="font-medium text-primary-700 mb-1">Products:</p>
                    {selectedProducts.map((product) => {
                      return (
                        <div key={product.product_id} className="flex justify-between text-sm">
                          <span className="text-primary-600">{product?.name}</span>
                          <span className="font-medium">${product?.price}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="border-t border-primary-200 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary-900">Total:</span>
                    <span className="text-xl font-bold text-primary-900">${calculateTotal()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  type="submit"
                  className="w-full bg-primary-500 hover:bg-primary-600"
                >
                  Create Order
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-primary-300 text-primary-700 hover:bg-primary-100"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default NewOrder;
