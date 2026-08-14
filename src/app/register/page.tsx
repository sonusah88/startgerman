'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) { router.push('/login'); }
      else { const data = await res.json(); setError(data.message || 'Something went wrong'); }
    } catch (err) { setError('An error occurred'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Branding Panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600/20 via-background to-background items-center justify-center p-12">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center font-bold text-black text-4xl mx-auto mb-8 shadow-2xl shadow-amber-500/30">D</div>
          <h2 className="text-4xl font-bold mb-4">Starten Sie Ihre Reise!</h2>
          <p className="text-muted-foreground text-lg max-w-md">Join thousands of learners mastering German with AI-powered lessons.</p>
          <div className="flex items-center justify-center gap-2 mt-8 text-amber-400 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Free forever · No credit card required
          </div>
        </motion.div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-6 left-6">
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground" asChild>
            <Link href="/"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <Link href="/" className="lg:hidden flex items-center gap-3 mb-10 hover:opacity-80 transition-opacity">
            <img src="/logo.jpg" alt="StartGerman Logo" className="h-12 w-12 rounded-full shadow-lg shadow-amber-500/20 object-cover" />
            <span className="font-bold text-xl">StartGerman</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground mb-8">Start learning German today</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground" htmlFor="name">Full Name</label>
              <Input id="name" placeholder="E.g. Johannes Schmidt" value={name} onChange={(e) => setName(e.target.value)} required 
                className="h-12 rounded-xl bg-secondary/50 border-white/10 focus:border-amber-500/50 focus:ring-amber-500/20 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground" htmlFor="email">Email</label>
              <Input id="email" type="email" placeholder="johannes@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required 
                className="h-12 rounded-xl bg-secondary/50 border-white/10 focus:border-amber-500/50 focus:ring-amber-500/20 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground" htmlFor="password">Password</label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="h-12 rounded-xl bg-secondary/50 border-white/10 focus:border-amber-500/50 focus:ring-amber-500/20 transition-all" />
            </div>
            {error && <p className="text-sm text-destructive font-medium bg-destructive/10 px-4 py-2 rounded-lg">{error}</p>}
            <Button type="submit" className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold hover:shadow-lg hover:shadow-amber-500/25 transition-all hover:scale-[1.02] border-0" disabled={isLoading}>
              {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account...</> : 'Sign Up'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">Log in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
