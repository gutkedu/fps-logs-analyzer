
# FPS Logs Analyzer

Este projeto analisa logs de partidas de jogos FPS e gera estatísticas detalhadas de jogadores e partidas, utilizando Node.js e NestJS.

## Requisitos

Para mais detalhes sobre os requisitos e funcionalidades, veja o arquivo `docs/specs.MD`.

### Principais Rotas 📡

- `GET /ranking` — Retorna o ranking global de jogadores. 
- `GET /:externalId/ranking` — Retorna o ranking de uma partida específica. 
- `POST /upload` — Realiza o upload de um arquivo de log para processamento. 
- `GET /health` — Endpoint de verificação de saúde da aplicação. 

Na pasta ```docs/postman``` você encontra uma coleção do Postman com exemplos de requisições para testar a API. 📨

### 🛠️ Tecnologias Utilizadas 
- Node.js
- NestJS
- Prisma ORM 
- EventEmitter para eventos assíncronos
- Multer para upload de arquivos
- Zod 
- Vitest para testes unitários

### 🏗️ Como Executar 

obs: Certifique-se de ter o Docker e o Docker Compose instalados.

```bash
docker-compose up -d
```


O projeto por padrão configurado no docker-compose irá rodar no endereço 🌐 `http://localhost:3000`. 

## 🗄️ Entidades do Banco de Dados

O sistema utiliza as seguintes entidades principais para persistência dos dados:

- **Player**: Representa um jogador, armazenando nome e identificador único.
- **Match**: Representa uma partida, com identificador externo, data de início e fim.
- **MatchParticipation**: Relaciona um jogador a uma partida, armazenando frags, mortes, streaks, prêmios e estatísticas individuais.
- **Frag**: Representa uma eliminação (frag) ocorrida na partida, incluindo quem matou, quem foi morto, arma utilizada e timestamp.

Essas entidades estão modeladas no arquivo `prisma/schema.prisma` e são utilizadas para gerar as tabelas do banco de dados via Prisma ORM.

O relacionamento entre elas permite calcular rankings, estatísticas globais e por partida, além de rastrear streaks e prêmios especiais.

### ⚡ Decisão de Design: Processamento Assíncrono com Eventos 

O processamento dos arquivos de log é realizado de forma assíncrona utilizando o padrão de eventos (EventEmitter). Essa abordagem traz os seguintes benefícios:

- **Desacoplamento**: O upload do arquivo e o processamento dos dados são separados, permitindo que a API responda rapidamente ao usuário e processe os dados em segundo plano. 
- **Escalabilidade**: O uso de eventos facilita a extensão do sistema para múltiplos tipos de processamento ou integrações futuras (ex: notificações, persistência em diferentes bancos, etc). 
- **Manutenção**: O fluxo de eventos torna o código mais modular, facilitando testes e manutenção. 

#### 🔀 Fluxo de Processamento 
1. O usuário faz upload do arquivo de log via endpoint (`POST /upload`).  
   **Arquivo:** `src/infra/http/controllers/logs.controller.ts`
2. O serviço de upload dispara um evento interno indicando que um novo arquivo está disponível para processamento.  
   **Arquivo:** `src/infra/events/event.service.ts`
3. O worker de processamento escuta esse evento, lê o arquivo, interpreta os eventos do log e atualiza as entidades (jogadores, partidas, participações, frags) no banco de dados.  
   **Arquivo:** `src/infra/workers/log-worker.service.ts` e `src/app/use-cases/process-match.use-case.ts`
4. O processamento é realizado de forma assíncrona, sem bloquear a resposta ao usuário.  
   **Arquivos envolvidos:** Todos acima, integrados via EventEmitter.
5. Após o processamento, os dados ficam disponíveis para consulta via API.  
   **Arquivo:** `src/infra/http/controllers/global-player-ranking.controller.ts`, `src/infra/http/controllers/match-ranking.controller.ts`

Esse padrão garante que o sistema seja responsivo e preparado para lidar com grandes volumes de dados ou múltiplos uploads simultâneos.


## 🛠️ Testes

Para executar os testes, utilize o comando:

```bash
npm run test:unit
```

O projeto utiliza o Vitest como framework de testes, com cobertura de testes configurada.

Para os testes unitários, foram criados mocks de repositórios com implementações InMemory para simular o comportamento do banco de dados. Isso permite testar a lógica de negócios sem depender de uma instância real do banco de dados. Esses arquivos estão localizados na pasta `test/repositories`.