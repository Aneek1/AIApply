import { Sparkles, Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onNavigate: (page: 'home' | 'dashboard') => void;
  currentPage: string;
  onAuthClick: () => void;
}

export function Header({ onNavigate, currentPage, onAuthClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AIApply
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => onNavigate('home')}
            className={`text-sm font-medium transition-colors hover:text-primary ${
              currentPage === 'home' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Home
          </button>
          {user && (
            <button
              onClick={() => onNavigate('dashboard')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPage === 'dashboard' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Dashboard
            </button>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Hi, {user.username}</span>
              <Button size="sm" variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={onAuthClick} className="bg-gradient-to-r from-purple-600 to-blue-600">
              Sign In
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b md:hidden">
            <nav className="container flex flex-col gap-4 py-4">
              <button
                onClick={() => {
                  onNavigate('home');
                  setMobileMenuOpen(false);
                }}
                className="text-left text-sm font-medium"
              >
                Home
              </button>
              {user && (
                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-sm font-medium"
                >
                  Dashboard
                </button>
              )}
              {user ? (
                <Button size="sm" variant="outline" onClick={logout} className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button size="sm" onClick={onAuthClick} className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
                  Sign In
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
