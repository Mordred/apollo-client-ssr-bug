import { gql, useQuery, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { ErrorMessage } from './ErrorMessage';

const AllTodos = gql`
query AllTodos {
    allTodos {
        id
        title
        completed
    }
}
`;

const CreateTodo = gql`
mutation CreateTodo($title: String!, $completed: Boolean!) {
    createTodo(title: $title, completed: $completed) {
        id
        title
        completed
    }
}
`;


export const App = () => {
    const { data, loading, error } = useQuery(AllTodos, { fetchPolicy: 'network-only' });
    const [createExecute] = useMutation(CreateTodo, {
        refetchQueries: ['AllTodos'],
    })

    const [value, setValue] = useState('');
    const [processing, setProcessing] = useState(false);

    return (
        <>
            <h1>TODO App</h1>

            {error || (loading && !data) ?
                <ErrorMessage message={error} />
                : (
                    <ul>
                        {data.allTodos.map((todo) => (
                            <li key={todo.id}>
                                {todo.title}
                            </li>
                        ))}
                    </ul>
                )}

            <form onSubmit={async (event) => {
                event.preventDefault();

                setProcessing(true);
                try {
                    const response = await createExecute({ variables: { title: value, completed: false } });
                    setValue('');
                } finally {
                    setProcessing(false)
                }
            }}>
                <input type="text" value={value} onChange={(event) => setValue(event.currentTarget.value)} disabled={processing} />
                <button type="submit" disabled={processing}>Create</button>
            </form>
        </>
    )
}