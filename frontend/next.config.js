/** @type {import('next').NextConfig} */

module.exports = {
	reactStrictMode: true,
	webpack: config => {
		config.externals.push('pino-pretty', 'lokijs', 'encoding')
		return config
	},
	transpilePackages: [
		"next-i18n-router"
	]
};
