import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Layout from "@/components/Layout";
import AIReport from "@/components/disease/AIReport";
import {
  ArrowLeft,
  Edit2Icon,
  Trash2,
  ExternalLink,
  Calendar,
  User,
  Database,
  AlertCircle,
  CheckCircle,
  Share2,
} from "lucide-react";
import {
  getEntryById,
  deleteEntry,
  getAllEntries,
} from "@/redux/actions/diseaseActions";
import {
  clearEntryError,
  clearDeleteSuccess,
} from "@/redux/slices/diseaseSlice";

const DiseaseDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();

  const {
    currentEntry,
    relatedEntries,
    entryLoading,
    entryError,
    deleteSuccess,
    loading,
  } = useSelector((state) => state.disease);

  const { user } = useSelector((state) => state.auth);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  console.log(currentEntry);

  // Helper function to check if user has admin privileges
  const isAdminOrSuperAdmin = () => {
    return user?.role === 'Admin' || user?.role === 'superAdmin';
  };
  // Load entry data when ID is available
  useEffect(() => {
    if (id && id !== "undefined") {
      dispatch(getEntryById(id));
    }
  }, [id, dispatch]);

  // Handle successful deletion
  useEffect(() => {
    if (deleteSuccess) {
      dispatch(clearDeleteSuccess());
      router.push("/dashboard/disease");
    }
  }, [deleteSuccess, dispatch, router]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearEntryError());
    };
  }, [dispatch]);

  const handleDelete = async () => {
    if (currentEntry?._id) {
      await dispatch(deleteEntry(currentEntry._id));
      setShowDeleteConfirm(false);
    }
  };


  const shareEntry = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Disease Entry: ${currentEntry?.disease}`,
          text: `${currentEntry?.autoantibody} - ${currentEntry?.autoantigen}`,
          url: url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getUniProtLink = (uniprotId) => {
    if (!uniprotId || uniprotId === "Multiple") return null;
    return `https://www.uniprot.org/uniprot/${uniprotId}`;
  };

  const handleRelatedEntryClick = (relatedEntry) => {
    router.push(`/dashboard/disease/${relatedEntry._id}`);
  };

  // Loading state
  if (entryLoading || !id) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-700 font-medium mt-6">Loading entry details...</p>
            <p className="text-gray-500 text-sm mt-2">Please wait</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (entryError) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-red-900 mb-2">
              Entry Not Found
            </h2>
            <p className="text-red-700 mb-6">{entryError}</p>
            <Link
              href="/dashboard/disease"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              <ArrowLeft size={18} />
              Back to Database
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // No entry state
  if (!currentEntry) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Database className="w-8 h-8 text-gray-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              No Entry Found
            </h2>
            <p className="text-gray-600 mb-6">
              The requested entry could not be loaded.
            </p>
            <Link
              href="/dashboard/disease"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              <ArrowLeft size={18} />
              Back to Database
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-xl px-6 py-5 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/disease/disease"
                className="flex items-center gap-2 px-3 py-2 text-white bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all duration-200 border border-white/30"
              >
                <ArrowLeft size={18} />
              </Link>
              <div className="hidden md:block h-6 w-px bg-white/30"></div>
              <h1 className="text-xl font-bold text-white">Details</h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={shareEntry}
                className="flex items-center gap-2 px-4 py-2 text-white bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all duration-200 border border-white/30"
                aria-label="Share this entry"
              >
                <Share2 size={18} />
                <span className="hidden sm:inline">Share</span>
              </button>
              {isAdminOrSuperAdmin() && (
                <>
                  <Link
                    href={`/dashboard/disease/edit/${currentEntry._id}`}
                    className="flex items-center gap-2 px-4 py-2 text-white bg-green-600/80 hover:bg-green-600 rounded-lg transition-all duration-200 border border-green-500/50"
                  >
                    <Edit2Icon size={18} />
                    <span className="hidden sm:inline">Edit</span>
                  </Link>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 text-white bg-red-600/80 hover:bg-red-600 rounded-lg transition-all duration-200 border border-red-500/50"
                    aria-label="Delete this entry"
                  >
                    <Trash2 size={18} />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>


        <div className="space-y-6">
          {/* Main Content */}
            {/* Primary Information Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">
                    Primary Information
                  </h2>
                  {currentEntry.metadata?.verified && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                      <CheckCircle size={18} className="text-white" />
                      <span className="text-sm font-medium text-white">Verified</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Disease
                      </label>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-lg border border-blue-200">
                        <p className="text-base font-bold text-blue-900">
                          {currentEntry.disease}
                        </p>
                      </div>
                    </div>

                    {currentEntry.databaseAccessionNumbers && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Database Accession Numbers
                        </label>
                        <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-900 font-mono">
                            {currentEntry.databaseAccessionNumbers}
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Autoantibody
                      </label>
                      <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {currentEntry.autoantibody}
                        </p>
                      </div>
                    </div>

                    {currentEntry.synonym && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Synonym
                        </label>
                        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 px-4 py-3 rounded-lg border border-yellow-200">
                          <p className="text-sm text-gray-900">
                            {currentEntry.synonym}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Autoantigen
                      </label>
                      <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {currentEntry.autoantigen}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Epitope
                      </label>
                      <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-900">
                          {currentEntry.epitope || (
                            <span className="text-gray-400 italic">
                              Not specified
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Type
                      </label>
                      <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-900">
                          {currentEntry.type || (
                            <span className="text-gray-400 italic">
                              Not specified
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* UniProt Information Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                <h2 className="text-lg font-bold text-white">
                  UniProt Information
                </h2>
              </div>

              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-lg border border-gray-200">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      UniProt ID
                    </label>
                    {currentEntry.uniprotId ? (
                      <span className="text-base font-mono font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200 inline-block">
                        {currentEntry.uniprotId}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Not available</span>
                    )}
                  </div>

                  {getUniProtLink(currentEntry.uniprotId) && (
                    <a
                      href={getUniProtLink(currentEntry.uniprotId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                    >
                      <ExternalLink size={18} />
                      View on UniProt
                    </a>
                  )}
                </div>
              </div>
            </div>

           

            {/* Clinical and Biological Information Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                <h2 className="text-lg font-bold text-white">
                  Clinical & Biological Information
                </h2>
              </div>

              <div className="p-6">

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Disease Association */}
                {currentEntry.diseaseAssociation && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Disease Association
                    </label>
                    <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-900">
                        {currentEntry.diseaseAssociation}
                      </p>
                    </div>
                  </div>
                )}

                {/* Epitope Prevalence */}
                {currentEntry.epitopePrevalence && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Epitope Prevalence
                    </label>
                    <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-900">
                        {typeof currentEntry.epitopePrevalence === 'number' 
                          ? `${(currentEntry.epitopePrevalence * 100).toFixed(1)}%`
                          : currentEntry.epitopePrevalence
                        }
                      </p>
                    </div>
                  </div>
                )}

                {/* Affinity */}
                {currentEntry.affinity && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Affinity
                    </label>
                    <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-900">
                        {currentEntry.affinity}
                      </p>
                    </div>
                  </div>
                )}

                {/* Avidity */}
                {currentEntry.avidity && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Avidity
                    </label>
                    <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-900">
                        {currentEntry.avidity}
                      </p>
                    </div>
                  </div>
                )}

                {/* Mechanism */}
                {currentEntry.mechanism && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Mechanism
                    </label>
                    <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-900">
                        {currentEntry.mechanism}
                      </p>
                    </div>
                  </div>
                )}

                {/* Isotype Subclasses */}
                {currentEntry.isotypeSubclasses && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Isotype Subclasses
                    </label>
                    <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-900">
                        {currentEntry.isotypeSubclasses}
                      </p>
                    </div>
                  </div>
                )}

                {/* Sensitivity */}
                {currentEntry.sensitivity && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Sensitivity
                    </label>
                    <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-900">
                        {currentEntry.sensitivity}
                      </p>
                    </div>
                  </div>
                )}

                {/* Diagnostic Marker */}
                {currentEntry.diagnosticMarker && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Diagnostic Marker
                    </label>
                    <div className={`px-4 py-3 rounded-lg border ${
                      currentEntry.diagnosticMarker === 'Yes' 
                        ? 'bg-green-50 text-green-800 border-green-200' 
                        : currentEntry.diagnosticMarker === 'No'
                        ? 'bg-red-50 text-red-800 border-red-200'
                        : 'bg-white text-gray-900 border-gray-200'
                    }`}>
                      <p className="text-sm font-medium">
                        {currentEntry.diagnosticMarker}
                      </p>
                    </div>
                  </div>
                )}

                {/* Association with Disease Activity */}
                {currentEntry.associationWithDiseaseActivity && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Disease Activity Association
                    </label>
                    <div className={`px-4 py-3 rounded-lg border ${
                      currentEntry.associationWithDiseaseActivity === 'Yes' 
                        ? 'bg-green-50 text-green-800 border-green-200' 
                        : currentEntry.associationWithDiseaseActivity === 'No'
                        ? 'bg-red-50 text-red-800 border-red-200'
                        : 'bg-white text-gray-900 border-gray-200'
                    }`}>
                      <p className="text-sm font-medium">
                        {currentEntry.associationWithDiseaseActivity}
                      </p>
                    </div>
                  </div>
                )}

                {/* Pathogenesis Involvement */}
                {currentEntry.pathogenesisInvolvement && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Pathogenesis Involvement
                    </label>
                    <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-900">
                        {currentEntry.pathogenesisInvolvement}
                      </p>
                    </div>
                  </div>
                )}

                {/* Screening */}
                {currentEntry.screening && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Screening
                    </label>
                    <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-900">
                        {currentEntry.screening}
                      </p>
                    </div>
                  </div>
                )}

                {/* Confirmation */}
                {currentEntry.confirmation && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Confirmation
                    </label>
                    <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-900">
                        {currentEntry.confirmation}
                      </p>
                    </div>
                  </div>
                )}

                {/* Monitoring */}
                {currentEntry.monitoring && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Monitoring
                    </label>
                    <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-900">
                        {currentEntry.monitoring}
                      </p>
                    </div>
                  </div>
                )}

                {/* Positive Predictive Values */}
                {currentEntry.positivePredictiveValues && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Positive Predictive Values
                    </label>
                    <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-900">
                        {currentEntry.positivePredictiveValues}
                      </p>
                    </div>
                  </div>
                )}

                {/* Negative Predictive Values */}
                {currentEntry.negativePredictiveValues && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Negative Predictive Values
                    </label>
                    <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-900">
                        {currentEntry.negativePredictiveValues}
                      </p>
                    </div>
                  </div>
                )}

                {/* Cross Reactivity Patterns */}
                {currentEntry.crossReactivityPatterns && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Cross Reactivity Patterns
                    </label>
                    <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-900">
                        {currentEntry.crossReactivityPatterns}
                      </p>
                    </div>
                  </div>
                )}

                {/* Reference Ranges and Cutoff Values */}
                {currentEntry.referenceRangesAndCutoffValues && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Reference Ranges and Cutoff Values
                    </label>
                    <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-900">
                        {currentEntry.referenceRangesAndCutoffValues}
                      </p>
                    </div>
                  </div>
                )}

                {/* Reference */}
                {currentEntry.reference && (
                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Reference
                    </label>
                    <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-900">
                        {currentEntry.reference}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              </div>
            </div>

            {/* Additional Information Card */}
            {(() => {
              // Normalize possible Map to plain object
              let additionalObj = {};
              if (currentEntry.additional) {
                if (
                  typeof currentEntry.additional.forEach === 'function' &&
                  typeof currentEntry.additional.get === 'function'
                ) {
                  currentEntry.additional.forEach((v, k) => {
                    additionalObj[k] = v;
                  });
                } else {
                  additionalObj = currentEntry.additional;
                }
              }
              const filteredEntries = additionalObj 
                ? Object.entries(additionalObj).filter(([key]) => key.toLowerCase() !== 'priority')
                : [];
              return filteredEntries.length > 0 ? (
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
                    <h2 className="text-lg font-bold text-white">
                      Additional Information
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredEntries.map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                          >
                            <label className="block text-xs font-semibold text-gray-500 tracking-wider mb-2 capitalize">
                              {key}
                            </label>
                            <p className="text-sm text-gray-900 break-words">
                              {value}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ) : null;
            })()}


             {/* AI-Generated Research Report */}
             {currentEntry.autoantibody && currentEntry.uniprotId && (
              <AIReport
                autoantibodyName={currentEntry.autoantibody}
                uniprotId={currentEntry.uniprotId}
              />
            )}

            {/* Related Entries */}
            {relatedEntries && relatedEntries.length > 0 && (
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">
                      Related Entries
                    </h2>
                    <span className="text-sm font-medium text-white bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/30">
                      {relatedEntries.length} found
                    </span>
                  </div>
                </div>

                <div className="p-6">

                <div className="space-y-3">
                  {relatedEntries.map((related) => (
                    <div
                      key={related._id}
                      className="p-5 bg-white rounded-lg border border-gray-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:border-purple-300 transition-all duration-200 cursor-pointer group"
                      onClick={() => handleRelatedEntryClick(related)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-blue-600">
                              {related.disease}
                            </span>
                            {related.disease !== currentEntry.disease && (
                              <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                Different Disease
                              </span>
                            )}
                            {related.autoantigen === currentEntry.autoantigen && (
                              <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                                Same Antigen
                              </span>
                            )}
                            {related.uniprotId === currentEntry.uniprotId && (
                              <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                Same UniProt
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Antibody:</span>
                              <span className="ml-1 text-gray-900">{related.autoantibody}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Antigen:</span>
                              <span className="ml-1 text-gray-900">{related.autoantigen}</span>
                            </div>
                          </div>
                          {related.epitope && (
                            <div className="mt-2">
                              <span className="text-sm text-gray-500">Epitope:</span>
                              <span className="ml-1 text-sm text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded">
                                {related.epitope}
                              </span>
                            </div>
                          )}
                          {related.diagnosticMarker && (
                            <div className="mt-2">
                              <span className={`text-sm px-2 py-1 rounded ${
                                related.diagnosticMarker === 'Yes' 
                                  ? 'bg-green-100 text-green-700' 
                                  : related.diagnosticMarker === 'No'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {related.diagnosticMarker === 'Yes' ? '✓' : related.diagnosticMarker === 'No' ? '✗' : '?'} Diagnostic Marker
                              </span>
                            </div>
                          )}
                        </div>
                        <ExternalLink size={16} className="text-blue-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              </div>
            )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Confirm Deletion
                  </h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Are you sure you want to delete this entry? This action cannot
                  be undone.
                </p>

                <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-lg mb-6 border-2 border-red-200">
                  <p className="text-xs font-semibold text-red-900 uppercase tracking-wider mb-2">
                    Entry to be deleted:
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {currentEntry.disease} - {currentEntry.autoantibody}
                  </p>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                  >
                    {loading ? "Deleting..." : "Delete Entry"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DiseaseDetailPage;
