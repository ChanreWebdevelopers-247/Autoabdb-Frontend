import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { listSubmissions, approveSubmission, rejectSubmission } from '@/redux/actions/submissionActions';

const SubmissionListPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error, pagination, reviewLoading } = useSelector((s) => s.submission);
  const { user } = useSelector((s) => s.auth);
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    dispatch(listSubmissions({ status, page: 1, limit: 10 }));
  }, [dispatch, status]);

  const handleApprove = async (id) => {
    await dispatch(approveSubmission({ id }));
    dispatch(listSubmissions({ status, page: pagination.page, limit: pagination.limit }));
  };

  const handleReject = async (id) => {
    const note = prompt('Optional review note:') || undefined;
    await dispatch(rejectSubmission({ id, reviewNote: note }));
    dispatch(listSubmissions({ status, page: pagination.page, limit: pagination.limit }));
  };

  return (
    <Layout>
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Disease Submissions</h1>
            <p className="text-gray-600 text-xs">Submit, review and manage disease entries</p>
          </div>
          <Link href="/dashboard/submission/new" className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50">
            New Submission
          </Link>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm text-gray-600">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-2 py-1 border rounded">
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {error && (
            <div className="text-red-600 text-sm mb-3">{error}</div>
          )}

          {loading ? (
            <div className="text-sm">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 px-2">Disease</th>
                    <th className="py-2 px-2">Antibody</th>
                    <th className="py-2 px-2">Antigen</th>
                    <th className="py-2 px-2">Epitope</th>
                    <th className="py-2 px-2">UniProt</th>
                    <th className="py-2 px-2">Submitted By</th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 px-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((s) => (
                    <tr key={s._id} className="border-b">
                      <td className="py-2 px-2">{s.disease}</td>
                      <td className="py-2 px-2">{s.autoantibody}</td>
                      <td className="py-2 px-2">{s.autoantigen}</td>
                      <td className="py-2 px-2">{s.epitope}</td>
                      <td className="py-2 px-2">{s.uniprotId}</td>
                      <td className="py-2 px-2">{s.submittedBy?.name || s.submittedBy?.username || '—'}</td>
                      <td className="py-2 px-2 capitalize">{s.status}</td>
                      <td className="py-2 px-2">
                        <div className="flex gap-2">
                          <Link href={`/dashboard/submission/${s._id}`} className="px-2 py-1 text-xs border rounded">View</Link>
                          {user?.role === 'superAdmin' && s.status === 'pending' && (
                            <>
                              <button disabled={reviewLoading} onClick={() => handleApprove(s._id)} className="px-2 py-1 text-xs border rounded text-green-700">
                                Approve
                              </button>
                              <button disabled={reviewLoading} onClick={() => handleReject(s._id)} className="px-2 py-1 text-xs border rounded text-red-700">
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SubmissionListPage;


