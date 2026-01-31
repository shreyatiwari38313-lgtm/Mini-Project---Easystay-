import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  guests: number;
  imageUrl: string;
  category: string;
}

const PropertyCard = ({
  id,
  title,
  location,
  price,
  rating,
  reviews,
  guests,
  imageUrl,
  category,
}: PropertyCardProps) => {
  return (
    <Link to={`/property/${id}`}>
      <Card className="group overflow-hidden border-border hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <Badge className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm">
            {category}
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-medium">{rating}</span>
              <span className="text-muted-foreground">({reviews})</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{guests} guests</span>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <div className="w-full flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-primary">₹{price}</span>
              <span className="text-muted-foreground text-sm"> / night</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PropertyCard;
