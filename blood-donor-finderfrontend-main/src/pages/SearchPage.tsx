import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Phone, Clock, User, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import DonorMap from "@/components/DonorMap";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const SearchPage = () => {
  const [selectedBloodType, setSelectedBloodType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [urgency, setUrgency] = useState<string>("");
  const [donors, setDonors] = useState<any[]>([]);
  const [userLoc, setUserLoc] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    // Attempt to grab location seamlessly
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("Geolocation permission denied or error.")
      );
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedBloodType && selectedBloodType !== "all") {
      params.append("bloodType", selectedBloodType);
    }
    if (searchQuery) {
      params.append("search", searchQuery);
    }
    if (userLoc) {
      params.append("userLat", userLoc.lat.toString());
      params.append("userLng", userLoc.lng.toString());
    }

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/donors?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setDonors(data))
      .catch((err) => console.error("Failed to fetch donors", err));
  }, [searchQuery, selectedBloodType, userLoc]);

  const filteredDonors = donors;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 px-6 pb-12">
        <div className="container max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-2">Find Donors</h1>
            <p className="text-muted-foreground text-lg mb-8">Search for compatible blood donors near you</p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by city or name..."
                  className="pl-10 bg-background border-border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Blood Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {bloodTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={urgency} onValueChange={setUrgency}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Urgency Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical — Immediate</SelectItem>
                  <SelectItem value="high">High — Within hours</SelectItem>
                  <SelectItem value="normal">Normal — Scheduled</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="hero" className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Search Donors
              </Button>
            </div>
          </motion.div>

          {/* Interactive Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <DonorMap donors={filteredDonors} userLoc={userLoc} />
          </motion.div>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDonors.map((donor, index) => (
              <motion.div
                key={donor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="glass-card rounded-xl p-5 hover:glow-border transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold">{donor.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {donor.city} · {donor.distance}
                      </p>
                    </div>
                  </div>
                  <Badge variant={donor.available ? "default" : "secondary"} className={donor.available ? "bg-green-600/20 text-green-400 border-green-600/30" : ""}>
                    {donor.available ? "Available" : "Unavailable"}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Droplet className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-primary">{donor.bloodType}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    Last: {donor.lastDonation}
                  </div>
                </div>

                {donor.available ? (
                  <Button
                    variant="hero"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <a href={`tel:${donor.contact}`}>
                      <Phone className="w-4 h-4 mr-1" />
                      {donor.contact}
                    </a>
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    disabled
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Not Available
                  </Button>
                )}
              </motion.div>
            ))}
          </div>

          {filteredDonors.length === 0 && (
            <div className="text-center py-16">
              <Droplet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold mb-2">No donors found</h3>
              <p className="text-muted-foreground">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
