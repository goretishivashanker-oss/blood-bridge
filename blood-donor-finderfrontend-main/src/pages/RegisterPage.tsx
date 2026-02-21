import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplet, MapPin, Phone, User, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const RegisterPage = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bloodType: "",
    contact: "",
    city: "",
    lastDonation: "",
    age: "",
    available: true,
    lat: null as number | null,
    lng: null as number | null,
  });

  useEffect(() => {
    // Attempt to grab location securely if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({ ...prev, lat: pos.coords.latitude, lng: pos.coords.longitude }));
        },
        (err) => console.log("Geolocation error", err)
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bloodType) {
      toast({ title: "Error", description: "Please select a Blood Group.", variant: "destructive" });
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/donors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        toast({
          title: "Registration Successful!",
          description: "Thank you for registering as a blood donor.",
        });
      } else {
        const errorData = await response.json();
        toast({ title: "Error", description: errorData.error || "Failed to register donor.", variant: "destructive" });
        console.error("Backend error:", errorData);
      }
    } catch (error) {
      toast({ title: "Error", description: "Network error. Make sure the backend is running and reachable.", variant: "destructive" });
      console.error("Fetch error:", error);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 px-6 flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-heading text-3xl font-bold mb-3">You're Registered!</h2>
            <p className="text-muted-foreground mb-6">
              Your donor profile is now active. You'll be notified when someone nearby needs your blood type.
            </p>
            <Button variant="hero" onClick={() => setSubmitted(false)}>Register Another Donor</Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 px-6 pb-12">
        <div className="container max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-2">Become a Donor</h1>
            <p className="text-muted-foreground text-lg mb-8">Register your profile to help save lives in emergencies</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <form
              className="glass-card rounded-3xl p-8 space-y-6"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" /> Full Name
                  </Label>
                  <Input placeholder="Enter your full name" className="bg-background border-border" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-primary" /> Blood Group
                  </Label>
                  <Select required value={formData.bloodType} onValueChange={(val) => setFormData({ ...formData, bloodType: val })}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" /> Contact Number
                  </Label>
                  <Input placeholder="+91 XXXXX XXXXX" className="bg-background border-border" required value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> City / Location
                  </Label>
                  <Input placeholder="Enter your city" className="bg-background border-border" required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" /> Last Donation Date
                  </Label>
                  <Input type="date" className="bg-background border-border" value={formData.lastDonation} onChange={(e) => setFormData({ ...formData, lastDonation: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">Age</Label>
                  <Input type="number" placeholder="Enter your age" min="18" max="65" className="bg-background border-border" required value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border">
                <div>
                  <p className="font-medium">Available for Donation</p>
                  <p className="text-sm text-muted-foreground">Toggle on when you're available to donate</p>
                </div>
                <Switch checked={formData.available} onCheckedChange={(val) => setFormData({ ...formData, available: val })} />
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full text-base py-6">
                Register as Donor
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
