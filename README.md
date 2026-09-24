# Descubra o Brasil

Portal e aplicativo web responsivo para planejar viagens pelo Brasil. A experiência inclui 87 atrações, favoritos, roteiros exportáveis, jogos com progresso local, notícias do Ministério do Turismo e uma área de empresas com propostas sujeitas a aprovação.

## Executar

```bash
npm install
npm run dev
```

O site abre em `http://localhost:3000`. O aplicativo também pode ser instalado no celular como PWA.

## Verificar

```bash
npm test
npm run build
```

## Cadastro e ofertas

O aplicativo funciona como visitante sem serviço externo. Para ativar login por e-mail, Google, sincronização e publicação de ofertas, siga [`docs/ATIVAR-CADASTRO-E-OFERTAS.md`](docs/ATIVAR-CADASTRO-E-OFERTAS.md). O banco começa vazio: nenhuma empresa ou oferta é apresentada como parceira sem cadastro e aprovação.

## Notícias

`npm run update:news` atualiza o arquivo público usando apenas chamadas oficiais do Ministério do Turismo. O workflow diário abre um commit quando existem mudanças.
