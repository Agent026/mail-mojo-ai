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
import { analyzeEmail, generateResponse } from '@/services/openaiService';

const Dashboard = () => {
  const [emails] = useState<Email[]>(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showTriageOnly, setShowTriageOnly] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // AI analysis function using OpenAI
  const handleAnalyzeEmail = useCallback(async () => {
    if (!selectedEmail) return;
    
    setIsAnalyzing(true);
    
    try {
      const analysis = await analyzeEmail(selectedEmail.subject, selectedEmail.body);
      
      // Update the selected email with analysis
      const updatedEmail = { ...selectedEmail, analysis };
      setSelectedEmail(updatedEmail);
      
      toast({
        title: "Analysis Complete",
        description: "AI has analyzed the email and identified key insights.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze email. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedEmail]);

  // AI response generation function using OpenAI
  const handleGenerateResponse = useCallback(async () => {
    if (!selectedEmail || !selectedEmail.analysis) return;
    
    setIsGenerating(true);
    
    try {
      const response = await generateResponse(
        selectedEmail.subject, 
        selectedEmail.body, 
        selectedEmail.analysis
      );
      
      const updatedEmail = { ...selectedEmail, draftResponse: response };
      setSelectedEmail(updatedEmail);
      
      toast({
        title: "Response Generated",
        description: "AI has created a draft response ready for review.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate response. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
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