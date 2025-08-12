// Utilitários para validação robusta de senhas
export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SPECIAL_CHARS: true,
  MIN_SPECIAL_CHARS: 1,
  MIN_NUMBERS: 1
};

// Verifica se a senha atende aos requisitos mínimos
export function validatePasswordStrength(password) {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      score: 0,
      errors: ['Senha inválida'],
      suggestions: []
    };
  }

  const errors = [];
  const suggestions = [];
  let score = 0;

  // Verificar comprimento
  if (password.length < PASSWORD_REQUIREMENTS.MIN_LENGTH) {
    errors.push(`A senha deve ter pelo menos ${PASSWORD_REQUIREMENTS.MIN_LENGTH} caracteres`);
    score -= 2;
  } else if (password.length >= PASSWORD_REQUIREMENTS.MIN_LENGTH) {
    score += 1;
  }

  if (password.length > PASSWORD_REQUIREMENTS.MAX_LENGTH) {
    errors.push(`A senha deve ter no máximo ${PASSWORD_REQUIREMENTS.MAX_LENGTH} caracteres`);
    score -= 1;
  }

  // Verificar maiúsculas
  if (PASSWORD_REQUIREMENTS.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula');
    score -= 1;
  } else if (/[A-Z]/.test(password)) {
    score += 1;
  }

  // Verificar minúsculas
  if (PASSWORD_REQUIREMENTS.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra minúscula');
    score -= 1;
  } else if (/[a-z]/.test(password)) {
    score += 1;
  }

  // Verificar números
  if (PASSWORD_REQUIREMENTS.REQUIRE_NUMBERS && !/\d/.test(password)) {
    errors.push('A senha deve conter pelo menos um número');
    score -= 1;
  } else if (/\d/.test(password)) {
    score += 1;
  }

  // Verificar caracteres especiais
  if (PASSWORD_REQUIREMENTS.REQUIRE_SPECIAL_CHARS && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('A senha deve conter pelo menos um caractere especial (!@#$%^&*()_+-=[]{}|;:,.<>?)');
    score -= 1;
  } else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 1;
  }

  // Verificar sequências comuns (fraquezas)
  const commonPatterns = [
    '123', 'abc', 'qwe', 'asd', 'zxc', 'password', 'senha', 'admin', 'user',
    '123456', 'abcdef', 'qwerty', 'asdfgh', 'zxcvbn'
  ];

  const lowerPassword = password.toLowerCase();
  for (const pattern of commonPatterns) {
    if (lowerPassword.includes(pattern)) {
      suggestions.push('Evite sequências comuns de teclado');
      score -= 1;
      break;
    }
  }

  // Verificar repetições
  if (/(.)\1{2,}/.test(password)) {
    suggestions.push('Evite caracteres repetidos consecutivos');
    score -= 1;
  }

  // Verificar apenas números
  if (/^\d+$/.test(password)) {
    suggestions.push('Use uma combinação de letras, números e caracteres especiais');
    score -= 2;
  }

  // Verificar apenas letras
  if (/^[a-zA-Z]+$/.test(password)) {
    suggestions.push('Adicione números e caracteres especiais para maior segurança');
    score -= 1;
  }

  // Calcular score baseado no comprimento
  if (password.length >= 12) score += 2;
  else if (password.length >= 10) score += 1;

  // Determinar força da senha
  let strength = 'fraca';
  if (score >= 4) strength = 'forte';
  else if (score >= 2) strength = 'média';
  else if (score >= 0) strength = 'fraca';

  // Adicionar sugestões baseadas no score
  if (score < 2) {
    suggestions.push('Considere usar uma senha mais complexa');
  }

  if (password.length < 12) {
    suggestions.push('Senhas mais longas são mais seguras');
  }

  return {
    isValid: errors.length === 0,
    score,
    strength,
    errors,
    suggestions,
    requirements: {
      length: password.length >= PASSWORD_REQUIREMENTS.MIN_LENGTH,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      specialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    }
  };
}

// Verifica se duas senhas coincidem
export function validatePasswordMatch(password, confirmPassword) {
  if (!password || !confirmPassword) {
    return {
      isValid: false,
      error: 'Ambas as senhas são obrigatórias'
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'As senhas não coincidem'
    };
  }

  return {
    isValid: true,
    error: null
  };
}

// Verifica se a nova senha é diferente da atual
export function validatePasswordChange(currentPassword, newPassword) {
  if (!currentPassword || !newPassword) {
    return {
      isValid: false,
      error: 'Ambas as senhas são obrigatórias'
    };
  }

  if (currentPassword === newPassword) {
    return {
      isValid: false,
      error: 'A nova senha deve ser diferente da senha atual'
    };
  }

  return {
    isValid: true,
    error: null
  };
}

// Validação completa para alteração de senha
export function validatePasswordChangeComplete(currentPassword, newPassword, confirmPassword) {
  const strengthValidation = validatePasswordStrength(newPassword);
  const matchValidation = validatePasswordMatch(newPassword, confirmPassword);
  const changeValidation = validatePasswordChange(currentPassword, newPassword);

  // Priorizar erros de coincidência sobre erros de força
  if (!matchValidation.isValid) {
    return {
      isValid: false,
      strength: strengthValidation,
      match: matchValidation,
      change: changeValidation,
      errors: [matchValidation.error],
      suggestions: strengthValidation.suggestions
    };
  }

  // Se as senhas coincidem, verificar força e mudança
  const allValidations = [strengthValidation, changeValidation];
  const isValid = allValidations.every(v => v.isValid);

  const errors = [
    ...strengthValidation.errors,
    ...(changeValidation.error ? [changeValidation.error] : [])
  ];

  return {
    isValid,
    strength: strengthValidation,
    match: matchValidation,
    change: changeValidation,
    errors,
    suggestions: strengthValidation.suggestions
  };
}

// Gera sugestões de senhas seguras
export function generatePasswordSuggestions() {
  const suggestions = [
    'Use uma frase memorável com números e símbolos (ex: MinhaCasa@2024!)',
    'Combine palavras não relacionadas com números (ex: GatoAzul#7)',
    'Use a primeira letra de cada palavra de uma frase (ex: HojeVou@Estudar2024!)',
    'Substitua letras por números similares (ex: P@ssw0rd)',
    'Use um padrão de teclado com variações (ex: Qw3rty!@#)'
  ];

  return suggestions;
}
