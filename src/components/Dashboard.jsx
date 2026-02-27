import { useState, useEffect, useRef } from 'react';
import { Sprout, Leaf, MessageCircle, LogOut, ChevronDown, FlaskConical, TrendingUp } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Dashboard.css';
import LeafDiseasePrediction from './LeafDiseasePrediction';
import CropRecommendation from './CropRecommendation';
import Fertilizer from './Fertilizer'
import MarketAnalysis from './MarketAnalysis';

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
        if (!error && data) setProfile(data);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (currentPage === 'disease-prediction')
    return <LeafDiseasePrediction onBack={() => setCurrentPage('dashboard')} />;
  if (currentPage === 'fertilizer-recommendation')
    return <Fertilizer onBack={() => setCurrentPage('dashboard')} />;
  if (currentPage === 'crop-recommendation')
    return <CropRecommendation onBack={() => setCurrentPage('dashboard')} />;
  if (currentPage === 'market-analysis')
    return <MarketAnalysis onBack={() => setCurrentPage('dashboard')} />;
  const cards = [
    {
      key: 'crop-recommendation',
      colorClass: 'card-green',
      icon: <Sprout size={40} />,
      title: 'Crop Recommendation',
      description: 'Get AI-powered crop suggestions tailored to your soil type, climate, and season.',
    },
    {
      key: 'fertilizer-recommendation',
      colorClass: 'card-teal',
      icon: <FlaskConical size={40} />,
      title: 'Fertilizer Recommendation',
      description: 'Receive optimal fertilizer plans based on nutrient deficiencies and crop needs.',
    },
    {
      key: 'disease-prediction',
      colorClass: 'card-orange',
      icon: <Leaf size={40} />,
      title: 'Leaf Disease Detection',
      description: 'Upload leaf images to instantly identify diseases and get treatment advice.',
    },
    {
      key: 'market-analysis',
      colorClass: 'card-blue',
      icon: <TrendingUp size={40} />,
      title: 'Market Analysis',
      description: 'Track real-time crop prices and market trends to maximize your profit.',
    },
  ];

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
            <div className="logo-icon"><Sprout size={32} /></div>
            <h1 className="brand-name">SmartAgriAssist</h1>
          </div>

          <div className="profile-wrapper" ref={dropdownRef}>
            <button
              className="profile-trigger"
              onClick={() => setDropdownOpen(prev => !prev)}
              aria-expanded={dropdownOpen}
            >
              <div className="avatar">{getInitials(profile?.name)}</div>
              <span className="profile-name">{profile?.name ?? 'Loading...'}</span>
              <ChevronDown size={16} className={`chevron ${dropdownOpen ? 'chevron-open' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="avatar avatar-large">{getInitials(profile?.name)}</div>
                  <div>
                    <p className="dropdown-name">{profile?.name}</p>
                    {profile?.age && <p className="dropdown-meta">Age: {profile.age}</p>}
                    {profile?.address && <p className="dropdown-meta">{profile.address}</p>}
                  </div>
                </div>
                <hr className="dropdown-divider" />
                <button className="dropdown-item" onClick={handleLogout}>
                  <LogOut size={15} /> Sign out
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
          {cards.map((card, i) => (
            <div
              key={card.key}
              className={`action-card ${card.colorClass}`}
              style={{ animationDelay: `${i * 0.1 + 0.1}s` }}
              onClick={() => setCurrentPage(card.key)}
            >
              <div className="card-icon-wrapper">
                <div className="card-icon">{card.icon}</div>
              </div>
              <div className="card-content">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.description}</p>
              </div>
              <div className="card-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;