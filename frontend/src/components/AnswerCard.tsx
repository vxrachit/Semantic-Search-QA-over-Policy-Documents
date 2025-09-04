import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Sparkles } from 'lucide-react';

interface AnswerCardProps {
  answer: string;
}

const AnswerCard = ({ answer }: AnswerCardProps) => {
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-accent/30 to-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          AI Answer
        </CardTitle>
        <CardDescription>
          Generated response based on your documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute -left-3 top-0 w-1 h-full bg-gradient-to-b from-primary to-primary-glow rounded-full"></div>
          <div className="pl-4">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap font-medium">
              {answer}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnswerCard;