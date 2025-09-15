import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, MapPin, Activity, Settings, Eye, Trash2, Shield } from 'lucide-react';
import { useAuth } from './AuthContext';
import { authService } from '@/lib/auth';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [farmers] = useState(authService.getAllFarmers());

  const stats = [
    { label: 'Total Farmers', value: farmers.length, icon: Users, color: 'text-blue-600' },
    { label: 'Active Farms', value: farmers.length, icon: MapPin, color: 'text-green-600' },
    { label: 'Total Area', value: `${farmers.reduce((sum, f) => sum + f.farmSize, 0).toFixed(1)} ha`, icon: Activity, color: 'text-purple-600' },
    { label: 'System Status', value: 'Online', icon: Shield, color: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Admin Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Kerala Agricultural Management System</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline">
                <Shield className="w-3 h-3 mr-1" />
                {user?.name}
              </Badge>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="farmers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="farmers">Farmer Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="farmers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Registered Farmers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {farmers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No farmers registered yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {farmers.map((farmer) => (
                      <div key={farmer.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{farmer.name}</h3>
                            <Badge variant="outline">{farmer.role}</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Email:</span> {farmer.email}
                            </div>
                            <div>
                              <span className="font-medium">Phone:</span> {farmer.phone}
                            </div>
                            <div>
                              <span className="font-medium">Location:</span> {farmer.farmLocation}
                            </div>
                            <div>
                              <span className="font-medium">Farm Size:</span> {farmer.farmSize} ha
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className="text-sm font-medium">Crops:</span>
                            <div className="flex gap-1 mt-1">
                              {farmer.cropTypes.map((crop, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {crop}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Crop Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['rice', 'coconut', 'pepper', 'cardamom', 'banana'].map((crop, index) => {
                      const count = farmers.filter(f => f.cropTypes.includes(crop)).length;
                      const percentage = farmers.length > 0 ? (count / farmers.length) * 100 : 0;
                      return (
                        <div key={crop} className="flex items-center justify-between">
                          <span className="capitalize">{crop}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-full bg-green-500 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span>Active Users</span>
                      <Badge variant="default">{farmers.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span>Data Uploads Today</span>
                      <Badge variant="secondary">24</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span>Alerts Generated</span>
                      <Badge variant="destructive">3</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">AI Model Settings</h3>
                    <p className="text-sm text-gray-600 mb-3">Configure crop and soil detection models</p>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Data Backup</h3>
                    <p className="text-sm text-gray-600 mb-3">Manage system data backups</p>
                    <Button variant="outline" size="sm">Backup Now</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">User Permissions</h3>
                    <p className="text-sm text-gray-600 mb-3">Manage farmer access levels</p>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">System Monitoring</h3>
                    <p className="text-sm text-gray-600 mb-3">View system health and performance</p>
                    <Button variant="outline" size="sm">Monitor</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
