import Layout from '../../components/Layout';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { 
  Plus, Users, UserPlus, Database, Activity, TrendingUp, 
  BarChart3, PieChart, Search, Filter, Download, RefreshCw,
  AlertCircle, CheckCircle, Target, FlaskConical, Shield,
  FileText, ArrowRight, Eye, Edit, Trash2, ExternalLink
} from 'lucide-react';
import { fetchUsers, fetchUserStats } from '../../redux/actions/userActions';
import { getStatistics, getAllEntries } from '../../redux/actions/diseaseActions';
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

const SuperAdminDashboard = () => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDiseases, setFilteredDiseases] = useState([]);

  const { users, loading: usersLoading, error: usersError, stats, statsLoading } = useSelector((state) => state.users);
  const { 
    statistics, 
    statisticsLoading, 
    error: diseaseStatsError,
    entries,
    loading: entriesLoading,
    pagination
  } = useSelector((state) => state.disease);

  useEffect(() => {
    dispatch(fetchUsers({ limit: 10, sortBy: 'createdAt', sortOrder: 'desc' }));
    dispatch(fetchUserStats());
    dispatch(getStatistics());
    dispatch(getAllEntries({ page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' }));
  }, [dispatch]);

  // Filter diseases based on search
  useEffect(() => {
    if (statistics?.diseaseBreakdown) {
      if (!searchQuery.trim()) {
        setFilteredDiseases(statistics.diseaseBreakdown);
      } else {
        const filtered = statistics.diseaseBreakdown.filter(d => 
          d._id?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredDiseases(filtered);
      }
    }
  }, [searchQuery, statistics]);

  const recentUsers = useMemo(() => Array.isArray(users) ? users.slice(0, 6) : [], [users]);
  const recentEntries = useMemo(() => Array.isArray(entries) ? entries.slice(0, 10) : [], [entries]);

  const isLoading = usersLoading || statsLoading || statisticsLoading || entriesLoading;
  const anyError = usersError || diseaseStatsError;

  // Prepare chart data
  const diseaseChartData = useMemo(() => {
    if (!statistics?.diseaseBreakdown) return [];
    return filteredDiseases.slice(0, 10).map(item => ({
      name: item._id?.length > 20 ? item._id.substring(0, 20) + '...' : item._id || 'Unknown',
      fullName: item._id || 'Unknown',
      count: item.count || 0
    }));
  }, [statistics, filteredDiseases]);

  const antibodyChartData = useMemo(() => {
    if (!statistics?.topAntibodies) return [];
    return statistics.topAntibodies.map(item => ({
      name: item._id?.length > 25 ? item._id.substring(0, 25) + '...' : item._id || 'Unknown',
      fullName: item._id || 'Unknown',
      count: item.count || 0
    }));
  }, [statistics]);

  const antigenChartData = useMemo(() => {
    if (!statistics?.topAntigens) return [];
    return statistics.topAntigens.map(item => ({
      name: item._id?.length > 25 ? item._id.substring(0, 25) + '...' : item._id || 'Unknown',
      fullName: item._id || 'Unknown',
      count: item.count || 0
    }));
  }, [statistics]);

  const diagnosticMarkerData = useMemo(() => {
    if (!statistics?.diagnosticMarkerBreakdown) return [];
    return statistics.diagnosticMarkerBreakdown.map(item => ({
      name: item._id || 'Unknown',
      value: item.count || 0
    }));
  }, [statistics]);

  const overview = statistics?.overview || {};
  const statsData = [
    {
      label: 'Total Entries',
      value: overview.totalEntries || 0,
      icon: Database,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      change: '+12%'
    },
    {
      label: 'Unique Diseases',
      value: overview.uniqueDiseasesCount || 0,
      icon: Activity,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      change: '+5%'
    },
    {
      label: 'Autoantibodies',
      value: overview.uniqueAntibodiesCount || 0,
      icon: Target,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      change: '+8%'
    },
    {
      label: 'Autoantigens',
      value: overview.uniqueAntigensCount || 0,
      icon: FlaskConical,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      change: '+3%'
    },
    {
      label: 'UniProt IDs',
      value: overview.uniqueUniprotIdsCount || 0,
      icon: FileText,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      change: '+7%'
    },
    {
      label: 'Verified Entries',
      value: overview.verifiedEntries || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      change: '+15%'
    },
    {
      label: 'Total Users',
      value: stats?.overview?.totalUsers || 0,
      icon: Users,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700',
      change: '+2%'
    },
    {
      label: 'Active Users',
      value: stats?.overview?.activeUsers || 0,
      icon: Shield,
      color: 'bg-cyan-500',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-700',
      change: '+4%'
    }
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (anyError) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <div>
            <p className="text-red-800 font-medium">Error loading dashboard</p>
            <p className="text-red-600 text-sm">{anyError}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Comprehensive overview of diseases and autoantibodies</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/users/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors text-sm font-medium shadow-sm"
          >
            <UserPlus size={18} />
            Create User
          </Link>
          <Link
            href="/dashboard/disease/add-disease"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus size={18} />
            Add Disease
          </Link>
          <Link
            href="/dashboard/disease/disease"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm font-medium shadow-sm"
          >
            <Eye size={18} />
            Browse All
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                  {stat.change}
                </span>
              </div>
              <p className={`text-2xl font-bold ${stat.textColor} mb-1`}>
                {stat.value.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'diseases', label: 'Diseases', icon: Activity },
            { id: 'autoantibodies', label: 'Autoantibodies', icon: Target },
            { id: 'autoantigens', label: 'Autoantigens', icon: FlaskConical },
            { id: 'recent', label: 'Recent Entries', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Disease Breakdown Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Top Diseases</h3>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search diseases..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={diseaseChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                            <p className="font-semibold">{payload[0].payload.fullName}</p>
                            <p className="text-blue-600">{`Count: ${payload[0].value}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top Autoantibodies Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Autoantibodies</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={antibodyChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" fontSize={12} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={120}
                    fontSize={12}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                            <p className="font-semibold">{payload[0].payload.fullName}</p>
                            <p className="text-amber-600">{`Count: ${payload[0].value}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#f59e0b" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Diagnostic Marker Pie Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Diagnostic Markers</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={diagnosticMarkerData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {diagnosticMarkerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            {/* Top Autoantigens Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Autoantigens</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={antigenChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                            <p className="font-semibold">{payload[0].payload.fullName}</p>
                            <p className="text-purple-600">{`Count: ${payload[0].value}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Diseases Tab */}
        {selectedTab === 'diseases' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Disease Breakdown</h3>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search diseases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Disease</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Entries</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDiseases.slice(0, 20).map((disease, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">{disease._id || 'Unknown'}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium text-sm">
                          {disease.count || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Link
                          href={`/dashboard/disease/disease?disease=${encodeURIComponent(disease._id)}`}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          <Eye size={16} />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Autoantibodies Tab */}
        {selectedTab === 'autoantibodies' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Autoantibodies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {antibodyChartData.map((antibody, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-semibold text-xs">
                        {index + 1}
                      </span>
                      <h4 className="font-semibold text-gray-900">{antibody.fullName}</h4>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-gray-600">Total Entries:</span>
                    <span className="font-bold text-amber-600">{antibody.count}</span>
                  </div>
                  <Link
                    href={`/dashboard/disease/disease?autoantibody=${encodeURIComponent(antibody.fullName)}`}
                    className="mt-3 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Autoantigens Tab */}
        {selectedTab === 'autoantigens' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Autoantigens</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {antigenChartData.map((antigen, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-semibold text-xs">
                        {index + 1}
                      </span>
                      <h4 className="font-semibold text-gray-900">{antigen.fullName}</h4>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-gray-600">Total Entries:</span>
                    <span className="font-bold text-purple-600">{antigen.count}</span>
                  </div>
                  <Link
                    href={`/dashboard/disease/disease?autoantigen=${encodeURIComponent(antigen.fullName)}`}
                    className="mt-3 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Entries Tab */}
        {selectedTab === 'recent' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Disease Entries</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Disease</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Autoantibody</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Autoantigen</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Epitope</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">UniProt ID</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEntries.length > 0 ? (
                      recentEntries.map((entry, index) => (
                        <tr key={entry._id || index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{entry.disease || 'N/A'}</td>
                          <td className="py-3 px-4 text-gray-700">{entry.autoantibody || 'N/A'}</td>
                          <td className="py-3 px-4 text-gray-700">{entry.autoantigen || 'N/A'}</td>
                          <td className="py-3 px-4 text-gray-700">{entry.epitope || 'N/A'}</td>
                          <td className="py-3 px-4 text-gray-700">{entry.uniprotId || 'N/A'}</td>
                          <td className="py-3 px-4 text-center">
                            <Link
                              href={`/dashboard/disease/${entry._id}`}
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              <Eye size={16} />
                              View
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-gray-500">
                          No recent entries found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                <Link
                  href="/users"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentUsers.length > 0 ? (
                  recentUsers.map((user) => (
                    <div
                      key={user._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{user.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.role === 'superAdmin' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'Admin' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500 py-4">
                    No users found
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/users"
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <Users className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Manage Users</span>
          </Link>
          <Link
            href="/dashboard/disease/disease"
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <Database className="h-6 w-6 text-emerald-600" />
            <span className="text-sm font-medium text-gray-700">Browse Diseases</span>
          </Link>
          <Link
            href="/dashboard/disease/add-disease"
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <Plus className="h-6 w-6 text-amber-600" />
            <span className="text-sm font-medium text-gray-700">Add Disease</span>
          </Link>
          <Link
            href="/dashboard/admin"
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <BarChart3 className="h-6 w-6 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Admin View</span>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default SuperAdminDashboard;
