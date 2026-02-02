import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Star, User, Heart, Clock } from "lucide-react";

const GuestDashboard = () => {
  const upcomingBookings = [
    {
      id: "1",
      property: "Cozy Downtown Apartment",
      location: "New York, NY",
      checkIn: "2025-11-15",
      checkOut: "2025-11-18",
      nights: 3,
      total: 410,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
      status: "confirmed"
    },
    {
      id: "2",
      property: "Beachfront Villa",
      location: "Miami, FL",
      checkIn: "2025-12-01",
      checkOut: "2025-12-05",
      nights: 4,
      total: 1450,
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400",
      status: "pending"
    }
  ];

  const pastBookings = [
    {
      id: "3",
      property: "Mountain Cabin Retreat",
      location: "Aspen, CO",
      checkIn: "2025-09-10",
      checkOut: "2025-09-15",
      nights: 5,
      total: 1050,
      image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=400",
      rating: 5,
      reviewed: true
    }
  ];

  const favorites = [
    {
      id: "1",
      title: "Luxury Penthouse Suite",
      location: "Chicago, IL",
      price: 450,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400"
    },
    {
      id: "2",
      title: "Riverside Loft",
      location: "Austin, TX",
      price: 140,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">Manage your bookings and preferences</p>
          </div>
          <Button size="lg" className="hidden sm:flex">
            <User className="mr-2 h-5 w-5" />
            Edit Profile
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            <h2 className="text-2xl font-semibold">Upcoming Trips</h2>
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No upcoming trips</h3>
                  <p className="text-muted-foreground mb-6">Time to plan your next adventure!</p>
                  <Button>Browse Properties</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {upcomingBookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden hover:shadow-card-hover transition-all">
                    <div className="flex">
                      <img 
                        src={booking.image} 
                        alt={booking.property}
                        className="w-32 h-full object-cover"
                      />
                      <CardContent className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{booking.property}</h3>
                          <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{booking.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{booking.checkIn} - {booking.checkOut}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{booking.nights} nights</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">₹{booking.total}</span>
                          <Button size="sm" variant="outline">View Details</Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            <h2 className="text-2xl font-semibold">Past Trips</h2>
            {pastBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Clock className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No past trips yet</h3>
                  <p className="text-muted-foreground">Your travel history will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {pastBookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <div className="flex">
                      <img 
                        src={booking.image} 
                        alt={booking.property}
                        className="w-32 h-full object-cover"
                      />
                      <CardContent className="flex-1 p-4">
                        <h3 className="font-semibold text-lg mb-2">{booking.property}</h3>
                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{booking.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{booking.checkIn} - {booking.checkOut}</span>
                          </div>
                          {booking.reviewed && (
                            <div className="flex items-center gap-2 text-accent">
                              <Star className="h-4 w-4 fill-accent" />
                              <span>You rated {booking.rating} stars</span>
                            </div>
                          )}
                        </div>
                        <Button size="sm" variant="outline" className="w-full">
                          {booking.reviewed ? "Edit Review" : "Write Review"}
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            <h2 className="text-2xl font-semibold">Saved Properties</h2>
            {favorites.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Heart className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground mb-6">Save properties you love for later</p>
                  <Button>Browse Properties</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {favorites.map((property) => (
                  <Card key={property.id} className="overflow-hidden hover:shadow-card-hover transition-all">
                    <div className="relative">
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="w-full h-48 object-cover"
                      />
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="absolute top-3 right-3"
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-1">{property.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4" />
                        <span>{property.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          <span className="font-medium">{property.rating}</span>
                        </div>
                        <span className="text-lg font-bold text-primary">₹{property.price}/night</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GuestDashboard;
