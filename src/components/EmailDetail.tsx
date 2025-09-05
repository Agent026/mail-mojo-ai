import { Email } from '@/types/email';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Brain, Send, Eye, AlertCircle, TrendingUp, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailDetailProps {
  email: Email | null;
  onAnalyze: () => void;
  onGenerateResponse: () => void;
  isAnalyzing: boolean;
  isGenerating: boolean;
}

const getSentimentColor = (sentiment?: string) => {
  switch (sentiment) {
    case 'positive':
      return 'text-success';
    case 'negative':
      return 'text-urgent';
    default:
      return 'text-muted-foreground';
  }
};

const getSentimentIcon = (sentiment?: string) => {
  switch (sentiment) {
    case 'positive':
      return '😊';
    case 'negative':
      return '😟';
    default:
      return '😐';
  }
};

export const EmailDetail = ({ 
  email, 
  onAnalyze, 
  onGenerateResponse, 
  isAnalyzing, 
  isGenerating 
}: EmailDetailProps) => {
  if (!email) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <Eye className="h-16 w-16 text-muted-foreground mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">Select an Email</h3>
            <p className="text-muted-foreground">
              Choose an email from the list to view details and AI analysis
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full overflow-y-auto">
      {/* Email Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-xl font-semibold">{email.subject}</CardTitle>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><span className="font-medium">From:</span> {email.sender}</p>
                <p><span className="font-medium">Date:</span> {email.timestamp.toLocaleDateString()} at {email.timestamp.toLocaleTimeString()}</p>
              </div>
            </div>
            {email.analysis?.priority && (
              <Badge 
                variant={email.analysis.priority === 'urgent' ? 'destructive' : 'default'}
                className="capitalize"
              >
                {email.analysis.priority} Priority
              </Badge>
            )}
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <div className="prose max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {email.body}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Analysis
            </CardTitle>
            <Button 
              onClick={onAnalyze}
              disabled={isAnalyzing}
              variant="outline"
              size="sm"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  {email.analysis ? 'Re-analyze' : 'Analyze'}
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {email.analysis ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="text-2xl">{getSentimentIcon(email.analysis.sentiment)}</div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sentiment</p>
                    <p className={cn("font-semibold capitalize", getSentimentColor(email.analysis.sentiment))}>
                      {email.analysis.sentiment}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <AlertCircle className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Priority</p>
                    <p className="font-semibold capitalize text-foreground">
                      {email.analysis.priority}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Keywords</p>
                    <p className="font-semibold text-foreground">
                      {email.analysis.keywords.length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Summary</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {email.analysis.summary}
                </p>
              </div>
              
              {email.analysis.keywords.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Key Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {email.analysis.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No analysis available yet. Click "Analyze" to get AI insights.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Response Generation Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Draft Response
            </CardTitle>
            <Button 
              onClick={onGenerateResponse}
              disabled={isGenerating || !email.analysis}
              variant="default"
              size="sm"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Generate Response
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {email.draftResponse ? (
            <div className="space-y-4">
              <Textarea 
                value={email.draftResponse}
                readOnly
                className="min-h-32 resize-none"
                placeholder="Generated response will appear here..."
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  Edit Response
                </Button>
                <Button size="sm">
                  Send Email
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>
                {!email.analysis 
                  ? "Analyze the email first to generate a response." 
                  : "Click \"Generate Response\" to create a draft reply."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};