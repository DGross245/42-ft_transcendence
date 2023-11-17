export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "Next.js + NextUI",
	description: "Make beautiful websites regardless of your design experience.",
	navItems: [
		{
			label: "Home",
			href: "/",
		},
    {
      label: "Pong",
      href: "/pong",
    }
	],
	navMenuItems: [
		{
			label: "Profile",
			href: "/profile",
		},
		{
			label: "Projects",
			href: "/projects",
		},
		{
			label: "Settings",
			href: "/settings",
		},
		{
			label: "Logout",
			href: "/logout",
		},
	]
};
