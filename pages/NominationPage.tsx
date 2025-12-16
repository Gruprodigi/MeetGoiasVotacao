import React, { useState } from 'react';
import { CITIES_GOIAS } from '../constants';
import { DataService } from '../services/dataService';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const NominationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    dishName: '',
    restaurantName: '',
    city: '',
    description: '',
    notes: '',
    agreed: false
  });
  
  // Captcha state
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaNum1] = useState(Math.floor(Math.random() * 10) + 1);
  const [captchaNum2] = useState(Math.floor(Math.random() * 10) + 1);

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');

    // Basic Validation
    if (!formData.dishName || !formData.restaurantName || !formData.city || !formData.agreed) {
      setStatus('error');
      setMessage('Por favor, preencha todos os campos obrigatórios e aceite os termos.');
      return;
    }

    // Captcha Validation
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
        setStatus('success');
        setMessage(result.message);
        setFormData({
          dishName: '',
          restaurantName: '',
          city: '',
          description: '',
          notes: '',
          agreed: false
        });
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

  if (status === 'success') {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg text-center border-t-4 border-goias-green">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-goias-green" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Indicação Recebida!</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <button 
            onClick={() => setStatus('idle')}
            className="text-goias-orange font-semibold hover:underline"
          >
            Fazer outra indicação
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-goias-orange mb-3">
            O que Goiás tem de melhor?
          </h1>
          <p className="text-gray-600">
            Ajude a mapear os tesouros culinários do nosso estado. Indique aquele prato inesquecível e o lugar onde ele é servido.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-goias-light px-6 py-4 border-b border-orange-100 flex items-center gap-3">
            <div className="w-2 h-8 bg-goias-orange rounded-full"></div>
            <h2 className="text-lg font-bold text-gray-800">Formulário de Indicação</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {status === 'error' && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3 text-sm">
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
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-goias-yellow focus:border-transparent outline-none transition bg-white"
                  required
                >
                  <option value="">Selecione...</option>
                  {CITIES_GOIAS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
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
