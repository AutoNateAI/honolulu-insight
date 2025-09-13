import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import hawaiianHeroBg from '@/assets/hawaiian-hero-bg.jpg';
import plumeriaDecoration from '@/assets/plumeria-decoration.jpg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
    }
    
    setLoading(false);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-primary via-sunset-primary to-tropical-primary relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(30, 136, 229, 0.8), rgba(233, 30, 99, 0.8)), url(${hawaiianHeroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Floating decoration */}
      <div 
        className="absolute top-10 right-10 w-32 h-32 opacity-30 rounded-full"
        style={{
          backgroundImage: `url(${plumeriaDecoration})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="absolute bottom-10 left-10 w-24 h-24 opacity-20 rounded-full bg-white/10 backdrop-blur-sm" />

      <Card className="glass-card w-full max-w-md mx-4 border-white/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-sunset-primary to-tropical-primary rounded-full flex items-center justify-center text-2xl">
            🌺
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            HTW Dashboard
          </CardTitle>
          <CardDescription className="text-white/80">
            Honolulu Tech Week Network Portal
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="bg-red-500/20 border-red-500/30 text-white">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900 font-semibold text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@htwdashboard.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glass-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-900 font-semibold text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="glass-input"
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sunset-primary to-tropical-primary hover:from-sunset-secondary hover:to-tropical-secondary text-white font-semibold py-2.5 transition-all duration-200 transform hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}