"use client"

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Selection } from "@nextui-org/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useCurrentLocale } from 'next-i18n-router/client';
import { useRouter, usePathname } from "next/navigation";
import i18nConfig from "@/i18n.config";

const LanguageSelectionButton: React.FC = () => {
	const currentLocale = useCurrentLocale(i18nConfig) ?? "";
	const [currentLang, currentCountry] = currentLocale.split('-');
	const currentPathname = usePathname() ?? "";
	const router = useRouter();

	const getFlagEmojiElement = (countryCode: string) => {
		const codePoints = (countryCode
			.toUpperCase()
			.split('') as any[])
			.map(char =>  127397 + char.charCodeAt());
		return (
			<span className="text-xl">
				{String.fromCodePoint(...codePoints)}
			</span>
		);
	}
	const capitalizeFirstLetter = (string: string) =>
		string.charAt(0).toUpperCase() + string.slice(1);
	const getCountryName = (langCode: string) =>
		capitalizeFirstLetter(new Intl.DisplayNames([currentLocale], {type: 'language'}).of(langCode) ?? "Unknown");

	const changeLanguage = (keys: Selection) => {
		const newLocale = (keys as any).currentKey;

		const days = 30;
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		document.cookie = `NEXT_LOCALE=${newLocale};expires=${date.toUTCString()};path=/`;

		const sendToPath = (path: string) => {
			if(!(typeof window === undefined)) {
				window.location.replace(path);
			} else {
				router.push(path);
				router.refresh();
			}
		}

		if (
			currentLocale === i18nConfig.defaultLocale &&
			!i18nConfig.prefixDefault
		) {
			sendToPath('/' + newLocale + currentPathname);
		} else {
			sendToPath(
				currentPathname.replace(`/${currentLocale}`, `/${newLocale}`)
			);
		}
	}

	return (
		<Dropdown backdrop="blur">
			<DropdownTrigger>
				<Button
					variant="bordered"
					startContent={getFlagEmojiElement(currentCountry)}
					endContent={<ChevronDownIcon className="w-5 h-5"/>}
				>
					{getCountryName(currentLang)}
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				variant="faded"
				aria-label="Laguages"
				selectionMode="single"
				disallowEmptySelection
				selectedKeys={[currentLocale]}
				onSelectionChange={changeLanguage}
			>
				{i18nConfig.locales.map((mlocale) => {
					const [lang, country] = mlocale.split('-');
					return (
						<DropdownItem key={mlocale} startContent={getFlagEmojiElement(country)}>
							{getCountryName(lang)}
						</DropdownItem>
					)
				})}
			</DropdownMenu>
		</Dropdown>
	)
}

export default LanguageSelectionButton;
