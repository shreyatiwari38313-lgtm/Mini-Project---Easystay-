import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Home, DollarSign, Calendar, Star, TrendingUp, MessageSquare, X } from "lucide-react";
import React, { useEffect, useState } from "react";

const HostDashboard = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editModal, setEditModal] = useState<{ open: boolean, property?: any }>({ open: false });
  const [viewModal, setViewModal] = useState<{ open: boolean, property?: any }>({ open: false });

  const [form, setForm] = useState({
    title: "",
    description: "",
    propertyType: "apartment",
    pricePerNight: "",
    maxGuests: "",
    bedrooms: "1",
    bathrooms: "1",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    longitude: "0",
    latitude: "0",
    amenities: "",
    images: [] as File[]
  });

  // API base (use Vite env variable VITE_API_BASE if available)
  const API_BASE = (import.meta.env.VITE_API_BASE as string) || "http://localhost:8000";

  // Get token from localStorage (use "accessToken" key from auth.api.ts)
  const token = localStorage.getItem("accessToken");

  // Fetch properties
  useEffect(() => {
    if (!token) {
      console.warn("⚠️ No token found. Please login first.");
      setError("You must be logged in to view properties");
      return;
    }
    fetchProperties();
  }, [token]);

  const fetchProperties = async () => {
    if (!token) {
      setError("Authentication required. Please login.");
      return;
    }

    setLoading(true);
    try {
      console.log("📡 Fetching properties with token:", token.substring(0, 20) + "...");
      const res = await fetch(`${API_BASE}/api/v1/properties/my/properties`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log("📊 Response status:", res.status);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
        throw new Error(errorData.message || `Failed to fetch properties: ${res.status}`);
      }

      const data = await res.json();
      setProperties(data.properties || []);
    } catch (err: any) {
      console.error("❌ Error fetching properties:", err);
      setError(err.message || "Failed to load properties");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name } = target;
    
    // Handle file input
    if (name === "images" && target.files) {
      setForm(prev => ({
        ...prev,
        images: Array.from(target.files as FileList)
      }));
      return;
    }
    
    const { value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      // Validate required fields
      if (!form.title || !form.city || !form.pricePerNight || !form.propertyType) {
        throw new Error("Please fill all required fields");
      }

      // Prepare FormData with image files
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("propertyType", form.propertyType);
      formData.append("pricePerNight", form.pricePerNight);
      formData.append("maxGuests", form.maxGuests ? form.maxGuests : "1");
      formData.append("bedrooms", form.bedrooms);
      formData.append("bathrooms", form.bathrooms);
      formData.append("longitude", form.longitude);
      formData.append("latitude", form.latitude);
      
      // Add address as nested object
      const addressObj = {
        street: form.street,
        city: form.city,
        state: form.state,
        country: form.country,
        zipCode: form.zipCode
      };
      formData.append("address", JSON.stringify(addressObj));
      
      // Note: amenities require ObjectIds (references to Amenity documents)
      // For now, we're skipping amenities in the basic property creation
      // TODO: Implement amenity selection with actual Amenity ObjectIds
      
      // Add image files
      if (form.images && form.images.length > 0) {
        console.log("📸 Adding images to FormData:", form.images.length, "files");
        for (let i = 0; i < form.images.length; i++) {
          console.log(`   File ${i}: ${form.images[i].name} (${form.images[i].size} bytes, ${form.images[i].type})`);
          formData.append("images", form.images[i]);
        }
      } else {
        console.warn("⚠️  No images selected");
      }

      console.log("📡 Creating property with token:", token?.substring(0, 20) + "...");

      const res = await fetch(`${API_BASE}/api/v1/properties`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData
      });

      console.log("📊 Response status:", res.status);

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("❌ Server error response:", data);
        throw new Error(data.message || `Server error: ${res.status}`);
      }

      console.log("✅ Property created successfully:", data);

      setSuccess("Property created successfully!");
      
      // Reset form
      setForm({
        title: "",
        description: "",
        propertyType: "apartment",
        pricePerNight: "",
        maxGuests: "",
        bedrooms: "1",
        bathrooms: "1",
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        longitude: "0",
        latitude: "0",
        amenities: "",
        images: []
      });

      // Refresh properties
      setTimeout(() => {
        setShowModal(false);
        fetchProperties();
      }, 1000);

    } catch (err: any) {
      const errorMsg = err.message || "Error creating property";
      setError(errorMsg);
      console.error("Error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete property
  const handleDeleteProperty = async (propertyId: string) => {
    if (!token) {
      setError("Authentication required. Please login.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    setLoading(true);
    try {
          const res = await fetch(`${API_BASE}/api/v1/properties/${propertyId}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
        throw new Error(errorData.message || `Failed to delete property: ${res.status}`);
      }
      setSuccess("Property deleted successfully!");
      fetchProperties();
    } catch (err: any) {
      setError(err.message || "Failed to delete property");
    } finally {
      setLoading(false);
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
      value: properties.length.toString(),
      change: `+${Math.max(0, properties.length - 4)} this month`,
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
    },
    {
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
          <Button
            size="lg"
            className="bg-gradient-primary hover:opacity-90"
            onClick={() => setShowModal(true)}
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Property
          </Button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Add New Property</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleInputChange}
                        placeholder="e.g., Cozy Apartment"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1">Property Type *</label>
                      <select
                        name="propertyType"
                        value={form.propertyType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="villa">Villa</option>
                        <option value="cottage">Cottage</option>
                        <option value="hotel">Hotel</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1">Price Per Night (₹) *</label>
                      <input
                        type="number"
                        name="pricePerNight"
                        value={form.pricePerNight}
                        onChange={handleInputChange}
                        placeholder="e.g., 2500"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1">Max Guests</label>
                      <input
                        type="number"
                        name="maxGuests"
                        value={form.maxGuests}
                        onChange={handleInputChange}
                        placeholder="e.g., 4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1">Bedrooms</label>
                      <input
                        type="number"
                        name="bedrooms"
                        value={form.bedrooms}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1">Bathrooms</label>
                      <input
                        type="number"
                        name="bathrooms"
                        value={form.bathrooms}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold mb-1">Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleInputChange}
                      placeholder="Describe your property..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-1">Street</label>
                        <input
                          type="text"
                          name="street"
                          value={form.street}
                          onChange={handleInputChange}
                          placeholder="123 Main St"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-1">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={form.city}
                          onChange={handleInputChange}
                          placeholder="Mumbai"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-1">State</label>
                        <input
                          type="text"
                          name="state"
                          value={form.state}
                          onChange={handleInputChange}
                          placeholder="Maharashtra"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-1">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={form.country}
                          onChange={handleInputChange}
                          placeholder="India"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-1">Zip Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={form.zipCode}
                          onChange={handleInputChange}
                          placeholder="400001"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-sm font-semibold mb-1">Amenities (comma separated)</label>
                    <input
                      type="text"
                      name="amenities"
                      value={form.amenities}
                      onChange={handleInputChange}
                      placeholder="e.g., WiFi, Pool, Parking, AC"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Images Upload */}
                  <div>
                    <label className="block text-sm font-semibold mb-1">Property Images (up to 5) *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary hover:bg-opacity-5 transition">
                      <input
                        type="file"
                        name="images"
                        multiple
                        accept="image/*"
                        onChange={handleInputChange}
                        className="hidden"
                        id="imageInput"
                      />
                      <label htmlFor="imageInput" className="cursor-pointer block">
                        <div className="text-gray-600 text-sm">
                          <p className="font-semibold mb-1">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5 MB (max 5 images)</p>
                        </div>
                      </label>
                    </div>
                    {form.images && form.images.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-semibold text-green-600">Selected {form.images.length} image(s):</p>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(form.images).map((file, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              {file.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 justify-end pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowModal(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-primary"
                      disabled={submitting}
                    >
                      {submitting ? "Creating..." : "Add Property"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

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

        {/* Tabs */}
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">My Properties</h2>
              <Button variant="outline" onClick={() => setShowModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New
              </Button>
            </div>

            {loading ? (
              <Card>
                <CardContent className="p-8 text-center">Loading properties...</CardContent>
              </Card>
            ) : properties.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No properties yet. Create your first property!
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {properties.map((property: any) => (
                  <Card key={property._id} className="overflow-hidden">
                    <div className="flex">
                      <img
                        src={property.images?.[0]?.url || "https://via.placeholder.com/160x160"}
                        alt={property.title}
                        className="w-40 h-40 object-cover"
                      />
                      <CardContent className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{property.title}</h3>
                          <Badge>{property.status || "pending"}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {property.address?.city}, {property.address?.country}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div>
                            <p className="text-muted-foreground">Price/night</p>
                            <p className="font-semibold">₹{property.pricePerNight}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Type</p>
                            <p className="font-semibold capitalize">{property.propertyType}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditModal({ open: true, property })}>Edit</Button>
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => setViewModal({ open: true, property })}>View</Button>
                          <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleDeleteProperty(property._id)}>Delete</Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Edit Modal */}
            {editModal.open && editModal.property && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Edit Property</h2>
                    <button
                      onClick={() => setEditModal({ open: false })}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="p-6">
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setSubmitting(true);
                        setError("");
                        setSuccess("");
                        try {
                          // Prepare FormData for PUT
                          const formData = new FormData();
                          formData.append("title", editModal.property.title);
                          formData.append("description", editModal.property.description || "");
                          formData.append("propertyType", editModal.property.propertyType);
                          formData.append("pricePerNight", editModal.property.pricePerNight);
                          formData.append("maxGuests", editModal.property.maxGuests || "1");
                          formData.append("bedrooms", editModal.property.bedrooms || "1");
                          formData.append("bathrooms", editModal.property.bathrooms || "1");
                          formData.append("longitude", editModal.property.longitude || "0");
                          formData.append("latitude", editModal.property.latitude || "0");
                          const addressObj = {
                            street: editModal.property.address?.street || "",
                            city: editModal.property.address?.city || "",
                            state: editModal.property.address?.state || "",
                            country: editModal.property.address?.country || "",
                            zipCode: editModal.property.address?.zipCode || ""
                          };
                          formData.append("address", JSON.stringify(addressObj));
                          // Amenities (comma separated)
                          if (editModal.property.amenities) {
                            formData.append("amenities", editModal.property.amenities);
                          }
                          // Images (new uploads)
                          if (editModal.property.newImages && editModal.property.newImages.length > 0) {
                            for (let i = 0; i < editModal.property.newImages.length; i++) {
                              formData.append("images", editModal.property.newImages[i]);
                            }
                          }
                          // PUT request (not PATCH)
                          const res = await fetch(`${API_BASE}/api/v1/properties/${editModal.property._id}`, {
                            method: "PUT",
                            headers: {
                              "Authorization": `Bearer ${token}`
                            },
                            body: formData
                          });
                          if (!res.ok) {
                            const errorData = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
                            throw new Error(errorData.message || `Failed to update property: ${res.status}`);
                          }
                          setSuccess("Property updated successfully!");
                          setEditModal({ open: false });
                          fetchProperties();
                        } catch (err: any) {
                          setError(err.message || "Failed to update property");
                        } finally {
                          setSubmitting(false);
                        }
                      }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-1">Title *</label>
                          <input
                            type="text"
                            name="title"
                            value={editModal.property.title}
                            onChange={e => setEditModal({ open: true, property: { ...editModal.property, title: e.target.value } })}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1">Property Type *</label>
                          <select
                            name="propertyType"
                            value={editModal.property.propertyType}
                            onChange={e => setEditModal({ open: true, property: { ...editModal.property, propertyType: e.target.value } })}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="apartment">Apartment</option>
                            <option value="house">House</option>
                            <option value="villa">Villa</option>
                            <option value="cottage">Cottage</option>
                            <option value="hotel">Hotel</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1">Price Per Night (₹) *</label>
                          <input
                            type="number"
                            name="pricePerNight"
                            value={editModal.property.pricePerNight}
                            onChange={e => setEditModal({ open: true, property: { ...editModal.property, pricePerNight: e.target.value } })}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1">Max Guests</label>
                          <input
                            type="number"
                            name="maxGuests"
                            value={editModal.property.maxGuests || ""}
                            onChange={e => setEditModal({ open: true, property: { ...editModal.property, maxGuests: e.target.value } })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1">Bedrooms</label>
                          <input
                            type="number"
                            name="bedrooms"
                            value={editModal.property.bedrooms || ""}
                            onChange={e => setEditModal({ open: true, property: { ...editModal.property, bedrooms: e.target.value } })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1">Bathrooms</label>
                          <input
                            type="number"
                            name="bathrooms"
                            value={editModal.property.bathrooms || ""}
                            onChange={e => setEditModal({ open: true, property: { ...editModal.property, bathrooms: e.target.value } })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Description</label>
                        <textarea
                          name="description"
                          value={editModal.property.description || ""}
                          onChange={e => setEditModal({ open: true, property: { ...editModal.property, description: e.target.value } })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold mb-1">Street</label>
                            <input
                              type="text"
                              name="street"
                              value={editModal.property.address?.street || ""}
                              onChange={e => setEditModal({ open: true, property: { ...editModal.property, address: { ...editModal.property.address, street: e.target.value } } })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-1">City *</label>
                            <input
                              type="text"
                              name="city"
                              value={editModal.property.address?.city || ""}
                              onChange={e => setEditModal({ open: true, property: { ...editModal.property, address: { ...editModal.property.address, city: e.target.value } } })}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-1">State</label>
                            <input
                              type="text"
                              name="state"
                              value={editModal.property.address?.state || ""}
                              onChange={e => setEditModal({ open: true, property: { ...editModal.property, address: { ...editModal.property.address, state: e.target.value } } })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-1">Country</label>
                            <input
                              type="text"
                              name="country"
                              value={editModal.property.address?.country || ""}
                              onChange={e => setEditModal({ open: true, property: { ...editModal.property, address: { ...editModal.property.address, country: e.target.value } } })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-1">Zip Code</label>
                            <input
                              type="text"
                              name="zipCode"
                              value={editModal.property.address?.zipCode || ""}
                              onChange={e => setEditModal({ open: true, property: { ...editModal.property, address: { ...editModal.property.address, zipCode: e.target.value } } })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>
                      </div>
                      {/* Amenities */}
                      <div>
                        <label className="block text-sm font-semibold mb-1">Amenities (comma separated)</label>
                        <input
                          type="text"
                          name="amenities"
                          value={editModal.property.amenities || ""}
                          onChange={e => setEditModal({ open: true, property: { ...editModal.property, amenities: e.target.value } })}
                          placeholder="e.g., WiFi, Pool, Parking, AC"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      {/* Images Upload */}
                      <div>
                        <label className="block text-sm font-semibold mb-1">Add/Replace Images (up to 5)</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary hover:bg-opacity-5 transition">
                          <input
                            type="file"
                            name="newImages"
                            multiple
                            accept="image/*"
                            onChange={e => {
                              const files = (e.target as HTMLInputElement).files;
                              setEditModal({
                                open: true,
                                property: {
                                  ...editModal.property,
                                  newImages: files ? Array.from(files) : []
                                }
                              });
                            }}
                            className="hidden"
                            id="editImageInput"
                          />
                          <label htmlFor="editImageInput" className="cursor-pointer block">
                            <div className="text-gray-600 text-sm">
                              <p className="font-semibold mb-1">Click to upload or drag and drop</p>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5 MB (max 5 images)</p>
                            </div>
                          </label>
                        </div>
                        {editModal.property.newImages && editModal.property.newImages.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-sm font-semibold text-green-600">Selected {editModal.property.newImages.length} image(s):</p>
                            <div className="flex flex-wrap gap-2">
                              {editModal.property.newImages.map((file: File, idx: number) => (
                                <span key={idx} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                  {file.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Show existing images */}
                        {editModal.property.images && editModal.property.images.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-semibold">Current Images:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {editModal.property.images.map((img: any, idx: number) => (
                                <img key={idx} src={img.url} alt="Property" className="w-16 h-16 object-cover rounded" />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3 justify-end pt-4">
                        <Button variant="outline" type="button" onClick={() => setEditModal({ open: false })}>Cancel</Button>
                        <Button className="bg-gradient-primary" type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Changes"}</Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* View Modal */}
            {viewModal.open && viewModal.property && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Property Details</h2>
                    <button
                      onClick={() => setViewModal({ open: false })}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      {/* Show all images */}
                      {viewModal.property.images && viewModal.property.images.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {viewModal.property.images.map((img: any, idx: number) => (
                            <img key={idx} src={img.url} alt={viewModal.property.title} className="w-32 h-32 object-cover rounded" />
                          ))}
                        </div>
                      ) : (
                        <img src="https://via.placeholder.com/160x160" alt="No images" className="w-40 h-40 object-cover mb-4" />
                      )}
                      <h3 className="font-semibold text-lg mb-2">{viewModal.property.title}</h3>
                      <p className="text-muted-foreground mb-2">{viewModal.property.address?.city}, {viewModal.property.address?.country}</p>
                      <p className="mb-2">Type: <b>{viewModal.property.propertyType}</b></p>
                      <p className="mb-2">Price/night: <b>₹{viewModal.property.pricePerNight}</b></p>
                      <p className="mb-2">Bedrooms: <b>{viewModal.property.bedrooms}</b></p>
                      <p className="mb-2">Bathrooms: <b>{viewModal.property.bathrooms}</b></p>
                      <p className="mb-2">Max Guests: <b>{viewModal.property.maxGuests}</b></p>
                      <p className="mb-2">Description: {viewModal.property.description}</p>
                      <p className="mb-2">Longitude: <b>{viewModal.property.longitude}</b></p>
                      <p className="mb-2">Latitude: <b>{viewModal.property.latitude}</b></p>
                      <p className="mb-2">Status: <Badge>{viewModal.property.status || "pending"}</Badge></p>
                      <div className="mt-2">
                        <h4 className="font-semibold">Address</h4>
                        <p>Street: {viewModal.property.address?.street}</p>
                        <p>City: {viewModal.property.address?.city}</p>
                        <p>State: {viewModal.property.address?.state}</p>
                        <p>Country: {viewModal.property.address?.country}</p>
                        <p>Zip Code: {viewModal.property.address?.zipCode}</p>
                      </div>
                      {/* Show amenities if present */}
                      {viewModal.property.amenities && (
                        <div className="mt-2">
                          <h4 className="font-semibold">Amenities</h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {typeof viewModal.property.amenities === 'string'
                              ? viewModal.property.amenities.split(',').map((a: string, idx: number) => (
                                  <span key={idx} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">{a.trim()}</span>
                                ))
                              : Array.isArray(viewModal.property.amenities)
                                ? viewModal.property.amenities.map((a: any, idx: number) => (
                                    <span key={idx} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">{a.name || a}</span>
                                  ))
                                : null}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 justify-end pt-4">
                      <Button variant="outline" onClick={() => setViewModal({ open: false })}>Close</Button>
                    </div>
                  </div>
                </div>
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
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-muted/30">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
                                {booking.guest[0]}
                              </div>
                              <span>{booking.guest}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">{booking.property}</td>
                          <td className="px-6 py-4 text-sm">{booking.checkIn}</td>
                          <td className="px-6 py-4 text-sm">{booking.checkOut}</td>
                          <td className="px-6 py-4 font-semibold">₹{booking.amount}</td>
                          <td className="px-6 py-4">
                            <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                              {booking.status}
                            </Badge>
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
              <CardContent className="p-8 text-center">
                <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
                <p className="text-muted-foreground">Reviews from guests will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HostDashboard;