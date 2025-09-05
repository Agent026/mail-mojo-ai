import { Email } from '@/types/email';

export const mockEmails: Email[] = [
  {
    id: '1',
    subject: 'Urgent Support Request - System Down',
    sender: 'john.doe@company.com',
    body: 'Hi, our entire system has been down for the past 2 hours. This is affecting all our customers and we need immediate assistance. Please prioritize this request.',
    timestamp: new Date('2024-01-15T09:30:00'),
    sent: false,
    isTriaged: true,
    analysis: {
      sentiment: 'negative',
      priority: 'urgent',
      summary: 'Critical system outage affecting all customers, requires immediate attention.',
      keywords: ['urgent', 'system down', 'customers affected']
    }
  },
  {
    id: '2',
    subject: 'Query about Product Features',
    sender: 'sarah.wilson@client.com',
    body: 'Hello, I hope you are doing well. I wanted to inquire about the advanced features available in your premium plan. Could you please send me detailed information?',
    timestamp: new Date('2024-01-15T08:15:00'),
    sent: false,
    isTriaged: true,
    analysis: {
      sentiment: 'positive',
      priority: 'medium',
      summary: 'Customer inquiry about premium plan features, needs product information.',
      keywords: ['query', 'product features', 'premium plan']
    }
  },
  {
    id: '3',
    subject: 'Help with Account Setup',
    sender: 'mike.chen@startup.io',
    body: 'I am having trouble setting up my new account. The verification email is not arriving and I have checked my spam folder multiple times. Can you help me resolve this issue?',
    timestamp: new Date('2024-01-15T07:45:00'),
    sent: false,
    isTriaged: true,
    analysis: {
      sentiment: 'neutral',
      priority: 'high',
      summary: 'Account setup issue with email verification, technical support needed.',
      keywords: ['help', 'account setup', 'verification']
    }
  },
  {
    id: '4',
    subject: 'Weekly Newsletter Feedback',
    sender: 'emma.taylor@reader.com',
    body: 'I really enjoy reading your weekly newsletter. The content is always relevant and well-written. Keep up the great work! Looking forward to next week\'s edition.',
    timestamp: new Date('2024-01-14T16:20:00'),
    sent: false,
    isTriaged: false,
    analysis: {
      sentiment: 'positive',
      priority: 'low',
      summary: 'Positive feedback about newsletter content, no action required.',
      keywords: ['feedback', 'newsletter', 'positive']
    }
  },
  {
    id: '5',
    subject: 'Partnership Proposal',
    sender: 'david.brown@partner.com',
    body: 'We would like to propose a strategic partnership between our companies. Our team believes there are significant synergies that could benefit both organizations. Would you be available for a call next week?',
    timestamp: new Date('2024-01-14T14:30:00'),
    sent: false,
    isTriaged: false
  }
];