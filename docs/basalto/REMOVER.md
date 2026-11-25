# Como remover a maquete da Basalto

A maquete é temporária. Está publicada em `xickoh.com/basalto/` e não é referenciada por mais nada no site (a raiz e o `/cv/` não ligam a ela).

1. Apagar os ficheiros:

   ```bash
   cd /home/deck/Documents/xickoh
   git rm -r public/basalto docs/basalto
   ```

2. Fazer commit e push (o push publica):

   ```bash
   git commit -m "chore: remove a maquete da Basalto"
   git push origin HEAD
   ```

3. Confirmar que `https://xickoh.com/basalto/` já não mostra a maquete. Como o site tem fallback para a página inicial, deixa de dar erro e passa a mostrar a timeline; é o esperado.

Nota: ao apagar `docs/basalto` perdem-se também o README e as capturas da maquete. Se as quiseres guardar, copia-as antes para fora do repositório.

Registo: a maquete foi acrescentada no commit `ce8f55b` (2026-11-25). Na vault há uma linha sobre ela em `raw/03-projetos.md` (secção «basalto-redesign»), a atualizar quando for removida.
