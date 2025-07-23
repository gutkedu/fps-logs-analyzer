## O Problema

Imagine-se analisando o log de um jogo de tiro em primeira pessoa para extrair métricas e rankings. Seu desafio é processar esses logs, identificar eventos-chave e gerar relatórios detalhados sobre o desempenho dos jogadores e das partidas.

### Exemplo de Log

```
23/04/2019 15:34:22 - New match 11348965 has started
23/04/2019 15:36:04 - Roman killed Nick using M16
23/04/2019 15:36:33 - <WORLD> killed Nick by DROWN
23/04/2019 15:39:22 - Match 11348965 has ended
23/04/2021 16:14:22 - New match 11348966 has started
23/04/2021 16:26:04 - Roman killed Marcus using M16
23/04/2021 16:36:33 - <WORLD> killed Marcus by DROWN
23/04/2021 16:49:22 - Match 11348966 has ended
24/04/2020 16:14:22 - New match 11348961 has started
24/04/2020 16:26:12 - Roman killed Marcus using M16
24/04/2020 16:35:56 - Marcus killed Jhon using AK47
24/04/2020 17:12:34 - Roman killed Bryian using M16
24/04/2020 18:26:14 - Bryan killed Marcus using AK47
24/04/2020 19:36:33 - <WORLD> killed Marcus by DROWN
24/04/2020 20:19:22 - Match 11348961 has ended
```

## Requisitos Essenciais

Seu código deve atender aos seguintes pontos:

### Ranking por Partida
- Gerar um ranking detalhado para cada partida, incluindo a quantidade de frags (abates de outros jogadores) e mortes para cada participante
- **Observação importante:** Frags realizados pelo `<WORLD>` devem ser desconsiderados
- Uma partida pode ter múltiplos jogadores, limitado a **20 jogadores por partida**

### Processamento de Múltiplos Logs
- Seu sistema deve ser capaz de receber logs de múltiplas rodadas em um único arquivo de entrada

### Persistência de Dados
- Utilizar **Node.js** com **NestJS** para criar um serviço que permita:
  - Upload do arquivo de log
  - Persistência dos dados das partidas (ex: em um banco de dados relacional)
  - Criação das APIs necessárias para exibir os rankings e estatísticas

## Bônus (Desafios Adicionais para se Destacar)

Se você se identifica com o problema ou deseja ir além, considere implementar os seguintes bônus. Eles demonstram sua criatividade e a profundidade de seu conhecimento em engenharia de software:

### Arma Preferida do Vencedor
- Identificar qual arma foi a mais utilizada pelo jogador que venceu a partida (o jogador com mais frags)

### Maior Sequência de Frags (Streak)
- Descobrir a maior sequência de frags efetuados por um jogador sem morrer, dentro da mesma partida

### Awards Específicos
- **NoDeathAward:** Os jogadores que venceram uma partida sem morrerem devem receber este prêmio
- **SpeedKillerAward:** Jogadores que realizarem 5 frags em 1 minuto devem receber este prêmio

### Ranking Global de Jogadores
- Criar um ranking consolidado com as estatísticas de todos os jogadores, considerando todas as partidas processadas

### Friendly Fire
- Implementar a lógica para penalizar "friendly fire" (quando um jogador mata um aliado do mesmo time)
- Subtrair -1 do score de frags do atirador
- Para este bônus, você pode definir como o sistema identificaria os times (ex: via configuração, ou inferência se os logs pudessem conter essa informação)

## Expectativas da Solução

Queremos ver como você pensa e constrói software!

### Criatividade
- Sinta-se à vontade para explorar soluções inovadoras

### Orientação a Objetos e Engenharia de Software
- Explore ao máximo os conceitos de Orientação a Objetos, SOLID, Use Cases, Services, Interactors, etc.
- Demonstre seu conhecimento em design de sistemas

### Test-Driven Development (TDD)
- Priorize a criação de testes unitários
- Tente aplicar TDD para guiar seu desenvolvimento

### Commits Atômicos e Progressivos
- Mantenha um histórico de commits claro e conciso
- Cada commit deve representar uma unidade lógica de trabalho

### Documentação
- Utilize o arquivo README.md do seu repositório para adicionar quaisquer comentários, observações ou decisões de design que julgar importantes sobre o projeto

## Ferramentas Requeridas

- **Node.js**
- **NestJS**
- **Sistema de persistência de dados** (ex: PostgreSQL, SQLite)