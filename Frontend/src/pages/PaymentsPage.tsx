import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Payment {
    _id: string;
    projectTitle: string;
    amount: number;
    status: string;
    date: string;
    client: string;
}

const PaymentsPage: React.FC = () => {
    const navigate = useNavigate();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalEarnings: 0,
        pendingPayments: 0,
        completedProjects: 0,
    });

    useEffect(() => {
        // TODO: Fetch payments from API
        // Mock data for now
        setPayments([
            {
                _id: '1',
                projectTitle: 'E-commerce Website',
                amount: 1500,
                status: 'completed',
                date: '2024-11-20',
                client: 'John Doe',
            },
            {
                _id: '2',
                projectTitle: 'Mobile App Design',
                amount: 2000,
                status: 'pending',
                date: '2024-11-25',
                client: 'Jane Smith',
            },
        ]);

        setStats({
            totalEarnings: 3500,
            pendingPayments: 2000,
            completedProjects: 1,
        });

        setLoading(false);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-2xl text-gray-600">Loading...</div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 px-10 py-16">
                <div className="max-w-6xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/expert-dashboard')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back to Dashboard</span>
                    </button>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-extrabold text-gray-900">Payments</h1>
                        <p className="text-gray-600 text-lg mt-1">Track your earnings and payment history</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 bg-green-100 rounded-xl">
                                    <DollarSign className="text-green-600" size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 font-semibold">Total Earnings</div>
                                    <div className="text-2xl font-bold text-gray-900">${stats.totalEarnings.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 bg-yellow-100 rounded-xl">
                                    <TrendingUp className="text-yellow-600" size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 font-semibold">Pending Payments</div>
                                    <div className="text-2xl font-bold text-gray-900">${stats.pendingPayments.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 bg-blue-100 rounded-xl">
                                    <Calendar className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 font-semibold">Completed Projects</div>
                                    <div className="text-2xl font-bold text-gray-900">{stats.completedProjects}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment History */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
                        </div>

                        {payments.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-gray-500 text-lg">No payment history yet</p>
                                <p className="text-gray-400 text-sm mt-2">Complete projects to start earning!</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Project</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Client</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {payments.map((payment) => (
                                            <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-gray-900">{payment.projectTitle}</div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">{payment.client}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900">${payment.amount.toLocaleString()}</div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {new Date(payment.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                                            payment.status
                                                        )}`}
                                                    >
                                                        {payment.status.toUpperCase()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Withdrawal Section */}
                    <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Withdraw Funds</h2>
                        <p className="text-gray-600 mb-6">
                            Available balance: <span className="font-bold text-gray-900">${stats.totalEarnings.toLocaleString()}</span>
                        </p>
                        <div className="flex gap-4">
                            <button className="px-6 py-3 bg-gradient-to-br from-[#87CEEB] to-[#AFEEEE] text-white font-bold rounded-xl shadow-md hover:from-[#AFEEEE] hover:to-[#87CEEB] transition-all duration-300">
                                Request Withdrawal
                            </button>
                            <button className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors">
                                Payment Settings
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PaymentsPage;
