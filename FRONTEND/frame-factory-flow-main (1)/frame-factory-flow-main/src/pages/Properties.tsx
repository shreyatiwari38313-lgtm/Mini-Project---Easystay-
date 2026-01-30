import { useState } from "react";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal } from "lucide-react";

const Properties = () => {
  const [priceRange, setPriceRange] = useState([0, 500]);
  
  // Mock data - would come from backend in real app
  const properties = [
    {
      id: "1",
      title: "Cozy Downtown Apartment",
      location: "New York, NY",
      price: 120,
      rating: 4.8,
      reviews: 124,
      guests: 4,
      imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      category: "Apartment"
    },
    {
      id: "2",
      title: "Beachfront Villa",
      location: "Miami, FL",
      price: 350,
      rating: 4.9,
      reviews: 89,
      guests: 8,
      imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      category: "Villa"
    },
    {
      id: "3",
      title: "Mountain Cabin Retreat",
      location: "Aspen, CO",
      price: 200,
      rating: 4.7,
      reviews: 156,
      guests: 6,
      imageUrl: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800",
      category: "Cabin"
    },
    {
      id: "4",
      title: "Modern Loft Studio",
      location: "Los Angeles, CA",
      price: 95,
      rating: 4.6,
      reviews: 78,
      guests: 2,
      imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      category: "Studio"
    },
    {
      id: "5",
      title: "Luxury Penthouse Suite",
      location: "Chicago, IL",
      price: 450,
      rating: 4.9,
      reviews: 201,
      guests: 6,
      imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      category: "Penthouse"
    },
    {
      id: "6",
      title: "Charming Cottage",
      location: "Portland, OR",
      price: 85,
      rating: 4.5,
      reviews: 67,
      guests: 3,
      imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
      category: "Cottage"
    },
    {
      id: "7",
      title: "Riverside Loft",
      location: "Austin, TX",
      price: 140,
      rating: 4.7,
      reviews: 112,
      guests: 4,
      imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      category: "Loft"
    },
    {
      id: "8",
      title: "Desert Oasis Villa",
      location: "Phoenix, AZ",
      price: 280,
      rating: 4.8,
      reviews: 94,
      guests: 10,
      imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      category: "Villa"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Explore Properties</h1>
        
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Filters</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search Location</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Where to?" className="pl-10" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Property Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="cabin">Cabin</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-4 block">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    min={0}
                    max={500}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-2"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Guests</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1">1 Guest</SelectItem>
                      <SelectItem value="2">2 Guests</SelectItem>
                      <SelectItem value="4">4 Guests</SelectItem>
                      <SelectItem value="6">6+ Guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full">Apply Filters</Button>
              </div>
            </div>
          </aside>
          
          {/* Properties Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing {properties.length} properties
              </p>
              <Select defaultValue="recommended">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
            
            <div className="mt-12 flex justify-center">
              <Button variant="outline" size="lg">Load More Properties</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;
