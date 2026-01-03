import { useState } from 'react';
import { RoofProvider, Head, SEO } from './roof';
import './App.css';

/* -------------------------------------------------------- */

function PageA() {
  return (
    <>
      <SEO title='Page A - ReactRoof' description='This is Page A description' url='"https://example.com/a' />
      <h2>Page A</h2>
      <p>Check the document title and head!</p>
    </>
  );
}

function PageB() {
  return (
    <>
      <Head>
        <title>Page B - ReactRoof</title>
        <meta name="description" content="This is Page B description" />
        <link rel="canonical" href="https://example.com/b" />
        <meta name="theme-color" content="#ff0000" />
      </Head>
      <h2>Page B</h2>
      <p>Now the title and metadata have changed.</p>
    </>
  );
}

function App() {
  const [page, setPage] = useState<'A' | 'B'>('A');

  return (
    <RoofProvider>
      <div className="start-screen">
        <Head>
          <title>ReactRoof</title>
          <meta name="application-name" content="ReactRoof library" />
        </Head>

        <h1>ReactRoof</h1>
        <div className="card">
          <button type='button' title='Page A' onClick={() => setPage('A')} disabled={page === 'A'}>
            Go to Page A
          </button>

          <button type='button' title='Page B' onClick={() => setPage('B')} style={{ marginLeft: '10px' }} disabled={page === 'B'}>
            Go to Page B
          </button>
        </div>

        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '20px', borderRadius: "8px" }}>
          {page === 'A' ? <PageA /> : <PageB />}
        </div>

        <p className="read-the-docs">
          You can inspect this page to see the changes in the &lt;head&gt; tag, or <a href="https://github.com/romeopeter/ReactRoof" target="_blank">read the docs</a>.
        </p>
      </div>
    </RoofProvider>
  );
}

export default App;
