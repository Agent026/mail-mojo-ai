import React, { useState, useCallback } from 'react';
import { Email } from '@/types/email';
import { mockEmails } from '@/data/mockEmails';
import { EmailList } from '@/components/EmailList';
import { EmailDetail } from '@/components/EmailDetail';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Filter, 
  Brain, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [emails] = useState<Email[]>(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showTriageOnly, setShowTriageOnly] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock AI analysis function
  const handleAnalyzeEmail = useCallback(async () => {
    if (!selectedEmail) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis based on email content
    const mockAnalysis = {
      sentiment: selectedEmail.body.toLowerCase().includes('urgent') || selectedEmail.body.toLowerCase().includes('down') 
        ? 'negative' as const
        : selectedEmail.body.toLowerCase().includes('great') || selectedEmail.body.toLowerCase().includes('enjoy')
        ? 'positive' as const 
        : 'neutral' as const,
      priority: selectedEmail.subject.toLowerCase().includes('urgent') 
        ? 'urgent' as const
        : selectedEmail.subject.toLowerCase().includes('help') || selectedEmail.subject.toLowerCase().includes('support')
        ? 'high' as const
        : 'medium' as const,
      summary: `This email requires ${selectedEmail.subject.toLowerCase().includes('urgent') ? 'immediate' : 'timely'} attention regarding ${selectedEmail.subject.toLowerCase()}.`,
      keywords: ['support', 'assistance', 'inquiry']
    };
    
    // Update the selected email with analysis
    const updatedEmail = { ...selectedEmail, analysis: mockAnalysis };
    setSelectedEmail(updatedEmail);
    
    setIsAnalyzing(false);
    toast({
      title: "Analysis Complete",
      description: "AI has analyzed the email and identified key insights.",
    });
  }, [selectedEmail]);

  // Mock response generation function
  const handleGenerateResponse = useCallback(async () => {
    if (!selectedEmail || !selectedEmail.analysis) return;
    
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response based on analysis
    let mockResponse = '';
    if (selectedEmail.analysis.priority === 'urgent') {
      mockResponse = `Dear ${selectedEmail.sender.split('@')[0]},

Thank you for bringing this urgent matter to our attention. We understand the critical nature of this issue and our technical team is actively working on a resolution.

We have escalated this to our highest priority and will provide updates every 30 minutes until resolved.

Best regards,
Support Team`;
    } else {
      mockResponse = `Dear ${selectedEmail.sender.split('@')[0]},

Thank you for reaching out to us. We have received your ${selectedEmail.analysis.priority} priority request and our team will address this promptly.

We appreciate your patience and will get back to you within 24 hours with a detailed response.

Best regards,
Support Team`;
    }
    
    const updatedEmail = { ...selectedEmail, draftResponse: mockResponse };
    setSelectedEmail(updatedEmail);
    
    setIsGenerating(false);
    toast({
      title: "Response Generated",
      description: "AI has created a draft response ready for review.",
    });
  }, [selectedEmail]);

  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email);
  };

  const triageEmails = emails.filter(email => email.isTriaged);
  const urgentCount = emails.filter(email => email.analysis?.priority === 'urgent').length;
  const analyzedCount = emails.filter(email => email.analysis).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">AI Communication Assistant</h1>
                <p className="text-sm text-muted-foreground">Intelligent email triage and response generation</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <div className="text-center">
                      <p className="text-lg font-semibold">{emails.length}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-urgent" />
                    <div className="text-center">
                      <p className="text-lg font-semibold">{urgentCount}</p>
                      <p className="text-xs text-muted-foreground">Urgent</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-3">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-success" />
                    <div className="text-center">
                      <p className="text-lg font-semibold">{analyzedCount}</p>
                      <p className="text-xs text-muted-foreground">Analyzed</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Email List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle>Email Inbox</CardTitle>
                  <Button
                    onClick={() => setShowTriageOnly(!showTriageOnly)}
                    variant={showTriageOnly ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    {showTriageOnly ? 'Show All' : 'Triage Mode'}
                  </Button>
                </div>
                {showTriageOnly && (
                  <Badge variant="warning" className="w-fit">
                    Showing {triageEmails.length} support emails
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="pt-0 h-[calc(100%-80px)]">
                <EmailList
                  emails={emails}
                  selectedEmailId={selectedEmail?.id}
                  onEmailSelect={handleEmailSelect}
                  showTriageOnly={showTriageOnly}
                />
              </CardContent>
            </Card>
          </div>

          {/* Email Detail */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardContent className="p-6 h-full">
                <EmailDetail
                  email={selectedEmail}
                  onAnalyze={handleAnalyzeEmail}
                  onGenerateResponse={handleGenerateResponse}
                  isAnalyzing={isAnalyzing}
                  isGenerating={isGenerating}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;