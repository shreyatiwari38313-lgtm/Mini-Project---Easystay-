import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, MapPin, Calendar as CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";

const SearchBar = () => {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("1");

  const handleSearch = () => {
    console.log({ location, checkIn, checkOut, guests });
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 bg-card rounded-2xl shadow-card-hover border border-border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Where to?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {checkIn ? format(checkIn, "PPP") : "Check-in"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {checkOut ? format(checkOut, "PPP") : "Check-out"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} />
          </PopoverContent>
        </Popover>

        <div className="relative">
          <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="number"
            placeholder="Guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            min="1"
            className="pl-10"
          />
        </div>
      </div>

      <Button 
        onClick={handleSearch} 
        className="w-full mt-4 bg-gradient-primary hover:opacity-90 transition-opacity"
        size="lg"
      >
        <Search className="mr-2 h-5 w-5" />
        Search Properties
      </Button>
    </div>
  );
};

export default SearchBar;
