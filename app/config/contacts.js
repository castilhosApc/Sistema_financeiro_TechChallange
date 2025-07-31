export const contacts = [
  {
    id: '1',
    name: 'João Silva',
    accountNumber: '001234567-8',
    bank: 'Banco do Brasil',
    type: 'Pessoa Física'
  },
  {
    id: '2',
    name: 'Maria Santos',
    accountNumber: '002345678-9',
    bank: 'Itaú',
    type: 'Pessoa Física'
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    accountNumber: '003456789-0',
    bank: 'Bradesco',
    type: 'Pessoa Física'
  },
  {
    id: '4',
    name: 'Ana Costa',
    accountNumber: '004567890-1',
    bank: 'Santander',
    type: 'Pessoa Física'
  },
  {
    id: '5',
    name: 'Carlos Ferreira',
    accountNumber: '005678901-2',
    bank: 'Caixa Econômica',
    type: 'Pessoa Física'
  },
  {
    id: '6',
    name: 'Empresa ABC Ltda',
    accountNumber: '006789012-3',
    bank: 'Banco do Brasil',
    type: 'Pessoa Jurídica'
  },
  {
    id: '7',
    name: 'Comércio XYZ',
    accountNumber: '007890123-4',
    bank: 'Itaú',
    type: 'Pessoa Jurídica'
  },
  {
    id: '8',
    name: 'Indústria 123',
    accountNumber: '008901234-5',
    bank: 'Bradesco',
    type: 'Pessoa Jurídica'
  },
  {
    id: '9',
    name: 'Serviços DEF',
    accountNumber: '009012345-6',
    bank: 'Santander',
    type: 'Pessoa Jurídica'
  },
  {
    id: '10',
    name: 'Consultoria GHI',
    accountNumber: '010123456-7',
    bank: 'Caixa Econômica',
    type: 'Pessoa Jurídica'
  }
];

export const getContactById = (id) => {
  return contacts.find(contact => contact.id === id);
};

export const getContactByName = (name) => {
  return contacts.find(contact => contact.name.toLowerCase().includes(name.toLowerCase()));
}; 