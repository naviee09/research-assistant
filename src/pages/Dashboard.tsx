import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  BarChart3, 
  FileText, 
  Clock, 
  TrendingUp, 
  Calendar,
  ExternalLink,
  RefreshCw,
  User,
  BadgeCheck,
  Globe,
  File,
  Plus,
  RotateCcw,
  Wifi,
  WifiOff
} from 'lucide-react';
import { dashboardApi, researchApi, billingApi, dataApi } from '../services/api';

interface Report {
  _id: string;
  question: string;
  createdAt: string;
  keyTakeaways: any[];
  sources: any[];
  status: 'fresh' | 'stale';
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  credits: number;
  createdAt: string;
}

interface UsageStats {
  questionsAsked: number;
  reportsGenerated: number;
  reportsRefreshed: number;
  totalCreditsUsed: number;
  remainingCredits: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState({
    totalReports: 0,
    freshReports: 0,
    credits: 0,
    totalCredits: 0,
    usedCredits: 0,
    totalSources: 0
  });
  const [usageStats, setUsageStats] = useState<UsageStats>({
    questionsAsked: 0,
    reportsGenerated: 0,
    reportsRefreshed: 0,
    totalCreditsUsed: 0,
    remainingCredits: 0
  });
  const [dataFreshness, setDataFreshness] = useState({
    isFresh: true,
    lastUpdated: '',
    isUsingRealData: true
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        // Fetch all data in parallel to reduce loading time
        const [statsData, profileData, reportsData, creditsData, usageData, freshnessData] = await Promise.all([
          dashboardApi.getStats(user.id),
          dashboardApi.getProfile(user.id),
          researchApi.getReports(user.id),
          billingApi.getCredits(user.id),
          billingApi.getUsageStats(user.id),
          dataApi.checkDataFreshness()
        ]);
        
        // Calculate total sources across all reports
        const totalSources = reportsData.reduce((acc: number, report: any) => {
          return acc + (report.sources?.length || 0);
        }, 0);
        
        setProfile(profileData);
        setStats({
          totalReports: statsData.totalReports,
          freshReports: statsData.freshReports,
          credits: creditsData.credits,
          totalCredits: creditsData.totalCredits,
          usedCredits: creditsData.usedCredits,
          totalSources: totalSources
        });
        
        setUsageStats(usageData);
        
        setDataFreshness({
          isFresh: freshnessData.isFresh,
          lastUpdated: freshnessData.lastUpdated,
          isUsingRealData: true // Assuming we're using real data by default
        });
        
        // Transform reports data to match our interface
        const transformedReports = reportsData.map((report: any) => ({
          _id: report._id,
          question: report.question,
          createdAt: report.createdAt,
          keyTakeaways: report.keyTakeaways || [],
          sources: report.sources || [],
          status: 'fresh' // This would be determined by your business logic
        }));
        
        setReports(transformedReports);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getStatusColor = (status: string) => {
    return status === 'fresh' ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100';
  };

  const getStatusText = (status: string) => {
    return status === 'fresh' ? 'Fresh' : 'Stale';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSourceTypeCount = (reports: Report[], type: string) => {
    return reports.reduce((count, report) => {
      return count + report.sources.filter((source: any) => source.type === type).length;
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold gradient-text mb-4">Research Dashboard</h1>
          <p className="text-xl text-gray-700 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20 max-w-2xl mx-auto">
            Comprehensive overview of your research activity and usage analytics
          </p>
        </div>

        {/* Data Source Status */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
          <CardHeader className="flex flex-row items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Wifi className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Real-Time Data Sources</CardTitle>
              <CardDescription className="flex items-center">
                Connected to live news and research sources
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">
              Your research is powered by real-time data from NewsAPI and other live sources. 
              All information is current and updated automatically.
            </p>
          </CardContent>
        </Card>

        {/* User Profile Card */}
        {profile && (
          <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
            <CardHeader className="flex flex-row items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">{profile.name}</CardTitle>
                <CardDescription className="flex items-center">
                  <BadgeCheck className="w-4 h-4 mr-1 text-green-500" />
                  {profile.email}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Member since {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Flexprice Usage Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="card-hover bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Questions Asked</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{usageStats.questionsAsked}</div>
              <p className="text-sm text-blue-600 font-medium">
                → {usageStats.questionsAsked} credits used
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Reports Generated</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Plus className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{usageStats.reportsGenerated}</div>
              <p className="text-sm text-green-600 font-medium">
                → {usageStats.reportsGenerated} credits used
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-to-br from-orange-50 to-red-100 border-2 border-orange-200 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Reports Refreshed</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <RotateCcw className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{usageStats.reportsRefreshed}</div>
              <p className="text-sm text-orange-600 font-medium">
                → {usageStats.reportsRefreshed} credits used
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-to-br from-purple-50 to-pink-100 border-2 border-purple-200 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Total Credits Used</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{usageStats.totalCreditsUsed}</div>
              <p className="text-sm text-purple-600 font-medium">
                of {stats.totalCredits} total credits
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-to-br from-cyan-50 to-blue-100 border-2 border-cyan-200 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cyan-800">Remaining Credits</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-600">{usageStats.remainingCredits}</div>
              <p className="text-sm text-cyan-600 font-medium">
                {stats.totalCredits > 0 ? Math.round((usageStats.remainingCredits / stats.totalCredits) * 100) : 0}% remaining
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>
              Your latest research reports and their sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.length > 0 ? (
                reports.map((report) => (
                  <div key={report._id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{report.question}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(report.createdAt)}
                          </div>
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            {report.keyTakeaways.length} takeaways
                          </div>
                          <div className="flex items-center">
                            <Globe className="w-4 h-4 mr-1" />
                            {report.sources.length} sources
                          </div>
                          <div className="flex items-center">
                            <File className="w-4 h-4 mr-1" />
                            {report.sources.filter((s: any) => s.type === 'file').length} files
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {getStatusText(report.status)}
                        </span>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No reports yet. Start your first research to see reports here.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Data Freshness and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Freshness Indicator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Data Freshness
              </CardTitle>
              <CardDescription>
                Information about the recency of your research data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${dataFreshness.isFresh ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'}`}>
                    {dataFreshness.isFresh ? 'Fresh' : 'Stale'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Data Source</span>
                  <span className="flex items-center text-sm text-green-600 font-medium">
                    <Wifi className="w-4 h-4 mr-1" />
                    Live Sources
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Updated</span>
                  <span className="text-sm text-gray-600">
                    {dataFreshness.lastUpdated ? new Date(dataFreshness.lastUpdated).toLocaleString() : 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Fresh Reports (last 7 days)</span>
                  <span className="text-sm text-green-600 font-semibold">{stats.freshReports}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Stale Reports (older than 7 days)</span>
                  <span className="text-sm text-yellow-600 font-semibold">{stats.totalReports - stats.freshReports}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${stats.totalReports > 0 ? (stats.freshReports / stats.totalReports) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">
                  Consider refreshing stale reports to get the latest information
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline" onClick={async () => {
                try {
                  await dataApi.updateDataSources();
                  // Refresh the data freshness status
                  const freshnessData = await dataApi.checkDataFreshness();
                  setDataFreshness({
                    isFresh: freshnessData.isFresh,
                    lastUpdated: freshnessData.lastUpdated,
                    isUsingRealData: true
                  });
                } catch (error) {
                  console.error('Failed to refresh data sources:', error);
                }
              }}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh All Data Sources
              </Button>
              <Button className="w-full" variant="outline">
                Export Research History
              </Button>
              <Button className="w-full" variant="outline">
                View Usage Analytics
              </Button>
              <Button className="w-full">
                Start New Research
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
