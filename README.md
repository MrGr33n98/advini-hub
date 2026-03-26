# README.md
# AdvocaciaHub - Plataforma de Conexão entre Advogados e Clientes

## Visão Geral

O AdvocaciaHub é uma plataforma completa que conecta clientes a advogados qualificados, oferecendo uma experiência integrada de busca, agendamento, pagamento e comunicação jurídica.

## Arquitetura

O projeto utiliza uma arquitetura de microsserviços com:

- **Frontend**: React com TypeScript e Shadcn UI
- **Backend**: Ruby on Rails com Active Admin
- **Banco de Dados**: PostgreSQL
- **Cache**: Redis
- **Filas de Trabalho**: Sidekiq
- **Sistema de Arquivos**: Amazon S3 (simulado)

## Funcionalidades

### Frontend
- Busca e filtragem de advogados
- Sistema de agendamento de consultas
- Pagamento integrado
- Videoconferência
- Gestão de documentos
- Avaliações e feedback
- Assistente jurídico AI

### Backend
- API RESTful para todas as operações
- Painel administrativo completo
- Sistema de autenticação JWT
- Integração com serviços de pagamento
- Sistema de notificações
- Processamento em background

## CI/CD Pipeline

O projeto inclui uma pipeline completa de CI/CD com:

- Testes automatizados (unitários, integração, E2E)
- Build e empacotamento
- Varredura de segurança
- Deploy automatizado
- Monitoramento de saúde

## Configuração de Desenvolvimento

### Pré-requisitos

- Node.js 18+
- Ruby 3.0+
- PostgreSQL 13+
- Redis
- Docker (opcional)

### Setup

Execute o script de setup:

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Execução Local

Para rodar o projeto localmente:

```bash
npm run dev
```

### Docker

Para executar com Docker:

```bash
npm run docker:build
npm run docker:up
```

## Estrutura do Projeto

```
advocacia-hub/                 # Frontend React
backend_rails/                # Backend Rails
  ├── app/
  ├── config/
  ├── db/
  ├── lib/
  └── spec/
scripts/                      # Scripts de automação
.github/workflows/            # Pipelines CI/CD
```

## Testes

Executar todos os testes:

```bash
npm run test
```

Executar testes específicos:

```bash
# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration
```

## Deploy

O deploy é automatizado via GitHub Actions para o ambiente de produção. Para fazer deploy manual:

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## Contribuição

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob os termos da licença MIT.