
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  const [licensePlate, setLicensePlate] = useState(profile?.vehicle_license_plate || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!user) {
      navigate("/");
    }
    
    // Update form when profile loads/changes
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setLicensePlate(profile.vehicle_license_plate || "");
    }
  }, [user, profile, navigate]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          vehicle_license_plate: licensePlate
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleFeatureClick = () => {
    toast("Feature coming soon", {
      description: "This feature will be available in the next update."
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onLoginClick={() => {}} />

      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-fit">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information here. This information will be displayed publicly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={user?.email || ""} 
                      disabled 
                      placeholder="Your email address"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your email cannot be changed.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licensePlate">Vehicle License Plate</Label>
                    <Input 
                      id="licensePlate" 
                      value={licensePlate} 
                      onChange={(e) => setLicensePlate(e.target.value)} 
                      placeholder="Enter your vehicle license plate"
                    />
                  </div>
                  
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotif">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about your reservations via email.
                    </p>
                  </div>
                  <Switch id="emailNotif" defaultChecked onClick={handleFeatureClick} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="smsNotif">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about your reservations via SMS.
                    </p>
                  </div>
                  <Switch id="smsNotif" onClick={handleFeatureClick} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reminderNotif">Reservation Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive reminders before your reservations start.
                    </p>
                  </div>
                  <Switch id="reminderNotif" defaultChecked onClick={handleFeatureClick} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>
                  Customize your app experience.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark theme.
                    </p>
                  </div>
                  <Switch id="darkMode" onClick={handleFeatureClick} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="mapView">Default Map View</Label>
                    <p className="text-sm text-muted-foreground">
                      Show map view by default when searching for parking.
                    </p>
                  </div>
                  <Switch id="mapView" defaultChecked onClick={handleFeatureClick} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Manage your account security settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Change Password</Label>
                  <Button variant="outline" className="w-full" onClick={handleFeatureClick}>
                    Update Password
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label>Two-Factor Authentication</Label>
                  <Button variant="outline" className="w-full" onClick={handleFeatureClick}>
                    Setup 2FA
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Enhance your account security with two-factor authentication.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>
                  Manage your account settings and data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Download Your Data</Label>
                  <Button variant="outline" className="w-full" onClick={handleFeatureClick}>
                    Export Account Data
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Download a copy of your personal data.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Delete Account</Label>
                  <Button variant="destructive" className="w-full" onClick={handleFeatureClick}>
                    Delete My Account
                  </Button>
                  <p className="text-xs text-text-destructive">
                    This action cannot be undone. All your data will be permanently deleted.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Sign Out</Label>
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    Sign Out from All Devices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
