import React from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

const withLoading = (WrappedComponent) => {
    const WithLoadingComponent = ({ isLoading, ...props }) => {
        if (isLoading) {
            return <LoadingSpinner />;
        }
        // <WrappedComponent todos={props.todos} updateTodo={props.updateTodo} deleteTodo={props.deleteTodo} />
        return <WrappedComponent {...props} />;
    };

    return WithLoadingComponent;
};

export default withLoading;