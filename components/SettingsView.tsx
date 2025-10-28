import React, { useState } from 'react';

type Integration = 'google' | 'slack' | 'trello' | 'asana';

const SettingsView: React.FC = () => {
    const [integrations, setIntegrations] = useState<Record<Integration, boolean>>({
        google: true,
        slack: false,
        trello: false,
        asana: false,
    });

    const toggleIntegration = (integration: Integration) => {
        setIntegrations(prev => ({ ...prev, [integration]: !prev[integration] }));
    };

    const integrationDetails = {
        google: { name: 'Google Tasks', description: 'Sync action points to your Google Tasks.' },
        slack: { name: 'Slack', description: 'Send notifications and summaries to Slack channels.' },
        trello: { name: 'Trello', description: 'Create Trello cards from action points.' },
        asana: { name: 'Asana', description: 'Create Asana tasks from action points.' },
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
            <p className="mt-2 text-gray-600 mb-6">Manage your integrations and preferences.</p>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Integrations</h2>
                <div className="space-y-4">
                    {Object.keys(integrationDetails).map(key => {
                        const integrationKey = key as Integration;
                        const isConnected = integrations[integrationKey];
                        return (
                            <div key={integrationKey} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <h3 className="font-semibold text-gray-700">{integrationDetails[integrationKey].name}</h3>
                                    <p className="text-sm text-gray-500">{integrationDetails[integrationKey].description}</p>
                                </div>
                                <button
                                    onClick={() => toggleIntegration(integrationKey)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                                        isConnected
                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                                >
                                    {isConnected ? 'Disconnect' : 'Connect'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
