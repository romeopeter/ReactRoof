import { useState } from 'react';
import { RoofProvider, Roof } from './roof';
import './App.css';

function PageA() {
  return (
    <>
      <Roof>
        <title>Page A - ReactRoof</title>
        <meta name="description" content="This is Page A description" />
        <link rel="canonical" href="https://example.com/a" />
      </Roof>
      <h2>Page A</h2>
      <p>Check the document title and head!</p>
    </>
  );
}

function PageB() {
  return (
    <>
      <Roof>
        <title>Page B - ReactRoof</title>
        <meta name="description" content="This is Page B description" />
        <link rel="canonical" href="https://example.com/b" />
        <meta name="theme-color" content="#ff0000" />
      </Roof>
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
        <Roof>
          <title>ReactRoof Demo</title>
          <meta name="application-name" content="ReactRoof App" />
        </Roof>

        <h1>ReactRoof Demo</h1>
        <div className="card">
          <button onClick={() => setPage('A')} disabled={page === 'A'}>
            Go to Page A
          </button>
          <button onClick={() => setPage('B')} styles={{ marginLeft: '10px' }} disabled={page === 'B'}>
            Go to Page B
          </button>
        </div>

        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '20px' }}>
          {page === 'A' ? <PageA /> : <PageB />}
        </div>

        <p className="read-the-docs">
          Inspect the &lt;head&gt; of this page to see changes.
        </p>
      </div>
    </RoofProvider>
  );
}

export default App;
