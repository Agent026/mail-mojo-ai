const OPENAI_API_KEY = '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';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface EmailAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  summary: string;
  keywords: string[];
}

export async function analyzeEmail(subject: string, body: string): Promise<EmailAnalysis> {
  const prompt = `Analyze this email and return a JSON object with the following structure:
{
  "sentiment": "positive/negative/neutral",
  "priority": "urgent/high/medium/low", 
  "summary": "brief summary of the email",
  "keywords": ["array", "of", "key", "topics"]
}

Email Subject: ${subject}
Email Body: ${body}

Please analyze the sentiment, determine priority level (urgent for system issues, high for support requests, medium for inquiries, low for feedback), provide a brief summary, and extract 3-5 key topics/keywords.`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert email analyst. Always respond with valid JSON only, no additional text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error analyzing email:', error);
    // Fallback to basic analysis
    return {
      sentiment: body.toLowerCase().includes('urgent') || body.toLowerCase().includes('problem') ? 'negative' : 
                body.toLowerCase().includes('thank') || body.toLowerCase().includes('great') ? 'positive' : 'neutral',
      priority: subject.toLowerCase().includes('urgent') ? 'urgent' :
                subject.toLowerCase().includes('support') || subject.toLowerCase().includes('help') ? 'high' : 'medium',
      summary: `Email regarding: ${subject}`,
      keywords: ['email', 'request']
    };
  }
}

export async function generateResponse(subject: string, body: string, analysis: EmailAnalysis): Promise<string> {
  const prompt = `Generate a professional, friendly email response based on this email and its analysis:

Original Email Subject: ${subject}
Original Email Body: ${body}

Analysis:
- Sentiment: ${analysis.sentiment}
- Priority: ${analysis.priority}
- Summary: ${analysis.summary}
- Keywords: ${analysis.keywords.join(', ')}

Generate a professional response that:
1. Acknowledges the sender appropriately
2. Addresses their concern/request directly
3. Provides a clear next step or timeline
4. Maintains a helpful, professional tone
5. Is appropriate for the priority level (urgent = immediate action, high = within 24 hours, medium = within 2-3 days)

Keep the response concise but complete.`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional customer service representative. Generate helpful, professional email responses.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 400
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return content.trim();
  } catch (error) {
    console.error('Error generating response:', error);
    // Fallback response
    return `Dear Customer,

Thank you for your ${analysis.priority} priority ${analysis.sentiment === 'negative' ? 'concern' : 'message'}. We have received your request and our team will address this promptly.

${analysis.priority === 'urgent' ? 'We understand the critical nature of this issue and will provide updates within the next hour.' : 
  analysis.priority === 'high' ? 'We will get back to you within 24 hours with a detailed response.' : 
  'We will respond within 2-3 business days.'}

Best regards,
Support Team`;
  }
}