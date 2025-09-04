import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Loader2, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Source {
  doc_name: string;
  page: number;
  score: number;
  preview: string;
}

interface QueryResponse {
  answer: string;
  sources: Source[];
}

interface QueryFormProps {
  onResults?: (results: QueryResponse) => void;
}

const QueryForm = ({ onResults }: QueryFormProps) => {
  const [userId, setUserId] = useState('');
  const [question, setQuestion] = useState('');
  const [topK, setTopK] = useState(3);
  const [isQuerying, setIsQuerying] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId.trim()) {
      toast({
        title: "User ID required",
        description: "Please enter a user ID.",
        variant: "destructive",
      });
      return;
    }

    if (!question.trim()) {
      toast({
        title: "Question required",
        description: "Please enter a question.",
        variant: "destructive",
      });
      return;
    }

    setIsQuerying(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          question: question,
          top_k: topK,
        }),
      });

      const data: QueryResponse = await response.json();

      if (response.ok && data.answer) {
        onResults?.(data);
        toast({
          title: "Query successful! ✅",
          description: `Found answer with ${data.sources.length} sources.`,
        });
      } else {
        throw new Error('Query failed');
      }
    } catch (error) {
      toast({
        title: "Query failed",
        description: "Failed to query documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Query Documents
        </CardTitle>
        <CardDescription>
          Ask questions about your ingested documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="queryUserId">User ID</Label>
              <Input
                id="queryUserId"
                type="text"
                placeholder="Enter your user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                disabled={isQuerying}
                className="bg-input border-input-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="topK">Top K Results</Label>
              <Input
                id="topK"
                type="number"
                min="1"
                max="10"
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                disabled={isQuerying}
                className="bg-input border-input-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              placeholder="Ask a question about your documents..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isQuerying}
              rows={4}
              className="bg-input border-input-border resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isQuerying || !userId.trim() || !question.trim()}
            className="w-full"
          >
            {isQuerying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <MessageSquare className="mr-2 h-4 w-4" />
                Ask Question
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QueryForm;