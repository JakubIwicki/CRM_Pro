
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { Client } from '@/models/Client';
import { postClient } from '@/api/api_clients';
import { useAuth } from '@/contexts/AuthContext';

const NewClient = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const clientParsed: Client = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      company: formData.company || null,
      address: formData.address || null,
      notes: formData.notes || null,
      status: 'Active' // Default status
    }

    const client = await postClient(user, clientParsed);

    if (client instanceof Error) {
      toast({
        title: "Error",
        description: client.message || "Failed to create client.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Client Created",
      description: `The new client ${client.name} has been successfully added.`,
    });

    navigate('/clients');
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
          <h1 className="text-3xl font-bold text-primary-900">Add New Client</h1>
          <p className="text-primary-600 mt-1">Fill in the client information to add them to your CRM</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card className="border-primary-200">
          <CardHeader>
            <CardTitle className="text-primary-900">Client Information</CardTitle>
            <CardDescription className="text-primary-600">
              Enter the basic information about your new client
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-primary-700">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter client's full name"
                    className="border-primary-300 focus:border-primary-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-primary-700">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                    className="border-primary-300 focus:border-primary-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-primary-700">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                    className="border-primary-300 focus:border-primary-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-primary-700">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Enter company name"
                    className="border-primary-300 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-primary-700">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter full address"
                  className="border-primary-300 focus:border-primary-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-primary-700">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Add any additional notes about this client"
                  className="border-primary-300 focus:border-primary-500 min-h-[100px]"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="bg-primary-500 hover:bg-primary-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Client
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

export default NewClient;
