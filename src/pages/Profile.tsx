import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import {
  User,
  Mail,
  Phone,
  Award,
  Flame,
  LogOut,
  Edit,
  Save,
  X,
} from "lucide-react";

const profileSchema = z.object({
  full_name: z.string().trim().max(100, "Name must be less than 100 characters").optional(),
  phone: z.string().trim().max(20, "Phone must be less than 20 characters").optional(),
});

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await (supabase as any)
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFullName(data.full_name || "");
        setPhone(data.phone || "");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const validated = profileSchema.parse({
        full_name: fullName,
        phone: phone,
      });

      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await (supabase as any)
        .from("profiles")
        .update({
          full_name: validated.full_name || "",
          phone: validated.phone || "",
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
      loadProfile();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen cosmic-bg flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cosmic-bg pb-24">
      <div className="max-w-md mx-auto p-4 space-y-6">
        <div className="pt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold cosmic-text mb-1">Profile</h1>
            <p className="text-muted-foreground">Manage your account</p>
          </div>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="icon"
              className="bg-card/80 backdrop-blur-lg border-border"
            >
              <Edit className="w-4 h-4" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                size="icon"
                className="bg-primary"
              >
                <Save className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setFullName(profile?.full_name || "");
                  setPhone(profile?.phone || "");
                }}
                variant="outline"
                size="icon"
                className="bg-card/80 backdrop-blur-lg border-border"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Profile Header */}
        <Card className="p-6 bg-gradient-to-br from-primary to-secondary text-white glow-card">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-10 h-10" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              ) : (
                <h2 className="text-2xl font-bold">{fullName || "User"}</h2>
              )}
              <p className="text-sm opacity-90 mt-1">
                Member since {new Date(profile?.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-card/80 backdrop-blur-lg border-border text-center">
            <Flame className="w-6 h-6 mx-auto mb-2 text-accent" />
            <p className="text-2xl font-bold">{profile?.streak_count || 0}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </Card>
          <Card className="p-4 bg-card/80 backdrop-blur-lg border-border text-center">
            <Award className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{profile?.total_points || 0}</p>
            <p className="text-xs text-muted-foreground">Total Points</p>
          </Card>
        </div>

        {/* Account Details */}
        <Card className="p-6 bg-card/80 backdrop-blur-lg border-border space-y-4">
          <h3 className="font-semibold mb-4">Account Details</h3>
          
          <div className="space-y-2">
            <Label className="text-muted-foreground flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <div className="p-3 bg-background/50 rounded-lg">
              <p className="font-medium">{profile?.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone
            </Label>
            {isEditing ? (
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="bg-background/50"
              />
            ) : (
              <div className="p-3 bg-background/50 rounded-lg">
                <p className="font-medium">{phone || "Not provided"}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Sign Out Button */}
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full justify-start gap-3 h-12 bg-destructive/10 border-destructive/20 hover:bg-destructive/20 text-destructive"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
