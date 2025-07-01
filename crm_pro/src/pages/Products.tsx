import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Monitor, Smartphone, Laptop, Headphones, Camera, Watch } from 'lucide-react';
import { useDataContext } from '@/contexts/DataContext';
import { useEffect, useState } from 'react';
import { ProductWrapper } from '@/models_wrappers/ProductWrapper';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const Products = () => {
  const { products, fetchProducts } = useDataContext();
  const { user } = useAuth();
  const [serviceWrappers, setServiceWrappers] = useState<ProductWrapper[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Products');

  const icons = {
    Monitor,
    Smartphone,
    Laptop,
    Headphones,
    Camera,
    Watch
  };

  const getRandomIcon = () => {
    const iconNames = Object.keys(icons);
    const randomIndex = Math.floor(Math.random() * iconNames.length);
    return icons[iconNames[randomIndex]];
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  useEffect(() => {
    if (!products || products.length === 0) {
      setServiceWrappers([]);
      return;
    }

    const wrappers = products.map(product => ({
      product,
      icon: getRandomIcon()
    }));

    setServiceWrappers(wrappers);
  }, [products]);

  const categories = ['All Products', ...Array.from(new Set(serviceWrappers.map(sw => sw.product.type)))];

  const handleBadgeClick = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredServiceWrappers = selectedCategory === 'All Products'
    ? serviceWrappers
    : serviceWrappers.filter(sw => sw.product.type === selectedCategory);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">Products</h1>
          <p className="text-primary-600 mt-1">Manage your product catalog and inventory</p>
        </div>
        <Button asChild className="bg-primary-500 hover:bg-primary-600">
          <Link to="/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
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
                className={
                  selectedCategory === category
                    ? 'bg-primary-500 text-white'
                    : 'border-primary-300 text-primary-700 cursor-pointer'
                }
                onClick={() => handleBadgeClick(category)}
                style={{ cursor: 'pointer' }}
              >
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServiceWrappers.map(({ product, icon: Icon }) => (
          <Card key={product.product_id} className="border-primary-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-primary-900 text-lg">{product.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="border-primary-300 text-primary-700">
                      {product.type}
                    </Badge>
                    <Badge
                      variant={product.stock > 10 ? 'default' : product.stock > 0 ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-primary-600">
                {product.description}
              </CardDescription>

              <div className="flex items-center justify-between py-4 border-t border-b border-primary-200">
                <div>
                  <p className="text-sm text-primary-600">Price</p>
                  <p className="text-2xl font-bold text-primary-900">${product.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-primary-600">Stock</p>
                  <p className="text-lg font-bold text-primary-900">{product.stock}</p>
                </div>
              </div>

              {/* <div>
                <p className="text-sm font-medium text-primary-700 mb-2">Tags:</p>
                <div className="flex flex-wrap gap-1">
                  {product.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div> */}

              <div className="flex gap-2 pt-4">
                <Button
                  size="sm"
                  className="flex-1 bg-primary-500 hover:bg-primary-600"
                  disabled={product.stock === 0}
                >
                  Add to Order
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
    </div>
  );
};

export default Products;
