import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Search, 
  MoreHorizontal, 
  ChevronLeft,
  Calendar,
  DollarSign,
  MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Member {
  id: string;
  full_name: string;
  email: string;
  whatsapp_num: string;
  plan_name: string;
  status: 'pending' | 'active' | 'expired';
  expiry_date: string | null;
  goal: string;
  created_at: string;
}

export const AdminDashboard = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    setLoading(true);
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching members:', error);
    else setMembers(data || []);
    setLoading(false);
  }

  const verifyMember = async (id: string) => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    const { error } = await supabase
      .from('members')
      .update({ 
        status: 'active', 
        expiry_date: expiry.toISOString() 
      })
      .eq('id', id);

    if (error) alert('Update failed');
    else fetchMembers();
  };

  const filteredMembers = members.filter(m => 
    m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.whatsapp_num.includes(searchTerm)
  );

  const stats = {
    total: members.length,
    active: members.filter(m => m.status === 'active').length,
    pending: members.filter(m => m.status === 'pending').length,
    revenue: members.filter(m => m.status === 'active').length * 2000 // Simplified
  };

  return (
    <div className="min-h-screen bg-benny-dark text-white p-4 md:p-8 font-display">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-benny-green mb-2">
              <ChevronLeft size={20} className="cursor-pointer" onClick={() => window.location.href = '/'} />
              <span className="text-xs font-bold uppercase tracking-widest">Back to Site</span>
            </div>
            <h1 className="text-4xl font-extrabold uppercase tracking-tighter">Gym Operations <span className="text-benny-green">Control</span></h1>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-benny-green transition-colors"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Members', value: stats.total, icon: Users, color: 'text-benny-green' },
            { label: 'Active Plans', value: stats.active, icon: CheckCircle, color: 'text-blue-400' },
            { label: 'Pending Verification', value: stats.pending, icon: Clock, color: 'text-orange-400' },
            { label: 'Estimated Revenue', value: `Rs. ${stats.revenue}`, icon: DollarSign, color: 'text-benny-green' },
          ].map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="glass p-6 rounded-3xl border-white/5"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Members Table */}
        <div className="glass rounded-[40px] border-white/5 overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-bold uppercase tracking-tight">Recent Applications</h2>
            <button onClick={fetchMembers} className="text-xs font-bold uppercase tracking-widest text-benny-green hover:opacity-70">Refresh Feed</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 uppercase text-[10px] tracking-widest font-bold text-gray-500">
                  <th className="px-8 py-6">Member</th>
                  <th className="px-8 py-6">Plan</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6">Expiry</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan={5} className="p-20 text-center text-gray-500">Loading data...</td></tr>
                ) : filteredMembers.length === 0 ? (
                  <tr><td colSpan={5} className="p-20 text-center text-gray-500">No members found.</td></tr>
                ) : filteredMembers.map((member) => (
                  <tr key={member.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-benny-green/20 flex items-center justify-center font-bold text-benny-green">
                          {member.full_name[0]}
                        </div>
                        <div>
                          <p className="font-bold">{member.full_name}</p>
                          <p className="text-xs text-gray-500">{member.whatsapp_num}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm">
                      <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
                        {member.plan_name}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded ${
                        member.status === 'active' ? 'bg-benny-green/20 text-benny-green' : 
                        member.status === 'pending' ? 'bg-orange-400/20 text-orange-400' : 
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium">
                      {member.expiry_date ? (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar size={14} />
                          {new Date(member.expiry_date).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                         {member.status === 'pending' && (
                           <button 
                            onClick={() => verifyMember(member.id)}
                            className="bg-benny-green text-benny-dark px-4 py-2 rounded-xl text-xs font-bold uppercase hover:scale-105 transition-transform"
                           >
                             Verify
                           </button>
                         )}
                         <a 
                          href={`https://wa.me/${member.whatsapp_num}`}
                          target="_blank"
                          className="p-2 glass border-white/10 rounded-xl text-gray-400 hover:text-benny-green transition-colors"
                         >
                           <MessageCircle size={18} />
                         </a>
                         <button className="p-2 glass border-white/10 rounded-xl text-gray-400">
                           <MoreHorizontal size={18} />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
