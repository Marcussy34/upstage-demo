import Head from 'next/head';
import { DocumentParser } from '../components/DocumentParser';

export default function DocumentParserPage() {
  return (
    <>
      <Head>
        <title>Document Parser Demo</title>
        <meta name="description" content="Document parsing demo using Upstage API" />
      </Head>

      <DocumentParser />
    </>
  );
} 