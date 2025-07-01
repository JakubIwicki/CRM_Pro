import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Package, ShoppingCart, TrendingUp, Plus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Stats } from '@/models_wrappers/Stats';
import { useDataContext } from '@/contexts/DataContext';

const Dashboard = () => {
  const [stats, setStats] = useState<Stats[]>([]);
  const { dashboardData, fetchDashboardData } = useDataContext();

  useEffect(() => {
    const _ = setInterval(async () => {
      await fetchDashboardData();
    }, 10000);
  });

  useEffect(() => {
    if (!dashboardData) {
      setStats([]);
      return;
    }

    const newStats: Stats[] = [
      { title: 'Total Clients', value: dashboardData.totalClients.toString(), icon: Users, color: 'text-blue-600' },
      { title: 'Active Orders', value: dashboardData.activeOrders.toString(), icon: ShoppingCart, color: 'text-green-600' },
      { title: 'Services', value: dashboardData.totalServices.toString(), icon: Package, color: 'text-purple-600' },
      { title: 'Revenue', value: `$${dashboardData.revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-orange-600' },
    ];

    setStats(newStats);
  }, [dashboardData]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary-900">Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild className="bg-primary-500 hover:bg-primary-600">
            <Link to="/clients/new">
              <Plus className="h-4 w-4 mr-2" />
              New Client
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-primary-300 text-primary-700 hover:bg-primary-100">
            <Link to="/orders/new">
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-primary-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-900">{stat.value}</div>
              {/* <p className="text-xs text-primary-500 mt-1">
                <span className="text-green-600">{stat.change}</span> from last month
              </p> */}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Clients */}
        <Card className="border-primary-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-primary-900">Recent Clients</CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-primary-600 hover:text-primary-800">
                <Link to="/clients">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Link>
              </Button>
            </div>
            <CardDescription className="text-primary-600">
              Latest client activities and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.recentClients && dashboardData.recentClients.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentClients.map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                    <div>
                      <p className="font-medium text-primary-900">{client.name}</p>
                      <p className="text-sm text-primary-600">{client.email}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${client.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                        }`}>
                        {client.status}
                      </span>
                      {/* <p className="text-xs text-primary-500 mt-1">{client.lastOrder}</p> */}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-primary-500 text-center py-4">Empty</div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="border-primary-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-primary-900">Recent Orders</CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-primary-600 hover:text-primary-800">
                <Link to="/orders">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Link>
              </Button>
            </div>
            <CardDescription className="text-primary-600">
              Latest order activities and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.recentOrders && dashboardData.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentOrders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                    <div>
                      <p className="font-medium text-primary-900">Id: {order.order_id} - Client: {order.client_id}</p>
                      <p className="text-sm text-primary-600">
                        {order.services && Array.isArray(order.services) && order.services.length > 0
                          ? order.services.map((service: any) => service).join(', ')
                          : 'No services'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-900">{order.total_amount}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${order.status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'InProgress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-primary-500 text-center py-4">Empty</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
