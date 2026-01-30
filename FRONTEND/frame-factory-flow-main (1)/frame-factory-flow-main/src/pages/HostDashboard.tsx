import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, Home, DollarSign, Calendar, Star, 
  TrendingUp, Users, MessageSquare 
} from "lucide-react";

const HostDashboard = () => {
  const stats = [
    {
      title: "Total Earnings",
      value: "$12,450",
      change: "+12.5%",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Active Listings",
      value: "5",
      change: "+1 this month",
      icon: Home,
      trend: "up"
    },
    {
      title: "Upcoming Bookings",
      value: "8",
      change: "Next 30 days",
      icon: Calendar,
      trend: "neutral"
    },
    {
      title: "Average Rating",
      value: "4.8",
      change: "From 124 reviews",
      icon: Star,
      trend: "up"
    }
  ];

  const properties = [
    {
      id: "1",
      title: "Cozy Downtown Apartment",
      location: "New York, NY",
      price: 120,
      status: "active",
      bookings: 15,
      revenue: 3450,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"
    },
    {
      id: "2",
      title: "Beachfront Villa",
      location: "Miami, FL",
      price: 350,
      status: "active",
      bookings: 8,
      revenue: 5600,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400"
    }
  ];

  const recentBookings = [
    {
      id: "1",
      guest: "John Smith",
      property: "Cozy Downtown Apartment",
      checkIn: "2025-11-15",
      checkOut: "2025-11-18",
      amount: 410,
      status: "confirmed"
    },
    {
      id: "2",
      guest: "Sarah Johnson",
      property: "Beachfront Villa",
      checkIn: "2025-11-20",
      checkOut: "2025-11-25",
      amount: 1800,
      status: "pending"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Host Dashboard</h1>
            <p className="text-muted-foreground">Manage your properties and bookings</p>
          </div>
          <Button size="lg" className="bg-gradient-primary">
            <Plus className="mr-2 h-5 w-5" />
            Add Property
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                        {stat.change}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">My Properties</h2>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add New
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {properties.map((property) => (
                <Card key={property.id} className="overflow-hidden hover:shadow-card-hover transition-all">
                  <div className="flex">
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-40 h-full object-cover"
                    />
                    <CardContent className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{property.title}</h3>
                        <Badge variant="default">{property.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{property.location}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Total Bookings</p>
                          <p className="font-semibold">{property.bookings}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Revenue</p>
                          <p className="font-semibold text-primary">₹{property.revenue}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Rating</p>
                          <p className="font-semibold flex items-center gap-1">
                            <Star className="h-3 w-3 fill-accent text-accent" />
                            {property.rating}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Price/night</p>
                          <p className="font-semibold">₹{property.price}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                        <Button size="sm" variant="outline" className="flex-1">View</Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <h2 className="text-2xl font-semibold">Recent Bookings</h2>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Guest</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Property</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Check-in</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Check-out</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-muted/30">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                                {booking.guest[0]}
                              </div>
                              <span className="font-medium">{booking.guest}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">{booking.property}</td>
                          <td className="px-6 py-4 text-sm">{booking.checkIn}</td>
                          <td className="px-6 py-4 text-sm">{booking.checkOut}</td>
                          <td className="px-6 py-4 font-semibold text-primary">₹{booking.amount}</td>
                          <td className="px-6 py-4">
                            <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                              {booking.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Button size="sm" variant="ghost">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <h2 className="text-2xl font-semibold">Guest Reviews</h2>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground">Reviews from your guests will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HostDashboard;
