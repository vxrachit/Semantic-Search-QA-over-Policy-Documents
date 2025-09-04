import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, ExternalLink } from 'lucide-react';

interface Source {
  doc_name: string;
  page: number;
  score: number;
  preview: string;
}

interface SourcesListProps {
  sources: Source[];
}

const SourcesList = ({ sources }: SourcesListProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-success-bg text-success border-success/20';
    if (score >= 0.6) return 'bg-warning-bg text-warning border-warning/20';
    return 'bg-muted text-muted-foreground border-border';
  };

  const formatScore = (score: number) => {
    return `${(score * 100).toFixed(1)}%`;
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Sources
          <Badge variant="secondary" className="ml-auto">
            {sources.length} found
          </Badge>
        </CardTitle>
        <CardDescription>
          Relevant document excerpts that informed the answer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sources.map((source, index) => (
            <div
              key={index}
              className="p-4 bg-muted/50 rounded-lg border border-border/50 hover:border-primary/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2 flex-1">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-foreground truncate">
                      {source.doc_name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Page {source.page}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className={getScoreColor(source.score)}>
                    {formatScore(source.score)}
                  </Badge>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -left-2 top-0 w-0.5 h-full bg-primary/30 rounded-full"></div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-3 italic">
                  "{source.preview}"
                </p>
              </div>
            </div>
          ))}
          
          {sources.length === 0 && (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No sources available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SourcesList;