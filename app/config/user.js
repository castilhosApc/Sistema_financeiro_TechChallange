// Configuração centralizada do usuário
export const userConfig = {
  name: "João Silva",
  email: "joao.silva@email.com",
  avatar: "👤", // Emoji como avatar temporário
  role: "Usuário",
  preferences: {
    currency: "BRL",
    language: "pt-BR",
    theme: "dark"
  }
};

// Função para obter dados do usuário
export const getUserData = () => {
  return userConfig;
};

// Função para atualizar dados do usuário
export const updateUserData = (newData) => {
  Object.assign(userConfig, newData);
  return userConfig;
};

// Função para obter apenas o nome do usuário
export const getUserName = () => {
  return userConfig.name;
};

// Função para obter apenas o email do usuário
export const getUserEmail = () => {
  return userConfig.email;
}; 