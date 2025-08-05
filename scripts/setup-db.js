const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando banco de dados local...');

// Verificar se o arquivo .env existe
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Criando arquivo .env...');
  fs.writeFileSync(envPath, 'DATABASE_URL="file:./dev.db"\n');
  console.log('✅ Arquivo .env criado');
}

try {
  // Gerar cliente Prisma
  console.log('🔧 Gerando cliente Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Cliente Prisma gerado');

  // Executar migrações
  console.log('🗄️ Executando migrações...');
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  console.log('✅ Migrações executadas');

  // Executar seed
  console.log('🌱 Executando seed...');
  execSync('npx prisma db seed', { stdio: 'inherit' });
  console.log('✅ Seed executado');

  console.log('🎉 Banco de dados configurado com sucesso!');
  console.log('💡 Execute "npm run dev" para iniciar o servidor');
} catch (error) {
  console.error('❌ Erro ao configurar banco de dados:', error.message);
  process.exit(1);
} 