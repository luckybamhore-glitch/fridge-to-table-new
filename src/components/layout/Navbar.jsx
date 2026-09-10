import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Sparkles, Camera, Menu, X, User, LogOut, ChevronDown, Heart } from 'lucide-react';
import { Button } from '../ui/Button';
import { usePantry } from '../../context/PantryContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { cn } from '../../lib/cn';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { ingredients, savedRecipeIds } = usePantry();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    addToast('Signed out successfully.', 'info');
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'The Cutting Board', path: '/cook' },
    { name: 'Snap Fridge', path: '/cook/photo' },
    { name: 'Saved Recipes', path: '/saved', count: savedRecipeIds.length },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        scrolled
          ? 'bg-[#FDFBF8]/90 backdrop-blur-md shadow-xs border-b border-[#E7DCD1]'
          : 'bg-transparent py-2'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#E2673F] text-white flex items-center justify-center shadow-md shadow-orange-900/10 transition-transform group-hover:scale-105">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-serif text-[#2B2622] tracking-tight">
              Fridge <span className="serif-italic text-[#E2673F] font-normal">to</span> Table
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'text-sm font-medium transition-colors relative py-1 flex items-center gap-1.5',
                    isActive
                      ? 'text-[#E2673F] font-semibold'
                      : 'text-[#6B6259] hover:text-[#2B2622]'
                  )}
                >
                  {link.name}
                  {typeof link.count === 'number' && link.count > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#E2673F] text-white">
                      {link.count}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E2673F] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 text-sm font-medium text-[#2B2622] px-3 py-2 rounded-full hover:bg-orange-100/50 transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-[#E2673F]/15 text-[#E2673F] flex items-center justify-center text-xs font-semibold uppercase">
                    {user?.name?.charAt(0) || <User className="w-3.5 h-3.5" />}
                  </span>
                  <span className="max-w-[120px] truncate">{user?.name?.split(' ')[0] || 'Account'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8E847A]" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#FDFBF8] hairline-border border-[#E7DCD1] shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#E7DCD1]">
                      <p className="text-sm font-medium text-[#2B2622] truncate">{user?.name}</p>
                      <p className="text-xs text-[#8E847A] truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/saved"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#2B2622] hover:bg-orange-50 transition-colors border-b border-[#E7DCD1]/60"
                    >
                      <Heart className="w-4 h-4 text-[#E2673F]" />
                      Saved Recipes ({savedRecipeIds.length})
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#2B2622] hover:bg-orange-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="text-sm font-medium text-[#6B6259] hover:text-[#2B2622] px-3 py-2 transition-colors"
              >
                Sign in
              </button>
            )}
            <Button
              variant="primary"
              size="md"
              icon={Sparkles}
              onClick={() => navigate('/cook')}
            >
              Get started {ingredients.length > 0 && `(${ingredients.length})`}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/cook')}
            >
              Cook
            </Button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-[#2B2622] hover:bg-orange-100/50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FDFBF8] border-b border-[#E7DCD1] px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'block py-2.5 px-4 text-base font-medium rounded-2xl',
                location.pathname === link.path
                  ? 'bg-orange-100/60 text-[#E2673F] font-semibold'
                  : 'text-[#2B2622] hover:bg-orange-50'
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Button
              variant="secondary"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/cook/photo');
              }}
              icon={Camera}
            >
              Snap Fridge Photo
            </Button>
            {isAuthenticated ? (
              <Button
                variant="ghost"
                className="w-full justify-center"
                icon={LogOut}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
              >
                Sign out ({user?.name?.split(' ')[0]})
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-center"
                icon={User}
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
              >
                Sign in
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
