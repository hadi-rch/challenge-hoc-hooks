import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import withLoading from '../withLoading';
import React from 'react';

// Mock the LoadingSpinner component
vi.mock('../../components/LoadingSpinner', () => ({
    default: () => <div data-testid="mock-loading-spinner">Loading...</div>,
}));

// Create a dummy component to wrap
const DummyComponent = ({ message, ...rest }) => (
    <div data-testid="dummy-component" {...rest}>
        {message}
    </div>
);

describe('withLoading HOC', () => {
    const WrappedDummyComponent = withLoading(DummyComponent);

    it('renders LoadingSpinner when isLoading is true', () => {
        render(<WrappedDummyComponent isLoading={true} message="Hello" />);
        expect(screen.getByTestId('mock-loading-spinner')).toBeInTheDocument();
        expect(screen.queryByTestId('dummy-component')).not.toBeInTheDocument();
    });

    it('renders WrappedComponent when isLoading is false', () => {
        render(<WrappedDummyComponent isLoading={false} message="Hello" data-extra="extra-prop" />);
        expect(screen.queryByTestId('mock-loading-spinner')).not.toBeInTheDocument();
        const dummyComponent = screen.getByTestId('dummy-component');
        expect(dummyComponent).toBeInTheDocument();
        expect(dummyComponent).toHaveTextContent('Hello');
        expect(dummyComponent).toHaveAttribute('data-extra', 'extra-prop');
    });

    it('passes other props to the WrappedComponent', () => {
        const extraProps = {
            someProp: 'value',
            anotherProp: 123,
            onClick: vi.fn(),
        };
        render(<WrappedDummyComponent isLoading={false} {...extraProps} />);
        const dummyComponent = screen.getByTestId('dummy-component');
        expect(dummyComponent).toBeInTheDocument();
    });
});