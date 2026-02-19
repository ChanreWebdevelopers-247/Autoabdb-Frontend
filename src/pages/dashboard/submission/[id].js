import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { listSubmissions, approveSubmission, rejectSubmission } from '@/redux/actions/submissionActions';

const SubmissionDetailPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const { items, loading, reviewLoading } = useSelector((s) => s.submission);
  const { user } = useSelector((s) => s.auth);

  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    if (!id) return;
    if (items.length === 0) {
      dispatch(listSubmissions({ page: 1, limit: 100 }));
    }
  }, [id, dispatch, items.length]);

  useEffect(() => {
    if (!id) return;
    const found = items.find((i) => i._id === id);
    setSubmission(found || null);
  }, [id, items]);

  const handleApprove = async () => {
    await dispatch(approveSubmission({ id }));
    dispatch(listSubmissions({ page: 1, limit: 100 }));
  };

  const handleReject = async () => {
    const note = prompt('Optional review note:') || undefined;
    await dispatch(rejectSubmission({ id, reviewNote: note }));
    dispatch(listSubmissions({ page: 1, limit: 100 }));
  };

  return (
    <Layout>
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Submission Details</h1>
            <p className="text-gray-600 text-xs">Review submission information</p>
          </div>
          <Link href="/dashboard/submission" className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50">Back</Link>
        </div>

        {loading && <div className="text-sm">Loading...</div>}
        {!loading && !submission && <div className="text-sm">Not found</div>}

        {submission && (
          <div className="bg-white border rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ['Disease', submission.disease],
                ['Autoantibody', submission.autoantibody],
                ['Autoantigen', submission.autoantigen],
                ['Epitope', submission.epitope],
                ['UniProt ID', submission.uniprotId],
                ['Disease Association', submission.diseaseAssociation],
                ['Epitope Prevalence', submission.epitopePrevalence],
                ['Affinity', submission.affinity],
                ['Avidity', submission.avidity],
                ['Mechanism', submission.mechanism],
                ['Isotype Subclasses', submission.isotypeSubclasses],
                ['Sensitivity', submission.sensitivity],
                ['Diagnostic Marker', submission.diagnosticMarker],
                ['Association With Disease Activity', submission.associationWithDiseaseActivity],
                ['Pathogenesis Involvement', submission.pathogenesisInvolvement],
                ['Reference', submission.reference],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="text-xs text-gray-500">{label}</div>
                  <div className="text-sm text-gray-900">{value || '—'}</div>
                </div>
              ))}
            </div>

            {submission.additional && Object.keys(submission.additional).length > 0 && (
              <div>
                <div className="text-sm font-semibold mb-2">Additional</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(submission.additional).map(([k, v]) => (
                    <div key={k} className="bg-gray-50 p-2 rounded border">
                      <div className="text-xs text-gray-500">{k}</div>
                      <div className="text-sm">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between border-t pt-4">
              <div className="text-xs text-gray-500">Status: <span className="capitalize">{submission.status}</span></div>
              {user?.role === 'superAdmin' && submission.status === 'pending' && (
                <div className="flex gap-2">
                  <button disabled={reviewLoading} onClick={handleApprove} className="px-3 py-2 border rounded text-green-700">Approve</button>
                  <button disabled={reviewLoading} onClick={handleReject} className="px-3 py-2 border rounded text-red-700">Reject</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SubmissionDetailPage;


