import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const TransactionForm = ({ initialData }) => {
    const [formData, setFormData] = useState(initialData || {});
    
    const handleSubmit = (e) => {
      e.preventDefault();
      // Validação e submissão
    };
    
    return (
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Transação
          </label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.type || ''}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
          >
            <option value="">Selecione o tipo</option>
            <option value="DEPOSIT">Depósito</option>
            <option value="WITHDRAW">Saque</option>
            <option value="TRANSFER">Transferência</option>
          </select>
        </div>
        
        <div className="mb-4">
          <Input 
            type="number"
            label="Valor"
            value={formData.amount || ''}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
          />
        </div>
        
        <div className="mb-4">
          <Input 
            type="text"
            label="Descrição"
            value={formData.description || ''}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>
        
        <div className="mb-4">
          <Input 
            type="text"
            label="Categoria"
            value={formData.category || ''}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          />
        </div>
        
        <Button type="submit">Salvar</Button>
      </form>
    );
  };

export default TransactionForm;