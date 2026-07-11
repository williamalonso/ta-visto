# Especificação de Design System e UI --- Complemento ao SPECS

> Este documento complementa exclusivamente a especificação visual do
> aplicativo. As regras abaixo possuem prioridade para implementação da
> interface e devem ser seguidas de forma consistente.

# Filosofia

-   Interface minimalista.
-   Poucos elementos competindo pela atenção.
-   Conteúdo é o foco principal.
-   Hierarquia visual baseada em tamanho, peso tipográfico e
    espaçamento.
-   Evitar bordas pesadas.

# Tokens

## Cores

Cor primária - #F59E0B

Primária clara - #FEF3C7

Texto principal - #0F172A

Texto secundário - #64748B

Texto auxiliar - #94A3B8

Background - #F5F7FA

Surface - #FFFFFF

Border - #E5E7EB

Sucesso - #22C55E

Finalizado - #6366F1

Assistindo - #22C55E

Planejado - #F59E0B

Pausado - #F97316

Erro - #EF4444

## Border radius

xs = 6 sm = 8 md = 12 lg = 16 xl = 20 pill = 999

## Espaçamento (8pt)

4 8 12 16 20 24 32 40

Nunca utilizar valores arbitrários.

## Tipografia

H1 32 / Bold

H2 24 / Bold

Título seção 18 / SemiBold

Título card 15 / SemiBold

Texto padrão 14 / Regular

Texto auxiliar 12 / Regular

Número estatística 36 / Bold

## Sombras

Muito discretas.

Offset Y = 2\~4

Blur baixo.

Sem sombras escuras.

# Grid

Padding horizontal: 20

Espaçamento vertical: 20

Gap entre cards: 12

SafeArea obrigatória.

# Componentes

## Bottom Tab

Altura aproximada: 72

Ícones centralizados.

Item ativo: - fundo arredondado - cor primária - animação suave

Item inativo: - ícone cinza

## Chips

Altura: 30

Padding: 12 horizontal

Radius: pill

Ativo: - fundo laranja - texto branco

Inativo: - branco - borda cinza clara

## Card padrão

Radius 16.

Padding 16.

Background branco.

Sombra discreta.

## Poster

Proporção fixa 2:3.

Radius 10.

Imagem ocupa todo o card.

Placeholder enquanto carrega.

# Dashboard

## Header

Logo.

Saudação.

Avatar.

Espaçamento inferior de 24.

## Estatísticas

Grid 2x2.

Cada card: - altura \~84 - número grande - legenda - barra inferior
colorida

## Recentes

Scroll horizontal.

Poster 72x108 aproximadamente.

Nome máximo 2 linhas.

Ano em fonte auxiliar.

## Continue Assistindo

Lista vertical.

Poster à esquerda.

Informações ao centro.

Botão Play circular à direita.

Barra de progresso logo abaixo do episódio.

# Busca

Campo sempre no topo.

Radius 16.

Ícone de busca.

Debounce visual com Skeleton.

Filtros abaixo do campo.

Resultados em grid 2 colunas.

Ao tocar em um item: - abrir detalhes - permitir adicionar - selecionar
status antes de salvar

# Filmes e Séries

Mesmo layout.

Header: - título - contador total

Filtros por status.

Grid 3 colunas.

Cada card:

Poster.

Indicador circular de status.

Título.

Status.

Press: abre detalhes.

Long press: menu contextual.

# Configurações

Seções separadas por título.

Cada ação utiliza card clicável.

Estrutura:

ícone

título

descrição

seta

Importação deve exibir confirmação destrutiva.

# Animações

Troca de abas suave.

Skeleton com fade.

Press scale leve (0.97).

Sem animações exageradas.

# Acessibilidade

Área mínima de toque 44x44.

Contraste AA.

Suporte a Dynamic Type quando possível.

# Regras obrigatórias para IA

-   Criar componentes reutilizáveis antes das telas.
-   Nenhuma medida hardcoded fora dos tokens.
-   Reutilizar o mesmo componente de Card.
-   Reutilizar Chip em todas as telas.
-   Centralizar constantes visuais em um arquivo `theme.ts`.
-   Centralizar cores, radius, spacing e typography.
-   Nenhum estilo duplicado entre telas.
-   Toda lista deve suportar estado vazio, loading e erro.
