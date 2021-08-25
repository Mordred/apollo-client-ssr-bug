import express from 'express';
import jsonGraphqlExpress from 'json-graphql-server';
import cors from 'cors';

const PORT = 3000;
const app = express();

const data = {
    todos: [
        { id: 1, title: "Lorem Ipsum", completed: false },
        { id: 2, title: "Sic Dolor amet", completed: true },
    ],
};

app.use('/graphql', cors(), jsonGraphqlExpress(data));
app.listen(PORT, () => {
    console.log(`GraphQL Server is now running on http://localhost:${PORT}`);
});