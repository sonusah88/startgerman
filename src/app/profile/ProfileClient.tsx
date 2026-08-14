'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Save, Loader2 } from 'lucide-react';
import { updateUserProfile } from '@/actions/profile';
import { signOut } from 'next-auth/react';

export default function ProfileClient({ profile }: { profile: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name || '',
    targetLevel: profile.targetLevel || 'A2.2',
    goal: profile.goal || '',
    dailyMinutes: profile.dailyMinutes || 15,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'dailyMinutes' ? parseInt(value) || 15 : value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const result = await updateUserProfile(formData);
      if (result.success) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      alert("An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-3xl p-6 md:p-8">
        <h3 className="text-xl font-bold mb-6">Learning Settings</h3>
        
        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Display Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              placeholder="Your Name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Target CEFR Level</label>
              <select 
                name="targetLevel"
                value={formData.targetLevel}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all appearance-none"
              >
                <option value="A1.1">A1.1 (Beginner)</option>
                <option value="A1.2">A1.2 (Elementary)</option>
                <option value="A2.1">A2.1 (Pre-Intermediate)</option>
                <option value="A2.2">A2.2 (Intermediate)</option>
                <option value="B1.1">B1.1 (Upper-Intermediate)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Daily Goal (Minutes)</label>
              <select 
                name="dailyMinutes"
                value={formData.dailyMinutes}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all appearance-none"
              >
                <option value="5">5 minutes / day</option>
                <option value="10">10 minutes / day</option>
                <option value="15">15 minutes / day</option>
                <option value="30">30 minutes / day</option>
                <option value="60">1 hour / day</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Why are you learning German?</label>
            <textarea 
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all resize-none h-24"
              placeholder="e.g. I want to move to Berlin..."
            />
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-end">
            <Button 
              type="submit" 
              disabled={isSaving}
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl px-8"
            >
              {isSaving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Save Changes</>
              )}
            </Button>
          </div>
        </form>
      </div>

      <div className="glass-card rounded-3xl p-6 md:p-8 border-red-500/20 bg-red-500/5">
        <h3 className="text-xl font-bold mb-2 text-red-500">Danger Zone</h3>
        <p className="text-muted-foreground text-sm mb-6">
          Ready to take a break? You can sign out of your account here. Your progress will be saved.
        </p>
        <Button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          variant="destructive" 
          className="w-full md:w-auto rounded-xl font-bold bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/50 transition-all"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
