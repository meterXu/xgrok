import type {Project} from "xxweb-util";

declare global {
    interface Window {
        project: Project;
        app:Vue,
        appStore:any,
        $ls:any
    }
}

export {};
