import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import { ArrowRight, Shield, Clock, HeadphonesIcon } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  // Mock data for featured properties
  const featuredProperties = [
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
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Beautiful apartment interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50" />
        </div>
        
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect
              <span className="block bg-gradient-primary bg-clip-text text-transparent">
                Stay Anywhere
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover unique accommodations from apartments to villas. Book your dream stay with EasyStay.
            </p>
            
            <div className="mt-12 animate-slide-up">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose EasyStay?</h2>
            <p className="text-muted-foreground text-lg">Your trusted partner for seamless accommodation</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-xl shadow-card hover:shadow-card-hover transition-all">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
              <p className="text-muted-foreground">
                Your payments and personal data are protected with industry-leading security.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-xl shadow-card hover:shadow-card-hover transition-all">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Confirmation</h3>
              <p className="text-muted-foreground">
                Get immediate booking confirmation and start planning your trip right away.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-xl shadow-card hover:shadow-card-hover transition-all">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                <HeadphonesIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground">
                Our dedicated support team is always here to help with any questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Properties</h2>
              <p className="text-muted-foreground">Handpicked stays for your next adventure</p>
            </div>
            <Link to="/properties">
              <Button variant="outline" className="hidden sm:flex">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/properties">
              <Button>
                View All Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to List Your Property?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of hosts earning extra income by sharing their spaces with travelers.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Become a Host
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">EasyStay</h3>
              <p className="text-muted-foreground text-sm">
                Your seamless stay and property management platform.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Guests</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/properties" className="hover:text-foreground">Browse Properties</Link></li>
                <li><Link to="/login" className="hover:text-foreground">My Bookings</Link></li>
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Hosts</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/register" className="hover:text-foreground">List Property</Link></li>
                <li><Link to="/login" className="hover:text-foreground">Host Dashboard</Link></li>
                <li><a href="#" className="hover:text-foreground">Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About Us</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2025 EasyStay. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
