import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Lock, Bell, Globe, Shield, Camera, Mail, Phone, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import SuperAdminLayout from "@/components/layout/SuperAdminLayout";
import AgencyLayout from "@/components/layout/AgencyLayout";

type Role = "super-admin" | "agency" | "client";

interface ProfileSettingsPageProps {
  role: Role;
}

const roleConfig: Record<Role, { name: string; roleLabel: string; initials: string; email: string; backPath: string }> = {
  "super-admin": {
    name: "John Doe",
    roleLabel: "Super Admin",
    initials: "SA",
    email: "john.doe@socialninja.com",
    backPath: "/super-admin/dashboard",
  },
  agency: {
    name: "Agency Admin",
    roleLabel: "Agency Admin",
    initials: "A",
    email: "admin@agency.com",
    backPath: "/agency/dashboard",
  },
  client: {
    name: "Business Owner",
    roleLabel: "Business Admin",
    initials: "B",
    email: "owner@business.com",
    backPath: "/client/dashboard",
  },
};

export default function ProfileSettingsPage({ role }: ProfileSettingsPageProps) {
  const navigate = useNavigate();
  const cfg = roleConfig[role];

  const [profile, setProfile] = useState({
    fullName: cfg.name,
    email: cfg.email,
    phone: "+1 (555) 123-4567",
    timezone: "America/New_York",
    language: "en",
    bio: "",
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    pushAlerts: true,
    weeklyDigest: false,
    mentions: true,
    productNews: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionAlerts: true,
  });

  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });

  const handleSaveProfile = () => toast.success("Profile updated successfully");
  const handleSavePassword = () => {
    if (!pwd.current || !pwd.next || pwd.next !== pwd.confirm) {
      toast.error("Please fill all fields and confirm passwords match");
      return;
    }
    toast.success("Password updated");
    setPwd({ current: "", next: "", confirm: "" });
  };
  const handleSaveNotifications = () => toast.success("Notification preferences saved");
  const handleSaveSecurity = () => toast.success("Security settings updated");

  const content = (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(cfg.backPath)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </div>

      {/* Profile header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full gradient-coral flex items-center justify-center text-white text-2xl font-bold">
                {cfg.initials}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-background border border-border shadow flex items-center justify-center hover:bg-muted transition-colors">
                <Camera className="h-3.5 w-3.5 text-foreground" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{profile.fullName}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                <Mail className="h-3.5 w-3.5" /> {profile.email}
              </p>
              <Badge variant="secondary" className="mt-2">{cfg.roleLabel}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" /> Profile</TabsTrigger>
          <TabsTrigger value="security" className="gap-2"><Lock className="h-4 w-4" /> Security</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" /> Notifications</TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2"><Globe className="h-4 w-4" /> Preferences</TabsTrigger>
        </TabsList>

        {/* PROFILE */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={profile.fullName} onChange={e => setProfile({ ...profile, fullName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input value={cfg.roleLabel} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" rows={3} placeholder="Tell us a bit about yourself..." value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECURITY */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Use a strong password with at least 8 characters, mixing letters, numbers, and symbols.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current">Current Password</Label>
                <Input id="current" type="password" value={pwd.current} onChange={e => setPwd({ ...pwd, current: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input id="new" type="password" value={pwd.next} onChange={e => setPwd({ ...pwd, next: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm New Password</Label>
                  <Input id="confirm" type="password" value={pwd.confirm} onChange={e => setPwd({ ...pwd, confirm: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSavePassword}>Update Password</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-start gap-3">
                  <Smartphone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Authenticator App</p>
                    <p className="text-xs text-muted-foreground">Use an app like Google Authenticator or Authy.</p>
                  </div>
                </div>
                <Switch checked={security.twoFactor} onCheckedChange={v => setSecurity({ ...security, twoFactor: v })} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Login Session Alerts</p>
                  <p className="text-xs text-muted-foreground">Get notified when a new device signs in.</p>
                </div>
                <Switch checked={security.sessionAlerts} onCheckedChange={v => setSecurity({ ...security, sessionAlerts: v })} />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveSecurity}>Save Security Settings</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Devices currently signed in to your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">MacBook Pro · Chrome</p>
                    <p className="text-xs text-muted-foreground">New York, US · Active now</p>
                  </div>
                  <Badge variant="secondary">Current</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">iPhone 14 · Safari</p>
                    <p className="text-xs text-muted-foreground">New York, US · 2 hours ago</p>
                  </div>
                  <Button variant="ghost" size="sm">Revoke</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what you want to be notified about.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                { key: "emailUpdates", label: "Email Updates", desc: "Receive important account updates via email." },
                { key: "pushAlerts", label: "Push Alerts", desc: "Real-time alerts in your browser and mobile app." },
                { key: "mentions", label: "Mentions & Replies", desc: "When someone mentions you or replies to your content." },
                { key: "weeklyDigest", label: "Weekly Digest", desc: "A weekly summary of activity and performance." },
                { key: "productNews", label: "Product News", desc: "Announcements about new features and improvements." },
              ].map((item, i) => (
                <div key={item.key}>
                  {i > 0 && <Separator />}
                  <div className="flex items-center justify-between py-4">
                    <div className="pr-4">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={v => setNotifications({ ...notifications, [item.key]: v })}
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-end pt-2">
                <Button onClick={handleSaveNotifications}>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PREFERENCES */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Customize timezone, language, and formatting.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={profile.timezone} onValueChange={v => setProfile({ ...profile, timezone: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={profile.language} onValueChange={v => setProfile({ ...profile, language: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="hi">हिन्दी</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4 border-destructive/30">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for your account.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Delete Account</p>
                <p className="text-xs text-muted-foreground">Permanently remove your account and all associated data.</p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  if (role === "super-admin") return <SuperAdminLayout title="My Profile">{content}</SuperAdminLayout>;
  if (role === "agency") return <AgencyLayout title="My Profile">{content}</AgencyLayout>;
  return content; // client uses ClientLayout via Outlet
}
