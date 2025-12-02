import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Star, MapPin, Users, Wifi, Car, Coffee, 
  Calendar as CalendarIcon, ChevronLeft 
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

const PropertyDetails = () => {
  const { id } = useParams();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  
  // Mock data - would come from API in real app
  const property = {
    id,
    title: "Cozy Downtown Apartment",
    location: "123 Main Street, New York, NY 10001",
    price: 120,
    rating: 4.8,
    reviews: 124,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
    ],
    description: "Experience the perfect blend of comfort and convenience in this beautifully designed downtown apartment. Located in the heart of the city, this space offers easy access to restaurants, shops, and entertainment while providing a peaceful retreat after a day of exploration.",
    amenities: ["WiFi", "Free Parking", "Kitchen", "Air Conditioning", "Heating", "TV"],
    host: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      joinedDate: "2020"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/properties">
          <Button variant="ghost" className="mb-4">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
        </Link>
        
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 rounded-2xl overflow-hidden">
          <div className="md:col-span-2 md:row-span-2">
            <img 
              src={property.images[0]} 
              alt="Main view"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="hidden md:block">
            <img 
              src={property.images[1]} 
              alt="View 2"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="hidden md:block">
            <img 
              src={property.images[2]} 
              alt="View 3"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Property Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-4">{property.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="font-medium">{property.rating}</span>
                  <span>({property.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{property.location}</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Badge variant="secondary">{property.guests} guests</Badge>
                <Badge variant="secondary">{property.bedrooms} bedrooms</Badge>
                <Badge variant="secondary">{property.bathrooms} bathrooms</Badge>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">About this place</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 gap-4">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3">
                      {amenity === "WiFi" && <Wifi className="h-5 w-5 text-primary" />}
                      {amenity === "Free Parking" && <Car className="h-5 w-5 text-primary" />}
                      {amenity === "Kitchen" && <Coffee className="h-5 w-5 text-primary" />}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Meet your host</h2>
                <div className="flex items-center gap-4">
                  <img 
                    src={property.host.avatar} 
                    alt={property.host.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{property.host.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Hosting since {property.host.joinedDate}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-2">
              <CardContent className="p-6">
                <div className="mb-6">
                  <span className="text-3xl font-bold text-primary">${property.price}</span>
                  <span className="text-muted-foreground"> / night</span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Check-in</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkIn ? format(checkIn, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Check-out</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkOut ? format(checkOut, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <Button className="w-full mb-4" size="lg">
                  Reserve Now
                </Button>
                
                <p className="text-sm text-center text-muted-foreground">
                  You won't be charged yet
                </p>
                
                <div className="mt-6 pt-6 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">${property.price} × 3 nights</span>
                    <span>${property.price * 3}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service fee</span>
                    <span>$50</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span>${property.price * 3 + 50}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
