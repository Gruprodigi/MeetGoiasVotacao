import { Nomination, Status } from './types';

export const CITIES_GOIAS = [
  'Goiânia', 'Anápolis', 'Aparecida de Goiânia', 'Rio Verde', 'Caldas Novas',
  'Pirenópolis', 'Cidade de Goiás', 'Trindade', 'Catalão', 'Itumbiara',
  'Jataí', 'Formosa', 'Luziânia', 'Águas Lindas de Goiás', 'Valparaíso de Goiás',
  'Cristalina', 'Mineiros', 'Goianésia', 'Jaraguá', 'Porangatu'
];

export const MOCK_ADMIN = {
  email: 'admin@goias.com.br',
  password: '123' // Simple check for demo
};

export const SEED_NOMINATIONS: Nomination[] = [
  {
    id: '1',
    dishName: 'Empadão Goiano',
    restaurantName: 'Mercado Central',
    city: 'Goiânia',
    description: 'O tradicional empadão com guariroba e linguiça.',
    status: Status.APPROVED,
    ip: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: '2',
    dishName: 'Pamonha Salgada',
    restaurantName: 'Pamonharia Frutos da Terra',
    city: 'Goiânia',
    status: Status.APPROVED,
    ip: '192.168.1.2',
    userAgent: 'Mozilla/5.0',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: '3',
    dishName: 'Arroz com Pequi',
    restaurantName: 'Restaurante do Cerrado',
    city: 'Pirenópolis',
    status: Status.APPROVED,
    ip: '192.168.1.3',
    userAgent: 'Mozilla/5.0',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: '4',
    dishName: 'Galinhada',
    restaurantName: 'Rancho Fogão de Lenha',
    city: 'Trindade',
    status: Status.PENDING,
    ip: '192.168.1.4',
    userAgent: 'Mozilla/5.0',
    createdAt: new Date().toISOString()
  }
];
