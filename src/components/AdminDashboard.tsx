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
  MessageCircle,
  Plus,
  X,
  Edit2,
  Trash2,
  RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

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
  amount_paid: number | null;
}

export const AdminDashboard = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1);
    
    return {
      full_name: '',
      email: '',
      whatsapp_num: '',
      plan_name: 'Simple Plan',
      amount_paid: '',
      expiry_date: expiry.toISOString().split('T')[0],
      created_at: today,
      status: 'active' as 'pending' | 'active' | 'expired'
    };
  });
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
        return;
      }
      
      // Strict check: Only your email can access this
      if (session.user.email !== 'ghasifofficial23@gmail.com') {
        await supabase.auth.signOut();
        navigate('/admin/login', { state: { error: 'Unauthorized: Access restricted to owner only.' } });
      }
    };
    checkAuth();
    fetchMembers();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

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

  const handleManualEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('members')
      .insert([{
        full_name: formData.full_name,
        email: formData.email,
        whatsapp_num: formData.whatsapp_num,
        plan_name: formData.plan_name,
        amount_paid: parseFloat(formData.amount_paid) || 0,
        status: formData.status,
        expiry_date: formData.expiry_date ? new Date(formData.expiry_date).toISOString() : null,
        created_at: formData.created_at ? new Date(formData.created_at).toISOString() : new Date().toISOString(),
        goal: 'Manual Entry'
      }]);

    if (error) {
      alert('Failed to add member');
      console.error(error);
    } else {
      setIsModalOpen(false);
      resetForm();
      fetchMembers();
    }
    setLoading(false);
  };

  const resetForm = () => {
    const today = new Date().toISOString().split('T')[0];
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1);

    setFormData({
      full_name: '',
      email: '',
      whatsapp_num: '',
      plan_name: 'Simple Plan',
      amount_paid: '',
      expiry_date: expiry.toISOString().split('T')[0],
      created_at: today,
      status: 'active'
    });
    setEditingMemberId(null);
  };

  const handleEditClick = (member: Member) => {
    setFormData({
      full_name: member.full_name,
      email: member.email || '',
      whatsapp_num: member.whatsapp_num,
      plan_name: member.plan_name,
      amount_paid: member.amount_paid?.toString() || '',
      expiry_date: member.expiry_date ? member.expiry_date.split('T')[0] : '',
      created_at: member.created_at.split('T')[0],
      status: member.status
    });
    setEditingMemberId(member.id);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMemberId) return;
    setLoading(true);

    const { error } = await supabase
      .from('members')
      .update({
        full_name: formData.full_name,
        email: formData.email,
        whatsapp_num: formData.whatsapp_num,
        plan_name: formData.plan_name,
        amount_paid: parseFloat(formData.amount_paid) || 0,
        status: formData.status,
        expiry_date: formData.expiry_date ? new Date(formData.expiry_date).toISOString() : null,
        created_at: new Date(formData.created_at).toISOString(),
      })
      .eq('id', editingMemberId);

    if (error) {
      alert('Failed to update member');
    } else {
      setIsModalOpen(false);
      resetForm();
      fetchMembers();
    }
    setLoading(false);
  };

  const deleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);

    if (error) alert('Delete failed');
    else fetchMembers();
    setActiveMenuId(null);
  };

  const renewMember = async (id: string, planName: string) => {
    const amount = prompt("Enter renewal amount (Rs.):", planName.includes('Cardio') ? "4000" : "2000");
    if (amount === null) return;

    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1);

    const { error } = await supabase
      .from('members')
      .update({ 
        status: 'active', 
        expiry_date: expiry.toISOString(),
        amount_paid: parseFloat(amount) || 0
      })
      .eq('id', id);

    if (error) alert('Renewal failed');
    else fetchMembers();
  };

  const verifyMember = async (id: string, planName: string) => {
    const amount = prompt("Enter amount paid (Rs.):", planName.includes('Cardio') ? "4000" : "2000");
    if (amount === null) return;

    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1);

    const { error } = await supabase
      .from('members')
      .update({ 
        status: 'active', 
        expiry_date: expiry.toISOString(),
        amount_paid: parseFloat(amount) || 0
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
    revenue: members.reduce((acc, m) => acc + (Number(m.amount_paid) || 0), 0)
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
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search members..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-benny-green transition-colors"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-primary py-4 px-6 flex items-center justify-center gap-2 text-xs"
            >
              <Plus size={18} /> Manual Entry
            </button>
            <button 
              onClick={handleLogout}
              className="p-4 glass border-white/10 rounded-2xl text-red-400 hover:bg-red-500/10 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Members', value: stats.total, icon: Users, color: 'text-benny-green' },
            { label: 'Active Plans', value: stats.active, icon: CheckCircle, color: 'text-blue-400' },
            { label: 'Pending Verification', value: stats.pending, icon: Clock, color: 'text-orange-400' },
            { label: 'Total Revenue', value: `Rs. ${stats.revenue}`, icon: DollarSign, color: 'text-benny-green' },
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
            <h2 className="text-xl font-bold uppercase tracking-tight">Member Directory</h2>
            <button onClick={fetchMembers} className="text-xs font-bold uppercase tracking-widest text-benny-green hover:opacity-70">Refresh Feed</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 uppercase text-[10px] tracking-widest font-bold text-gray-500">
                  <th className="px-8 py-6">Member</th>
                  <th className="px-8 py-6">Entry Date</th>
                  <th className="px-8 py-6">Plan</th>
                  <th className="px-8 py-6">Paid</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6">Expiry</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan={7} className="p-20 text-center text-gray-500">Loading data...</td></tr>
                ) : filteredMembers.length === 0 ? (
                  <tr><td colSpan={7} className="p-20 text-center text-gray-500">No members found.</td></tr>
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
                    <td className="px-8 py-6 text-sm text-gray-400 font-medium">
                      {new Date(member.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-6 text-sm">
                      <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
                        {member.plan_name}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-benny-green">
                      Rs. {member.amount_paid || 0}
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
                      <div className="flex justify-end gap-2 relative">
                         {member.status === 'pending' && (
                           <button 
                            onClick={() => verifyMember(member.id, member.plan_name)}
                            className="bg-benny-green text-benny-dark px-4 py-2 rounded-xl text-xs font-bold uppercase hover:scale-105 transition-transform"
                           >
                             Manual Verify
                           </button>
                         )}
                         
                         {(member.status === 'expired' || (member.expiry_date && new Date(member.expiry_date) < new Date())) && (
                           <button 
                            onClick={() => renewMember(member.id, member.plan_name)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase flex items-center gap-2 hover:scale-105 transition-transform"
                           >
                             <RefreshCcw size={12} /> Renew
                           </button>
                         )}

                         <a 
                          href={`https://wa.me/${member.whatsapp_num}`}
                          target="_blank"
                          className="p-2 glass border-white/10 rounded-xl text-gray-400 hover:text-benny-green transition-colors"
                         >
                           <MessageCircle size={18} />
                         </a>
                         
                         <div className="relative">
                           <button 
                            onClick={() => setActiveMenuId(activeMenuId === member.id ? null : member.id)}
                            className={`p-2 glass border-white/10 rounded-xl transition-colors ${activeMenuId === member.id ? 'text-benny-green bg-white/5' : 'text-gray-400'}`}
                           >
                             <MoreHorizontal size={18} />
                           </button>
                           
                           <AnimatePresence>
                             {activeMenuId === member.id && (
                               <>
                                 <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                                 <motion.div 
                                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                   animate={{ opacity: 1, y: 0, scale: 1 }}
                                   exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                   className="absolute right-0 top-full mt-2 w-48 glass-dark rounded-2xl border border-white/10 p-2 z-20 shadow-2xl"
                                 >
                                   <button 
                                     onClick={() => handleEditClick(member)}
                                     className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 flex items-center gap-3 text-sm transition-colors text-gray-300"
                                   >
                                     <Edit2 size={16} /> Edit Entry
                                   </button>
                                   <button 
                                     onClick={() => deleteMember(member.id)}
                                     className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-500/10 flex items-center gap-3 text-sm transition-colors text-red-500"
                                   >
                                     <Trash2 size={16} /> Delete Entry
                                   </button>
                                 </motion.div>
                               </>
                             )}
                           </AnimatePresence>
                         </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Manual Entry Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl glass-dark rounded-[40px] border-white/10 p-8 md:p-12 overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-extrabold uppercase tracking-tighter mb-8">
                {editingMemberId ? 'Edit' : 'Manual'} <span className="text-benny-green">Client Entry</span>
              </h2>

              <form onSubmit={editingMemberId ? handleUpdateMember : handleManualEntry} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-gray-500">Full Name</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      className="w-full bg-white/5 border-b border-white/10 p-4 outline-none focus:border-benny-green transition-colors" 
                      placeholder="e.g. Ahmed Raza" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-gray-500">WhatsApp Number</label>
                    <input 
                      required 
                      type="tel" 
                      value={formData.whatsapp_num}
                      onChange={(e) => setFormData({...formData, whatsapp_num: e.target.value})}
                      className="w-full bg-white/5 border-b border-white/10 p-4 outline-none focus:border-benny-green transition-colors" 
                      placeholder="03XXXXXXXXX" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-gray-500">Plan</label>
                    <select 
                      value={formData.plan_name}
                      onChange={(e) => setFormData({...formData, plan_name: e.target.value})}
                      className="w-full bg-white/5 border-b border-white/10 p-4 outline-none focus:border-benny-green transition-colors appearance-none"
                    >
                      <option className="bg-benny-dark" value="Simple Plan">Simple Plan</option>
                      <option className="bg-benny-dark" value="Cardio & Gym">Cardio & Gym</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-gray-500">Pricing / Amount Paid (Rs.)</label>
                    <input 
                      required 
                      type="number" 
                      value={formData.amount_paid}
                      onChange={(e) => setFormData({...formData, amount_paid: e.target.value})}
                      className="w-full bg-white/5 border-b border-white/10 p-4 outline-none focus:border-benny-green transition-colors" 
                      placeholder="e.g. 2000" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-gray-500">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white/5 border-b border-white/10 p-4 outline-none focus:border-benny-green transition-colors" 
                      placeholder="e.g. client@email.com" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-gray-500">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                      className="w-full bg-white/5 border-b border-white/10 p-4 outline-none focus:border-benny-green transition-colors appearance-none"
                    >
                      <option className="bg-benny-dark" value="active">Active</option>
                      <option className="bg-benny-dark" value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-gray-500">Registration Date</label>
                    <input 
                      type="date" 
                      value={formData.created_at}
                      onChange={(e) => {
                        const newDate = e.target.value;
                        const expiryDate = new Date(newDate);
                        expiryDate.setMonth(expiryDate.getMonth() + 1);
                        setFormData({
                          ...formData, 
                          created_at: newDate,
                          expiry_date: expiryDate.toISOString().split('T')[0]
                        });
                      }}
                      className="w-full bg-white/5 border-b border-white/10 p-4 outline-none focus:border-benny-green transition-colors" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-gray-500">Expiry Date</label>
                    <input 
                      type="date" 
                      value={formData.expiry_date}
                      onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                      className="w-full bg-white/5 border-b border-white/10 p-4 outline-none focus:border-benny-green transition-colors" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full btn-primary py-5 uppercase tracking-widest mt-4"
                >
                  {loading ? 'Processing...' : editingMemberId ? 'Update Client Record' : 'Register Member'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
