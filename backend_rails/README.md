# README for Rails Backend

# AdvocaciaHub - Backend Rails com Active Admin

Este é o backend Rails para o sistema AdvocaciaHub, com Active Admin para administração e API JSON para o frontend React.

## Setup

1. Instale as dependências:
```bash
bundle install
```

2. Configure o banco de dados em `config/database.yml`

3. Execute as migrações:
```bash
rails db:create
rails db:migrate
```

4. Inicie o servidor:
```bash
rails server
```

## Estrutura

- `/admin` - Interface administrativa com Active Admin
- `/api/v1/lawyers` - API para advogados
- `/api/v1/offices` - API para escritórios
- `/api/v1/specialties` - API para especialidades

## Modelos

- Lawyer: Informações dos advogados
- Office: Informações dos escritórios de advocacia
- Specialty: Especialidades jurídicas
- Review: Avaliações dos clientes

## Endpoints da API

### GET /api/v1/lawyers
Lista advogados com opções de filtro:
- `city`: Filtra por cidade
- `state`: Filtra por estado
- `specialty`: Filtra por especialidade
- `min_rating`: Filtra por rating mínimo
- `search`: Busca por nome
- `page`, `limit`: Paginação

### GET /api/v1/lawyers/:id
Detalhes de um advogado específico

### GET /api/v1/offices
Lista escritórios de advocacia

### GET /api/v1/offices/:id
Detalhes de um escritório específico com seus advogados