'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Project, UserInvestment, Transaction } from '@/types';
import { Payment } from '@/components/Payment';

// Background Carousel Component - INLINE
const BackgroundCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      type: 'feature',
      title: 'Earn Monthly Dividends',
      description: 'Get consistent returns from verified development projects across Uganda',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800',
    },
    {
      type: 'testimonial',
      title: '"Best investment platform in Uganda"',
      description: "I've earned over UGX 500,000 in dividends in just 3 months. The platform is transparent and reliable.",
      author: 'Sarah M., Kampala',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
    },
    {
      type: 'project',
      title: 'Nakawa Apartments - Fully Funded',
      description: 'Investors earned 7% monthly ROI. Project completed 2 months ahead of schedule.',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    },
    {
      type: 'feature',
      title: 'Start With Just UGX 20,000',
      description: 'Fractional investing makes real estate accessible to everyone',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800',
    },
    {
      type: 'testimonial',
      title: '"My passive income solution"',
      description: 'As a teacher, I needed extra income. Collective Advantage helped me invest without leaving my job.',
      author: 'David K., Entebbe',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    },
    {
      type: 'project',
      title: 'Mukono Commercial Plaza',
      description: 'Currently 85% funded. Early investors already receiving returns.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="max-w-2xl text-center space-y-4">
              {slide.type === 'feature' && (
                <div className="inline-block px-4 py-2 bg-yellow-600/20 border border-yellow-600/50 rounded-full text-yellow-400 text-sm font-semibold mb-4">
                  WHY CHOOSE US
                </div>
              )}
              {slide.type === 'testimonial' && (
                <div className="inline-block px-4 py-2 bg-green-600/20 border border-green-600/50 rounded-full text-green-400 text-sm font-semibold mb-4">
                  SUCCESS STORY
                </div>
              )}
              {slide.type === 'project' && (
                <div className="inline-block px-4 py-2 bg-blue-600/20 border border-blue-600/50 rounded-full text-blue-400 text-sm font-semibold mb-4">
                  FEATURED PROJECT
                </div>
              )}

              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight animate-fade-in">
                {slide.title}
              </h2>
              <p className="text-xl text-gray-300 animate-fade-in">
                {slide.description}
              </p>
              {slide.author && (
                <p className="text-yellow-400 font-semibold animate-fade-in">
                  — {slide.author}
                </p>
              )}
            </div>
          </div>

          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-600/10 rounded-full blur-3xl" />
        </div>
      ))}

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-yellow-400 w-8'
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default function SinglePageApp() {
  const { user, userData, signIn, signUp, signInWithGoogle, signOut, refreshUserData } = useAuth();
  
  const [view, setView] = useState<'home' | 'auth' | 'activation' | 'dashboard' | 'projects' | 'admin'>('home');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [investments, setInvestments] = useState<UserInvestment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [referralStats, setReferralStats] = useState({ referral_count: 0, total_bonus: 0 });
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [slots, setSlots] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [authForm, setAuthForm] = useState({ email: '', password: '', confirmPassword: '', phone: '' });
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', location: '', target_amount: '', slots_available: '',
    slot_price: '', roi_percentage: '', image_url: ''
  });

  // REFERRAL STATE - NEW
  const [referralUid, setReferralUid] = useState<string | null>(null);

  // CAPTURE REFERRAL PARAMETER ON MOUNT - NEW
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralUid(ref);
      setAuthMode('signup');
      setView('auth');
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const [invRes, txRes, refRes] = await Promise.all([
        fetch('/api/investments', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/transactions?limit=10', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/referrals', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [invData, txData, refData] = await Promise.all([invRes.json(), txRes.json(), refRes.json()]);
      setInvestments(invData.investments || []);
      setTransactions(txData.transactions || []);
      setReferralStats({ referral_count: refData.referral_count || 0, total_bonus: refData.total_bonus || 0 });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  }, [user]);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects?status=open&limit=100');
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  }, []);

  // IMPROVED ACTIVATION BLOCKING LOGIC - FIXED
  useEffect(() => {
    if (!user && view !== 'home' && view !== 'auth') {
      setView('home');
    } else if (user && userData) {
      // Admins can access everything
      if (userData.is_admin) {
        return;
      }
      
      // FORCE inactive users to activation page - BLOCK ALL OTHER VIEWS
      if (!userData.is_active) {
        if (view !== 'activation' && view !== 'home' && view !== 'auth') {
          setView('activation');
          setError('⚠️ Please complete your account activation to access this feature');
          setTimeout(() => setError(''), 4000);
        }
      }
      
      // Redirect active users away from activation page
      if (userData.is_active && view === 'activation') {
        setView('dashboard');
      }
    }
  }, [user, userData, view]);

  useEffect(() => {
    if (view === 'dashboard' && user && (userData?.is_active || userData?.is_admin)) {
      fetchDashboardData();
    } else if (view === 'projects') {
      fetchProjects();
    } else if (view === 'admin' && userData?.is_admin) {
      fetchProjects();
    }
  }, [view, user, userData, fetchDashboardData, fetchProjects]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        await signIn(authForm.email, authForm.password);
        setView('dashboard');
      } else {
        if (authForm.password !== authForm.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        // USE REFERRAL UID - FIXED
        await signUp(authForm.email, authForm.password, authForm.phone || null, referralUid);
        setTimeout(() => setView('activation'), 500);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      // USE REFERRAL UID - FIXED
      await signInWithGoogle(referralUid);
      setTimeout(() => setView('activation'), 500);
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = (project: Project) => {
    if (!user) {
      setView('auth');
      return;
    }
    if (!userData?.is_active && !userData?.is_admin) {
      setView('activation');
      setError('⚠️ Please activate your account first to invest');
      setTimeout(() => setError(''), 4000);
      return;
    }
    setSelectedProject(project);
    setSlots(1);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = await user!.getIdToken();
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          title: projectForm.title,
          description: projectForm.description,
          location: projectForm.location,
          target_amount: parseInt(projectForm.target_amount),
          slots_available: parseInt(projectForm.slots_available),
          slot_price: parseInt(projectForm.slot_price),
          roi_percentage: parseFloat(projectForm.roi_percentage),
          image_url: projectForm.image_url || null,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('✅ Project created successfully!');
        setProjectForm({ title: '', description: '', location: '', target_amount: '', slots_available: '', slot_price: '', roi_percentage: '', image_url: '' });
        fetchProjects();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to create project');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
      console.error('Error creating project:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=${user?.uid}`;
    navigator.clipboard.writeText(link);
    setSuccess('✅ Referral link copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const totalInvested = investments.reduce((sum, inv) => sum + (inv.total_invested || 0), 0);
  const monthlyDividend = investments.reduce((sum, inv: any) => sum + ((inv.project?.roi_percentage || 0) / 100) * (inv.total_invested || 0), 0);

  // ACTIVATION VIEW - FULL SCREEN WITH CAROUSEL
  if (view === 'activation' && userData) {
    return (
      <div className="fixed inset-0 z-40">
        <BackgroundCarousel />
        <div className="relative z-50 min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-black/90 backdrop-blur-xl border border-yellow-600/30 rounded-lg p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="inline-block p-3 bg-yellow-600/20 rounded-full mb-4">
                  <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-yellow-400 mb-2">Activate Your Account</h1>
                <p className="text-gray-300">One-time activation fee of UGX 20,000</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-600/10 to-yellow-600/5 border border-yellow-600/30 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  What You Get:
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">✓</span>
                    <span>Full access to all investment projects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">✓</span>
                    <span>Start earning monthly dividends immediately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">✓</span>
                    <span>Personal referral link to earn 10% bonuses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">✓</span>
                    <span>Portfolio tracking dashboard</span>
                  </li>
                </ul>
              </div>

              {userData.referrer_uid && (
                <div className="bg-green-600/10 border border-green-600/30 p-4 rounded-lg mb-6">
                  <p className="text-sm text-green-400 flex items-center gap-2">
                    <span className="text-xl">🎉</span>
                    Your referrer will receive UGX 2,000 bonus when you activate!
                  </p>
                </div>
              )}

              <div className="border-t border-yellow-600/30 pt-4 mb-6">
                <div className="flex justify-between items-center text-lg font-bold mb-2">
                  <span className="text-gray-300">Total Amount:</span>
                  <span className="text-yellow-400 text-2xl">UGX 20,000</span>
                </div>
                <p className="text-xs text-gray-500 text-center">Secure payment powered by Flutterwave</p>
              </div>

              {success && (
                <div className="mb-4 p-3 bg-green-600/20 border border-green-600 rounded-lg text-sm text-green-400 text-center">
                  {success}
                </div>
              )}

              <Payment
                amount={20000}
                email={userData.email}
                name={userData.email.split('@')[0]}
                metadata={{ 
                  user_uid: user!.uid, 
                  payment_type: 'reg_fee', 
                  referrer_uid: userData.referrer_uid || undefined 
                }}
                onSuccess={async () => { 
                  setSuccess('✅ Payment successful! Activating your account...');
                  await new Promise(r => setTimeout(r, 3000)); 
                  await refreshUserData(); 
                  setView('dashboard'); 
                }}
                onClose={() => {}}
                buttonText="Pay Activation Fee"
              />

              <div className="mt-6 text-center">
                <button 
                  onClick={() => setView('home')}
                  className="text-gray-400 text-sm hover:text-yellow-400 transition"
                >
                  ← Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-black via-gray-900 to-black border-b border-yellow-600/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => setView('home')} className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Collective Advantage
          </button>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button onClick={() => {
                  if (!userData?.is_active && !userData?.is_admin) {
                    setError('⚠️ Please activate your account first');
                    setTimeout(() => setError(''), 3000);
                    setView('activation');
                  } else {
                    setView('dashboard');
                  }
                }} className="text-white hover:text-yellow-400 transition">Dashboard</button>
                <button onClick={() => {
                  if (!userData?.is_active && !userData?.is_admin) {
                    setError('⚠️ Please activate your account first');
                    setTimeout(() => setError(''), 3000);
                    setView('activation');
                  } else {
                    setView('projects');
                  }
                }} className="text-white hover:text-yellow-400 transition">Projects</button>
                {userData?.is_admin && <button onClick={() => setView('admin')} className="text-white hover:text-yellow-400 transition">Admin</button>}
                <button onClick={() => { signOut(); setView('home'); }} className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg font-bold hover:from-yellow-600 hover:to-yellow-700 transition">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => setView('projects')} className="text-white hover:text-yellow-400 transition">Projects</button>
                <button onClick={() => { setAuthMode('login'); setView('auth'); }} className="text-white hover:text-yellow-400 transition">Login</button>
                <button onClick={() => { setAuthMode('signup'); setView('auth'); }} className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg font-bold hover:from-yellow-600 hover:to-yellow-700 transition">Sign Up</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Success/Error Messages */}
      {success && (
        <div className="fixed top-20 right-4 z-50 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold animate-pulse">
          {success}
        </div>
      )}
      {error && (
        <div className="fixed top-20 right-4 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* HOME VIEW */}
        {view === 'home' && (
          <div className="max-w-4xl mx-auto text-center py-16">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-6">
              Build Wealth Collectively
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Pool funds to finance development projects, earn monthly dividends, and grow your investment together.
            </p>
            <div className="flex gap-4 justify-center mb-16">
              <button onClick={() => { setAuthMode('signup'); setView('auth'); }} className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg font-bold text-lg hover:from-yellow-600 hover:to-yellow-700 transition transform hover:scale-105">Get Started</button>
              <button onClick={() => setView('projects')} className="px-8 py-4 bg-white/10 border border-yellow-600/50 text-white rounded-lg font-bold text-lg hover:bg-white/20 transition">View Projects</button>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-gradient-to-br from-gray-900 to-black border border-yellow-600/30 rounded-lg">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">Fractional Investment</h3>
                <p className="text-gray-400">Start with as little as UGX 20,000</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-gray-900 to-black border border-yellow-600/30 rounded-lg">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">Monthly Returns</h3>
                <p className="text-gray-400">Earn consistent dividends</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-gray-900 to-black border border-yellow-600/30 rounded-lg">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">Referral Rewards</h3>
                <p className="text-gray-400">Earn 10% bonus on referrals</p>
              </div>
            </div>
          </div>
        )}

        {/* AUTH VIEW */}
        {view === 'auth' && (
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-600/30 rounded-lg p-6">
              <h1 className="text-3xl font-bold text-yellow-400 mb-6">
                {authMode === 'login' ? 'Login' : 'Create Account'}
              </h1>
              
              {/* REFERRAL INDICATOR - NEW */}
              {referralUid && authMode === 'signup' && (
                <div className="mb-4 p-3 bg-green-600/20 border border-green-600 rounded-lg">
                  <p className="text-sm text-green-400 flex items-center gap-2">
                    <span className="text-xl">🎉</span>
                    You were referred! You&apos;ll both earn bonuses when you activate.
                  </p>
                </div>
              )}
              
              {error && <div className="mb-4 p-3 bg-red-600/20 border border-red-600 rounded-lg text-sm text-red-400">{error}</div>}
              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <input type="email" required value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                    className="w-full px-4 py-2 bg-black border border-yellow-600/30 rounded-lg text-white focus:border-yellow-600 focus:outline-none" />
                </div>
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone (Optional)</label>
                    <input type="tel" value={authForm.phone} onChange={(e) => setAuthForm({...authForm, phone: e.target.value})}
                      className="w-full px-4 py-2 bg-black border border-yellow-600/30 rounded-lg text-white focus:border-yellow-600 focus:outline-none" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                  <input type="password" required value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                    className="w-full px-4 py-2 bg-black border border-yellow-600/30 rounded-lg text-white focus:border-yellow-600 focus:outline-none" />
                </div>
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
                    <input type="password" required value={authForm.confirmPassword} onChange={(e) => setAuthForm({...authForm, confirmPassword: e.target.value})}
                      className="w-full px-4 py-2 bg-black border border-yellow-600/30 rounded-lg text-white focus:border-yellow-600 focus:outline-none" />
                  </div>
                )}
                <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg font-bold hover:from-yellow-600 hover:to-yellow-700 transition disabled:opacity-50">
                  {loading ? 'Loading...' : authMode === 'login' ? 'Login' : 'Sign Up'}
                </button>
              </form>
              <div className="mt-6">
                <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-yellow-600/30" /></div>
                  <div className="relative flex justify-center text-sm"><span className="px-2 bg-gray-900 text-gray-500">Or</span></div>
                </div>
                <button onClick={handleGoogleAuth} className="mt-4 w-full px-4 py-2 border border-yellow-600/30 rounded-lg text-white hover:bg-white/10 transition">Google</button>
              </div>
              <p className="mt-4 text-center text-sm text-gray-400">
                {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-yellow-400 hover:underline">
                  {authMode === 'login' ? 'Sign up' : 'Login'}
                </button>
              </p>
            </div>
          </div>
        )}

        {/* DASHBOARD VIEW */}
        {view === 'dashboard' && (userData?.is_active || userData?.is_admin) && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <h1 className="text-3xl font-bold text-yellow-400">
                Welcome, {userData.email.split('@')[0]}!
              </h1>
              {userData.is_admin && <span className="px-3 py-1 bg-yellow-600 text-black text-sm rounded-full font-bold">ADMIN</span>}
            </div>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-600/30 rounded-lg p-6">
                <p className="text-sm text-gray-400 mb-1">Wallet Balance</p>
                <p className="text-2xl font-bold text-yellow-400">UGX {userData.wallet_balance.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-600/30 rounded-lg p-6">
                <p className="text-sm text-gray-400 mb-1">Total Invested</p>
                <p className="text-2xl font-bold text-white">UGX {totalInvested.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-600/30 rounded-lg p-6">
                <p className="text-sm text-gray-400 mb-1">Monthly Dividends</p>
                <p className="text-2xl font-bold text-green-400">UGX {monthlyDividend.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-600/30 rounded-lg p-6">
                <p className="text-sm text-gray-400 mb-1">Active Projects</p>
                <p className="text-2xl font-bold text-white">{investments.filter(i => i.status === 'active').length}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-600/30 rounded-lg p-6">
                <h2 className="text-xl font-bold text-yellow-400 mb-4">Referral Program</h2>
                <div className="space-y-4">
                  <div className="flex justify-between"><span className="text-gray-400">Referrals</span>
                    <span className="font-bold text-white">{referralStats.referral_count}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Total Earned</span>
                    <span className="font-bold text-green-400">UGX {referralStats.total_bonus.toLocaleString()}</span></div>
                  <button onClick={copyReferralLink} className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg font-bold hover:from-yellow-600 hover:to-yellow-700 transition">Copy Referral Link</button>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-600/30 rounded-lg p-6">
                <h2 className="text-xl font-bold text-yellow-400 mb-4">My Investments</h2>
                {investments.length === 0 ? <p className="text-gray-400 text-center py-8">No investments yet</p> :
                  <div className="space-y-3">{investments.slice(0, 5).map((inv: any) => (
                    <div key={inv.id} className="p-3 border border-yellow-600/30 rounded-lg">
                      <p className="font-semibold text-white">{inv.project?.title || 'Unknown'}</p>
                      <p className="text-sm text-gray-400">{inv.slots_owned} slots • UGX {inv.total_invested.toLocaleString()}</p>
                    </div>
                  ))}</div>
                }
              </div>
            </div>
          </div>
        )}

        {/* PROJECTS VIEW */}
        {view === 'projects' && (
          <div>
            <h1 className="text-3xl font-bold text-yellow-400 mb-8">Investment Projects</h1>
            {projects.length === 0 ? <p className="text-center text-gray-400 py-16">No projects available</p> :
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => {
                  const progress = (project.amount_raised / project.target_amount) * 100;
                  return (
                    <div key={project.id} className="bg-gradient-to-br from-gray-900 to-black border border-yellow-600/30 rounded-lg overflow-hidden hover:border-yellow-600 transition group">
                      {project.image_url && (
                        <div className="h-48 overflow-hidden">
                          <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-yellow-400 mb-2">{project.title}</h3>
                        <p className="text-sm text-gray-400 mb-4">📍 {project.location}</p>
                        <p className="text-gray-300 line-clamp-3 mb-4">{project.description}</p>
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-yellow-400 font-bold">{progress.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2">
                            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span className="text-gray-500">Raised: UGX {(project.amount_raised / 1000000).toFixed(1)}M</span>
                            <span className="text-gray-500">Target: UGX {(project.target_amount / 1000000).toFixed(1)}M</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div><p className="text-gray-400">Slot Price</p>
                            <p className="font-bold text-white">UGX {project.slot_price.toLocaleString()}</p></div>
                          <div><p className="text-gray-400">Monthly ROI</p>
                            <p className="font-bold text-green-400">{project.roi_percentage}%</p></div>
                        </div>
                        <button onClick={() => handleInvest(project)} disabled={project.status !== 'open' || project.slots_available === 0}
                          className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg font-bold hover:from-yellow-600 hover:to-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                          {project.status !== 'open' ? 'Closed' : project.slots_available === 0 ? 'Sold Out' : 'Invest Now'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            }
          </div>
        )}

        {/* ADMIN VIEW */}
        {view === 'admin' && userData?.is_admin && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <h1 className="text-3xl font-bold text-yellow-400">Admin Panel</h1>
              <span className="px-3 py-1 bg-yellow-600 text-black rounded-full text-sm font-bold">ADMIN ACCESS</span>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-600/30 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-yellow-400 mb-4">Create Project</h2>
              {error && <div className="mb-4 p-3 bg-red-600/20 border border-red-600 rounded-lg text-sm text-red-400">{error}</div>}
              {success && <div className="mb-4 p-3 bg-green-600/20 border border-green-600 rounded-lg text-sm text-green-400">{success}</div>}
              <form onSubmit={handleCreateProject} className="grid md:grid-cols-2 gap-4">
                <input type="text" placeholder="Title" required value={projectForm.title} onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                  className="px-4 py-2 bg-black border border-yellow-600/30 rounded-lg text-white focus:border-yellow-600 focus:outline-none" />
                <input type="text" placeholder="Location" required value={projectForm.location} onChange={(e) => setProjectForm({...projectForm, location: e.target.value})}
                  className="px-4 py-2 bg-black border border-yellow-600/30 rounded-lg text-white focus:border-yellow-600 focus:outline-none" />
                <input type="number" placeholder="Target Amount (UGX)" required value={projectForm.target_amount} onChange={(e) => setProjectForm({...projectForm, target_amount: e.target.value})}
                  className="px-4 py-2 bg-black border border-yellow-600/30 rounded-lg text-white focus:border-yellow-600 focus:outline-none" />
                <input type="number" placeholder="Slots Available" required value={projectForm.slots_available} onChange={(e) => setProjectForm({...projectForm, slots_available: e.target.value})}
                  className="px-4 py-2 bg-black border border-yellow-600/30 rounded-lg text-white focus:border-yellow-600 focus:outline-none" />
                <input type="number" placeholder="Slot Price (UGX)" required value={projectForm.slot_price} onChange={(e) => setProjectForm({...projectForm, slot_price: e.target.value})}
                  className="px-4 py-2 bg-black border border-yellow-600/30 rounded-lg text-white focus:border-yellow-600 focus:outline-none" />
                <input type="number" step="0.1" placeholder="ROI %" required value={projectForm.roi_percentage} onChange={(e) => setProjectForm({...projectForm, roi_percentage: e.target.value})}
                  className="px-4 py-2 bg-black border border-yellow-600/30 rounded-lg text-white focus:border-yellow-600 focus:outline-none" />
                <input type="url" placeholder="Image URL (https://...)" value={projectForm.image_url} onChange={(e) => setProjectForm({...projectForm, image_url: e.target.value})}
                  className="md:col-span-2 px-4 py-2 bg-black border border-yellow-600/30 rounded-lg text-white focus:border-yellow-600 focus:outline-none" />
                <textarea placeholder="Description" required value={projectForm.description} onChange={(e) => setProjectForm({...projectForm, description: e.target.value})} rows={3}
                  className="md:col-span-2 px-4 py-2 bg-black border border-yellow-600/30 rounded-lg text-white focus:border-yellow-600 focus:outline-none" />
                <button type="submit" disabled={loading} className="md:col-span-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg font-bold hover:from-yellow-600 hover:to-yellow-700 transition disabled:opacity-50">
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
              </form>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-600/30 rounded-lg p-6">
              <h2 className="text-xl font-bold text-yellow-400 mb-4">All Projects ({projects.length})</h2>
              <div className="space-y-2">
                {projects.map(p => (
                  <div key={p.id} className="flex justify-between items-center p-3 border border-yellow-600/30 rounded-lg hover:bg-white/5 transition">
                    <div>
                      <p className="font-semibold text-white">{p.title}</p>
                      <p className="text-sm text-gray-400">{p.location} • {p.slots_available} slots • UGX {(p.slot_price / 1000).toFixed(0)}K/slot</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.status === 'open' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}`}>{p.status.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Investment Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setSelectedProject(null)} />
          <div className="relative bg-gradient-to-br from-gray-900 to-black border border-yellow-600/30 rounded-lg shadow-xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">{selectedProject.title}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Number of Slots</label>
                <input type="number" min="1" max={selectedProject.slots_available} value={slots} onChange={(e) => setSlots(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 bg-black border border-yellow-600/30 rounded-lg text-white focus:border-yellow-600 focus:outline-none" />
              </div>
              <div className="border-t border-yellow-600/30 pt-4">
                <div className="flex justify-between text-lg font-bold text-white mb-2">
                  <span>Total:</span><span className="text-yellow-400">UGX {(selectedProject.slot_price * slots).toLocaleString()}</span>
                </div>
              </div>
              {user && userData && (
                <Payment
                  amount={selectedProject.slot_price * slots}
                  email={userData.email}
                  name={userData.email.split('@')[0]}
                  metadata={{ user_uid: user.uid, payment_type: 'investment', project_id: selectedProject.id, slots }}
                  onSuccess={() => { 
                    setSuccess('✅ Investment successful!');
                    setSelectedProject(null); 
                    fetchProjects(); 
                    fetchDashboardData(); 
                  }}
                  onClose={() => setSelectedProject(null)}
                  buttonText={`Invest UGX ${(selectedProject.slot_price * slots).toLocaleString()}`}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}