# 🏆 Kingdom Assessoria - Quiz Funnel

## Projeto Completo de Funil de Quiz de Alta Conversão

---

## 📁 Estrutura do Projeto

```
kingdom-quiz-funnel/
├── index.html      → Página principal do funil (5 steps)
├── style.css       → Design system premium completo
├── script.js       → Engine JavaScript (validação, webhook, animações)
└── README.md       → Documentação
```

---

## 🚀 Como Acessar

O servidor local está rodando em:
```
http://localhost:3000
```

Para iniciar manualmente:
```bash
cd kingdom-quiz-funnel
npx serve .
```

---

## 🔧 CONFIGURAÇÕES NECESSÁRIAS

### 1. URL do Webhook n8n

No arquivo `script.js`, linha 4, altere a URL do webhook:

```javascript
webhookUrl: 'https://SEU-N8N.app.n8n.cloud/webhook/kingdom-lead',
```

**Sua URL de webhook pode ser encontrada no n8n:**
1. Acesse o workflow **"Kingdom Assessoria - Quiz Funnel Leads"** (ID: `mQ7gIblDM5cUJ2LQ`)
2. Clique no nó **"Webhook Lead"**
3. Copie a **Production URL** ou **Test URL**
4. Cole no `script.js`

### 2. Número do WhatsApp

No arquivo `script.js`, linha 6, altere o número do WhatsApp:

```javascript
whatsappNumber: '5500000000000',
```

**Formato:** `55` + DDD + Número (sem +, sem espaços)
**Exemplo:** `5511999998888`

Também altere no `index.html`, no botão do WhatsApp (Step 5):
```html
<a href="https://wa.me/5511999998888?text=..."
```

### 3. Configurar o Workflow n8n

O workflow foi criado automaticamente no seu n8n com ID: **`mQ7gIblDM5cUJ2LQ`**

#### Nodes do Workflow:
1. **Webhook Lead** → Recebe dados do formulário via POST
2. **Format Lead Data** → Formata campos estruturados
3. **Save to Google Sheets** → Salva lead na planilha
4. **Email Notification** → Envia notificação por e-mail

#### Para configurar:

**Google Sheets:**
1. No nó "Save to Google Sheets", configure a credencial do Google
2. Selecione/Crie uma planilha com as colunas:
   - Nome | WhatsApp | Email | Site_Instagram | Servico | Data_Cadastro | Origem
3. Selecione a planilha e aba correta

**Email:**
1. No nó "Email Notification", configure a credencial SMTP
2. Altere o campo `toEmail` para **seu e-mail real**
3. Altere o `fromEmail` para o e-mail do remetente

**Depois de configurar:**
1. Clique em **"Save"** no workflow
2. Clique em **"Active"** para ativar o webhook

---

## 🎯 Estrutura do Funil

| Step | Descrição | Função |
|------|-----------|--------|
| 1 | Quiz Intro | Capturar atenção com headline e CTA |
| 2 | Formulário | Coletar dados do lead |
| 3 | Análise | Tela de loading com simulação |
| 4 | Prova Social | Vídeo de depoimentos + stats |
| 5 | VSL Final | Vídeo de vendas + CTA WhatsApp |

---

## 📊 Observação Estratégica (Escalabilidade)

Conforme sua instrução, o workflow foi configurado para:

✅ **Salvar TUDO no Google Sheets** (fonte de dados principal)
✅ **Enviar e-mail apenas como NOTIFICAÇÃO** (com dados do lead no corpo)
❌ **NÃO gera planilha .xlsx a cada lead** (não escalável)

Se precisar do .xlsx eventualmente, basta adicionar um nó de "Spreadsheet File" no n8n para exportação manual/agendada.

---

## 🎨 Design Features

- ✨ Glassmorphism com backdrop-filter
- 🌊 Partículas flutuantes animadas
- 📱 Mobile-first 100% responsivo
- 🔵 Paleta premium azul com gradientes
- ⚡ Micro-animações e transições suaves
- 🛡️ Microcopy de confiança nos formulários
- 🔥 Botões com glow pulsante
- 📊 Barra de progresso interativa
- 🎯 Select customizado com ícones
- 🟢 Validação em tempo real dos campos
- 💾 Fallback localStorage para leads offline

---

## 📱 Imagens Utilizadas

| Tipo | URL |
|------|-----|
| Desktop Banner | https://i.ibb.co/KcB3pmyG/BANNER-SITE-DESCKTOP-KINGDOM-2.webp |
| Square Branding | https://i.ibb.co/MDLWS9fT/KINGDOM-1080-x-1080-px-1.webp |
| Logo | https://i.ibb.co/TjL1Zt3/logor9.webp |
| Mobile Banner 1 | https://i.ibb.co/HL3TXsCx/mobile.webp |
| Mobile Banner 2 | https://i.ibb.co/qLhfZ37q/SITE-KINGDOM-MOBILE-2.webp |

---

## 🎬 Vídeos

| Tipo | URL |
|------|-----|
| Prova Social | https://www.youtube.com/watch?v=Hm5d0DcjFCo |
| VSL | https://www.youtube.com/watch?v=vhZVUxdfzjA |

---

## © 2026 Kingdom Assessoria
