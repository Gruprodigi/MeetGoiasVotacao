import React, { useEffect, useState } from 'react';
import { DataService } from '../../services/dataService';
import { NominationStats } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<NominationStats | null>(null);

  useEffect(() => {
    const load = async () => {
      const s = await DataService.getStats();
      setStats(s);
    };
    load();
  }, []);

  if (!stats) return <div className="p-8 text-center">Carregando dados...</div>;

  // Prepare Chart Data
  const chartData = Object.entries(stats.byCity)
    .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
    .slice(0, 5)
    .map(([city, count]) => ({ city, count }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Geral</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total de Indicações" 
          value={stats.total} 
          icon={<FileText className="text-blue-500" />} 
          color="border-l-blue-500"
        />
        <StatCard 
          title="Aprovadas" 
          value={stats.approved} 
          icon={<CheckCircle className="text-green-500" />} 
          color="border-l-green-500"
        />
        <StatCard 
          title="Pendentes" 
          value={stats.pending} 
          icon={<Clock className="text-yellow-500" />} 
          color="border-l-yellow-500"
        />
        <StatCard 
          title="Rejeitadas" 
          value={stats.rejected} 
          icon={<XCircle className="text-red-500" />} 
          color="border-l-red-500"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-4">Volume por Cidade (Top 5)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="city" fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#D95E00" name="Indicações" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-4">Resumo Executivo</h3>
          <div className="space-y-4 text-sm text-slate-600">
             <p>O sistema possui um total de <span className="font-bold">{stats.total}</span> registros processados.</p>
             <p>A taxa de aprovação atual é de <span className="font-bold">{stats.total ? Math.round((stats.approved / stats.total) * 100) : 0}%</span>.</p>
             <p className="mt-4 font-semibold text-slate-800">Prato mais indicado:</p>
             <p>{Object.entries(stats.byDish).sort((a: [string, number], b: [string, number]) => b[1] - a[1])[0]?.[0] || 'N/A'}</p>
             <p className="mt-4 font-semibold text-slate-800">Restaurante mais indicado:</p>
             <p>{Object.entries(stats.byRestaurant).sort((a: [string, number], b: [string, number]) => b[1] - a[1])[0]?.[0] || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) => (
  <div className={`bg-white p-6 rounded-lg shadow-sm border border-slate-200 border-l-4 ${color}`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-sm font-medium uppercase">{title}</p>
        <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
      </div>
      <div className="p-2 bg-slate-50 rounded-lg">
        {icon}
      </div>
    </div>
  </div>
);

export default AdminDashboard;