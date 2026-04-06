import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ExternalLink, Calendar, BarChart3, ArrowLeft, AlertCircle, RefreshCw, FileText, Globe } from 'lucide-react';
import { researchApi } from '../services/api';

interface ResearchSource {
  id: string;
  title: string;
  url: string;
  description: string;
  date: string;
  type: string;
  sourceName?: string;
  citation?: string;
}

interface ResearchReport {
  _id: string;
  question: string;
  keyTakeaways: string[];
  sources: ResearchSource[];
  createdAt: string;
  updatedAt: string;
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<ResearchReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      // Check if we have a report in location state
      if (location.state?.report) {
        setResult(location.state.report);
        setIsLoading(false);
        return;
      }
      
      // If we have a report ID in the URL, fetch it
      const reportId = new URLSearchParams(location.search).get('id');
      if (reportId) {
        try {
          const reportData = await researchApi.getReport(reportId);
          setResult(reportData);
        } catch (err) {
          console.error('Failed to fetch report:', err);
          setError('Failed to load research report.');
        } finally {
          setIsLoading(false);
        }
        return;
      }
      
      // If no report data, redirect to ask page
      navigate('/ask');
    };

    fetchReport();
  }, [location.state, location.search, navigate]);

  const handleRefresh = async () => {
    if (!result) return;
    
    setIsRefreshing(true);
    try {
      // In a real implementation, this would call the refresh API
      // For now, we'll simulate a refresh
      setTimeout(() => {
        setIsRefreshing(false);
        // Show a success message or update the report
      }, 1500);
    } catch (err) {
      console.error('Failed to refresh report:', err);
      setIsRefreshing(false);
    }
  };

  const getSourceIcon = (type: string) => {
    if (type === 'file') {
      return <FileText className="w-4 h-4" />;
    }
    return <Globe className="w-4 h-4" />;
  };

  const getSourceTypeText = (type: string) => {
    if (type === 'file') {
      return 'Uploaded File';
    }
    return 'Live Source';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your research report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <p className="text-lg text-gray-600 mb-4">{error}</p>
          <Link to="/ask">
            <Button>Start New Research</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">No research results found.</p>
          <Link to="/ask">
            <Button>Start New Research</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/ask" className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-4 font-medium transition-colors duration-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Ask
          </Link>
          <h1 className="text-3xl font-bold gradient-text mb-2">Research Results</h1>
          <p className="text-lg text-gray-700 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">{result.question}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Takeaways */}
            <Card className="card-hover bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                <CardTitle className="text-white">Key Takeaways</CardTitle>
                <CardDescription className="text-green-100">
                  Summary of the most important findings from your research
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {result.keyTakeaways && result.keyTakeaways.length > 0 ? (
                  <ul className="space-y-4">
                    {result.keyTakeaways.map((takeaway, index) => (
                      <li key={index} className="flex items-start group">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mt-1 mr-4 flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{takeaway}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray-500 italic">No key takeaways available for this report.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sources */}
            <Card className="card-hover bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
                <CardTitle className="text-white">Sources ({result.sources?.length || 0})</CardTitle>
                <CardDescription className="text-blue-100">
                  References and citations used in this research
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {result.sources && result.sources.length > 0 ? (
                  <div className="space-y-4">
                    {result.sources.map((source) => (
                      <div key={source.id} className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-400 transition-all duration-300 group">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                {getSourceIcon(source.type)}
                              </div>
                              <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                {getSourceTypeText(source.type)}
                              </span>
                              {source.sourceName && (
                                <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-800 rounded ml-2">
                                  {source.sourceName}
                                </span>
                              )}
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">{source.title}</h4>
                            <p className="text-sm text-gray-600 mb-3">{source.description}</p>
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              {source.date ? new Date(source.date).toLocaleDateString() : 'Date not available'}
                            </div>
                            {source.citation && (
                              <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 font-mono">
                                {source.citation}
                              </div>
                            )}
                          </div>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-4 text-blue-600 hover:text-blue-800 hover:scale-110 transition-all duration-300"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray-500 italic">No sources available for this report.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Report Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Report Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Report ID</p>
                    <p className="text-sm font-mono text-gray-900 break-all">{result._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Generated</p>
                    <p className="text-sm text-gray-900">
                      {new Date(result.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="text-sm text-gray-900">
                      {new Date(result.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sources Count</p>
                    <p className="text-sm font-bold text-gray-900">
                      {result.sources?.length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Data
                    </>
                  )}
                </Button>
                <Button className="w-full" variant="outline" disabled>
                  Export Report
                </Button>
                <Button className="w-full" variant="outline" disabled>
                  Share Results
                </Button>
                <Link to="/ask" className="block">
                  <Button className="w-full">
                    New Research
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;