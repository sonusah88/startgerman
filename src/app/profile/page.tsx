import { getUserProfile } from '@/actions/profile';
import { redirect } from 'next/navigation';
import { Home, Map, BookA, Bot, User, LogOut, Settings, Award, Flame, Zap } from 'lucide-react';
import Link from 'next/link';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect('/login');
  }

  const sidebarItems = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/roadmap', icon: Map, label: 'Learn' },
    { href: '/dictionary', icon: BookA, label: 'Dict' },
    { href: '/tutor', icon: Bot, label: 'Tutor' },
    { href: '/profile', icon: User, label: 'Profile', active: true },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="w-64 border-r hidden md:flex flex-col bg-card/30 backdrop-blur-sm sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-amber-500">
            <span className="bg-gradient-to-br from-amber-400 to-orange-600 text-transparent bg-clip-text">StartGerman</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.active 
                  ? 'bg-amber-500/10 text-amber-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-amber-500/20' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? 'text-amber-500' : ''}`} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto pb-24 md:pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <header className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Your Profile</h1>
              <p className="text-muted-foreground text-lg mt-2">Manage your learning journey and settings.</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: Stats & Info */}
            <div className="md:col-span-1 space-y-6">
              
              {/* User Avatar Card */}
              <div className="glass-card rounded-3xl p-6 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-600 p-1 shadow-lg shadow-orange-500/20 mb-4">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-4xl font-bold">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>
                <h2 className="text-xl font-bold text-foreground truncate">{profile.name}</h2>
                <p className="text-muted-foreground text-sm truncate mb-4">{profile.email}</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-xs text-muted-foreground border border-white/10">
                  <Settings className="w-3 h-3" />
                  Joined {new Date(profile.createdAt || Date.now()).toLocaleDateString()}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <Zap className="w-6 h-6 text-yellow-400 mb-2" />
                  <div className="text-2xl font-bold">{profile.xp}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Total XP</div>
                </div>
                <div className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <Flame className="w-6 h-6 text-orange-500 mb-2" />
                  <div className="text-2xl font-bold">{profile.currentStreak}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Day Streak</div>
                </div>
                <div className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <BookA className="w-6 h-6 text-blue-400 mb-2" />
                  <div className="text-2xl font-bold">{profile.wordsLearned}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Words</div>
                </div>
                <div className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <Award className="w-6 h-6 text-emerald-400 mb-2" />
                  <div className="text-2xl font-bold">{profile.grammarLearned}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Grammar</div>
                </div>
              </div>

            </div>

            {/* Right Column: Settings Form & Actions */}
            <div className="md:col-span-2 space-y-6">
              <ProfileClient profile={profile} />
            </div>

          </div>
        </div>
      </main>

      {/* Mobile Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 w-full border-t bg-background/80 backdrop-blur-xl pb-safe z-50">
        <div className="flex justify-around items-center p-4">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 ${item.active ? 'text-amber-500' : 'text-muted-foreground hover:text-foreground'}`}>
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
