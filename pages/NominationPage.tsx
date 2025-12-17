import React, { useState, useRef, useEffect } from 'react';
import { CITIES_GOIAS } from '../constants';
import { DataService } from '../services/dataService';
import { NominationStats } from '../types';
import { CheckCircle2, AlertCircle, Share2, Award, User, MapPin, Trophy } from 'lucide-react';

const NominationPage: React.FC = () => {
  // Form State
  const [formData, setFormData] = useState({
    dishName: '',
    restaurantName: '',
    city: '',
    description: '',
    notes: '',
    agreed: false
  });
  
  // Captcha State
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaNum1] = useState(Math.floor(Math.random() * 10) + 1);
  const [captchaNum2] = useState(Math.floor(Math.random() * 10) + 1);

  // App State
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState<NominationStats | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  // Load stats for the "Live Ranking" feature
  useEffect(() => {
    DataService.getStats().then(setStats);
  }, []);

  // Helper to determine the "Goiano Rank" badge based on the dish
const getBadgeTitle = (dish: string) => {
  const d = dish.toLowerCase();

  if (d.includes('pamonha')) return 'Embaixador(a) do Milho';
  if (d.includes('curau') || d.includes('bolo de milho') || d.includes('milharina')) return 'Senhor(a) das Espigas';
  if (d.includes('chica')) return 'Especialista em Chica Doida';
  if (d.includes('cuscuz')) return 'Arquiteto do Cuscuz';

  if (d.includes('pequi')) return 'Roedor(a) de Pequi Profissional';
  if (d.includes('guariroba')) return 'Domador(a) de Amargor';
  if (d.includes('baru')) return 'Cavaleiro(a) do Baru';
  if (d.includes('jatobá')) return 'Conhecedor(a) do Cerrado';
  if (d.includes('cagaita')) return 'Explorador(a) do Cerrado';

  if (d.includes('empad')) return 'Fiscal do Empadão';
  if (d.includes('galinhada')) return 'Mestre da Galinhada';
  if (d.includes('suã')) return 'Defensor da Suã';
  if (d.includes('costela')) return 'Guardião da Costela Goiana';
  if (d.includes('carne de lata')) return 'Conservador das Tradições';
  if (d.includes('linguiça')) return 'Mestre Linguiçeiro';

  if (d.includes('peixe') || d.includes('tucunaré')) return 'Pescador do Araguaia';

  if (d.includes('espetinho')) return 'Rei/Rainha do Espeto';
  if (d.includes('pastel')) return 'Fiscal do Pastel';
  if (d.includes('caldo') || d.includes('dobradinha') || d.includes('tropeiro')) return 'Senhor(a) do Caldo Quente';

  if (d.includes('doce de leite')) return 'Mestre Doceiro';
  if (d.includes('ambrosia')) return 'Guardião da Ambrosia';
  if (d.includes('queijadinha')) return 'Alquimista do Coco';
  if (d.includes('bolo')) return 'Orgulho da Vó';

  if (d.includes('mané') || d.includes('pelado') || d.includes('tradição')) return 'Guardião da Tradição';

  return 'Goiano(a) Raiz Certificado';
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');

    if (!formData.dishName || !formData.restaurantName || !formData.city || !formData.agreed) {
      setStatus('error');
      setMessage('Por favor, preencha todos os campos obrigatórios e aceite os termos.');
      return;
    }

    if (parseInt(captchaAnswer) !== captchaNum1 + captchaNum2) {
      setStatus('error');
      setMessage('A resposta da verificação de segurança está incorreta.');
      return;
    }

    try {
      const result = await DataService.submitNomination({
        dishName: formData.dishName,
        restaurantName: formData.restaurantName,
        city: formData.city,
        description: formData.description,
        notes: formData.notes
      });

      if (result.success) {
        // Refresh stats to include the new vote instantly in the background logic (optional)
        DataService.getStats().then(setStats);
        setStatus('success');
        setMessage(result.message);
        setCaptchaAnswer('');
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch (err) {
      setStatus('error');
      setMessage('Ocorreu um erro ao enviar sua indicação. Tente novamente mais tarde.');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setFormData({
      dishName: '',
      restaurantName: '',
      city: '',
      description: '',
      notes: '',
      agreed: false
    });
  };

  // --- Render: Success View (Carteirinha) ---
  if (status === 'success') {
    const badgeTitle = getBadgeTitle(formData.dishName);
    
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="w-full max-w-lg animate-fade-in">
          
          <div className="bg-white p-6 rounded-xl shadow-lg text-center border-t-4 border-goias-green mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-goias-green" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Indicação Recebida!</h2>
            <p className="text-gray-600">
              Parabéns! Você acaba de desbloquear sua identidade gastronômica.
            </p>
          </div>

          {/* Carteirinha de Goiano Raiz - RESPONSIVE FIXES */}
          <div className="mb-8 perspective-1000">
             <div ref={cardRef} className="relative w-full aspect-[1.586/1] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 select-none">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-amber-50 opacity-50 z-0"></div>
                <div className="absolute top-0 w-full h-3 md:h-4 bg-goias-green z-10"></div>
                <div className="absolute bottom-0 w-full h-3 md:h-4 bg-goias-yellow z-10"></div>
                
                {/* Header */}
                <div className="relative z-10 p-4 md:p-5 pb-0 flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-goias-green rounded-full flex items-center justify-center text-white shrink-0">
                      <Award className="w-4 h-4 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h3 className="text-[8px] md:text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">República Federativa do</h3>
                      <h2 className="text-lg md:text-xl font-black text-goias-green uppercase leading-none">Cerrado</h2>
                    </div>
                  </div>
                  <div className="text-right hidden xs:block">
                    <p className="text-[8px] md:text-[10px] font-bold text-goias-orange uppercase">Documento Oficial</p>
                    <p className="text-[8px] md:text-[10px] text-gray-500">Válido em todo território</p>
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-4 md:p-5 pt-2 md:pt-4 flex gap-3 md:gap-4">
                  {/* Photo Area - Adjusted size for mobile */}
                  <div className="w-20 h-26 md:w-24 md:h-32 bg-gray-100 border-2 border-gray-300 flex flex-col items-center justify-center text-gray-300 shrink-0">
                    <User className="w-8 h-8 md:w-12 md:h-12 mb-1" />
                    <span className="text-[6px] md:text-[8px] uppercase font-bold text-gray-400">Foto 3x4</span>
                  </div>

                  {/* Info */}
                  <div className="flex-grow flex flex-col justify-center space-y-1 md:space-y-3 min-w-0">
                    <div>
                      <p className="text-[8px] md:text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Título Honorário</p>
                      <p className="text-sm md:text-lg font-bold text-goias-orange leading-tight truncate">{badgeTitle}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                       <div className="min-w-0">
                        <p className="text-[8px] md:text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Especialidade</p>
                        <p className="text-xs md:text-sm font-semibold text-gray-800 truncate">{formData.dishName}</p>
                       </div>
                       <div className="min-w-0">
                        <p className="text-[8px] md:text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Base Operacional</p>
                        <p className="text-xs md:text-sm font-semibold text-gray-800 truncate">{formData.city}</p>
                       </div>
                    </div>

                    <div>
                      <p className="text-[8px] md:text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Nível de Goianidade</p>
                      <div className="w-full bg-gray-200 h-1.5 md:h-2 rounded-full overflow-hidden">
                        <div className="bg-goias-green h-full w-[98%]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Watermark */}
                <div className="absolute bottom-6 right-6 opacity-10 pointer-events-none">
                  <Award className="w-20 h-20 md:w-32 md:h-32" />
                </div>
             </div>
             
             <p className="text-center text-xs text-gray-400 mt-2">
               Tire um print da sua carteirinha e compartilhe!
             </p>
          </div>

          <div className="flex gap-4 justify-center">
             <button 
              onClick={handleReset}
              className="px-6 py-2 text-gray-600 hover:text-goias-orange font-medium transition-colors"
            >
              Voltar
            </button>
            <button 
              onClick={() => alert("Dica: Tire um print da tela para compartilhar no Stories!")}
              className="flex items-center gap-2 px-6 py-2 bg-goias-orange text-white rounded-full font-bold shadow-md hover:bg-orange-700 transition-transform active:scale-95"
            >
              <Share2 className="w-4 h-4" /> Compartilhar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Ranking Logic ---
  const sortedCities: [string, number][] = stats 
    ? Object.entries(stats.byCity)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 3) 
    : [];
  
  const maxVotes = sortedCities.length > 0 ? (sortedCities[0][1] as number) : 1;

  // --- Render: Form View ---
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-goias-orange mb-3">
            O que Goiás tem de melhor?
          </h1>
          <p className="text-gray-600 text-lg">
            Ajude a mapear os tesouros culinários do nosso estado.
          </p>
        </div>

        {/* Feature: Ranking em Tempo Real (Disputa do Cerrado) */}
        {sortedCities.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-amber-100 p-6 mb-8 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-goias-yellow fill-goias-yellow" />
              <h3 className="font-bold text-gray-800 uppercase tracking-wide text-sm">Disputa do Cerrado (Top 3)</h3>
            </div>
            
            <div className="space-y-4">
              {sortedCities.map(([city, count], index) => {
                const percentage = ((count as number) / maxVotes) * 100;
                return (
                  <div key={city} className="relative">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="flex items-center gap-1">
                        {index === 0 && <span className="text-lg leading-none">🥇</span>}
                        {index === 1 && <span className="text-lg leading-none">🥈</span>}
                        {index === 2 && <span className="text-lg leading-none">🥉</span>}
                        {city}
                      </span>
                      <span className="text-goias-orange">{count} votos</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          index === 0 ? 'bg-goias-green' : 'bg-goias-orange/70'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">
              Sua cidade não está aqui? Vote agora e ajude ela a subir no ranking!
            </p>
          </div>
        )}

        {/* Nomination Form */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden relative">
          <div className="bg-goias-light px-6 py-4 border-b border-orange-100 flex items-center gap-3">
            <div className="w-2 h-8 bg-goias-orange rounded-full"></div>
            <h2 className="text-lg font-bold text-gray-800">Formulário de Indicação</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {status === 'error' && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3 text-sm animate-pulse">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Nome do Prato Típico *</label>
                <input
                  type="text"
                  name="dishName"
                  value={formData.dishName}
                  onChange={handleChange}
                  placeholder="Ex: Pamonha à Moda"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-goias-yellow focus:border-transparent outline-none transition"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Cidade *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-goias-yellow focus:border-transparent outline-none transition bg-white appearance-none"
                    required
                  >
                    <option value="">Selecione...</option>
                    {CITIES_GOIAS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Nome do Restaurante / Estabelecimento *</label>
              <input
                type="text"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                placeholder="Ex: Pamonharia Central"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-goias-yellow focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Descrição do Prato (Opcional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="O que torna este prato especial?"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-goias-yellow focus:border-transparent outline-none transition"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Observações (Opcional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Ex: Horário de funcionamento, melhor dia para ir..."
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-goias-yellow focus:border-transparent outline-none transition"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
               <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Verificação de Segurança: Quanto é {captchaNum1} + {captchaNum2}? *
                </label>
                <input
                  type="number"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-goias-yellow focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="agreed"
                  id="agreed"
                  checked={formData.agreed}
                  onChange={(e) => setFormData(prev => ({ ...prev, agreed: e.target.checked }))}
                  className="mt-1 w-4 h-4 text-goias-orange border-gray-300 rounded focus:ring-goias-orange"
                />
                <label htmlFor="agreed" className="text-sm text-gray-600">
                  Declaro que esta indicação é verdadeira e concordo com os <span className="underline cursor-pointer text-goias-orange">Termos de Participação</span>. Entendo que meus dados como IP e data serão registrados para auditoria.
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className={`w-full py-4 rounded-lg font-bold text-white text-lg shadow-md transition-all
                ${status === 'submitting' ? 'bg-gray-400 cursor-not-allowed' : 'bg-goias-orange hover:bg-orange-700 active:transform active:scale-[0.98]'}`}
            >
              {status === 'submitting' ? 'Enviando...' : 'Enviar Indicação'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NominationPage;