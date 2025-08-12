// Utilitário para padronizar mensagens de erro do sistema
export const ERROR_MESSAGES = {
  // Mensagens de autenticação
  AUTHENTICATION: {
    'INVALID_CREDENTIALS': 'E-mail ou senha incorretos',
    'USER_NOT_FOUND': 'Usuário não encontrado',
    'ACCOUNT_INACTIVE': 'Conta inativa. Entre em contato com o suporte',
    'EMAIL_ALREADY_EXISTS': 'Este e-mail já está cadastrado',
    'WEAK_PASSWORD': 'A senha deve ter pelo menos 8 caracteres e atender aos requisitos de segurança',
    'PASSWORDS_DONT_MATCH': 'As senhas não coincidem',
    'INVALID_EMAIL': 'E-mail inválido',
    'REQUIRED_FIELDS': 'Todos os campos obrigatórios devem ser preenchidos',
    'DEFAULT': 'Erro na autenticação. Tente novamente'
  },

  // Mensagens de senha
  PASSWORD: {
    'CURRENT_PASSWORD_INCORRECT': 'Senha atual incorreta',
    'NEW_PASSWORDS_DONT_MATCH': 'As novas senhas não coincidem',
    'WEAK_NEW_PASSWORD': 'A nova senha deve ter pelo menos 8 caracteres e atender aos requisitos de segurança',
    'SAME_AS_CURRENT': 'A nova senha deve ser diferente da atual',
    'PASSWORD_UPDATED': 'Senha atualizada com sucesso',
    'DEFAULT': 'Erro ao alterar senha. Tente novamente'
  },

  // Mensagens de perfil
  PROFILE: {
    'UPDATE_FAILED': 'Erro ao atualizar perfil. Tente novamente',
    'UPLOAD_FAILED': 'Erro ao fazer upload da imagem. Tente novamente',
    'INVALID_FORMAT': 'Formato de imagem não suportado',
    'FILE_TOO_LARGE': 'Arquivo muito grande. Máximo 5MB',
    'DEFAULT': 'Erro ao processar perfil. Tente novamente'
  },

  // Mensagens de transações
  TRANSACTIONS: {
    'INVALID_AMOUNT': 'Valor inválido para a transação',
    'INSUFFICIENT_BALANCE': 'Saldo insuficiente para realizar a transação',
    'CONTACT_NOT_FOUND': 'Contato não encontrado',
    'INVALID_DATE': 'Data inválida para a transação',
    'TRANSACTION_NOT_FOUND': 'Transação não encontrada',
    'UPDATE_FAILED': 'Erro ao atualizar transação',
    'DELETE_FAILED': 'Erro ao excluir transação',
    'CREATE_FAILED': 'Erro ao criar transação',
    'DEFAULT': 'Erro ao processar transação. Tente novamente'
  },

  // Mensagens de contatos
  CONTACTS: {
    'CONTACT_NOT_FOUND': 'Contato não encontrado',
    'INVALID_PIX_KEY': 'Chave PIX inválida',
    'PIX_KEY_ALREADY_EXISTS': 'Esta chave PIX já está cadastrada',
    'INVALID_PHONE': 'Número de telefone inválido',
    'INVALID_EMAIL': 'E-mail inválido',
    'CREATE_FAILED': 'Erro ao criar contato',
    'UPDATE_FAILED': 'Erro ao atualizar contato',
    'DELETE_FAILED': 'Erro ao excluir contato',
    'SEARCH_FAILED': 'Erro ao buscar contatos',
    'DEFAULT': 'Erro ao processar contato. Tente novamente'
  },

  // Mensagens gerais
  GENERAL: {
    'NETWORK_ERROR': 'Erro de conexão. Verifique sua internet',
    'SERVER_ERROR': 'Erro interno do servidor. Tente novamente',
    'UNAUTHORIZED': 'Acesso não autorizado',
    'FORBIDDEN': 'Acesso negado',
    'NOT_FOUND': 'Recurso não encontrado',
    'VALIDATION_ERROR': 'Dados inválidos fornecidos',
    'TIMEOUT': 'Tempo limite excedido. Tente novamente',
    'DEFAULT': 'Ocorreu um erro inesperado. Tente novamente'
  },

  // Mensagens de carregamento da aplicação
  APP_LOAD: {
    'DATA_LOAD_FAILED': 'Erro ao carregar dados da aplicação',
    'USER_LOAD_FAILED': 'Erro ao carregar dados do usuário',
    'TRANSACTIONS_LOAD_FAILED': 'Erro ao carregar transações',
    'CONTACTS_LOAD_FAILED': 'Erro ao carregar contatos',
    'DEFAULT': 'Erro ao carregar dados da aplicação'
  }
};

// Função para obter mensagem de erro baseada no tipo e mensagem original
export function getErrorMessage(error, context = 'GENERAL') {
  if (!error) return ERROR_MESSAGES[context]?.DEFAULT || ERROR_MESSAGES.GENERAL.DEFAULT;

  const errorMessage = error.message || error.toString();
  
  // Verificar se é uma mensagem conhecida
  for (const [key, message] of Object.entries(ERROR_MESSAGES[context] || {})) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase()) || 
        errorMessage.toLowerCase().includes(message.toLowerCase())) {
      return message;
    }
  }

  // Verificar mensagens específicas por contexto
  switch (context) {
    case 'AUTHENTICATION':
      if (errorMessage.includes('senha')) return ERROR_MESSAGES.AUTHENTICATION.WEAK_PASSWORD;
      if (errorMessage.includes('email')) return ERROR_MESSAGES.AUTHENTICATION.INVALID_EMAIL;
      break;
    
    case 'PASSWORD':
      if (errorMessage.includes('não coincidem')) return ERROR_MESSAGES.PASSWORD.NEW_PASSWORDS_DONT_MATCH;
      if (errorMessage.includes('incorreta')) return ERROR_MESSAGES.PASSWORD.CURRENT_PASSWORD_INCORRECT;
      if (errorMessage.includes('8 caracteres')) return ERROR_MESSAGES.PASSWORD.WEAK_NEW_PASSWORD;
      if (errorMessage.includes('diferente da atual')) return ERROR_MESSAGES.PASSWORD.SAME_AS_CURRENT;
      if (errorMessage.includes('maiúscula')) return 'A senha deve conter pelo menos uma letra maiúscula';
      if (errorMessage.includes('minúscula')) return 'A senha deve conter pelo menos uma letra minúscula';
      if (errorMessage.includes('número')) return 'A senha deve conter pelo menos um número';
      if (errorMessage.includes('caractere especial')) return 'A senha deve conter pelo menos um caractere especial';
      break;
    
    case 'TRANSACTIONS':
      if (errorMessage.includes('valor')) return ERROR_MESSAGES.TRANSACTIONS.INVALID_AMOUNT;
      if (errorMessage.includes('saldo')) return ERROR_MESSAGES.TRANSACTIONS.INSUFFICIENT_BALANCE;
      break;
    
    case 'CONTACTS':
      if (errorMessage.includes('PIX')) return ERROR_MESSAGES.CONTACTS.INVALID_PIX_KEY;
      if (errorMessage.includes('telefone')) return ERROR_MESSAGES.CONTACTS.INVALID_PHONE;
      break;
  }

  // Retornar mensagem padrão do contexto ou geral
  return ERROR_MESSAGES[context]?.DEFAULT || ERROR_MESSAGES.GENERAL.DEFAULT;
}

// Função para obter mensagem de sucesso baseada no contexto
export function getSuccessMessage(context = 'GENERAL') {
  const SUCCESS_MESSAGES = {
    'AUTHENTICATION': 'Operação realizada com sucesso!',
    'PASSWORD': 'Senha alterada com sucesso!',
    'PROFILE': 'Perfil atualizado com sucesso!',
    'TRANSACTION': 'Transação processada com sucesso!',
    'TRANSACTION_UPDATE': 'Transação atualizada com sucesso!',
    'TRANSACTION_DELETE': 'Transação excluída com sucesso!',
    'CONTACT': 'Contato criado com sucesso!',
    'CONTACT_UPDATE': 'Contato atualizado com sucesso!',
    'CONTACT_DELETE': 'Contato excluído com sucesso!',
    'GENERAL': 'Operação realizada com sucesso!'
  };

  return SUCCESS_MESSAGES[context] || SUCCESS_MESSAGES.GENERAL;
}

// Função para formatar mensagens de validação
export function formatValidationError(field, message) {
  const fieldNames = {
    'name': 'Nome',
    'email': 'E-mail',
    'password': 'Senha',
    'confirmPassword': 'Confirmação de senha',
    'phone': 'Telefone',
    'amount': 'Valor',
    'date': 'Data',
    'description': 'Descrição',
    'pixKey': 'Chave PIX',
    'bankName': 'Nome do banco',
    'accountNumber': 'Número da conta'
  };

  const fieldName = fieldNames[field] || field;
  return `${fieldName}: ${message}`;
}
