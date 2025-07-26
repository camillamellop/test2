-- Script para configurar o banco de dados Conexão UNK
-- Execute este script após criar o banco de dados

-- Criar usuário de teste
INSERT INTO users (email, name, password, "createdAt", "updatedAt") 
VALUES ('teste@email.com', 'Usuário Teste', 'hashed_password_here', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Inserir projetos de exemplo
INSERT INTO projects (title, description, category, status, progress, "userId", "createdAt", "updatedAt")
VALUES 
  ('Desenvolvimento de Branding', 'Criar identidade visual completa para carreira musical', 'branding', 'active', 75, 1, NOW(), NOW()),
  ('Mixagem do Álbum', 'Finalizar mixagem das 12 faixas do álbum', 'dj-music', 'active', 60, 1, NOW(), NOW()),
  ('Gestão de Redes Sociais', 'Criar conteúdo para Instagram e TikTok', 'instagram', 'active', 30, 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Inserir tarefas de exemplo
INSERT INTO tasks (title, description, completed, priority, "projectId", "createdAt", "updatedAt")
VALUES 
  ('Criar logo', 'Design do logo principal', true, 'high', 1, NOW(), NOW()),
  ('Definir paleta de cores', 'Escolher cores da marca', false, 'medium', 1, NOW(), NOW()),
  ('Mixar faixa 1', 'Finalizar mixagem da primeira faixa', true, 'high', 2, NOW(), NOW()),
  ('Criar post semanal', 'Conteúdo para Instagram', false, 'medium', 3, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Inserir documentos de exemplo
INSERT INTO documents (title, description, "fileName", "fileUrl", "fileType", "fileSize", category, "userId", "createdAt", "updatedAt")
VALUES 
  ('Contrato de Show - Festa de Aniversário', 'Contrato para show de aniversário em 15/12/2024', 'contrato-show-aniversario.pdf', '/documents/contrato-show-aniversario.pdf', 'pdf', 245760, 'contract', 1, NOW(), NOW()),
  ('Proposta Comercial - Evento Corporativo', 'Proposta para evento corporativo de fim de ano', 'proposta-evento-corporativo.docx', '/documents/proposta-evento-corporativo.docx', 'docx', 512000, 'proposal', 1, NOW(), NOW()),
  ('Fatura - Equipamentos de Som', 'Fatura dos equipamentos adquiridos em outubro', 'fatura-equipamentos.pdf', '/documents/fatura-equipamentos.pdf', 'pdf', 102400, 'invoice', 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Inserir transações financeiras de exemplo
INSERT INTO transactions (type, amount, description, category, date, "userId", "createdAt", "updatedAt")
VALUES 
  ('income', 1500.00, 'Show de aniversário', 'shows', '2024-10-15', 1, NOW(), NOW()),
  ('expense', 250.00, 'Equipamentos de som', 'equipment', '2024-10-10', 1, NOW(), NOW()),
  ('income', 800.00, 'DJ em festa corporativa', 'shows', '2024-10-20', 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Inserir notas de exemplo
INSERT INTO notes (title, content, type, pinned, date, "userId", "createdAt", "updatedAt")
VALUES 
  ('Ideia para próxima música', 'Explorar ritmos africanos com elementos eletrônicos', 'idea', true, NOW(), 1, NOW(), NOW()),
  ('Lembrete importante', 'Finalizar mixagem do álbum até sexta-feira', 'reminder', true, NOW(), 1, NOW(), NOW()),
  ('Inspiração para branding', 'Usar elementos da cultura brasileira no design', 'idea', false, NOW(), 1, NOW(), NOW())
ON CONFLICT DO NOTHING; 