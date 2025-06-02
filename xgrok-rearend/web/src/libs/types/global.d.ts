declare global {
    interface Window {
        project: ProjectType;
        app:Vue,
        appStore:any,
        $ls:any
    }
}

export {};