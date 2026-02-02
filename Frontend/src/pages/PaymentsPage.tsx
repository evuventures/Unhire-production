import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    Filter,
    Download,
    ShieldCheck,
    Zap,
    Clock,
    ChevronRight,
    Plus
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

interface Payment {
    _id: string;
    projectTitle: string;
    amount: number;
    status: string;
    date: string;
    client: string;
    type: 'earning' | 'withdrawal' | 'escrow';
}

const PaymentsPage: React.FC = () => {
    const navigate = useNavigate();
    const userRole = JSON.parse(localStorage.getItem('user') || '{}').role || 'expert';
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulated API fetch
        setTimeout(() => {
            setPayments([
                { _id: '1', projectTitle: 'E-commerce React Migration', amount: 1500, status: 'completed', date: '2024-11-20', client: 'Alpha Tech', type: 'earning' },
                { _id: '2', projectTitle: 'Fintech Mobile App UI', amount: 2000, status: 'pending', date: '2024-11-25', client: 'Nebula Systems', type: 'escrow' },
                { _id: '3', projectTitle: 'Withdrawal to Bank', amount: 800, status: 'completed', date: '2024-11-15', client: 'Mastercard ****8892', type: 'withdrawal' },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const stats = [
        { label: 'Available Balance', value: '$3,420.00', icon: Wallet, color: 'text-primary' },
        { label: 'Pending Escrow', value: '$2,000.00', icon: Clock, color: 'text-yellow-400' },
        { label: 'Total Withdrawn', value: '$12,800.00', icon: ArrowUpRight, color: 'text-green-400' },
    ];

    if (loading) {
        return (
            <div className="flex bg-background min-h-screen">
                <Sidebar role={userRole as any} />
                <main className="flex-1 ml-64 flex items-center justify-center">
                    <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </main>
            </div>
        );
    }

    return (
        <div className="flex bg-background min-h-screen text-text-primary">
            <Sidebar role={userRole as any} />

            <main
                className="flex-1 p-10 pb-20 transition-all duration-300"
                style={{ marginLeft: 'var(--sidebar-width, 256px)' }}
            >
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 text-text-secondary mb-4 hover:text-white transition-colors cursor-pointer w-fit"
                                onClick={() => navigate(userRole === 'client' ? '/client-dashboard' : '/expert-dashboard')}
                            >
                                <ArrowLeft size={16} />
                                <span className="text-sm font-medium">Back to Workspace</span>
                            </motion.div>
                            <h1 className="text-4xl font-bold">Financial Center</h1>
                            <p className="text-text-secondary mt-1">Track your earnings, manage withdrawals, and view financial history.</p>
                        </div>

                        <div className="flex gap-4">
                            <button className="btn-secondary py-3 px-6 text-sm flex items-center gap-2">
                                <Download size={18} />
                                Export Statement
                            </button>
                            <button className="btn-primary py-3 px-8 text-sm flex items-center gap-2">
                                <Plus size={18} />
                                Withdraw Funds
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {stats.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-8 border-white/5"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`p-2.5 rounded-xl bg-white/5 ${s.color}`}>
                                        <s.icon size={22} />
                                    </div>
                                    <p className="text-text-secondary text-xs font-bold uppercase tracking-wider">{s.label}</p>
                                </div>
                                <p className="text-4xl font-black">{s.value}</p>
                                <div className="mt-4 flex items-center gap-2 text-[10px] text-text-secondary font-bold uppercase tracking-widest">
                                    <Zap size={10} className="text-primary" />
                                    Updated Real-time
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Transaction Table */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-3 glass-card overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-xl font-bold">Recent Transactions</h2>
                                <button className="text-text-secondary hover:text-white transition-colors">
                                    <Filter size={20} />
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-white/2">
                                            <th className="px-8 py-5 text-left text-xs font-bold text-text-secondary uppercase tracking-widest">Description</th>
                                            <th className="px-8 py-5 text-left text-xs font-bold text-text-secondary uppercase tracking-widest">Type</th>
                                            <th className="px-8 py-5 text-left text-xs font-bold text-text-secondary uppercase tracking-widest">Amount</th>
                                            <th className="px-8 py-5 text-left text-xs font-bold text-text-secondary uppercase tracking-widest">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {payments.map((p) => (
                                            <tr key={p._id} className="group hover:bg-white/2 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`size-10 rounded-xl flex items-center justify-center ${p.type === 'earning' ? 'bg-green-400/10 text-green-400' :
                                                            p.type === 'withdrawal' ? 'bg-red-400/10 text-red-400' : 'bg-primary/10 text-primary'
                                                            }`}>
                                                            {p.type === 'earning' ? <ArrowDownLeft size={20} /> :
                                                                p.type === 'withdrawal' ? <ArrowUpRight size={20} /> : <ShieldCheck size={20} />}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-white group-hover:text-primary transition-colors">{p.projectTitle}</p>
                                                            <p className="text-xs text-text-secondary">{p.client} • {new Date(p.date).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">{p.type}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <p className={`font-black text-lg ${p.type === 'withdrawal' ? 'text-red-400' : 'text-white'}`}>
                                                        {p.type === 'withdrawal' ? '-' : '+'}${p.amount.toLocaleString()}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${p.status === 'completed' ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'
                                                        }`}>
                                                        {p.status}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-6 text-center border-t border-white/5">
                                <button className="text-xs font-bold text-text-secondary hover:text-white transition-colors uppercase tracking-widest">View Full History</button>
                            </div>
                        </motion.div>

                        {/* Sidebar Info */}
                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass-card p-8 border-primary/20"
                            >
                                <h3 className="text-lg font-bold mb-6">Payment Methods</h3>
                                <div className="space-y-4">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-lg bg-surface flex items-center justify-center font-bold">MC</div>
                                            <p className="text-xs font-bold text-text-secondary">**** 8892</p>
                                        </div>
                                        <ChevronRight size={16} className="text-text-secondary group-hover:text-primary transition-all" />
                                    </div>
                                </div>
                                <button className="w-full mt-6 py-3 bg-white/5 border border-dashed border-border rounded-xl text-xs font-bold text-text-secondary hover:text-white transition-all">
                                    Add New Method
                                </button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="glass-card p-8"
                            >
                                <div className="flex items-center gap-3 mb-4 text-sm font-bold text-primary italic">
                                    <ShieldCheck size={16} />
                                    Secure Payments
                                </div>
                                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                                    Unhire uses institutional-grade encryption and escrow protocols to ensure every dollar is tracked and protected.
                                </p>
                                <p className="text-[10px] text-text-secondary uppercase font-black">Escrow ID: #UH-88291</p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PaymentsPage;
