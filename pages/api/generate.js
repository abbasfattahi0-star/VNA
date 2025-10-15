// این کد روی سرور Vercel اجرا می‌شود و امن است
export default async function handler(req, res) {
  try {
    // دریافت سوال کاربر از بدنه درخواست
    const { prompt } = req.body;

    // خواندن کلید API از تنظیمات Vercel
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "API key is not configured" });
    }

    const GOOGLE_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    const apiResponse = await fetch(GOOGLE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      return res.status(apiResponse.status).json({ error: `Google API Error: ${errorText}` });
    }

    const data = await apiResponse.json();
    res.status(200).json(data);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
