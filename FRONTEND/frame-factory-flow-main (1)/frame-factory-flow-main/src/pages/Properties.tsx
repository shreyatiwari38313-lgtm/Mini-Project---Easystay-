
import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal } from "lucide-react";
import properties from "@/lib/propertiesData";

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [priceRange, setPriceRange] = useState([1000, 10000]);
  const [guests, setGuests] = useState("any");
  const [sortBy, setSortBy] = useState("recommended");

  const filteredAndSortedProperties = useMemo(() => {
    let filtered = properties.filter((property) => {
      // Search Term Filter (by location)
      const matchesSearch = property.location
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Property Type Filter
      const matchesType =
        propertyType === "all" || property.category.toLowerCase() === propertyType;

      // Price Range Filter
      const matchesPrice =
        property.price >= priceRange[0] && property.price <= priceRange[1];

      // Guests Filter
      const matchesGuests = guests === "any" || property.guests >= parseInt(guests);

      return matchesSearch && matchesType && matchesPrice && matchesGuests;
    });

    // Sorting Logic
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    }
    // 'recommended' sorting is the default order, so no extra logic needed.

    return filtered;
  }, [searchTerm, propertyType, priceRange, guests, sortBy]);

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
                    <Input
                      placeholder="Where to?"
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Property Type</label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
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
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                  </label>
                  <Slider
                    min={1000}
                    max={10000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-2"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Guests</label>
                  <Select value={guests} onValueChange={setGuests}>
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
                
                <Button className="w-full" disabled>
                  Filters Applied
                </Button>
              </div>
            </div>
          </aside>
          
          {/* Properties Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing {filteredAndSortedProperties.length} properties
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
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
            
            {filteredAndSortedProperties.length === 0 ? (
              <div className="text-center py-10">
                <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedProperties.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>
            )}
            
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