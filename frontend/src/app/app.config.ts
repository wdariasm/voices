import {  InjectionToken } from '@angular/core'

export interface AppConfig {
    apiEndpoint: string;
    title :string;
}


export const SUPERVOICES_CONFIG: AppConfig = {
    apiEndpoint: 'http://127.0.0.1:8000/api/',
    //apiEndpoint: '/api/',
    title: 'SuperVoices'
};

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');