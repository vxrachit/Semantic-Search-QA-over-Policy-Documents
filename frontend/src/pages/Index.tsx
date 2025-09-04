import { useState, useEffect } from 'react';
import StatusBadge from '@/components/StatusBadge';
import FileIngestForm from '@/components/FileIngestForm';
import QueryForm from '@/components/QueryForm';
import AnswerCard from '@/components/AnswerCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowDown, Sparkles, Database, Search, FileText, Zap, BookOpen } from 'lucide-react';

interface QueryResponse {
  answer: string;
  sources: Array<{
    doc_name: string;
    page: number;
    score: number;
    preview: string;
  }>;
}

const Index = () => {
  const [queryResults, setQueryResults] = useState<QueryResponse | null>(null);
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean>(false);

  const handleQueryResults = (results: QueryResponse) => {
    setQueryResults(results);
  };

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Navigation Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold gradient-text">
                CHATQA
              </h1>
            </div>
            <StatusBadge onStatusChange={setIsBackendHealthy} />
          </div>
        </div>
      </header>

      {/* Hero Section (keep as earlier) */}
      <section className="relative pt-20 pb-32 bg-gradient-to-br from-background via-accent/20 to-background overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="gradient-text">Intelligent Document</span>
                <br />
                <span className="text-foreground">Query System</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Transform your PDF documents into an intelligent knowledge base. 
                Upload, query, and get instant AI-powered answers from your content.
              </p>
            </div>
            
            <div className="animate-fade-in-left flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="px-8 py-3 text-lg hover-lift animate-glow"
                onClick={() => scrollToSection('upload-section')}
              >
                <FileText className="w-5 h-5 mr-2" />
                Upload Documents
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-3 text-lg hover-lift"
                onClick={() => scrollToSection('query-section')}
              >
                <Search className="w-5 h-5 mr-2" />
                Start Querying
              </Button>
            </div>

            <div className="animate-fade-in-right">
              <Button
                variant="ghost"
                className="animate-bounce"
                onClick={() => scrollToSection('features-section')}
              >
                <ArrowDown className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Database className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="absolute top-40 right-10 animate-float" style={{ animationDelay: '2s' }}>
          <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6 text-success" />
          </div>
        </div>
      </section>

      {/* Below Hero Section: new professional UI */}
      <section id="features-section" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 text-blue-700">Powerful Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
              Everything you need to transform your documents into an intelligent, searchable knowledge base.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center hover:scale-105 transition-transform bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-blue-100">
              <div className="w-16 h-16 bg-blue-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-700">Smart Upload</h3>
              <p className="text-gray-600 font-medium">Drag and drop PDF files with automatic processing and chunking.</p>
            </div>
            <div className="text-center hover:scale-105 transition-transform bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-green-100">
              <div className="w-16 h-16 bg-green-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow">
                <Search className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-700">Intelligent Search</h3>
              <p className="text-gray-600 font-medium">AI-powered semantic search across all your documents.</p>
            </div>
            <div className="text-center hover:scale-105 transition-transform bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-yellow-100">
              <div className="w-16 h-16 bg-yellow-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow">
                <Sparkles className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-yellow-700">Smart Answers</h3>
              <p className="text-gray-600 font-medium">Get comprehensive answers with source citations.</p>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div id="upload-section" className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-blue-100">
            <FileIngestForm />
          </div>
          <div id="query-section" className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-green-100">
            <QueryForm onResults={handleQueryResults} />
          </div>
        </div>
        {queryResults && (
          <div className="max-w-3xl mx-auto py-10 px-4">
            <div className="mt-8 space-y-6">
              <AnswerCard answer={queryResults.answer} />
              {queryResults.sources && queryResults.sources.length > 0 && (
                <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-100/30 to-white p-8 rounded-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-blue-700" />
                    <span className="font-semibold text-lg">Sources</span>
                  </div>
                  <ul className="space-y-4">
                    {queryResults.sources.map((src, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="pt-1">
                          <FileText className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-blue-700">{src.doc_name}</div>
                          <div className="text-xs text-gray-500 mb-1">
                            Page <span className="font-bold">{src.page}</span> &middot; Score <span className="font-bold">{src.score.toFixed(2)}</span>
                          </div>
                          <div className="bg-gray-100 rounded p-2 text-sm text-gray-800">{src.preview}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 bg-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-400 rounded-md flex items-center justify-center shadow">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">CHATQA</span>
            </div>
            <p className="text-gray-500 font-medium">
              Professional document querying powered by AI
            </p>
            <p className="text-gray-500 font-medium">
              &copy; 2025 vxRachit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      <style>
        {`
          .animate-bounce {
            animation: bounce 1.2s infinite;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0);}
            50% { transform: translateY(-10px);}
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0);}
            50% { transform: translateY(-12px);}
          }
        `}
      </style>
    </div>
  );
};

export default Index;
