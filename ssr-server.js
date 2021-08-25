import express from 'express';
import {
    ApolloProvider,
    ApolloClient,
    InMemoryCache,
    HttpLink
} from '@apollo/client';
import React from 'react';
import { getDataFromTree } from '@apollo/client/react/ssr';
import { App } from './src/components/App';
import fetch from 'cross-fetch';
import { renderToString } from 'react-dom/server';
import path from 'path';
import fs from 'fs';

const PORT = 3001;

const app = new express();
app.get('/', (req, res) => {

    const client = new ApolloClient({
        ssrMode: true,
        link: new HttpLink({ uri: 'http://localhost:3000/graphql', fetch }),
        cache: new InMemoryCache(),
    });

    const context = {};

    // The client-side App will instead use <BrowserRouter>
    const A = (
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    );

    // Replace the TODO with this
    getDataFromTree(A).then((content) => {
        // Extract the entirety of the Apollo Client cache's current state
        const initialState = client.extract();

        const indexFile = path.resolve('./build/index.html')
        fs.readFile(indexFile, 'utf8', (err, data) => {
            if (err) {
                console.error('Something went wrong:', err);
                return res.status(500).send('Oops, better luck next time!');
            }

            res.status(200);
            res.send(
                data.replace('<div id="root"></div>', `<div id="root">${content}</div><script>window.__APOLLO_STATE__ = ${JSON.stringify(initialState).replace(/</g, '\\u003c')};</script>`)
            );
            res.end();
        });
    });
});

app.use(express.static('./build'));

app.listen(PORT, () => {
    console.log(
        `App Server is now running on http://localhost:${PORT}`
    )
});
