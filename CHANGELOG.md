# Change Log (Atualizações) - COUP Admin

Todas as atualizações e mudanças notáveis deste projeto serão documentadas aqui. Veja [Conventional Commits](https://conventionalcommits.org) para o guia das commits.

---

## 1.4.0 (??-11-2024)

### Feature

-   **Validação do Config:** implementação de uma validação robusta na página de configuração antes da partida.
-   **Validação de Jogadores:** quando não há jogadores, o usuário será redirecionado para a home.
-   **Registro da Ação 'Passar':** se o jogador usa um efeito de carta que não implica na vida ou no dinheiro, agora aparece no histórico como 'jogador usou uma carta'.

### Refactor

-   **Contagem Turno / Rodada:** refatoração na contagem de Turno / Rodada que não contava corretamente ao decorrer da partida quando jogadores morriam.
-   **Card dos Jogadores:** refatoração completa do visual dos cards dos jogadores, seus comportamentos e animações.
-   **Ação do Jogador:** refatoração do sistema de ação do jogador, identificação do jogador atual na tela de ação, novas opções mais complexas (ação 'Afetar' acontece em cadeia, com várias movimentações simultâneas) e melhor retorno de mensagens para o histórico.

### Fix

-   **Dependências:** remoção e correção de dependências não necessárias e deprecated.
-   **Botões dos Alert:** minimo de altura e tamanho dos botões escolhido por padrão, a fim de melhor acessibilidade.
-   **Icones:** correção de icones dependente https para interno offline.
-   **Componentes Ionic:** IonicModal não estava passando para o build, remoção do mesmo e implementação individual dos respectivos imports.
-   **Modal e Alert Controller:** após a correção anterior, um conflito de implementação apareceu no programa, foi convertido o import de '@ionic/angular' para '@ionic/angular/standalone'.
-   **Reinicio da partida:** correção do reinicio da partida no final e nas opções, não resetava todos os dados corretamente.

<br>

## 1.3.0 (14-10-2024) - 1º na Google Play Store

### Feature

-   **Opções:** implementado a tela de opções da partida enquanto no meio do jogo.
-   **Fim da Partida:** implementado do aviso de finalização da partida e seu respectivo vencedor.

### Refactor

-   **Framework:** atualização completa do framework para Ionic 8 e suas dependências.
-   **Transição das Páginas:** refatoração para o bom funcionamento das transições das páginas.
-   **Interface:** correções de interface e disposição das páginas, para uma estética agradável e padronizada.

### Fix

-   **Funções e Elementos:** revisão de várias funções e itens com um funcionamento mediano, a fim de melhor resposta e estabilidade.

<br>

## 1.2.0 (13-05-2024)

### Refactor

-   **Design App:** remodelação de alguns elementos e melhoria das imagens do aplicativo.

### Fix

-   **Inicio da Partida:** erro de lógica não deixava iniciar a partida corretamente.
-   **Otimização:** correções na lógica de funções e observáveis, que estavam deixando o aplicativo lento e pesado.
