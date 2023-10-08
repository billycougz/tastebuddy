import * as React from 'react';
import { SEO } from '../components/seo';
import TasteBuddy from '../TasteBuddy';
import Layout from '../components/layout';
import { isDevelopment } from '../TasteBuddy/utils';

const IndexPage = () => {
	return (
		<Layout>
			<TasteBuddy />
		</Layout>
	);
};

export default IndexPage;

export const Head = () => <SEO title={isDevelopment() ? 'dev' : 'TasteBuddy'} />;
