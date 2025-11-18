// PluginManager: Loads and manages plugins, exposes extension points

import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { PaneConfig, ControlConfig, ValidatorConfig } from "./pluginApi";

interface PluginManagerState {
    panes: PaneConfig[];
    controls: ControlConfig[];
    validators: ValidatorConfig[];
}

const PluginManagerContext = createContext<PluginManagerState | undefined>(undefined);

export const PluginManagerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [panes] = useState<PaneConfig[]>([]);
    const [controls] = useState<ControlConfig[]>([]);
    const [validators] = useState<ValidatorConfig[]>([]);

    // PluginContext setup for future plugin registration

    // Example: Load plugins here (dynamic import or static list)
    // plugins.forEach(plugin => plugin.register(pluginContext));

    return (
        <PluginManagerContext.Provider value={{ panes, controls, validators }}>
            {children}
        </PluginManagerContext.Provider>
    );
};

export const usePluginManager = () => {
    const ctx = useContext(PluginManagerContext);
    if (!ctx) throw new Error("usePluginManager must be used within PluginManagerProvider");
    return ctx;
};