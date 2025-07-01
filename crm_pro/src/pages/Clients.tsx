import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Eye, Edit, Phone, Mail, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDataContext } from '@/contexts/DataContext';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { clients, fetchClients } = useDataContext();

  useEffect(() => {
    fetchClients();
  }, [user]);

  const filteredClients = clients.filter(client =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">Clients</h1>
          <p className="text-primary-600 mt-1">Manage your client relationships and information</p>
        </div>
        <Button asChild className="bg-primary-500 hover:bg-primary-600">
          <Link to="/clients/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Client
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="border-primary-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-primary-400" />
              <Input
                placeholder="Search clients by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-primary-300 focus:border-primary-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.client_id} className="border-primary-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-primary-900">{client.name}</CardTitle>
                  <CardDescription className="text-primary-600 font-medium">
                    {client.company}
                  </CardDescription>
                </div>
                <Badge variant={client.status === 'Active' ? 'default' : 'secondary'}>
                  {client.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-primary-600">
                  <Mail className="h-4 w-4" />
                  {client.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-primary-600">
                  <Phone className="h-4 w-4" />
                  {client.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-primary-600">
                  <MapPin className="h-4 w-4" />
                  {client.address}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary-200">
                {!client.orders || client.orders.length === 0 ? (
                  <div className="col-span-2 text-center">
                    <p className="font-bold text-primary-900 text-left">No orders</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-sm text-primary-600">Total Orders</p>
                      <p className="font-bold text-primary-900">
                        {client.orders.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-primary-600">Total Value</p>
                      <p className="font-bold text-primary-900">
                        {client.orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  asChild
                  size="sm"
                  className="flex-1 bg-primary-500 hover:bg-primary-600"
                >
                  <Link to={`/orders/new?client=${client.client_id}`}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Order
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary-300 text-primary-700 hover:bg-primary-100"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary-300 text-primary-700 hover:bg-primary-100"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card className="border-primary-200">
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-primary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-primary-900 mb-2">No clients found</h3>
            <p className="text-primary-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first client.'}
            </p>
            <Button asChild className="bg-primary-500 hover:bg-primary-600">
              <Link to="/clients/new">
                <Plus className="h-4 w-4 mr-2" />
                Add New Client
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Clients;
