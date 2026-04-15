import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, 
  Zap, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Share2,
  Camera,
  Globe,
  Mail,
  Phone,
  MapPin,
  Menu,
  X
} from 'lucide-react';

// --- Components ---

const BennyLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" />
    <path d="M35 35 L65 65 M35 65 L65 35" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
  </svg>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 px-4">
      <div className="w-full max-w-6xl glass rounded-full px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BennyLogo className="w-8 h-8 text-benny-green" />
          <span className="font-display text-xl tracking-tighter font-bold uppercase">Benny™</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
          <a href="#about" className="hover:text-benny-green transition-colors">About</a>
          <a href="#testimonials" className="hover:text-benny-green transition-colors">Client Reviews</a>
          <a href="#membership" className="hover:text-benny-green transition-colors">Membership</a>
          <a href="#contact" className="btn-primary py-2 px-6 text-xs mt-0">Join Now</a>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-4 right-4 glass rounded-3xl p-8 flex flex-col gap-6 md:hidden"
          >
            <a href="#about" onClick={() => setIsOpen(false)} className="text-xl font-display uppercase tracking-widest">About</a>
            <a href="#results" onClick={() => setIsOpen(false)} className="text-xl font-display uppercase tracking-widest">Results</a>
            <a href="#membership" onClick={() => setIsOpen(false)} className="text-xl font-display uppercase tracking-widest">Membership</a>
            <a href="#contact" onClick={() => setIsOpen(false)} className="btn-primary text-center">Join Now</a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="p-8 glass-dark rounded-3xl border-white/5 hover:border-benny-green/30 transition-all duration-500"
  >
    <div className="w-12 h-12 bg-benny-green rounded-2xl flex items-center justify-center mb-6 text-benny-dark">
      <Icon size={24} strokeWidth={2.5} />
    </div>
    <h3 className="font-display text-2xl mb-4 font-bold">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{desc}</p>
  </motion.div>
);

const ResultsCard = () => (
  <div className="relative group">
    <div className="absolute -inset-1 bg-benny-green opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
    <div className="relative glass bg-white/5 backdrop-blur-2xl rounded-[40px] p-12 overflow-hidden border-white/10">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="w-full md:w-1/2">
          <span className="text-benny-green font-display uppercase tracking-widest mb-4 inline-block">Success Story</span>
          <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-8 italic">
            "I feel like myself again. Benny changed my entire outlook."
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-benny-muted overflow-hidden">
               <img src="https://i.pravatar.cc/150?u=josh" alt="Zaid" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-lg">Zaid Ahmed</p>
              <p className="text-gray-400">Project Manager | Member since 2024</p>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 bg-white/5 rounded-3xl p-8 border border-white/10">
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="text-gray-400">Age:</span>
              <span className="font-bold">40</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="text-gray-400">Biological Age (Before):</span>
              <span className="font-bold text-red-500">49 <span className="text-xs uppercase ml-1">▲ 9</span></span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Biological Age (After 3 Months):</span>
              <span className="font-bold text-benny-green text-2xl italic font-serif">41</span>
            </div>
          </div>
          <button className="w-full btn-primary mt-8 py-3 text-sm">View full program</button>
        </div>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  const reviews = [
    { name: "Ahmed Raza", review: "Best gym in Sahiwal! The equipment is top-notch and the atmosphere is very professional.", role: "Athlete" },
    { name: "Bilal Khan", review: "Great atmosphere and very professional trainers. Benny Gym has completely transformed my fitness.", role: "Business Owner" },
    { name: "Fatima Zahra", review: "The environment is very clean and safe for women. Highly recommend the cardio and gym plan.", role: "Fitness Enthusiast" },
    { name: "Muhammad Ali", review: "Highly recommend the cardio plan. It's affordable and effective for anyone looking to stay fit.", role: "Student" },
    { name: "Zainab Bibi", review: "Benny Gym is a game changer in Sahiwal. The bio-data sync tech is something I've never seen before.", role: "Professional" },
    { name: "Omar Farooq", review: "Outstanding facility. The membership plans are very reasonable for the quality they provide.", role: "Local Member" },
  ];

  // Duplicate for infinite effect
  const doubledReviews = [...reviews, ...reviews];

  return (
    <section id="testimonials" className="py-32 overflow-hidden bg-benny-charcoal/20">
      <div className="container mx-auto px-6 mb-16 text-center">
        <h2 className="text-5xl md:text-6xl font-display font-bold uppercase mb-4">Client Reviews</h2>
        <div className="w-24 h-1 bg-benny-green mx-auto mb-8"></div>
        <p className="text-gray-400 max-w-2xl mx-auto">Hear from our community of high-performers across Pakistan who have redefined their limits at Benny.</p>
      </div>
      
      <div className="flex w-full overflow-hidden">
        <div className="flex gap-8 animate-scroll whitespace-nowrap px-4">
          {doubledReviews.map((item, idx) => (
            <div key={idx} className="min-w-[300px] md:min-w-[400px] glass p-8 rounded-3xl border-white/5 whitespace-normal">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Zap key={i} size={14} className="fill-benny-green text-benny-green" />
                ))}
              </div>
              <p className="text-lg italic mb-6 text-gray-200">"{item.review}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-benny-muted flex items-center justify-center font-bold text-benny-green">
                  {item.name[0]}
                </div>
                <div>
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const App = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    setTimeout(() => setFormStatus('success'), 1500);
  };

  return (
    <div className="min-h-screen selection:bg-benny-green selection:text-benny-dark">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero.png" 
            alt="Gym Hero" 
            className="w-full h-full object-cover opacity-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-benny-dark via-benny-dark/20 to-benny-dark/80"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 rounded-full glass text-benny-green text-xs font-bold uppercase tracking-[0.3em] mb-8">
              Now Open in Your District
            </span>
            <h1 className="text-7xl md:text-9xl font-display font-extrabold tracking-tighter uppercase mb-6 leading-[0.8]">
              Feel Like <br /> <span className="text-benny-green italic font-serif leading-tight">Yourself</span> Again
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
              Experience the science of performance. Bio-hacking training protocols 
              within a sanctuary of luxury fitness.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <a href="#contact" className="btn-primary flex items-center gap-2 group">
                Begin Transformation <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#about" className="btn-outline">
                Explore The Facility
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-2">
           <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Scroll</span>
           <div className="w-[1px] h-10 bg-gradient-to-b from-benny-green to-transparent"></div>
        </div>
      </section>

      {/* Why BENNY */}
      <section id="about" className="py-32 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Zap} 
            title="Bio-Data Sync" 
            desc="Wearable integration that adapts your workout intensity in real-time based on CNS fatigue and HRV levels."
          />
          <FeatureCard 
            icon={Dumbbell} 
            title="Sovereign Tech" 
            desc="Our equipment isn't just weights—it's high-performance machinery designed to optimize every eccentric phase."
          />
          <FeatureCard 
            icon={Users} 
            title="The 1% Elite" 
            desc="Join a community of high-performers, founders, and athletes who demand excellence from every rep."
          />
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-32 bg-benny-charcoal/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-display font-bold uppercase mb-4">Measurable Impact</h2>
            <div className="w-24 h-1 bg-benny-green mx-auto"></div>
          </div>
          <ResultsCard />
        </div>
      </section>

      <Testimonials />

      {/* Pricing / Tiers */}
      <section id="membership" className="py-32 container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-display font-bold uppercase mb-4">Membership</h2>
          <p className="text-gray-400">Strictly Limited Capacity. Application Only.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {['Core Performance', 'Elite Biological'].map((plan, i) => (
            <div key={i} className={`glass p-12 rounded-[40px] flex flex-col border ${i === 1 ? 'border-benny-green bg-benny-green/5' : 'border-white/10'}`}>
              <div className="flex justify-between items-start mb-8">
                <div>
                   <h3 className="text-2xl font-display font-bold uppercase mb-2">{i === 0 ? 'Simple Plan' : 'Cardio & Gym'}</h3>
                   <p className="text-gray-400 text-sm">Monthly Investment</p>
                </div>
                <div className="text-3xl font-display font-bold text-benny-green">
                  Rs. {i === 0 ? '2000' : '4000'}
                </div>
              </div>
              <ul className="space-y-4 mb-12 flex-grow">
                {[
                  '24/7 Biometric Access',
                  'Unlimited High-Fi Group Protocols',
                  'Recovery Lounge Access',
                  i === 1 ? 'Personal Biological Architect' : null,
                  i === 1 ? 'Cryo & Hyperbaric Unlimited' : null,
                  i === 1 ? 'Nutrient Optimization Meals' : null,
                ].filter(Boolean).map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 size={16} className="text-benny-green" /> {feat}
                  </li>
                ))}
              </ul>
              <button className={`w-full ${i === 1 ? 'btn-primary' : 'btn-outline'} py-4`}>Apply Now</button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA / Form */}
      <section id="contact" className="py-32 container mx-auto px-6">
        <div className="glass rounded-[50px] overflow-hidden flex flex-col md:flex-row min-h-[600px] border-white/5">
          <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center bg-benny-green text-benny-dark">
             <h2 className="text-5xl md:text-6xl font-display font-extrabold uppercase mb-8 leading-none">Your <br /> Legacy <br /> Starts <br /> Here.</h2>
             <p className="text-benny-dark/70 text-lg mb-12 font-medium">
               Complete the application below. Our Bio-Architects will contact you 
               for a facility tour and baseline assessment.
             </p>
             <div className="space-y-4">
                <div className="flex items-center gap-4"><Mail size={20} /> ghasifofficial23@gmail.com</div>
                <div className="flex items-center gap-4"><Phone size={20} /> 03126872248</div>
                <div className="flex items-center gap-4"><MapPin size={20} /> Sahiwal College Chowk, Punjab, Pakistan</div>
              </div>
          </div>
          
          <div className="w-full md:w-1/2 p-12 md:p-20 bg-benny-charcoal/50">
            {formStatus === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center"
              >
                <div className="w-20 h-20 bg-benny-green rounded-full flex items-center justify-center mb-6 text-benny-dark">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-3xl font-display font-bold uppercase mb-2">Application Received</h3>
                <p className="text-gray-400">A Bio-Architect will reach out within 4 hours.</p>
              </motion.div>
            ) : (
              <form 
                action="https://formspree.io/f/ghasifofficial23@gmail.com"
                method="POST"
                onSubmit={(e) => {
                  e.preventDefault();
                  setFormStatus('loading');
                  const form = e.target as HTMLFormElement;
                  fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                  }).then(response => {
                    if (response.ok) {
                      setFormStatus('success');
                    } else {
                      setFormStatus('idle');
                      alert('Something went wrong. Please try again.');
                    }
                  });
                }} 
                className="space-y-8"
              >
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-gray-500">Full Name</label>
                  <input name="name" required type="text" className="w-full bg-white/5 border-b-2 border-white/10 p-4 outline-none focus:border-benny-green transition-colors font-display" placeholder="CHRIS BUMSTEAD" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-gray-500">Email Address</label>
                  <input name="email" required type="email" className="w-full bg-white/5 border-b-2 border-white/10 p-4 outline-none focus:border-benny-green transition-colors font-display" placeholder="CHRIS@BUMSTEAD.CO" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-gray-500">Primary Goal</label>
                  <select name="goal" className="w-full bg-white/5 border-b-2 border-white/10 p-4 outline-none focus:border-benny-green transition-colors font-display appearance-none">
                    <option className="bg-benny-dark">Hypertrophy</option>
                    <option className="bg-benny-dark">Longevity & Bio-Hacking</option>
                    <option className="bg-benny-dark">Fat Loss</option>
                    <option className="bg-benny-dark">Elite Performance</option>
                  </select>
                </div>
                <button disabled={formStatus === 'loading'} className="w-full btn-primary py-5 uppercase tracking-widest disabled:opacity-50">
                  {formStatus === 'loading' ? 'Encrypting Data...' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <BennyLogo className="w-6 h-6 text-benny-green" />
              <span className="font-display font-bold uppercase tracking-tighter">Benny™</span>
            </div>
            <p className="text-gray-500 text-xs">© 2026 BENNY BIOLOGICAL ALLIANCE. ALL RIGHTS RESERVED.</p>
          </div>
          
          <div className="flex gap-8">
            <a href="#" className="hover:text-benny-green transition-colors"><Camera size={20} /></a>
            <a href="#" className="hover:text-benny-green transition-colors"><Share2 size={20} /></a>
            <a href="#" className="hover:text-benny-green transition-colors"><Globe size={20} /></a>
          </div>
          
          <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold text-gray-500">
             <a href="#" className="hover:text-white transition-colors">Privacy</a>
             <a href="#" className="hover:text-white transition-colors">Terms</a>
             <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
