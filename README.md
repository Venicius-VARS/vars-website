# VARS — site institucional

Site estático bilíngue EN/PT, sem instalação ou compilação. Abra index.html para visualizar. O botão de idioma atualiza o conteúdo e o idioma do documento, preservando a preferência no navegador. Sem JavaScript, o conteúdo inicial em inglês e o contato continuam disponíveis.

## Publicação no GitHub Pages

1. Envie TODO o conteúdo desta pasta para a raiz do repositório Venicius-VARS/vars-website, incluindo assets, CNAME e .nojekyll. Não envie apenas o ZIP.
2. Em Settings → Pages → Build and deployment, selecione Deploy from a branch → main → / (root) → Save.
3. O repositório está privado na preparação desta entrega. GitHub Free exige repositório público para Pages; planos compatíveis permitem publicar a partir de repositório privado. Não é necessário contratar hospedagem adicional se optar por repositório público. Confirme a visibilidade e as opções da conta.
4. Verifique o domínio na conta GitHub (Settings → Pages → Add a domain), seguindo o registro TXT individual fornecido pelo GitHub. Preserve os demais TXT.
5. Em Settings → Pages do repositório, configure Custom domain como vars.com.br ANTES de editar o DNS.
6. Configure somente os registros web indicados abaixo. Espere a validação e ative Enforce HTTPS quando disponível. Propagação e certificado podem levar até 24 horas.

## DNS: preservar Zoho

Este pacote NÃO executa alterações DNS. Antes de editar a zona atual, exporte ou registre uma cópia completa, incluindo valores, nomes, prioridades e TTL. Mantenha os servidores DNS atuais; não substitua a zona por um modelo de hospedagem.

Adicionar/ajustar exclusivamente os registros web:

| Tipo | Nome | Valor |
|---|---|---|
| A | @ (raiz) | 185.199.108.153 |
| A | @ (raiz) | 185.199.109.153 |
| A | @ (raiz) | 185.199.110.153 |
| A | @ (raiz) | 185.199.111.153 |
| CNAME | www | Venicius-VARS.github.io |

No Registro.br, a raiz pode ser representada pelo campo de nome vazio. Use a representação aceita no painel. O CNAME www não inclui https, barras ou nome do repositório.

Não crie CNAME na raiz: ela deve continuar permitindo MX e TXT. Não use curingas. Se houver A/AAAA antigos apontando outro site, ajuste apenas esses registros web após identificá-los. IPv6 é opcional; se utilizado, use os quatro AAAA oficiais atuais do GitHub, nunca endereços antigos de outro provedor.

PRESERVAR integralmente:
- Todos os MX do Zoho, seus destinos e prioridades atuais.
- O TXT SPF atual (v=spf1…). Não crie um segundo SPF nem substitua o existente por um exemplo genérico.
- Todos os seletores DKIM do Zoho em <seletor>._domainkey, TXT ou CNAME, exatamente como estão.
- TXT de verificação Zoho, _dmarc e quaisquer registros de serviços existentes.

Os valores Zoho dependem da região/conta. Confirme-os no Admin Console Zoho, sem copiar valores genéricos. Depois da alteração, compare MX, SPF e DKIM com a cópia anterior, valide o domínio no Zoho e teste envio e recebimento externo para venicius@vars.com.br. Se houver divergência, restaure os registros de e-mail da cópia. A configuração do site não exige mudar nenhum registro de e-mail.

## Conteúdo e identidade

Os dois PNG fornecidos foram preservados. O PDF de estudos de marca não é incluído no repositório público. Experiência em EGSE, engenharia de AIT e engenharia de sistemas foi informada pelo usuário. As demais especialidades permanecem temas de consulta. Confirmar o escopo comercial diretamente com a VARS. Nenhum projeto, cliente, certificação, endereço ou número de desempenho foi inventado.

Contato confirmado no histórico: venicius@vars.com.br. O link mailto abre o aplicativo do visitante; não existe formulário ou servidor de envio. Nenhum rastreador, cookie de análise, fonte remota ou biblioteca externa é utilizado. localStorage guarda apenas a preferência de idioma.

Arquivos: index.html, style.css, script.js, assets/*.png, CNAME e .nojekyll. Responsividade por CSS, foco visível, navegação por teclado, link de salto, contraste e preferência por movimento reduzido. A revisão visual final em navegador deve incluir celular e desktop, zoom 200%, EN/PT e envio de e-mail.

## Fontes oficiais consultadas em 29/10/2026

- GitHub: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- Zoho: https://www.zoho.com/mail/help/adminconsole/configure-email-delivery.html
- SPF: https://www.zoho.com/mail/help/adminconsole/spf-configuration.html