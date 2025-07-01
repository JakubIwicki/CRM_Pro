
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Calendar, User, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDataContext } from '@/contexts/DataContext';
import { OrderWrapper } from '@/models_wrappers/OrderWrapper';

const Orders = () => {
  const { user, setIsLoading } = useAuth();
  const { orders, clients, fetchOrders, fetchClients } = useDataContext();
  const [orderWrappers, setOrderWrappers] = useState<OrderWrapper[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      await fetchClients();
      await fetchOrders();
    }
    fetchData()
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (!orders || !clients) {
      setOrderWrappers([]);
      return;
    }

    const wrappers = orders.map(order => {
      const client = clients.find(c => c.client_id === order.client_id);
      return {
        order: order,
        client: client ?? null,
      } as OrderWrapper;
    });

    setOrderWrappers(wrappers);
  }, [orders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-orange-100 text-orange-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">Orders</h1>
          <p className="text-primary-600 mt-1">Manage and track all client orders</p>
        </div>
        <Button asChild className="bg-primary-500 hover:bg-primary-600">
          <Link to="/orders/new">
            <Plus className="h-4 w-4 mr-2" />
            Create New Order
          </Link>
        </Button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orderWrappers && orderWrappers.length !== 0 && orderWrappers.map((ow) => (
          <Card key={ow.order.order_id} className="border-primary-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-primary-900">{ow.order.order_id}</CardTitle>
                    <Badge className={getStatusColor(ow.order.status)}>
                      {ow.order.status}
                    </Badge>
                    <Badge className={getPriorityColor(ow.order.priority)}>
                      {ow.order.priority} Priority
                    </Badge>
                  </div>
                  <CardDescription className="text-lg font-medium text-primary-800">
                    {ow.order.title}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-900">${ow.order.total_amount}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {ow.client && (
                  <div className="flex items-center gap-2 text-primary-600">

                    <User className="h-4 w-4" />
                    <div>
                      <p className="font-medium">{ow.client.name}</p>
                      <p className="text-sm">{ow.client.company}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 text-primary-600">
                  <Calendar className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Due: {new Date(ow.order.due_date).toLocaleDateString()}</p>
                    <p className="text-sm">Created: {new Date(ow.order.created_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-primary-600">
                  <DollarSign className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Order Value</p>
                    <p className="text-sm">{ow.order.total_amount}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-primary-500 hover:bg-primary-600"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary-300 text-primary-700 hover:bg-primary-100"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Order
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {orderWrappers.length === 0 && (
        <Card className="border-primary-200">
          <CardContent className="text-center py-12">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Plus className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-medium text-primary-900 mb-2">No orders yet</h3>
            <p className="text-primary-600 mb-4">Create your first order to get started.</p>
            <Button asChild className="bg-primary-500 hover:bg-primary-600">
              <Link to="/orders/new">
                <Plus className="h-4 w-4 mr-2" />
                Create New Order
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Orders;
