'use client';

import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { useCurrentLocale } from 'next-i18n-router/client'
import i18nConfig from '@/i18n.config'
import i18next from 'i18next'
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const runsOnServerSide = typeof window === 'undefined';
i18next
	.use(initReactI18next)
	.use(resourcesToBackend((language: string, namespace: string) => 
		import(`@/locales/${language}/${namespace}.json`)
	))
	.init({
		lng: i18nConfig.defaultLocale,
		preload: runsOnServerSide ? i18nConfig.locales : []
	})

export function useTranslation(ns: string) {
	const currentLocale = useCurrentLocale(i18nConfig);
	const ret = useTranslationOrg(ns);
	const { i18n } = ret

	useEffect(() => {
		if (currentLocale && i18n.resolvedLanguage !== currentLocale) {
			i18n.changeLanguage(currentLocale);
		}
	}, [currentLocale, i18n]);

	return ( ret );
}