const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ Em produção, use variáveis de ambiente (.env)
const PUBLIC_KEY = 'pk_pVLC9dkHNQLQt63OfL1vZsCw60GilTH3CvRxlZXz6dFfMTjC';
const SECRET_KEY = 'sk_pJPSh4ByUPoQPSudZQNsMU5Ycq98lTLNS1cL1271WafWHuz-';
const API_URL = 'https://api.simpsip.com.br/v1/transactions';

// Gera autenticação Basic
function getAuth() {
  return 'Basic ' + Buffer.from(PUBLIC_KEY + ':' + SECRET_KEY).toString('base64');
}

// POST /pix/criar — cria cobrança Pix
app.post('/pix/criar', async (req, res) => {
  try {
    const { amount, name, cpf, email } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valor inválido' });
    }

    const payload = {
      amount: Math.round(amount * 100), // centavos
      paymentMethod: 'pix',
      customer: {
        name: name || 'Cliente TikTok Shop',
        cpf: cpf || '00000000000',
        email: email || 'cliente@email.com',
      },
    };

    console.log('📤 Criando cobrança Pix:', payload);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: getAuth(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('📥 Resposta SimpSP:', data);

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Erro na API', details: data });
    }

    // Retorna os dados do Pix para o frontend
    res.json({
      success: true,
      transactionId: data.id,
      qrCode: data.pix?.qrCode || data.qrCode || data.pixQrCode || null,
      qrCodeImage: data.pix?.qrCodeImage || data.qrCodeImage || null,
      amount: data.amount,
      status: data.status,
      raw: data, // útil para debugar no início
    });

  } catch (error) {
    console.error('❌ Erro:', error);
    res.status(500).json({ error: 'Erro interno', details: error.message });
  }
});

// GET /pix/status/:id — verifica status do pagamento
app.get('/pix/status/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: getAuth(),
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log(`🔍 Status da transação ${id}:`, data.status);

    res.json({
      success: true,
      transactionId: id,
      status: data.status, // 'pending', 'paid', 'cancelled', etc.
      raw: data,
    });

  } catch (error) {
    console.error('❌ Erro ao verificar status:', error);
    res.status(500).json({ error: 'Erro ao verificar status', details: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📡 Endpoints disponíveis:`);
  console.log(`   POST http://localhost:${PORT}/pix/criar`);
  console.log(`   GET  http://localhost:${PORT}/pix/status/:id\n`);
});
