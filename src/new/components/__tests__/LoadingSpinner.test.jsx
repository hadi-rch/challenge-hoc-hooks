import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from '../LoadingSpinner';
import React from 'react';

describe('LoadingSpinner', () => {
    it('renders the loading spinner element', () => {
        render(<LoadingSpinner />);
        const outerDiv = screen.getByTestId('loading-spinner');
        expect(outerDiv).toBeInTheDocument();
        // Periksa class pada elemen anak pertama yang sebenarnya memiliki animasi
        expect(outerDiv.firstChild).toHaveClass('animate-spin');
    });
});