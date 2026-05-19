# Oral Vitta Fortaleza

Site estatico da clinica Oral Vitta Fortaleza.

## Estrutura

- `index.html`: conteudo das secoes, links, formularios e imagens.
- `style.css`: layout, responsividade, cores, espacamentos e animacoes.
- `script.js`: menu, comportamento do cabecalho, formulario de WhatsApp, lightbox e interacoes.
- `assets/images/`: imagens principais do site.
- `assets/images/patients/`: fotos originais dos pacientes usadas no zoom.
- `assets/images/patients/thumbs/`: imagens otimizadas exibidas na grade de pacientes.
- `assets/media/`: videos do site.
- `assets/legacy/`: arquivos antigos mantidos como referencia.

## Atualizacoes rapidas

- Trocar telefone ou WhatsApp: edite `WHATSAPP_NUMBER` em `script.js` e os links `wa.me` em `index.html`.
- Trocar redes sociais ou email: edite os links do topo, agendamento e rodape em `index.html`.
- Trocar foto inicial: substitua `assets/images/inicio.png`.
- Trocar logo: substitua `assets/images/logo.png`.
- Trocar servicos: substitua `assets/images/servicos.jpg`.
- Trocar convenios: substitua `assets/images/convenios-parceiros.jpg`.
- Trocar fotos de pacientes: substitua os arquivos em `assets/images/patients/` e gere/atualize as miniaturas em `assets/images/patients/thumbs/`.

## Verificacao local

Abra `index.html` no navegador. Para validar o JavaScript:

```powershell
node --check script.js
```
