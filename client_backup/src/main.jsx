import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // this must point to the file with @tailwind directives

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <div className="bg-red-500 text-white p-4 rounded">
      If this is red, Tailwind works.
    </div>
  </React.StrictMode>
);
