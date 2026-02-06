import React, { useEffect, useState } from 'react';
import { User, AdminStats } from '../types';
import { getAdminStats } from '../services/localStorageService';
import { useLanguage } from '../contexts/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ArrowLeft, RefreshCw, TrendingUp, Users, Database, DollarSign, CheckCircle, Clock } from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  onBack: () => void;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00c49f', '#ff00ff'];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onBack }) => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    const result = await getAdminStats(user.email);
    if (result.success && result.stats) {
      setStats(result.stats);
    } else {
      setError(result.error || t.adminDashboard.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatStatus = (status: string) => {
    if (status === 'success') return <span className="text-green-600 font-medium">成功</span>;
    if (status === 'pending') return <span className="text-yellow-600 font-medium">处理中</span>;
    if (status === 'failed') return <span className="text-red-600 font-medium">失败</span>;
    return status;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
            <p className="text-gray-600">{t.adminDashboard.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={loadStats} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-4">
            <ArrowLeft size={20} />
            <span>返回</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{t.adminDashboard.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" />
              {t.adminDashboard.todayStats}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">{t.adminDashboard.totalImages}</p>
                <p className="text-2xl font-bold text-blue-700">{stats.today.totalImages}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray600 mb-1">{t.adminDashboard.successImages}</p>
                <p className="text-2xl font-bold text-green-700">{stats.today.successImages}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">{t.adminDashboard.successRate}</p>
                <p className="text-2xl font-bold text-purple-700">{stats.today.successRate}%</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">{t.adminDashboard.totalCredits}</p>
                <p className="text-2xl font-bold text-amber-700">{stats.today.totalCredits}</p>
              </div>
              <div className="bg-cyan-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">{t.adminDashboard.newUsers}</p>
                <p className="text-2xl font-bold text-cyan-700">{stats.today.newUsers}</p>
              </div>
              <div className="bg-rose-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">{t.adminDashboard.totalRechargeAmount}</p>
                <p className="text-2xl font-bold text-rose-700">¥{stats.today.totalRechargeAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Database size={20} className="text-blue-600" />
              {t.adminDashboard.totalStats}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">{t.adminDashboard.totalImages}</p>
                <p className="text-2xl font-bold text-blue-700">{stats.total.totalImages}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">{t.adminDashboard.successImages}</p>
                <p className="text-2xl font-bold text-green-700">{stats.total.successImages}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">{t.adminDashboard.successRate}</p>
                <p className="text-2xl font-bold text-purple-700">{stats.total.successRate}%</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">{t.adminDashboard.totalCredits}</p>
                <p className="text-2xl font-bold text-amber-700">{stats.total.totalCredits}</p>
              </div>
              <div className="bg-cyan-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">{t.adminDashboard.totalUsers}</p>
                <p className="text-2xl font-bold text-cyan-700">{stats.total.totalUsers}</p>
              </div>
              <div className="bg-rose-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">{t.adminDashboard.totalRechargeAmount}</p>
                <p className="text-2xl font-bold text-rose-700">¥{stats.total.totalRechargeAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle size={20} className="text-blue-600" />
            {t.adminDashboard.moduleUsage}
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.moduleUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="moduleName" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-blue-600" />
              {t.adminDashboard.rechargeRecords}
            </h2>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">{t.adminDashboard.user}</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">{t.adminDashboard.amount}</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">{t.adminDashboard.credits}</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">{t.adminDashboard.status}</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">{t.adminDashboard.time}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.rechargeRecords.slice(0, 20).map((record) => (
                    <tr key={record.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2">{record.userName}</td>
                      <td className="px-4 py-2">¥{record.amount.toFixed(2)}</td>
                      <td className="px-4 py-2">{record.credits}</td>
                      <td className="px-4 py-2">{formatStatus(record.status)}</td>
                      <td className="px-4 py-2 text-xs text-gray-500">{formatDate(record.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-blue-600" />
              {t.adminDashboard.generationRecords}
            </h2>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">{t.adminDashboard.user}</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">{t.adminDashboard.moduleName}</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">{t.adminDashboard.model}</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">{t.adminDashboard.status}</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">{t.adminDashboard.time}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentGenerations.slice(0, 20).map((record) => (
                    <tr key={record.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2">{record.userName}</td>
                      <td className="px-4 py-2">{record.moduleName}</td>
                      <td className="px-4 py-2">{record.model}</td>
                      <td className="px-4 py-2">{record.success ? <span className="text-green-600">成功</span> : <span className="text-red-600">失败</span>}</td>
                      <td className="px-4 py-2 text-xs text-gray-500">{formatDate(record.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
