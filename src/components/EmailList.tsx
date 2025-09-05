import { Email } from '@/types/email';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle, CheckCircle2, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailListProps {
  emails: Email[];
  selectedEmailId?: string;
  onEmailSelect: (email: Email) => void;
  showTriageOnly: boolean;
}

const getPriorityIcon = (priority?: string) => {
  switch (priority) {
    case 'urgent':
      return <AlertCircle className="h-4 w-4 text-urgent" />;
    case 'high':
      return <AlertCircle className="h-4 w-4 text-warning" />;
    case 'medium':
      return <Minus className="h-4 w-4 text-primary" />;
    case 'low':
      return <CheckCircle2 className="h-4 w-4 text-success" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const getPriorityBadgeVariant = (priority?: string) => {
  switch (priority) {
    case 'urgent':
      return 'urgent';
    case 'high':
      return 'warning';
    case 'medium':
      return 'default';
    case 'low':
      return 'secondary';
    default:
      return 'outline';
  }
};

export const EmailList = ({ emails, selectedEmailId, onEmailSelect, showTriageOnly }: EmailListProps) => {
  const filteredEmails = showTriageOnly 
    ? emails.filter(email => email.isTriaged)
    : emails;

  const sortedEmails = filteredEmails.sort((a, b) => {
    // Sort by priority: urgent > high > medium > low, then by timestamp
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.analysis?.priority as keyof typeof priorityOrder] || 0;
    const bPriority = priorityOrder[b.analysis?.priority as keyof typeof priorityOrder] || 0;
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          {showTriageOnly ? 'Triage Queue' : 'All Emails'}
        </h2>
        <Badge variant="secondary" className="text-xs">
          {filteredEmails.length} emails
        </Badge>
      </div>
      
      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {sortedEmails.map((email) => (
          <Card
            key={email.id}
            className={cn(
              "p-4 cursor-pointer transition-all duration-200 hover:shadow-md border",
              selectedEmailId === email.id 
                ? "ring-2 ring-primary shadow-lg border-primary" 
                : "hover:border-primary/30"
            )}
            onClick={() => onEmailSelect(email)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getPriorityIcon(email.analysis?.priority)}
                <h3 className="font-medium text-sm text-foreground line-clamp-1">
                  {email.subject}
                </h3>
              </div>
              {email.analysis?.priority && (
                <Badge 
                  variant={getPriorityBadgeVariant(email.analysis.priority) as any}
                  className="text-xs capitalize"
                >
                  {email.analysis.priority}
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">
              From: {email.sender}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {email.timestamp.toLocaleDateString()} {email.timestamp.toLocaleTimeString()}
              </span>
              {email.analysis && (
                <Badge variant="outline" className="text-xs">
                  Analyzed
                </Badge>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};