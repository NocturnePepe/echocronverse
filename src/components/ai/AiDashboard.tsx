/**
 * 🎛️ AI CONTROL DASHBOARD - Phase 6.6 Administrative Interface
 * Strategic Co-Architect Implementation
 * 
 * Purpose: Comprehensive AI module monitoring and control interface
 * Architecture: Real-time dashboard with mystical theming and admin controls
 * 
 * COPILOT DAEMON STRATEGIC ENHANCEMENT:
 * - Real-time AI module status monitoring
 * - Event log streaming with filtering capabilities
 * - Emergency controls and override systems
 * - Performance metrics visualization
 */

import React, { useState, useEffect, useCallback } from 'react';
import { aiLogBus, AiLogEntry, AiSystemMetrics } from '../../ai/phase6x/aiLogBus';
import { checkAIStatus, activateDevAI, emergencyAIActivation, deactivateAI } from '../../ai/phase6x/runeGate';

interface AiDashboardProps {
  className?: string;
  isVisible?: boolean;
  onClose?: () => void;
}

interface DashboardState {
  isLoading: boolean;
  aiStatus: any;
  systemMetrics: AiSystemMetrics | null;
  recentEvents: AiLogEntry[];
  selectedModule: string;
  filterLevel: string;
  autoRefresh: boolean;
  emergencyMode: boolean;
}

export const AiDashboard: React.FC<AiDashboardProps> = ({
  className = '',
  isVisible = false,
  onClose
}) => {
  const [state, setState] = useState<DashboardState>({
    isLoading: true,
    aiStatus: null,
    systemMetrics: null,
    recentEvents: [],
    selectedModule: 'all',
    filterLevel: 'all',
    autoRefresh: true,
    emergencyMode: false
  });

  const [showEmergencyPanel, setShowEmergencyPanel] = useState(false);
  const [devPassword, setDevPassword] = useState('');
  const [emergencyCode, setEmergencyCode] = useState('');
  const [emergencyReason, setEmergencyReason] = useState('');

  /**
   * STRATEGIC ENHANCEMENT: Real-time Data Updates
   * - Subscribes to AI event stream for live monitoring
   * - Updates system metrics and status periodically
   * - Maintains dashboard state synchronization
   */
  const refreshDashboardData = useCallback(() => {
    try {
      const status = checkAIStatus();
      const metrics = aiLogBus.getSystemMetrics();
      const events = aiLogBus.getEvents({
        limit: 100,
        modules: state.selectedModule !== 'all' ? [state.selectedModule as any] : undefined,
        levels: state.filterLevel !== 'all' ? [state.filterLevel as any] : undefined
      });

      setState(prev => ({
        ...prev,
        aiStatus: status,
        systemMetrics: metrics,
        recentEvents: events,
        isLoading: false
      }));
    } catch (error) {
      console.error('🎛️ Dashboard refresh error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.selectedModule, state.filterLevel]);

  /**
   * COPILOT DAEMON ENHANCEMENT: Event Stream Subscription
   * - Sets up live event monitoring for real-time updates
   * - Filters events based on dashboard configuration
   * - Handles subscription lifecycle management
   */
  useEffect(() => {
    if (!isVisible) return;

    refreshDashboardData();

    // Subscribe to live events
    const subId = aiLogBus.subscribe((event: AiLogEntry) => {
      setState(prev => ({
        ...prev,
        recentEvents: [event, ...prev.recentEvents].slice(0, 100)
      }));
    });

    // Auto-refresh timer
    let refreshInterval: NodeJS.Timeout | null = null;
    if (state.autoRefresh) {
      refreshInterval = setInterval(refreshDashboardData, 5000);
    }

    return () => {
      if (subId) aiLogBus.unsubscribe(subId);
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [isVisible, state.autoRefresh, refreshDashboardData]);

  /**
   * STRATEGIC ENHANCEMENT: AI Module Control Functions
   * - Provides secure activation and deactivation controls
   * - Implements emergency override capabilities
   * - Maintains audit trail for all administrative actions
   */
  const handleDevActivation = async () => {
    try {
      const result = activateDevAI(devPassword);
      if (result.success) {
        aiLogBus.publish({
          module: 'system',
          level: 'info',
          message: 'Development mode activated via dashboard',
          data: { source: 'admin_dashboard', timestamp: Date.now() }
        });
        refreshDashboardData();
        setDevPassword('');
      } else {
        aiLogBus.publish({
          module: 'system',
          level: 'warn',
          message: `Development activation failed: ${result.message}`,
          data: { source: 'admin_dashboard', attempt: 'dev_activation' }
        });
      }
    } catch (error) {
      console.error('🎛️ Dev activation error:', error);
    }
  };

  const handleEmergencyActivation = async () => {
    try {
      const result = emergencyAIActivation(emergencyCode, emergencyReason);
      if (result.success) {
        setState(prev => ({ ...prev, emergencyMode: true }));
        aiLogBus.publish({
          module: 'system',
          level: 'error',
          message: `Emergency activation via dashboard: ${emergencyReason}`,
          data: { source: 'admin_dashboard', emergencyCode, timestamp: Date.now() }
        });
        refreshDashboardData();
        setEmergencyCode('');
        setEmergencyReason('');
        setShowEmergencyPanel(false);
      }
    } catch (error) {
      console.error('🎛️ Emergency activation error:', error);
    }
  };

  const handleDeactivation = async () => {
    try {
      const result = deactivateAI();
      if (result.success) {
        setState(prev => ({ ...prev, emergencyMode: false }));
        aiLogBus.publish({
          module: 'system',
          level: 'info',
          message: 'AI modules deactivated via dashboard',
          data: { source: 'admin_dashboard', timestamp: Date.now() }
        });
        refreshDashboardData();
      }
    } catch (error) {
      console.error('🎛️ Deactivation error:', error);
    }
  };

  /**
   * COPILOT DAEMON ENHANCEMENT: Event Log Management
   * - Provides event filtering and search capabilities
   * - Exports event logs for external analysis
   * - Clears event history with confirmation
   */
  const handleClearLogs = () => {
    if (window.confirm('🎛️ Clear all AI event logs? This action cannot be undone.')) {
      aiLogBus.clearEvents();
      refreshDashboardData();
    }
  };

  const handleExportLogs = () => {
    const exportData = aiLogBus.exportEvents();
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai_logs_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper functions for UI formatting
  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getStatusColor = (status: any): string => {
    if (!status?.isActivated) return 'text-red-400';
    if (state.emergencyMode) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getHealthColor = (health: string): string => {
    switch (health) {
      case 'optimal': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getLevelIcon = (level: string): string => {
    switch (level) {
      case 'error': return '🚨';
      case 'warn': return '⚠️';
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      case 'debug': return '🔍';
      default: return '📝';
    }
  };

  const getModuleIcon = (module: string): string => {
    switch (module) {
      case 'optimizer': return '⚡';
      case 'sentinel': return '🛡️';
      case 'uxAgent': return '📊';
      case 'system': return '🔄';
      case 'feedback': return '🔄';
      case 'memory': return '📝';
      default: return '🤖';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-gray-900 border border-purple-500 rounded-lg w-full max-w-6xl h-5/6 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-4 flex items-center justify-between border-b border-purple-500">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🎛️</span>
            <h2 className="text-xl font-bold text-white">AI Control Dashboard</h2>
            <span className="text-purple-300 text-sm">Phase 6.6 Strategic Interface</span>
            {state.emergencyMode && (
              <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                EMERGENCY MODE
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setState(prev => ({ ...prev, autoRefresh: !prev.autoRefresh }))}
              className={`px-3 py-1 rounded text-sm ${
                state.autoRefresh ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
              }`}
            >
              {state.autoRefresh ? '🔄 Auto' : '⏸️ Manual'}
            </button>
            <button
              onClick={refreshDashboardData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            >
              🔄 Refresh
            </button>
            <button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              ❌ Close
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Controls */}
          <div className="w-80 bg-gray-800 border-r border-purple-500 p-4 overflow-y-auto">
            <div className="space-y-6">
              {/* System Status */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">🔄 System Status</h3>
                <div className="bg-gray-700 rounded p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">AI Status:</span>
                    <span className={getStatusColor(state.aiStatus)}>
                      {state.aiStatus?.isActivated ? '🟢 Active' : '🔴 Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">System Health:</span>
                    <span className={getHealthColor(state.systemMetrics?.systemHealth || 'unknown')}>
                      {state.systemMetrics?.systemHealth || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Events:</span>
                    <span className="text-blue-400">{state.systemMetrics?.totalEvents || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Subscriptions:</span>
                    <span className="text-green-400">{state.systemMetrics?.activeSubscriptions || 0}</span>
                  </div>
                </div>
              </div>

              {/* Activation Controls */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">🜃 Activation Controls</h3>
                <div className="space-y-3">
                  {/* Development Activation */}
                  <div className="bg-gray-700 rounded p-3">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Development Mode
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="password"
                        value={devPassword}
                        onChange={(e) => setDevPassword(e.target.value)}
                        placeholder="Dev password"
                        className="flex-1 bg-gray-600 text-white px-2 py-1 rounded text-sm"
                      />
                      <button
                        onClick={handleDevActivation}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Activate
                      </button>
                    </div>
                  </div>

                  {/* Emergency Panel Toggle */}
                  <button
                    onClick={() => setShowEmergencyPanel(!showEmergencyPanel)}
                    className={`w-full py-2 px-3 rounded text-sm font-medium ${
                      showEmergencyPanel
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    🚨 Emergency Controls
                  </button>

                  {showEmergencyPanel && (
                    <div className="bg-red-900 border border-red-500 rounded p-3 space-y-2">
                      <input
                        type="text"
                        value={emergencyCode}
                        onChange={(e) => setEmergencyCode(e.target.value)}
                        placeholder="Emergency code"
                        className="w-full bg-gray-600 text-white px-2 py-1 rounded text-sm"
                      />
                      <input
                        type="text"
                        value={emergencyReason}
                        onChange={(e) => setEmergencyReason(e.target.value)}
                        placeholder="Emergency reason"
                        className="w-full bg-gray-600 text-white px-2 py-1 rounded text-sm"
                      />
                      <button
                        onClick={handleEmergencyActivation}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-1 rounded text-sm"
                      >
                        Emergency Activate
                      </button>
                    </div>
                  )}

                  {/* Deactivation */}
                  <button
                    onClick={handleDeactivation}
                    disabled={!state.aiStatus?.isActivated}
                    className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white py-2 rounded text-sm"
                  >
                    🛑 Deactivate AI
                  </button>
                </div>
              </div>

              {/* Event Filters */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">🔍 Event Filters</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Module</label>
                    <select
                      value={state.selectedModule}
                      onChange={(e) => setState(prev => ({ ...prev, selectedModule: e.target.value }))}
                      className="w-full bg-gray-600 text-white px-2 py-1 rounded text-sm"
                    >
                      <option value="all">All Modules</option>
                      <option value="system">System</option>
                      <option value="optimizer">Optimizer</option>
                      <option value="sentinel">Sentinel</option>
                      <option value="uxAgent">UX Agent</option>
                      <option value="feedback">Feedback</option>
                      <option value="memory">Memory</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Level</label>
                    <select
                      value={state.filterLevel}
                      onChange={(e) => setState(prev => ({ ...prev, filterLevel: e.target.value }))}
                      className="w-full bg-gray-600 text-white px-2 py-1 rounded text-sm"
                    >
                      <option value="all">All Levels</option>
                      <option value="error">Errors</option>
                      <option value="warn">Warnings</option>
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="debug">Debug</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Log Controls */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">📝 Log Management</h3>
                <div className="space-y-2">
                  <button
                    onClick={handleExportLogs}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm"
                  >
                    📤 Export Logs
                  </button>
                  <button
                    onClick={handleClearLogs}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm"
                  >
                    🗑️ Clear Logs
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Event Log */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-gray-800 p-4 border-b border-gray-600">
              <h3 className="text-lg font-semibold text-white">📊 Real-time Event Stream</h3>
              <p className="text-gray-400 text-sm">
                Showing {state.recentEvents.length} events 
                {state.selectedModule !== 'all' && ` from ${state.selectedModule}`}
                {state.filterLevel !== 'all' && ` at ${state.filterLevel} level`}
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-gray-900 p-4">
              {state.isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin text-4xl mb-4">🔄</div>
                    <p className="text-gray-400">Loading AI dashboard...</p>
                  </div>
                </div>
              ) : state.recentEvents.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🤖</div>
                    <p className="text-gray-400">No events to display</p>
                    <p className="text-gray-500 text-sm">AI modules may be inactive or filtered</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {state.recentEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`bg-gray-800 border-l-4 p-3 rounded-r ${
                        event.level === 'error' ? 'border-red-500' :
                        event.level === 'warn' ? 'border-yellow-500' :
                        event.level === 'success' ? 'border-green-500' :
                        event.level === 'info' ? 'border-blue-500' :
                        'border-gray-500'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <span className="text-lg">
                            {getModuleIcon(event.module)} {getLevelIcon(event.level)}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-purple-400">
                                {event.module}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                event.level === 'error' ? 'bg-red-600' :
                                event.level === 'warn' ? 'bg-yellow-600' :
                                event.level === 'success' ? 'bg-green-600' :
                                event.level === 'info' ? 'bg-blue-600' :
                                'bg-gray-600'
                              }`}>
                                {event.level}
                              </span>
                            </div>
                            <p className="text-white text-sm mb-1">{event.message}</p>
                            {event.data && (
                              <pre className="text-xs text-gray-400 bg-gray-700 p-2 rounded overflow-x-auto">
                                {JSON.stringify(event.data, null, 2)}
                              </pre>
                            )}
                            {event.mysticalContext && (
                              <div className="mt-2 text-xs text-purple-300">
                                🔮 Cult Significance: {event.mysticalContext.cultSignificance}
                                {event.mysticalContext.ritualPhase && ` | Phase: ${event.mysticalContext.ritualPhase}`}
                                {event.mysticalContext.emergencyLevel !== 'none' && 
                                  ` | Emergency: ${event.mysticalContext.emergencyLevel}`
                                }
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 ml-3">
                          {formatTimestamp(event.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiDashboard;
