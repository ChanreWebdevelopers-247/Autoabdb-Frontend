import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Minus, 
  Eye, 
  Edit2Icon, 
  Activity,
  Zap,
  Shield,
  Target,
  Database,
  ExternalLink,
  TrendingUp
} from 'lucide-react';

const HierarchicalDiseaseView = ({ entries, user, loading }) => {
  const [expandedDiseases, setExpandedDiseases] = useState(new Set());
  const [expandedAutoantibodies, setExpandedAutoantibodies] = useState(new Set());

  // Group entries by disease name and sort by priority
  const groupedData = useMemo(() => {
    const groups = {};
    const diseasePriorityMap = new Map();
    
    entries.forEach(entry => {
      const diseaseName = entry.disease;
      // Parse priority robustly - handle string, number, null, undefined
      const parsePriority = (priority) => {
        if (priority == null || priority === '') return 0;
        const parsed = parseFloat(String(priority).trim());
        return isNaN(parsed) ? 0 : parsed;
      };
      
      const priority = parsePriority(entry.priority);
      
      // Track the highest priority for each disease
      if (!diseasePriorityMap.has(diseaseName) || diseasePriorityMap.get(diseaseName) < priority) {
        diseasePriorityMap.set(diseaseName, priority);
      }
      
      if (!groups[diseaseName]) {
        groups[diseaseName] = {
          disease: diseaseName,
          priority: priority,
          autoantibodies: {}
        };
      }
      
      const autoantibodyName = entry.autoantibody;
      if (!groups[diseaseName].autoantibodies[autoantibodyName]) {
        groups[diseaseName].autoantibodies[autoantibodyName] = [];
      }
      
      groups[diseaseName].autoantibodies[autoantibodyName].push(entry);
    });
    
    // Update priorities with the highest value for each disease
    Object.keys(groups).forEach(diseaseName => {
      groups[diseaseName].priority = diseasePriorityMap.get(diseaseName) || 0;
      
      // Sort entries within each autoantibody group by priority (high to low)
      Object.keys(groups[diseaseName].autoantibodies).forEach(autoantibodyName => {
        groups[diseaseName].autoantibodies[autoantibodyName].sort((a, b) => {
          // Parse priority robustly - handle string, number, null, undefined
          const parsePriority = (priority) => {
            if (priority == null || priority === '') return 0;
            const parsed = parseFloat(String(priority).trim());
            return isNaN(parsed) ? 0 : parsed;
          };
          
          const priorityA = parsePriority(a.priority);
          const priorityB = parsePriority(b.priority);
          
          // Sort by priority (descending - high to low priority numbers)
          if (priorityB !== priorityA) {
            return priorityB - priorityA; // Higher priority number first
          }
          return (a.autoantigen || '').localeCompare(b.autoantigen || '');
        });
      });
    });
    
    // Sort diseases by priority (high to low), then alphabetically
    const sortedGroups = {};
    Object.keys(groups)
      .sort((a, b) => {
        // Parse priority robustly - handle string, number, null, undefined
        const parsePriority = (priority) => {
          if (priority == null || priority === '') return 0;
          const parsed = parseFloat(String(priority).trim());
          return isNaN(parsed) ? 0 : parsed;
        };
        
        const priorityA = parsePriority(groups[a].priority);
        const priorityB = parsePriority(groups[b].priority);
        // First sort by priority (descending - high to low priority numbers)
        if (priorityB !== priorityA) {
          return priorityB - priorityA; // Higher priority number first
        }
        return a.localeCompare(b); // Alphabetical if same priority
      })
      .forEach(diseaseName => {
        sortedGroups[diseaseName] = groups[diseaseName];
      });
    
    return sortedGroups;
  }, [entries]);

  const toggleDiseaseExpansion = (diseaseName) => {
    const newExpanded = new Set(expandedDiseases);
    if (newExpanded.has(diseaseName)) {
      newExpanded.delete(diseaseName);
      // Also collapse all autoantibodies for this disease
      const autoantibodyKeys = Object.keys(groupedData[diseaseName]?.autoantibodies || {});
      autoantibodyKeys.forEach(key => {
        setExpandedAutoantibodies(prev => {
          const newAutoExpanded = new Set(prev);
          newAutoExpanded.delete(`${diseaseName}-${key}`);
          return newAutoExpanded;
        });
      });
    } else {
      newExpanded.add(diseaseName);
    }
    setExpandedDiseases(newExpanded);
  };

  const toggleAutoantibodyExpansion = (diseaseName, autoantibodyName) => {
    const key = `${diseaseName}-${autoantibodyName}`;
    setExpandedAutoantibodies(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(key)) {
        newExpanded.delete(key);
      } else {
        newExpanded.add(key);
      }
      return newExpanded;
    });
  };

  const isDiseaseExpanded = (diseaseName) => expandedDiseases.has(diseaseName);
  const isAutoantibodyExpanded = (diseaseName, autoantibodyName) => 
    expandedAutoantibodies.has(`${diseaseName}-${autoantibodyName}`);

  if (loading) {
    return (
      <div className="flex flex-col items-center py-16">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mb-4"></div>
        <div className="text-center">
          <p className="text-gray-600 text-xs font-medium mb-2">Loading Disease Data</p>
          <p className="text-gray-500 text-sm">Preparing hierarchical view...</p>
        </div>
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-gray-500">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Database className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold mb-3 text-gray-700">No Results Found</h3>
        <p className="text-center text-gray-400 max-w-md">Try adjusting your search terms or filters to discover more disease data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedData).map(([diseaseName, diseaseData]) => {
        const autoantibodyCount = Object.keys(diseaseData.autoantibodies).length;
        const totalEntries = Object.values(diseaseData.autoantibodies).flat().length;
        const isExpanded = isDiseaseExpanded(diseaseName);

        return (
          <div 
            key={diseaseName} 
            className="bg-white border border-gray-200 rounded-lg transition-shadow duration-200"
          >
            {/* Disease Header */}
            <div 
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              onClick={() => toggleDiseaseExpansion(diseaseName)}
            >
              <div className="flex items-center gap-4">
                {/* Disease Label */}
                <div className="bg-orange-500 rounded-lg px-3 py-1 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">Disease Name</span>
                </div>

                {/* Disease Info */}
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-800 mb-1">
                    {diseaseName}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{autoantibodyCount} {autoantibodyCount !== 1 ? 'autoantibodies' : 'autoantibody'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Database className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{totalEntries} total entries</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                    {autoantibodyCount} autoantibodies
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                    {totalEntries} entries
                  </span>
                </div>
                
                <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  {isExpanded ? (
                    <Minus size={20} />
                  ) : (
                    <Plus size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Autoantibodies List */}
            {isExpanded && (
              <div className="border-t border-gray-100 bg-gray-50">
                {Object.entries(diseaseData.autoantibodies).map(([autoantibodyName, entries]) => {
                  const isAutoExpanded = isAutoantibodyExpanded(diseaseName, autoantibodyName);
                  const entryCount = entries.length;

                  return (
                    <div 
                      key={autoantibodyName} 
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-100 transition-colors duration-200"
                    >
                      {/* Autoantibody Header */}
                      <div 
                        className="flex items-center justify-between p-5 pl-12 cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                        onClick={() => toggleAutoantibodyExpansion(diseaseName, autoantibodyName)}
                      >
                        <div className="flex items-center gap-4">
                          {/* Autoantibody Label */}
                          <div className="bg-green-200 rounded-lg px-3 py-1 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-700">Autoantibodies</span>
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-semibold text-gray-800 mb-1">
                              {autoantibodyName}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Zap className="w-4 h-4 text-gray-500" />
                              <span>{entryCount} associated autoantigen{entryCount !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full">
                            {entryCount} entries
                          </span>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                            {isAutoExpanded ? (
                              <Minus size={16} />
                            ) : (
                              <Plus size={16} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Autoantigens and Data */}
                      {isAutoExpanded && (
                        <div className="bg-white pl-20 pr-6 pb-6">
                          <div className="space-y-4">
                            {entries.map((entry, index) => (
                              <div 
                                key={entry._id || index} 
                                className="bg-white border border-gray-200 rounded-lg p-6 transition-shadow duration-200"
                              >
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex-1">
                                    {/* Autoantigen Header */}
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="bg-indigo-500  rounded-lg px-3 py-1 flex items-center justify-center">
                                        <span className="text-xs font-bold text-white">Auto Antigen - </span>
                                      </div>
                                      <h5 className="text-xs font-bold text-gray-800">
                                        {entry.autoantigen}
                                      </h5>
                                    </div>
                                    
                                    {/* Data Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                      {/* Epitope */}
                                      {entry.epitope && (
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1 mb-2">
                                            <Target className="w-3 h-3" />
                                            Epitope
                                          </label>
                                          <p className="text-gray-800 font-medium">{entry.epitope}</p>
                                        </div>
                                      )}

                                      {/* UniProt ID */}
                                      {entry.uniprotId && (
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1 mb-2">
                                            <Database className="w-3 h-3" />
                                            UniProt ID
                                          </label>
                                          <div className="mt-1">
                                            <Link
                                              href={`https://www.uniprot.org/uniprot/${entry.uniprotId}/entry`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900 font-mono text-sm font-bold hover:underline transition-colors duration-200"
                                            >
                                              {entry.uniprotId}
                                              <ExternalLink className="w-3 h-3" />
                                            </Link>
                                          </div>
                                        </div>
                                      )}

                                      {/* Type */}
                                      {entry.type && (
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1 mb-2">
                                            <Activity className="w-3 h-3" />
                                            Type
                                          </label>
                                          <p className="text-gray-800 font-medium">{entry.type}</p>
                                        </div>
                                      )}


                                      {/* Diagnostic Marker */}
                                      {entry.diagnosticMarker && (
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1 mb-2">
                                            <TrendingUp className="w-3 h-3" />
                                            Diagnostic Marker
                                          </label>
                                          <div className="mt-1">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                              entry.diagnosticMarker.toLowerCase() === 'yes' 
                                                ? 'bg-gray-200 text-gray-800 border border-gray-300' 
                                                : 'bg-gray-100 text-gray-800 border border-gray-300'
                                            }`}>
                                              {entry.diagnosticMarker}
                                            </span>
                                          </div>
                                        </div>
                                      )}

                                      {/* Sensitivity */}
                                      {/* {entry.sensitivity && (
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1 mb-2">
                                            <Zap className="w-3 h-3" />
                                            Sensitivity
                                          </label>
                                          <p className="text-gray-800 font-medium">{entry.sensitivity}</p>
                                        </div>
                                      )} */}

                                      {/* Disease Association */}
                                      {/* {entry.diseaseAssociation && (
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1 mb-2">
                                            <Shield className="w-3 h-3" />
                                            Disease Association
                                          </label>
                                          <p className="text-gray-800 font-medium">{entry.diseaseAssociation}</p>
                                        </div>
                                      )} */}

                                      {/* Affinity */}
                                      {/* {entry.affinity && (
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1 mb-2">
                                            <Target className="w-3 h-3" />
                                            Affinity
                                          </label>
                                          <p className="text-gray-800 font-medium">{entry.affinity}</p>
                                        </div>
                                      )} */}

                                      {/* Reference */}
                                      {/* {entry.reference && (
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:col-span-2 lg:col-span-3">
                                          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1 mb-2">
                                            <Database className="w-3 h-3" />
                                            Reference
                                          </label>
                                          <p className="text-gray-800 font-medium text-sm leading-relaxed">{entry.reference}</p>
                                        </div>
                                      )} */}
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex flex-col gap-2 ml-6">
                                    <Link
                                      href={`/dashboard/disease/${entry._id}`}
                                      className="p-3 text-indigo-600 border border-indigo-600 hover:text-white hover:bg-gray-600 rounded-lg transition-colors duration-200"
                                      title="View Details"
                                    >
                                      <Eye size={18} />
                                    </Link>
                                    {(user?.role === 'superAdmin' || user?.role === 'Admin') && (
                                      <Link
                                        href={`/dashboard/disease/edit/${entry._id}`}
                                        className="p-3 text-gray-600 hover:text-white hover:bg-gray-600 rounded-lg transition-colors duration-200"
                                        title="Edit Entry"
                                      >
                                        <Edit2Icon size={18} />
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HierarchicalDiseaseView;