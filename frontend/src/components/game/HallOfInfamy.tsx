import React, { useState } from 'react';
import { useGameStore } from '../../stores/composedStore';
import Card from '../ui/Card';

export const HallOfInfamy: React.FC = () => {
  const { legacyBook, hallOfInfamy, daemons } = useGameStore();
  const [selectedBloodline, setSelectedBloodline] = useState<string | null>(
    null
  );

  const bloodlines = Object.keys(legacyBook);
  const recentStories = hallOfInfamy.slice(-10).reverse(); // Last 10 stories, newest first

  const getCategoryIcon = (category: string) => {
    const icons = {
      heroic: '🦸',
      tragic: '💀',
      absurd: '🤪',
      legendary: '⭐',
    };
    return icons[category as keyof typeof icons] || '📖';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      heroic: 'text-blue-300',
      tragic: 'text-red-300',
      absurd: 'text-purple-300',
      legendary: 'text-yellow-300',
    };
    return colors[category as keyof typeof colors] || 'text-gray-300';
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const getBloodlineStatus = (bloodline: string) => {
    const legacy = legacyBook[bloodline];
    const activeDaemons = daemons.filter(
      d => d.bloodline === bloodline && d.isActive
    );
    const totalGenerations = legacy.generation;
    const totalStories = legacy.stories.length;
    const legends = legacy.legends.length;

    return {
      activeDaemons: activeDaemons.length,
      totalGenerations,
      totalStories,
      legends,
      isExtinct: activeDaemons.length === 0,
    };
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-900 to-purple-900">
      <h2 className="text-xl font-bold text-white mb-4">📚 Hall of Infamy</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bloodline Summary */}
        <div>
          <h3 className="text-lg font-semibold text-purple-300 mb-3">
            Daemon Bloodlines
          </h3>
          {bloodlines.length === 0 ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-2">🏛️</div>
              <p className="text-gray-400">No legacies recorded yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {bloodlines.map(bloodline => {
                const status = getBloodlineStatus(bloodline);
                const legacy = legacyBook[bloodline];

                return (
                  <div
                    key={bloodline}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedBloodline === bloodline
                        ? 'border-purple-400 bg-purple-500/20'
                        : status.isExtinct
                          ? 'border-gray-600 bg-gray-700/30'
                          : 'border-blue-500 bg-blue-500/10 hover:bg-blue-500/20'
                    }`}
                    onClick={() =>
                      setSelectedBloodline(
                        selectedBloodline === bloodline ? null : bloodline
                      )
                    }
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4
                          className={`font-semibold ${status.isExtinct ? 'text-gray-400' : 'text-white'}`}
                        >
                          {bloodline}
                          {status.isExtinct && ' (Extinct)'}
                        </h4>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p>Generation {status.totalGenerations}</p>
                          <p>
                            {status.totalStories} stories • {status.legends}{' '}
                            legends
                          </p>
                          {!status.isExtinct && (
                            <p>{status.activeDaemons} active daemons</p>
                          )}
                        </div>
                      </div>
                      {status.legends > 0 && (
                        <div className="text-right">
                          <div className="text-yellow-400 text-lg">⭐</div>
                          <div className="text-xs text-yellow-300">
                            {status.legends} legends
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expanded Bloodline Details */}
                    {selectedBloodline === bloodline && (
                      <div className="mt-4 pt-4 border-t border-gray-600">
                        <h5 className="font-medium text-purple-300 mb-2">
                          Achievements:
                        </h5>
                        {legacy.achievements.length > 0 ? (
                          <ul className="text-sm text-gray-300 space-y-1">
                            {legacy.achievements.map((achievement, index) => (
                              <li key={index}>• {achievement}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-400">
                            No achievements recorded
                          </p>
                        )}

                        {legacy.legends.length > 0 && (
                          <div className="mt-3">
                            <h5 className="font-medium text-yellow-300 mb-2">
                              Legends:
                            </h5>
                            {legacy.legends.map((legend, index) => (
                              <div
                                key={index}
                                className="p-2 bg-yellow-600/20 rounded mb-2"
                              >
                                <h6 className="font-medium text-yellow-300">
                                  {legend.name}
                                </h6>
                                <p className="text-xs text-yellow-100">
                                  {legend.description}
                                </p>
                                <div className="text-xs text-gray-300 mt-1">
                                  Effects:{' '}
                                  {legend.effects
                                    .map(e => `${e.type} +${e.value}`)
                                    .join(', ')}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {legacy.stories.length > 0 && (
                          <div className="mt-3">
                            <h5 className="font-medium text-blue-300 mb-2">
                              Recent Stories:
                            </h5>
                            <div className="max-h-32 overflow-y-auto space-y-2">
                              {legacy.stories
                                .slice(-3)
                                .reverse()
                                .map(story => (
                                  <div
                                    key={story.id}
                                    className="p-2 bg-gray-800 rounded"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <span className="text-lg">
                                        {getCategoryIcon(story.category)}
                                      </span>
                                      <h6
                                        className={`font-medium text-sm ${getCategoryColor(story.category)}`}
                                      >
                                        {story.title}
                                      </h6>
                                    </div>
                                    <p className="text-xs text-gray-300 mt-1">
                                      {story.description}
                                    </p>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Stories */}
        <div>
          <h3 className="text-lg font-semibold text-blue-300 mb-3">
            Recent Stories
          </h3>
          {recentStories.length === 0 ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-2">📖</div>
              <p className="text-gray-400">No stories written yet</p>
              <p className="text-sm text-gray-500">
                Complete missions to generate epic tales
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentStories.map(story => (
                <div
                  key={story.id}
                  className="p-3 bg-gray-800 rounded-lg border-l-4 border-opacity-50"
                  style={{
                    borderLeftColor:
                      story.category === 'heroic'
                        ? '#3B82F6'
                        : story.category === 'tragic'
                          ? '#EF4444'
                          : story.category === 'absurd'
                            ? '#8B5CF6'
                            : '#F59E0B',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <span className="text-xl">
                        {getCategoryIcon(story.category)}
                      </span>
                      <div>
                        <h4
                          className={`font-semibold ${getCategoryColor(story.category)}`}
                        >
                          {story.title}
                        </h4>
                        <p className="text-sm text-gray-300 mt-1">
                          {story.description}
                        </p>
                        <div className="text-xs text-gray-400 mt-2">
                          {formatTimestamp(story.timestamp)}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        story.category === 'heroic'
                          ? 'bg-blue-600/30 text-blue-300'
                          : story.category === 'tragic'
                            ? 'bg-red-600/30 text-red-300'
                            : story.category === 'absurd'
                              ? 'bg-purple-600/30 text-purple-300'
                              : 'bg-yellow-600/30 text-yellow-300'
                      }`}
                    >
                      {story.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h4 className="font-semibold text-gray-300 mb-3">Legacy Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-purple-300">
              {bloodlines.length}
            </div>
            <div className="text-xs text-gray-400">Bloodlines</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-300">
              {hallOfInfamy.length}
            </div>
            <div className="text-xs text-gray-400">Total Stories</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-300">
              {Object.values(legacyBook).reduce(
                (sum, legacy) => sum + legacy.legends.length,
                0
              )}
            </div>
            <div className="text-xs text-gray-400">Legends</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-300">
              {Math.max(0, ...Object.values(legacyBook).map(l => l.generation))}
            </div>
            <div className="text-xs text-gray-400">Max Generation</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
