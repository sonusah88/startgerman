'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, Plus, Edit, Trash2, LayoutGrid, Type, BrainCircuit, CheckCircle2, Search, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';

const STATS = [
  { label: 'Active Modules', value: '26', icon: LayoutGrid, color: 'text-blue-400' },
  { label: 'Vocabulary Items', value: '1,240', icon: Type, color: 'text-amber-400' },
  { label: 'Pending Validation', value: '18', icon: BrainCircuit, color: 'text-rose-400' },
];

const VALIDATIONS = [
  { type: 'Vocabulary', content: 'der Bahnhof (Train station)', level: 'A1.1', status: 'Pending Review', statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { type: 'Grammar', content: 'Modal verb: möchten', level: 'A1.1', status: 'Approved', statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { type: 'Conversation', content: 'Ordering at a restaurant', level: 'A1.2', status: 'Pending Review', statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <header className="p-4 flex items-center justify-between border-b border-white/5 glass sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors mr-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg leading-tight block">Admin CMS</span>
            <span className="text-xs text-muted-foreground font-mono">v2.0.0-beta</span>
          </div>
        </div>
      </header>

      <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-2">Content Management</h1>
            <p className="text-muted-foreground">Manage curriculum, vocabulary, and validate AI-generated content.</p>
          </motion.div>
          <Button className="gap-2 bg-white text-black hover:bg-white/90 rounded-full px-6">
            <Plus className="w-4 h-4" /> Create Content
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {STATS.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-2xl flex flex-col relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/[0.02] rounded-full group-hover:scale-150 transition-transform duration-500" />
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl bg-white/[0.03] ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-medium text-muted-foreground">{stat.label}</h3>
              </div>
              <p className="text-4xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Recent Validations</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search content..." className="pl-9 bg-black/20 border-white/10 rounded-xl" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-black/20 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Content</th>
                  <th className="px-6 py-4 font-medium">Level</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {VALIDATIONS.map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium">{row.type}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.content}</td>
                    <td className="px-6 py-4"><span className="font-mono text-xs px-2 py-1 bg-white/5 rounded-md">{row.level}</span></td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${row.statusColor}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-foreground">
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-blue-400">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-500/10 text-muted-foreground hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
