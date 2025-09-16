import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from './AuthContext';
import { LogOut, User } from 'lucide-react';

export const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <User className="w-5 h-5 text-green-700" />
          </div>
          <div>
            <div className="text-lg font-semibold">{user.name}</div>
            <div className="text-sm text-gray-600">{user.email}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {user.phone && (
            <div className="text-sm"><span className="font-medium">Phone:</span> {user.phone}</div>
          )}
          {user.farmLocation && (
            <div className="text-sm"><span className="font-medium">Location:</span> {user.farmLocation}</div>
          )}
          {typeof user.farmSize !== 'undefined' && (
            <div className="text-sm"><span className="font-medium">Farm size:</span> {user.farmSize} ha</div>
          )}
          {user.cropTypes && user.cropTypes.length > 0 && (
            <div className="text-sm"><span className="font-medium">Crops:</span> {user.cropTypes.join(', ')}</div>
          )}
        </div>

        <div className="pt-2">
          <Button variant="destructive" className="gap-2" onClick={logout}>
            <LogOut className="w-4 h-4" />
            Log out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};


