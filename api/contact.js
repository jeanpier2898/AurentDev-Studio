// Vercel Serverless Function. Configure RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL in Vercel.
module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({error: 'Method not allowed'});
    }
    const {RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL} = process.env;
    if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) return res.status(503).json({error: 'El formulario todavía no está configurado. Escríbenos por WhatsApp. / Contact form is not configured yet. Please use WhatsApp.'});
    const {name, email, company, service, message, language, website} = req.body || {};
    if (website) return res.status(200).json({ok: true});
    if (!name || !email || !message || String(name).length > 120 || String(email).length > 254 || String(message).length > 5000 || !/^\S+@\S+\.\S+$/.test(String(email))) return res.status(400).json({error: 'Invalid form fields / Datos inválidos'});
    const clean = x => String(x || '').replace(/[<>]/g, '').slice(0, 5000);
    const body = `New inquiry - AurentDev Studio\n\nName: ${clean(name)}\nEmail: ${clean(email)}\nCompany: ${clean(company)}\nService: ${clean(service)}\nLanguage: ${clean(language)}\n\nMessage:\n${clean(message)}`;
    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json'},
            body: JSON.stringify({
                from: CONTACT_FROM_EMAIL,
                to: [CONTACT_TO_EMAIL],
                reply_to: clean(email),
                subject: 'Nueva consulta web - AurentDev Studio',
                text: body
            })
        });
        if (!response.ok) {
            console.error('Resend delivery failed', response.status);
            return res.status(502).json({error: 'No se pudo enviar la consulta. Intenta por WhatsApp. / Could not send. Please use WhatsApp.'});
        }
        return res.status(200).json({ok: true});
    } catch (err) {
        console.error('Email service unavailable');
        return res.status(502).json({error: 'Servicio no disponible. Escríbenos por WhatsApp. / Service unavailable. Please use WhatsApp.'});
    }
};
