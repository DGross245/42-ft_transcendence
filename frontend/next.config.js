/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	output: 'export',
	webpack: config => {
	  config.externals.push('pino-pretty', 'lokijs', 'encoding')
	  return config
	},
	transpilePackages: [
	  "next-i18n-router"
	]
};