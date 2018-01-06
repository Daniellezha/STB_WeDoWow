import { registerLocaleData } from '@angular/common';
import { Injectable } from '@angular/core';

declare var System: any;

const BaseLocale: string = 'en-GB';
const SupportedRegions: string[] = ['us', 'gb', 'br', 'ca', 'au']
const DefaultRegionLocales: string[] = ['en-US', 'en-GB', 'pt-BR', 'en-CA', 'en-AU']
const SupportedLocales: string[] = ['en-US', 'en-GB', 'en', 'gb', 'br', 'es-BR', 'es-US', 'es', 'pt-BR', 'pt', 'en-CA', 'fr-CA', 'en-AU', 'en-IE', 'ca', 'ie']

@Injectable()
export class LocaleService {
    getLocale(): string {
        if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
            return BaseLocale;
        }

        var preferredLanguageIsDefaultElement = <HTMLInputElement>window.document.getElementById('SessionContext.DefaultLanguageApplied');

        let locale: any;

        if (preferredLanguageIsDefaultElement.value === '1') {
            locale = window.navigator['languages'] ? window.navigator['languages'][0] : null;
            locale = locale || window.navigator.language || window.navigator['browserLanguage'] as string || window.navigator['userLanguage'] as string || window.document['locale'] as string;
        }
        else {
            var preferredLanguage1Element = <HTMLInputElement>window.document.getElementById('SessionContext.PreferredLanguage');
            locale = preferredLanguage1Element.value;
        }

        var alternateLocale = this.getNormalizedLocale(locale);

        if (SupportedLocales.indexOf(alternateLocale) !== -1) {
            if (alternateLocale == 'en-IE' || alternateLocale == 'en' || alternateLocale == 'gb' || alternateLocale == 'ie') {
                return 'en-GB'
            }
            if (alternateLocale == 'pt' || alternateLocale == 'br') {
                return 'pt-BR'
            }
            if (alternateLocale == 'ca') {
                return 'en-CA'
            }
            if (alternateLocale == 'es') {
                return 'es-BR'
            }

            return alternateLocale;
        }

        var region = this.getLocaleRegion(locale);

        if (SupportedRegions.indexOf(region) !== -1) {
            return DefaultRegionLocales[SupportedRegions.indexOf(region)];
        }

        var language = this.getLocaleLanguage(locale);

        if (SupportedLocales.indexOf(language) !== -1) {
            if (language = 'fr') {
                return 'fr-CA'
            }
            if (language = 'pt') {
                return 'pt-BR'
            }
            if (language = 'es') {
                return 'es-PT'
            }

            return 'en-GB';
        }

        return BaseLocale;
    }

    getLocaleLanguageFile() {
        var locale = this.getLocale();

        if (locale == 'en-US') {
            return 'messages.en-US.xlf'
        }
        if (locale == 'es-BR') {
            return 'messages.es-BR.xlf'
        }
        if (locale == 'es-US') {
            return 'messages.es-US.xlf'
        }
        if (locale == 'fr-CA') {
            return 'messages.fr.xlf'
        }
        if (locale == 'pt-BR') {
            return 'messages.pt.xlf'
        }

        return 'messages.en.xlf'
    }

    private getNormalizedLocale(locale: string): string {
        if (locale.indexOf('-') !== -1) {
            var parts = locale.split('-');
            locale = parts[0].toLowerCase() + '-' + parts[1].toUpperCase();
        }
        else if (locale.indexOf('_') !== -1) {
            var parts = locale.split('_');
            locale = parts[0].toLowerCase() + '_' + parts[1].toUpperCase();
        }
        else {
            locale = locale.toLowerCase();
        }

        return locale;
    }

    private getLocaleRegion(locale: string): string {
        if (locale.indexOf('-') !== -1) {
            var parts = locale.split('-');
            locale = parts[1].toLowerCase();
        }
        else if (locale.indexOf('_') !== -1) {
            var parts = locale.split('_');
            locale = parts[1].toLowerCase();
        }

        return locale;
    }

    private getLocaleLanguage(locale: string): string {
        if (locale.indexOf('-') !== -1) {
            var parts = locale.split('-');
            locale = parts[0].toLowerCase();
        }
        else if (locale.indexOf('_') !== -1) {
            var parts = locale.split('_');
            locale = parts[0].toLowerCase();
        }

        return locale;
    }
}

export function localeIdFactory(localeService: LocaleService) {
    return localeService.getLocale();
}

export function localeLanguageFile(localeService: LocaleService) {
    return localeService.getLocaleLanguageFile();
}

export function localeInitializer(localeId: string) {
    return (): Promise<any> => {
        return new Promise((resolve, reject) => {
            System.import(`@angular/common/locales/${localeId}.js`)
                .then((module: any) => {
                    registerLocaleData(module.default);
                    resolve();
                }, reject);
        });
    };
}
