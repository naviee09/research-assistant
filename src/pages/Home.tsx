import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Search, FileText, BarChart3, Zap, TrendingUp, RefreshCw, BadgeCheck, Globe } from 'lucide-react';
import { dashboardApi, dataApi } from '../services/api';

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalReports: 0,
    freshReports: 0,
    credits: 0,
    totalSources: 0
  });
  const [dataFreshness, setDataFreshness] = useState({
    lastUpdate: '',
    isFresh: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch dashboard stats and data freshness in parallel to reduce loading time
        const [statsData, freshnessData] = await Promise.all([
          dashboardApi.getStats(user.id),
          dataApi.checkDataFreshness()
        ]);
        
        setStats({
          totalReports: statsData.totalReports,
          freshReports: statsData.freshReports,
          credits: statsData.credits,
          totalSources: statsData.recentReports?.reduce((acc: number, report: any) => {
            return acc + (report.sources?.length || 0);
          }, 0) || 0
        });
        
        setDataFreshness({
          lastUpdate: freshnessData.lastUpdated || new Date().toISOString(),
          isFresh: freshnessData.isFresh || true
        });
      } catch (error) {
        console.error('Failed to fetch home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="min-h-screen animated-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6 animate-pulse">
            Smart Research Assistant
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto drop-shadow-lg">
            Transform your research process with AI-powered insights, structured reports, 
            and comprehensive source analysis.
          </p>
          <Link to="/ask">
            <Button size="lg" className="text-lg px-8 py-6 button-glow pulse-glow bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
              <Zap className="w-5 h-5 mr-2" />
              Start Research
            </Button>
          </Link>
        </div>

        {/* User Stats (if logged in) */}
        {user && (
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <h2 className="text-2xl font-bold text-white mr-3">Welcome back, {user.name}!</h2>
              <BadgeCheck className="w-6 h-6 text-green-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="text-center bg-white/10 backdrop-blur-sm border border-white/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Total Reports</CardTitle>
                  <CardDescription className="text-blue-200">
                    {loading ? (
                      <div className="h-6 w-8 bg-white/20 rounded animate-pulse mx-auto"></div>
                    ) : (
                      <span className="text-2xl font-bold text-white">{stats.totalReports}</span>
                    )}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white/10 backdrop-blur-sm border border-white/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <RefreshCw className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Fresh Reports</CardTitle>
                  <CardDescription className="text-green-200">
                    {loading ? (
                      <div className="h-6 w-8 bg-white/20 rounded animate-pulse mx-auto"></div>
                    ) : (
                      <span className="text-2xl font-bold text-white">{stats.freshReports}</span>
                    )}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white/10 backdrop-blur-sm border border-white/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Available Credits</CardTitle>
                  <CardDescription className="text-purple-200">
                    {loading ? (
                      <div className="h-6 w-8 bg-white/20 rounded animate-pulse mx-auto"></div>
                    ) : (
                      <span className="text-2xl font-bold text-white">{stats.credits}</span>
                    )}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center bg-white/10 backdrop-blur-sm border border-white/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Sources Analyzed</CardTitle>
                  <CardDescription className="text-cyan-200">
                    {loading ? (
                      <div className="h-6 w-8 bg-white/20 rounded animate-pulse mx-auto"></div>
                    ) : (
                      <span className="text-2xl font-bold text-white">{stats.totalSources}</span>
                    )}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center card-hover bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 hover:border-blue-400">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Search className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-blue-800">Ask Questions</CardTitle>
              <CardDescription className="text-blue-600">
                Simply type your research question and let our AI do the heavy lifting
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center card-hover bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 hover:border-green-400">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-green-800">Get Structured Reports</CardTitle>
              <CardDescription className="text-green-600">
                Receive comprehensive reports with key takeaways and reliable sources
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center card-hover bg-gradient-to-br from-purple-50 to-pink-100 border-2 border-purple-200 hover:border-purple-400">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-purple-800">Track Progress</CardTitle>
              <CardDescription className="text-purple-600">
                Monitor your research history and usage with our intuitive dashboard
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How it Works */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-center mb-8 gradient-text">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Ask Your Question</h3>
              <p className="text-gray-600">
                Enter any research question or topic you'd like to explore
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">AI Analysis</h3>
              <p className="text-gray-600">
                Our AI searches and analyzes multiple sources to find relevant information
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Get Results</h3>
              <p className="text-gray-600">
                Receive a structured report with key insights and source citations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;