import { useState, useEffect, useRef } from 'react';
import { Sprout, Leaf, MessageCircle, User, LogOut, ChevronDown } from 'lucide-react';
import { supabase } from '../supabaseClient'; 
import './Dashboard.css';
import LeafDiseasePrediction from './LeafDiseasePrediction';
import CropRecommendation from './CropRecommendation';

function Dashboard() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [profile, setProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('name, age, address')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setProfile(data);
        }
      }
    };

    fetchProfile();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/'; // redirect to login/home
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (currentPage === 'disease-prediction') {
    return <LeafDiseasePrediction onBack={() => setCurrentPage('dashboard')} />;
  }

  if (currentPage === 'crop-recommendation') {
    return <CropRecommendation onBack={() => setCurrentPage('dashboard')} />;
  }

  return (
    <div className="dashboard-container">
      <div className="background-decoration">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="dashboard-content">
        <header className="dashboard-header">
          <div className="logo-section">
            <div className="logo-icon">
              <Sprout size={32} />
            </div>
            <h1 className="brand-name">SmartAgriAssist</h1>
          </div>

          {/* ── Profile section ── */}
          <div className="profile-wrapper" ref={dropdownRef}>
            <button
              className="profile-trigger"
              onClick={() => setDropdownOpen(prev => !prev)}
              aria-expanded={dropdownOpen}
            >
              <div className="avatar">
                {getInitials(profile?.name)}
              </div>
              <span className="profile-name">{profile?.name ?? 'Loading...'}</span>
              <ChevronDown
                size={16}
                className={`chevron ${dropdownOpen ? 'chevron-open' : ''}`}
              />
            </button>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="avatar avatar-large">
                    {getInitials(profile?.name)}
                  </div>
                  <div>
                    <p className="dropdown-name">{profile?.name}</p>
                    {profile?.age && (
                      <p className="dropdown-meta">Age: {profile.age}</p>
                    )}
                    {profile?.address && (
                      <p className="dropdown-meta">{profile.address}</p>
                    )}
                  </div>
                </div>
                <hr className="dropdown-divider" />
                <button className="dropdown-item" onClick={handleLogout}>
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="welcome-section">
          <h2 className="welcome-title">
            Welcome back{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}!
          </h2>
          <p className="welcome-subtitle">
            Empowering farmers with AI-driven insights for smarter, sustainable agriculture
          </p>
        </section>

        <div className="action-cards">
          <div className="action-card card-green" onClick={() => setCurrentPage('crop-recommendation')}>
            <div className="card-icon-wrapper">
              <div className="card-icon"><Sprout size={40} /></div>
            </div>
            <div className="card-content">
              <h3 className="card-title">Crop & Fertilizer</h3>
              <p className="card-description">
                Get personalized crop and fertilizer recommendations based on soil conditions
              </p>
            </div>
            <div className="card-arrow">→</div>
          </div>

          <div className="action-card card-orange" onClick={() => setCurrentPage('disease-prediction')}>
            <div className="card-icon-wrapper">
              <div className="card-icon"><Leaf size={40} /></div>
            </div>
            <div className="card-content">
              <h3 className="card-title">Leaf Disease Detection</h3>
              <p className="card-description">
                Upload leaf images to identify diseases and get treatment suggestions
              </p>
            </div>
            <div className="card-arrow">→</div>
          </div>

          <div className="action-card card-blue" onClick={() => setCurrentPage('ai-chatbot')}>
            <div className="card-icon-wrapper">
              <div className="card-icon"><MessageCircle size={40} /></div>
            </div>
            <div className="card-content">
              <h3 className="card-title">AI Assistant</h3>
              <p className="card-description">
                Chat with our AI assistant for instant farming advice and solutions
              </p>
            </div>
            <div className="card-arrow">→</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;