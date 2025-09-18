import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  User, 
  Phone, 
  Calendar, 
  MapPin, 
  LogOut, 
  Edit, 
  Save, 
  X, 
  Shield, 
  Award, 
  TrendingUp,
  Leaf,
  Settings,
  Bell,
  CreditCard,
  FileText,
  Activity,
  Globe,
  HelpCircle
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import { useTranslation } from '../lib/translations';

interface ProfileProps {
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  const { user, logout, updateProfile } = useAuth();
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    aadhar: user?.aadhar || '',
    location: user?.location || '',
    farmSize: user?.farmSize || 0,
    cropType: user?.cropType || 'both'
  });
  const [isAadhaarOpen, setIsAadhaarOpen] = useState(false);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [qrData, setQrData] = useState('');
  const [linking, setLinking] = useState(false);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p>Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = async () => {
    await updateProfile({
      name: editData.name,
      aadhar: editData.aadhar,
      location: editData.location,
      farmSize: editData.farmSize,
      cropType: editData.cropType as any
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      aadhar: user?.aadhar || '',
      location: user?.location || '',
      farmSize: user?.farmSize || 0,
      cropType: user?.cropType || 'both'
    });
    setIsEditing(false);
  };

  const handleLinkAadhaar = async () => {
    setLinking(true);
    try {
      const { fetchAadhaarByNumber, fetchAadhaarByQr } = await import('../lib/backendApi');
      const profile = qrData
        ? await fetchAadhaarByQr(qrData)
        : await fetchAadhaarByNumber(aadhaarNumber);
      await updateProfile({ aadhar: profile.aadhar, name: profile.name });
      setEditData((prev) => ({ ...prev, aadhar: profile.aadhar, name: profile.name || prev.name }));
      setIsAadhaarOpen(false);
      setAadhaarNumber('');
      setQrData('');
    } catch (e) {
      console.error('Aadhaar link failed', e);
    } finally {
      setLinking(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="farming">Farming Data</TabsTrigger>
            <TabsTrigger value="schemes">Schemes</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Manage your account information and preferences
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSave}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                      {isEditing ? (
                        <Input
                          value={editData.name}
                          onChange={(e) => setEditData({...editData, name: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-lg font-semibold">{user.name || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Phone Number</Label>
                      <p className="text-lg font-semibold">{user.phone}</p>
                    </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Location (City)</Label>
                    {isEditing ? (
                      <Input
                        value={editData.location}
                        onChange={(e) => setEditData({...editData, location: e.target.value})}
                        className="mt-1"
                        placeholder="e.g., Kochi,IN"
                      />
                    ) : (
                      <p className="text-lg font-semibold">{user.location || 'Not provided'}</p>
                    )}
                  </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Aadhar Number</Label>
                      {isEditing ? (
                        <Input
                          value={editData.aadhar}
                          onChange={(e) => setEditData({...editData, aadhar: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-lg font-semibold">{user.aadhar || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Farm Size</Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editData.farmSize}
                          onChange={(e) => setEditData({...editData, farmSize: parseFloat(e.target.value)})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-lg font-semibold">{user.farmSize ? `${user.farmSize} acres` : 'Not specified'}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Crop Type</Label>
                      {isEditing ? (
                        <select
                          value={editData.cropType}
                          onChange={(e) => setEditData({...editData, cropType: e.target.value as 'corn' | 'vegetables' | 'both'})}
                          className="mt-1 w-full p-2 border rounded-md"
                        >
                          <option value="corn">Corn</option>
                          <option value="vegetables">Vegetables</option>
                          <option value="both">Both</option>
                        </select>
                      ) : (
                        <p className="text-lg font-semibold capitalize">{user.cropType || 'Not specified'}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Member Since</Label>
                      <p className="text-lg font-semibold">{new Date(user.joinedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant={user.verified ? "default" : "secondary"}>
                    <Shield className="h-3 w-3 mr-1" />
                    {user.verified ? 'Verified' : 'Pending Verification'}
                  </Badge>
                  <Badge variant={user.isProfileComplete ? "default" : "outline"}>
                    <Award className="h-3 w-3 mr-1" />
                    {user.isProfileComplete ? 'Profile Complete' : 'Profile Incomplete'}
                  </Badge>
                  <Badge variant="outline">
                    <Activity className="h-3 w-3 mr-1" />
                    {user.role === 'admin' ? 'Administrator' : 'Farmer'}
                  </Badge>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <Button onClick={handleSave} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="flex-1">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Farming Data Tab */}
          <TabsContent value="farming" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5" />
                    Farm Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Farm Area</span>
                      <span className="font-semibold">{user.farmSize || 0} acres</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Crop Types</span>
                      <span className="font-semibold capitalize">{user.cropType || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Analysis Count</span>
                      <span className="font-semibold">0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent activity</p>
                    <p className="text-sm mt-2">Start analyzing your crops to see activity here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Schemes Tab */}
          <TabsContent value="schemes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Applied Schemes
                </CardTitle>
                <CardDescription>
                  Track your government scheme applications and benefits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No scheme applications yet</p>
                  <p className="text-sm mt-2">Browse available schemes to get started</p>
                  <Button className="mt-4" onClick={() => window.location.hash = '#government-schemes'}>
                    Browse Schemes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive alerts about your crops and schemes</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Bell className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Privacy</h4>
                      <p className="text-sm text-muted-foreground">Manage your data and privacy settings</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsAadhaarOpen(true)}>
                      <Shield className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Language</h4>
                      <p className="text-sm text-muted-foreground">Change your preferred language</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Globe className="h-4 w-4 mr-2" />
                      {language.toUpperCase()}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Help & Support</h4>
                      <p className="text-sm text-muted-foreground">Get help and contact support</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Help
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      logout();
                      onLogout();
                    }}
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <Dialog open={isAadhaarOpen} onOpenChange={setIsAadhaarOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Link Aadhaar</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm">Aadhaar Number</Label>
                <Input value={aadhaarNumber} onChange={(e) => setAadhaarNumber(e.target.value)} placeholder="XXXX-XXXX-XXXX" />
              </div>
              <div>
                <Label className="text-sm">QR Data (optional)</Label>
                <Input value={qrData} onChange={(e) => setQrData(e.target.value)} placeholder="Paste QR string" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAadhaarOpen(false)}>Cancel</Button>
              <Button onClick={handleLinkAadhaar} disabled={linking || (!aadhaarNumber && !qrData)}>
                {linking ? 'Linking...' : 'Link Aadhaar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Profile;