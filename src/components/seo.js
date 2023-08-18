import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

const useSiteMetadata = () => {
	const data = useStaticQuery(graphql`
		query {
			site {
				siteMetadata {
					title
					description
					image
					siteUrl
				}
			}
		}
	`);

	return data.site.siteMetadata;
};

export const SEO = ({ title, description, pathname, children }) => {
	const { title: defaultTitle, description: defaultDescription, image, siteUrl } = useSiteMetadata();

	const seo = {
		title: title || defaultTitle,
		description: description || defaultDescription,
		image: `${siteUrl}${image}`,
		url: `${siteUrl}${pathname || ``}`,
	};

	return (
		<>
			<title>{seo.title}</title>
			<meta name='description' content={seo.description} />
			<meta name='image' content={seo.image} />

			<meta property='og:title' content={seo.title} />
			<meta property='og:description' content={seo.description} />
			<meta property='og:image' content={seo.image} />
			<meta property='og:url' content={seo.url} />
			<meta property='og:type' content='website' />

			<meta name='twitter:card' content='summary_large_image' />
			<meta name='twitter:title' content={seo.title} />
			<meta name='twitter:url' content={seo.url} />
			<meta name='twitter:description' content={seo.description} />
			<meta name='twitter:image' content={seo.image} />
			{children}
		</>
	);
};
