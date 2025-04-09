import { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState({
    email: true,
    sms: true,
    emailAddress: '',
    phoneNumber: ''
  });

  const handleSave = async () => {
    // Save notification preferences to user profile
    // Implement your logic here
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Email Notifications</span>
          <Switch 
            checked={preferences.email}
            onCheckedChange={(checked) => 
              setPreferences(prev => ({ ...prev, email: checked }))
            }
          />
        </div>
        {preferences.email && (
          <Input
            type="email"
            placeholder="Email address"
            value={preferences.emailAddress}
            onChange={(e) => 
              setPreferences(prev => ({ ...prev, emailAddress: e.target.value }))
            }
          />
        )}
        <div className="flex items-center justify-between">
          <span>SMS Notifications</span>
          <Switch 
            checked={preferences.sms}
            onCheckedChange={(checked) => 
              setPreferences(prev => ({ ...prev, sms: checked }))
            }
          />
        </div>
        {preferences.sms && (
          <Input
            type="tel"
            placeholder="Phone number"
            value={preferences.phoneNumber}
            onChange={(e) => 
              setPreferences(prev => ({ ...prev, phoneNumber: e.target.value }))
            }
          />
        )}
        <Button className="w-full" onClick={handleSave}>
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences; 