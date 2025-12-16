import React, { useEffect, useState } from 'react';
import { DataService } from '../../services/dataService';
import { Nomination, Status } from '../../types';
import { Edit2, Check, X, Download, Filter } from 'lucide-react';

const AdminNominations: React.FC = () => {
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status | 'ALL'>('ALL');
  
  // Edit Modal State
  const [editingItem, setEditingItem] = useState<Nomination | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await DataService.getAllNominations();
    // Sort by date desc
    setNominations(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setLoading(false);
  };

  const handleAction = async (id: string, newStatus: Status) => {
    const user = DataService.getCurrentUser();
    if (!user) return;
    await DataService.updateNomination(id, { status: newStatus }, user.email);
    loadData();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const user = DataService.getCurrentUser();
    if (!user) return;

    await DataService.updateNomination(editingItem.id, {
        dishName: editingItem.dishName,
        restaurantName: editingItem.restaurantName,
        city: editingItem.city,
        status: editingItem.status
    }, user.email);
    
    setEditingItem(null);
    loadData();
  };

  const exportCSV = () => {
    const headers = ['ID', 'Data', 'Prato', 'Restaurante', 'Cidade', 'Status', 'IP'];
    const rows = nominations.map(n => [
        n.id,
        new Date(n.createdAt).toLocaleDateString(),
        `"${n.dishName}"`,
        `"${n.restaurantName}"`,
        `"${n.city}"`,
        n.status,
        n.ip
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'indicacoes_goias.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredData = filter === 'ALL' ? nominations : nominations.filter(n => n.status === filter);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Gerenciar Indicações</h1>
        <div className="flex gap-2">
            <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value as any)}
                className="border border-slate-300 rounded px-3 py-2 text-sm"
            >
                <option value="ALL">Todos os Status</option>
                <option value={Status.PENDING}>Pendentes</option>
                <option value={Status.APPROVED}>Aprovados</option>
                <option value={Status.REJECTED}>Rejeitados</option>
            </select>
            <button onClick={exportCSV} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-medium">
                <Download className="w-4 h-4" /> Exportar CSV
            </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase font-medium">
              <tr>
                <th className="px-6 py-3">Data / IP</th>
                <th className="px-6 py-3">Prato</th>
                <th className="px-6 py-3">Local</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center">Carregando...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center">Nenhum registro encontrado.</td></tr>
              ) : (
                filteredData.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                        <div className="font-bold">{new Date(item.createdAt).toLocaleDateString()}</div>
                        <div className="text-xs text-slate-400 font-mono">{item.ip}</div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{item.dishName}</div>
                        {item.description && <div className="text-xs italic truncate max-w-xs">{item.description}</div>}
                    </td>
                    <td className="px-6 py-4">
                        <div>{item.restaurantName}</div>
                        <div className="text-xs text-slate-500">{item.city}</div>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${item.status === Status.APPROVED ? 'bg-green-100 text-green-800' : 
                              item.status === Status.REJECTED ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {item.status === Status.APPROVED ? 'Aprovado' : item.status === Status.REJECTED ? 'Rejeitado' : 'Pendente'}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                        {item.status === Status.PENDING && (
                            <>
                                <button title="Aprovar" onClick={() => handleAction(item.id, Status.APPROVED)} className="text-green-600 hover:bg-green-50 p-1 rounded"><Check className="w-5 h-5"/></button>
                                <button title="Rejeitar" onClick={() => handleAction(item.id, Status.REJECTED)} className="text-red-600 hover:bg-red-50 p-1 rounded"><X className="w-5 h-5"/></button>
                            </>
                        )}
                        <button title="Editar" onClick={() => setEditingItem(item)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit2 className="w-5 h-5"/></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
                <h3 className="text-xl font-bold mb-4">Editar Indicação</h3>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Prato</label>
                        <input className="w-full border rounded px-3 py-2" value={editingItem.dishName} onChange={e => setEditingItem({...editingItem, dishName: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Restaurante</label>
                        <input className="w-full border rounded px-3 py-2" value={editingItem.restaurantName} onChange={e => setEditingItem({...editingItem, restaurantName: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Cidade</label>
                        <input className="w-full border rounded px-3 py-2" value={editingItem.city} onChange={e => setEditingItem({...editingItem, city: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select 
                            className="w-full border rounded px-3 py-2" 
                            value={editingItem.status}
                            onChange={e => setEditingItem({...editingItem, status: e.target.value as Status})}
                        >
                            <option value={Status.PENDING}>Pendente</option>
                            <option value={Status.APPROVED}>Aprovado</option>
                            <option value={Status.REJECTED}>Rejeitado</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Salvar Alterações</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminNominations;
