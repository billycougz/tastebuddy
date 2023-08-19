require('dotenv').config({
	path: `.env.${process.env.NODE_ENV}`,
});

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
	siteMetadata: {
		title: `TasteBuddy`,
		siteUrl: `https://tastebuddy.williamcougan.com`,
		description: 'TasteBuddy is your AI companion for food & drink recommendations',
		image: '/site-img.jpeg',
	},
	plugins: [
		{
			resolve: 'gatsby-plugin-styled-components',
		},
		{
			resolve: 'gatsby-plugin-manifest',
			options: {
				icon: 'src/images/icon.jpg',
				display: `standalone`,
			},
		},
		{
			resolve: 'gatsby-plugin-google-gtag',
			options: {
				trackingIds: [process.env.GA_MEASUREMENT_ID],
			},
		},
	],
};
