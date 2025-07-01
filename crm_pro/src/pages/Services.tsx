import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Code, Palette, Search, Megaphone, Shield, Database } from 'lucide-react';
import { useDataContext } from '@/contexts/DataContext';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ServiceWrapper } from '@/models_wrappers/ServiceWrapper';
import { Link } from 'react-router-dom';

const Services = () => {
  const { services, fetchServices } = useDataContext();
  const { user } = useAuth();

  const [serviceWrappers, setServiceWrappers] = useState<ServiceWrapper[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Services');

  useEffect(() => {
    fetchServices();
  }, [user]);

  useEffect(() => {
    if (!services || services.length === 0) {
      setServiceWrappers([]);
      return;
    }

    const wrappers = services.map(service => ({
      service,
      icon: getRandomIcon()
    }));

    setServiceWrappers(wrappers);
  }, [services]);

  const icons = {
    Code,
    Palette,
    Search,
    Megaphone,
    Shield,
    Database
  };

  const getRandomIcon = () => {
    const keys = Object.keys(icons);
    return icons[keys[Math.floor(Math.random() * keys.length)]];
  };

  const categories = ['All Services', ...new Set(serviceWrappers.map(service => service.service.type))];

  const handleBadgeClick = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredServiceWrappers = selectedCategory === 'All Services'
    ? serviceWrappers
    : serviceWrappers.filter(sw => sw.service.type === selectedCategory);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">Services</h1>
          <p className="text-primary-600 mt-1">Manage your service offerings and packages</p>
        </div>
        <Button asChild className="bg-primary-500 hover:bg-primary-600">
          <Link to="/services/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Service
          </Link>
        </Button>
      </div>

      {/* Category Filter */}
      <Card className="border-primary-200">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={`cursor-pointer ${selectedCategory === category ? 'bg-primary-500' : 'border-primary-300 text-primary-700'}`}
                onClick={() => handleBadgeClick(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
          {filteredServiceWrappers.length === 0 && (
            <p className="text-primary-600 mt-4">No services available. Please add some services.</p>
          )}
        </CardContent>
      </Card>

      {/* Services Grid */}
      {filteredServiceWrappers.length === 0 ? (
        <></>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServiceWrappers.map((sw) => (
            <Card key={sw.service.service_id} className="border-primary-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <sw.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <CardTitle className="text-primary-900">{sw.service.name}</CardTitle>
                    <Badge variant="outline" className="border-primary-300 text-primary-700">
                      {sw.service.type}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-primary-600">
                  {sw.service.description}
                </CardDescription>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-primary-200">
                  <div>
                    <p className="text-sm text-primary-600">Price Range</p>
                    <p className="font-bold text-primary-900">{sw.service.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-primary-600">Duration</p>
                    <p className="font-bold text-primary-900">{sw.service.duration}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    size="sm"
                    className="flex-1 bg-primary-500 hover:bg-primary-600"
                  >
                    Create Order
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary-300 text-primary-700 hover:bg-primary-100"
                  >
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;
