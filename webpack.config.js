const config = {
	mode: 'production',
	entry: {
		index: './src/scripts/index.js',
		// mobileNav: './src/scripts/mobileNav.js'
		contacts: './src/scripts/contacts.js',
		// about: './src/scripts/about.js',
	},
	output: {
		filename: '[name].bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
};

module.exports = config;
