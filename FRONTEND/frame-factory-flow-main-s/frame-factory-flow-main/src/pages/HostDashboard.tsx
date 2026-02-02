
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Home, DollarSign, Calendar, Star, TrendingUp, Users, MessageSquare } from "lucide-react";
import React, { useEffect, useState } from "react";

// Improved modal implementation: scrollable, always centered, responsive
const Modal = ({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative flex flex-col"
        style={{
          maxHeight: '90vh',
          minHeight: 'auto',
        }}
      >
        <button className="absolute top-2 right-2 text-gray-500 text-2xl font-bold z-10" onClick={onClose}>&times;</button>
        <div className="overflow-y-auto p-6" style={{ maxHeight: '80vh' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

const HostDashboard = () => {
  // State for properties
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    propertyType: "Apartment",
    pricePerNight: "",
    maxGuests: "",
    bedrooms: "1",
    bathrooms: "1",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: ""
    },
    location: {
      coordinates: [0, 0]
    },
    amenities: [],
    images: [],
    isActive: true
  });
  const [error, setError] = useState("");

  // TODO: Replace with real hostId from auth context
  const hostId = "4";

  // Fetch properties from backend
  useEffect(() => {
    setLoading(true);
    fetch(`/api/properties?hostId=${hostId}`)
      .then(res => res.json())
      .then(data => {
        setProperties(data.properties || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [showModal]);

  // Handle form input
  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      setForm({ ...form, address: { ...form.address, [name.split(".")[1]]: value } });
    } else if (name.startsWith("location.")) {
      const idx = name.endsWith("0") ? 0 : 1;
      const coords = [...form.location.coordinates];
      coords[idx] = parseFloat(value);
      setForm({ ...form, location: { ...form.location, coordinates: coords } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Handle amenities (comma separated)
  const handleAmenities = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, amenities: e.target.value.split(",").map(a => a.trim()) });
  };

  // Handle images (comma separated URLs)
  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, images: e.target.value.split(",").map(url => ({ url: url.trim(), isCover: false })) });
  };

  // Submit property
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, hostId })
      });
      if (!res.ok) throw new Error("Failed to add property");
      setShowModal(false);
      setForm({
        title: "",
        description: "",
        propertyType: "Apartment",
        pricePerNight: "",
        maxGuests: "",
        bedrooms: "1",
        bathrooms: "1",
        address: {
          street: "",
          city: "",
          state: "",
          country: "",
          zipCode: ""
        },
        location: {
          coordinates: [0, 0]
        },
        amenities: [],
        images: [],
        isActive: true
      });
    } catch (err: any) {
      setError(err.message || "Error");
    }
  };
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
    ,{
      id: "3",
      guest: "Shreya Tiwari",
      property: "Royal Palace",
      checkIn: "2026-01-20",
      checkOut: "2026-01-31",
      amount: 8800,
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
          <Button size="lg" className="bg-gradient-primary" onClick={() => setShowModal(true)}>
            <Plus className="mr-2 h-5 w-5" />
            Add Property
          </Button>
        </div>

        {/* Modal for property creation */}
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <div className="mb-6 flex items-center gap-3">
            <Plus className="h-7 w-7 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">Add New Property</h2>
          </div>
          {error && <div className="text-red-500 mb-2 text-center font-semibold">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Title*</label>
                <input name="title" value={form.title} onChange={handleInput} required className="rounded-lg border border-border px-4 py-2 focus:ring-2 focus:ring-primary/40" placeholder="e.g. Cozy Apartment in City Center" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Property Type*</label>
                <select name="propertyType" value={form.propertyType} onChange={handleInput} required className="rounded-lg border border-border px-4 py-2 focus:ring-2 focus:ring-primary/40">
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Villa</option>
                  <option>Studio</option>
                  <option>Hotel</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Price Per Night* (₹)</label>
                <input name="pricePerNight" type="number" value={form.pricePerNight} onChange={handleInput} required className="rounded-lg border border-border px-4 py-2 focus:ring-2 focus:ring-primary/40" placeholder="e.g. 1500" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Max Guests*</label>
                <input name="maxGuests" type="number" value={form.maxGuests} onChange={handleInput} required className="rounded-lg border border-border px-4 py-2 focus:ring-2 focus:ring-primary/40" placeholder="e.g. 4" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Bedrooms</label>
                <input name="bedrooms" type="number" value={form.bedrooms} onChange={handleInput} className="rounded-lg border border-border px-4 py-2 focus:ring-2 focus:ring-primary/40" placeholder="e.g. 2" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Bathrooms</label>
                <input name="bathrooms" type="number" value={form.bathrooms} onChange={handleInput} className="rounded-lg border border-border px-4 py-2 focus:ring-2 focus:ring-primary/40" placeholder="e.g. 1" />
              </div>
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Description*</label>
                <textarea name="description" value={form.description} onChange={handleInput} required className="rounded-lg border border-border px-4 py-2 min-h-[80px] focus:ring-2 focus:ring-primary/40" placeholder="Describe your property, location, highlights, etc." />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Street</label>
                <input name="address.street" value={form.address.street} onChange={handleInput} className="rounded-lg border border-border px-4 py-2 focus:ring-2 focus:ring-primary/40" placeholder="e.g. 123 Main St" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">City*</label>
                <input name="address.city" value={form.address.city} onChange={handleInput} required className="rounded-lg border border-border px-4 py-2 focus:ring-2 focus:ring-primary/40" placeholder="e.g. Mumbai" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">State</label>
                <input name="address.state" value={form.address.state} onChange={handleInput} className="rounded-lg border border-border px-4 py-2 focus:ring-2 focus:ring-primary/40" placeholder="e.g. Maharashtra" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Country*</label>
                <input name="address.country" value={form.address.country} onChange={handleInput} required className="rounded-lg border border-border px-4 py-2 focus:ring-2 focus:ring-primary/40" placeholder="e.g. India" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Zip Code</label>
                <input name="address.zipCode" value={form.address.zipCode} onChange={handleInput} className="rounded-lg border border-border px-4 py-2 focus:ring-2 focus:ring-primary/40" placeholder="e.g. 400001" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Longitude*</label>
                <input name="location.0" type="number" value={form.location.coordinates[0]} onChange={handleInput} required className="rounded-lg border border-border px-4 py-2 focus:ring-2 focus:ring-primary/40" placeholder="e.g. 72.8777" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Latitude*</label>
                <input name="location.1" type="number" value={form.location.coordinates[1]} onChange={handleInput} required className="rounded-lg border border-border px-4 py-2 focus:ring-2 focus:ring-primary/40" placeholder="e.g. 19.0760" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Amenities (comma separated)</label>
                <input name="amenities" value={form.amenities.join(",")} onChange={handleAmenities} className="rounded-lg border border-border px-4 py-2 focus:ring-2 focus:ring-primary/40" placeholder="e.g. wifi, pool, parking" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-muted-foreground">Images (comma separated URLs)</label>
                <input name="images" value={form.images.map((img: any) => img.url).join(",")} onChange={handleImages} className="rounded-lg border border-border px-4 py-2 focus:ring-2 focus:ring-primary/40" placeholder="e.g. https://..." />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="accent-primary h-5 w-5" />
              <label className="font-semibold text-muted-foreground">Active</label>
            </div>
            <div className="flex justify-end mt-6">
              <Button type="submit" className="bg-gradient-primary px-8 py-2 text-lg font-semibold rounded-lg shadow hover:scale-105 transition-transform">Add Property</Button>
            </div>
          </form>
        </Modal>
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
            
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {properties.length === 0 ? (
                  <div className="col-span-2 text-center text-muted-foreground">No properties found.</div>
                ) : (
                  properties.map((property: any) => (
                    <Card key={property._id} className="overflow-hidden hover:shadow-card-hover transition-all">
                      <div className="flex">
                        <img 
                          src={property.images && property.images[0] ? property.images[0].url : "https://via.placeholder.com/150"} 
                          alt={property.title}
                          className="w-40 h-full object-cover"
                        />
                        <CardContent className="flex-1 p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg">{property.title}</h3>
                            <Badge variant="default">{property.isActive ? "active" : "inactive"}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">{property.address?.city}, {property.address?.country}</p>
                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Price/night</p>
                              <p className="font-semibold">₹{property.pricePerNight}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Max Guests</p>
                              <p className="font-semibold">{property.maxGuests}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Bedrooms</p>
                              <p className="font-semibold">{property.bedrooms}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Bathrooms</p>
                              <p className="font-semibold">{property.bathrooms}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Rating</p>
                              <p className="font-semibold flex items-center gap-1">
                                <Star className="h-3 w-3 fill-accent text-accent" />
                                {property.averageRating}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Total Reviews</p>
                              <p className="font-semibold">{property.totalReviews}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                            <Button size="sm" variant="outline" className="flex-1">View</Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}
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
