import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { createSubmission } from '@/redux/actions/submissionActions';
import { clearSubmissionError, clearCreateSubmissionSuccess } from '@/redux/slices/submissionSlice';
import { toast } from 'react-toastify';

const NewSubmissionPage = () => {
  const dispatch = useDispatch();
  const { loading, error, createSuccess } = useSelector((s) => s.submission);

  const [formData, setFormData] = useState({
    disease: '',
    autoantibody: '',
    autoantigen: '',
    epitope: '',
    uniprotId: '',
    diseaseAssociation: '',
    epitopePrevalence: '',
    affinity: '',
    avidity: '',
    mechanism: '',
    isotypeSubclasses: '',
    sensitivity: '',
    diagnosticMarker: '',
    associationWithDiseaseActivity: '',
    pathogenesisInvolvement: '',
    reference: ''
  });
  const [additional, setAdditional] = useState([{ key: '', value: '' }]);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (createSuccess) {
      toast.success('Added successfully and pending approval.');
      dispatch(clearCreateSubmissionSuccess());
    }
  }, [createSuccess, dispatch]);

  useEffect(() => () => { dispatch(clearSubmissionError()); }, [dispatch]);

  const validate = () => {
    const e = {};
    ['disease','autoantibody','autoantigen','epitope','reference'].forEach((f) => {
      if (!formData[f]?.trim()) e[f] = 'Required';
    });
    setValidationErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const add = additional.reduce((acc, kv) => {
      const k = kv.key?.trim(); const v = kv.value?.toString().trim();
      if (k && v) acc[k] = v; return acc;
    }, {});
    const payload = Object.keys(add).length ? { ...formData, additional: add } : formData;
    console.log(payload)
    await dispatch(createSubmission(payload));
  };

  const setField = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const updateAdditional = (idx, key, value) => setAdditional((prev) => prev.map((r, i) => i === idx ? { ...r, [key]: value } : r));
  const addRow = () => setAdditional((prev) => [...prev, { key: '', value: '' }]);
  const removeRow = (idx) => setAdditional((prev) => prev.filter((_, i) => i !== idx));

  const formatLabel = (key) => {
    if (!key) return '';
    const spaced = key
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/_/g, ' ');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  };

  return (
    <Layout>
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold text-gray-900">New Disease Submission</h1>
            <p className="text-gray-600 text-xs">Submit a disease entry for super admin approval</p>
          </div>
          <Link href="/dashboard/submission" className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50">Back</Link>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}

        <div className="bg-white rounded-lg border border-gray-200 max-w-4xl mx-auto">
          <form onSubmit={onSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['disease','autoantibody','autoantigen','epitope'].map((f) => (
                <div key={f}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{formatLabel(f)} <span className="text-red-500">*</span></label>
                  <input name={f} value={formData[f]} onChange={setField} className={`w-full px-3 py-2 border rounded ${validationErrors[f] ? 'border-red-300' : 'border-gray-300'}`} />
                  {validationErrors[f] && <p className="text-xs text-red-600 mt-1">{validationErrors[f]}</p>}
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{formatLabel('reference')} <span className="text-red-500">*</span></label>
              <textarea 
                name="reference" 
                value={formData.reference} 
                onChange={setField} 
                rows={3}
                className={`w-full px-3 py-2 border rounded resize-vertical ${validationErrors.reference ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Enter reference information..."
              />
              {validationErrors.reference && <p className="text-xs text-red-600 mt-1">{validationErrors.reference}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['uniprotId','diseaseAssociation','epitopePrevalence','affinity','avidity','mechanism','isotypeSubclasses','sensitivity','diagnosticMarker','associationWithDiseaseActivity','pathogenesisInvolvement'].map((f) => (
                <div key={f}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{formatLabel(f)}</label>
                  <input name={f} value={formData[f]} onChange={setField} className="w-full px-3 py-2 border rounded border-gray-300" />
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Additional Fields</label>
                <button type="button" onClick={addRow} className="text-sm px-2 py-1 border rounded">Add</button>
              </div>
              <div className="space-y-2">
                {additional.map((r, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2">
                    <input className="col-span-5 px-3 py-2 border rounded border-gray-300" placeholder="Key" value={r.key} onChange={(e) => updateAdditional(idx, 'key', e.target.value)} />
                    <input className="col-span-6 px-3 py-2 border rounded border-gray-300" placeholder="Value" value={r.value} onChange={(e) => updateAdditional(idx, 'value', e.target.value)} />
                    <button type="button" onClick={() => removeRow(idx)} className="col-span-1 text-red-600">Remove</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="px-4 py-2 border rounded hover:bg-gray-50">
                {loading ? 'Submitting...' : 'Submit for Approval'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NewSubmissionPage;


