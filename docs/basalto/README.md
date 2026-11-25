# Basalto · proposta de redesign

Maquete da página inicial de <https://www.basalto.net/> (loja de aquariofilia de água doce, em Jumpseller) com um desenho moderno e acessível. **Não é o site oficial**: os textos, preços e contactos foram copiados do site em 2026-11-25 e as ligações dos produtos não levam a lado nenhum.

## Ver

Abrir `index.html` no browser (não precisa de servidor nem de instalar nada).

- `index.html`: a página
- `css/styles.css`: estilos e tokens de cor (tema claro e escuro)
- `js/main.js`: menu, tema, carrinho de demonstração e validação do formulário
- `capturas/`: capturas em desktop, telemóvel e tema escuro

## O que muda em relação ao site atual

| Site atual | Proposta |
|---|---|
| Banners só de imagem, sem texto alternativo | Slideshow com os mesmos banners e o texto de cada um repetido numa legenda |
| Mega-menu de 4 níveis, duplicado no HTML (desktop + telemóvel) | Um só menu, com um painel «Produtos» de 6 grupos, aberto por clique ou teclado |
| Pesquisa pouco visível | Pesquisa no centro do cabeçalho |
| Ícones sociais e WhatsApp sem nome acessível | Ligações com texto |
| «Produtos em Destaque» sem título a sério | Hierarquia de títulos h1 > h2 > h3 |
| Valores e serviços escondidos em páginas internas | Resumo dos valores (cativeiro, quarentena) e dos serviços com preços na home |
| BioInfo como lista solta de 13 artigos | Percurso «Passo 1 a 4» para principiantes |
| Preços com formatos diferentes (4.50 / 29,90) | Sempre `0,00 €` |
| Dois e-mails e dois URLs do Facebook | Um e-mail e um URL de cada rede |

## Acessibilidade (WCAG 2.2 AA como alvo)

- Ligação «Saltar para o conteúdo», regiões (`header`, `nav`, `main`, `footer`) e `lang="pt-PT"`.
- Contraste de texto ≥ 4,5:1 nos dois temas; foco sempre visível (contorno de 3 px).
- Alvos de toque com pelo menos 44 px.
- Tudo funciona com teclado: o menu abre com Enter/Espaço e fecha com Esc, sem depender do hover.
- Slideshow segundo o padrão «carousel» da WAI-ARIA: botão de pausa, anterior/seguinte e pontos com nome; pára com o rato ou o foco de teclado em cima; com «reduzir movimento» não passa sozinho; diapositivos escondidos ficam `inert`. `prefers-reduced-motion` desliga as transições.
- Preços com desconto lidos como «preço com desconto / preço anterior»; o desconto não depende só da cor.
- Formulário com `label` em todos os campos, erros em texto ligados ao campo e foco no primeiro erro.
- Mensagens do carrinho e do formulário anunciadas por `role="status"`.
- Tamanhos em `rem`: o zoom do texto a 200% não parte a página. Suporta o modo de alto contraste do Windows.

## Cores

O verde é o da Basalto (`#bfe73c`, a barra do topo do site original), com o claro `#e8f8c4` e o escuro `#18231f`. Em fundo claro, o verde puro não tem contraste para texto; aí usa-se o mesmo tom escurecido (`#4a6600`), e o `#bfe73c` fica para botões e etiquetas com texto preto.

## Limites

- Os banners do slideshow são cópias dos do site original (`public/basalto/img/`). As fotografias das categorias vêm diretamente do servidor do site original; se falharem, aparece um ícone. As dos produtos são ícones de substituição.
- Só a página inicial está desenhada. Num site Jumpseller, isto teria de ser passado para um tema (Liquid).
- O contraste foi escolhido por cálculo e a página foi vista em capturas; falta um teste com leitor de ecrã e com uma ferramenta como o axe.
