import type { Character } from '../types';

export const characters: Record<string, Character> = {
  narr: { id: 'narr', name: '', role: '', color: '#6b6258', bio: '' },
  marta: { id: 'marta', name: 'Marta', role: 'Tu · libraia a Valdorna', color: '#b5532f',
    bio: 'Trent’anni, lavora nella libreria “Il Segnalibro”. Non è un’esperta di tecnologia, ma è curiosa e testarda: quando qualcosa non quadra, vuole capire.' },
  lina: { id: 'lina', name: 'Zia Lina', role: 'Zia di Marta', color: '#8a5a8f',
    bio: 'Carolina Ferri, 68 anni. Generosa e premurosa: inoltra i messaggi perché vuole proteggere chi ama. Non è ingenua: è preoccupata.' },
  davide: { id: 'davide', name: 'Davide Conti', role: 'Giornalista freelance', color: '#2f6b7a',
    bio: 'Collabora con il giornale locale “La Voce della Valle”. Insegna un metodo, ma lascia che sia Marta a usarlo.' },
  irene: { id: 'irene', name: 'Irene Bassi', role: 'Ufficio comunicazione del Comune', color: '#4d7c4f',
    bio: 'Gestisce i canali ufficiali del Comune con poche risorse. Precisa, un po’ sulla difensiva: le critiche le pesano.' },
  nicola: { id: 'nicola', name: 'Nicola Moretti', role: 'Amministratore del gruppo “Valdorna Informa”', color: '#8a6d1f',
    bio: 'Ex insegnante in pensione, 64 anni. Ha fondato il gruppo per “tenere unita la valle”. Condivide con convinzione, e fa fatica a ammettere gli errori.' },
  rocco: { id: 'rocco', name: 'Rocco Serra', role: 'Titolare di “AcquaPura Valdorna”', color: '#7a3b3b',
    bio: 'Vende depuratori domestici. Sa che la paura fa vendere. Fino a dove si spinge?' },
  elio: { id: 'elio', name: 'Elio Marchetti', role: 'Vicino di casa di Marta', color: '#5b6b8c',
    bio: '79 anni, ex ferroviere. Ha un telefono che usa con prudenza e un cuore troppo fiducioso.' },
  paolo: { id: 'paolo', name: 'Paolo Greco', role: 'Sindaco di Valdorna', color: '#2b3a5c',
    bio: 'Sessantuno anni, sindaco da due mandati. Parla piano e non ama le polemiche. La sua voce, registrata in anni di consigli comunali pubblici, è facile da imitare.' },
  voce: { id: 'voce', name: 'Voce al telefono', role: 'Chiamante sconosciuto', color: '#6b6258', bio: 'Qualcuno che non si presenta con il proprio nome.' },
  mamma: { id: 'mamma', name: 'Mamma', role: 'Anna Ferri', color: '#c07a4c', bio: 'La madre di Marta.' },
};
export const who = (id: string) => characters[id] ?? characters.narr;
