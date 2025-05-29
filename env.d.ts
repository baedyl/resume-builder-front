interface ImportMetaEnv {
    VITE_API_AUDIENCE: string;
    VITE_API_URL: string;
    // Add other environment variables here if you use more
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}