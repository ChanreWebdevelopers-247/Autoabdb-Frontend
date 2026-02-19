// pages/dashboard/doctor.js
import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Users, ClipboardList, Plus, FileText, Database } from 'lucide-react';
import Layout from '../../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { getStatistics, getAllEntries } from '../../redux/actions/diseaseActions';

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const diseaseState = useSelector((state) => state.disease);
  const { statistics, statisticsLoading, statisticsError, entries, loading: entriesLoading, error: entriesError } = diseaseState;

  useEffect(() => {
    dispatch(getStatistics());
    dispatch(getAllEntries({ page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }));
  }, [dispatch]);

  const stats = useMemo(() => {
    const overview = statistics?.overview || {};
    return [
      { key: 'totalEntries', label: 'Total Entries', value: overview.totalEntries || 0, icon: Database, color: 'bg-blue-50 text-blue-600' },
      { key: 'uniqueDiseasesCount', label: 'Unique Diseases', value: overview.uniqueDiseasesCount || 0, icon: ClipboardList, color: 'bg-emerald-50 text-emerald-600' },
      { key: 'uniqueAntibodiesCount', label: 'Unique Antibodies', value: overview.uniqueAntibodiesCount || 0, icon: Users, color: 'bg-amber-50 text-amber-700' },
      // { key: 'verifiedEntries', label: 'Verified Entries', value: overview.verifiedEntries || 0, icon: FileText, color: 'bg-violet-50 text-violet-700' }
    ];
  }, [statistics]);



  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Doctor Dashboard</h1>
          <p className="text-sm text-gray-500">Overview of your day, patients, and tasks</p>
        </div>
       
      </div>

      {/* Stats (Redux: disease.statistics) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="border rounded-lg p-4 bg-white">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-md flex items-center justify-center ${s.color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <div className="text-xl font-semibold">{statisticsLoading ? '—' : s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-4">
        {/* Recent Disease Entries (Redux: disease.entries) */}
        <div className="border rounded-lg bg-white">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">Recent Disease Entries</h2>
            <Link href="/dashboard/disease/disease">
              <span className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer">Open Database</span>
            </Link>
          </div>
          <div className="divide-y">
            {entriesLoading && (
              <div className="p-4 text-sm text-gray-500">Loading...</div>
            )}
            {!entriesLoading && entriesError && (
              <div className="p-4 text-sm text-red-600">{entriesError}</div>
            )}
            {!entriesLoading && !entriesError && entries.map((e) => (
              <div key={e._id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center"><ClipboardList size={16} /></div>
                  <div>
                    <div className="text-sm font-medium">{e.disease} • {e.autoantibody}</div>
                    <div className="text-xs text-gray-500">{e.autoantigen} • {e.uniprotId}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/disease/${e._id}`}>
                    <span className="text-xs px-3 py-1 rounded-md border hover:bg-gray-50 cursor-pointer">Open</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </Layout>
  );
};

export default DoctorDashboard;
