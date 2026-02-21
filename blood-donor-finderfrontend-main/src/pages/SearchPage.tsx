import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Phone, Clock, User, Droplet, LocateFixed, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import DonorMap from "@/components/DonorMap";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const cardContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const donorCardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE } },
};

const SearchPage = () => {
  const [selectedBloodType, setSelectedBloodType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [urgency, setUrgency] = useState<string>("");
  const [donors, setDonors] = useState<any[]>([]);
  const [userLoc, setUserLoc] = useState<{ lat: number, lng: number } | null>(null);
  const [locStatus, setLocStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [locError, setLocError] = useState<string>("");

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocStatus("error");
      setLocError("Geolocation is not supported by your browser.");
      return;
    }
    setLocStatus("loading");
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocStatus("success");
      },
      (err) => {
        setLocStatus("error");
        setLocError(err.code === 1 ? "Location permission denied. Please allow access in your browser." : "Unable to retrieve your location.");
      },
      { timeout: 10000 }
    );
  };

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
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-2">Find Donors</h1>
            <p className="text-muted-foreground text-lg mb-8">Search for compatible blood donors near you</p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-3xl p-6 mb-8"
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

            {/* Location Row */}
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-primary/40 hover:border-primary hover:bg-primary/10 transition-all"
                onClick={handleGetLocation}
                disabled={locStatus === "loading"}
              >
                {locStatus === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                ) : locStatus === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : locStatus === "error" ? (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                ) : (
                  <LocateFixed className="w-4 h-4 text-primary" />
                )}
                {locStatus === "loading"
                  ? "Detecting location..."
                  : locStatus === "success"
                    ? "Location detected"
                    : locStatus === "error"
                      ? "Try again"
                      : "Use My Location"}
              </Button>

              {locStatus === "success" && userLoc && (
                <span className="text-sm text-green-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {userLoc.lat.toFixed(4)}, {userLoc.lng.toFixed(4)} — map centered on you
                </span>
              )}
              {locStatus === "error" && (
                <span className="text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {locError}
                </span>
              )}
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
          <motion.div
            variants={cardContainerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredDonors.map((donor) => (
              <motion.div
                key={donor.id}
                variants={donorCardVariants}
                whileHover={{ y: -5, transition: { duration: 0.22, ease: "easeOut" } }}
                className="glass-card rounded-3xl p-6 glow-border cursor-default flex flex-col justify-between"
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
          </motion.div>

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
