import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { researchApi } from '../services/api';

const Ask = () => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !user) return;

    setIsLoading(true);
    setError(null);
    
    try {
      // Submit the research question to the backend
      const report = await researchApi.submitQuestion(question, user.id);
      
      // Navigate to results page with the report data
      navigate('/results', { state: { report } });
    } catch (err: any) {
      console.error('Failed to submit research question:', err);
      // Provide more detailed error messages
      if (err.message) {
        setError(err.message);
      } else if (err.toString().includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        setError('Failed to generate report. Please try again.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            What would you like to research?
          </h1>
          <p className="text-lg text-gray-700">
            Ask any question and get comprehensive research results
          </p>
        </div>

        <Card className="max-w-2xl mx-auto card-hover bg-white/80 backdrop-blur-sm border-2 border-purple-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="text-white">Research Question</CardTitle>
            <CardDescription className="text-purple-100">
              Enter your research question below. Be as specific or broad as you'd like.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="question" className="text-sm font-medium text-gray-700">
                  Your Question
                </label>
                <Input
                  id="question"
                  type="text"
                  placeholder="e.g., What are the latest developments in artificial intelligence?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={isLoading}
                  className="text-base border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full button-glow bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0" 
                disabled={!question.trim() || isLoading || !user}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Start Research
                  </>
                )}
              </Button>
              
              {!user && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  You need to be logged in to start research
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Example Questions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-6 gradient-text">Example Questions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "What are the environmental impacts of renewable energy?",
              "How does machine learning affect healthcare outcomes?",
              "What are the economic implications of remote work?",
              "How is climate change affecting global agriculture?",
              "What are the latest trends in sustainable technology?",
              "How does social media influence political discourse?"
            ].map((example, index) => (
              <Card 
                key={index} 
                className="cursor-pointer card-hover bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300"
                onClick={() => setQuestion(example)}
              >
                <CardContent className="p-4">
                  <p className="text-sm text-gray-700 font-medium">{example}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ask;