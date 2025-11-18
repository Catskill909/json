// Core plugin API definition for extensibility

export interface Plugin {
    id: string;
    name: string;
    version: string;
    register: (ctx: PluginContext) => void;
}

export interface PluginContext {
    addPane?: (pane: PaneConfig) => void;
    addControl?: (control: ControlConfig) => void;
    addValidator?: (validator: ValidatorConfig) => void;
    addTheme?: (theme: ThemeConfig) => void;
    // More extension points can be added here
}

export interface PaneConfig {
    id: string;
    title: string;
    component: React.ComponentType<any>;
    position?: 'left' | 'right' | 'bottom';
}

export interface ControlConfig {
    id: string;
    component: React.ComponentType<any>;
    position?: 'top' | 'abovePanes';
}

export interface ValidatorConfig {
    id: string;
    validate: (json: any) => ValidationResult;
}

export interface ValidationResult {
    valid: boolean;
    errors?: string[];
}

export interface ThemeConfig {
    id: string;
    name: string;
    themeObject: object;
}