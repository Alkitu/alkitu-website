'use client';

import React, { useEffect, useRef, useState } from 'react';
import { render } from '@react-email/components';
import { cn } from '~/lib/utils';

interface EmailPreviewProps {
    html: Promise<string> | string;
    height?: number;
    className?: string;
}

/**
 * Renders a React Email HTML string inside a sandboxed iframe.
 * This gives an accurate end-to-end email preview in Storybook.
 */
export const EmailPreview: React.FC<EmailPreviewProps> = ({ html, height = 800, className }) => {
    const [resolvedHtml, setResolvedHtml] = useState<string>('');
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        Promise.resolve(html).then(setResolvedHtml);
    }, [html]);

    return (
        <div
            className={cn(className)}
            style={{
                width: '100%',
                background: '#f5f5f5',
                minHeight: `${height}px`,
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            }}
        >
            {/* Toolbar */}
            <div
                style={{
                    background: '#1a1a1a',
                    color: '#888',
                    padding: '8px 16px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderBottom: '1px solid #333',
                }}
            >
                <span style={{ color: '#ef4444', fontSize: '10px' }}>●</span>
                <span style={{ color: '#f59e0b', fontSize: '10px' }}>●</span>
                <span style={{ color: '#22c55e', fontSize: '10px' }}>●</span>
                <span style={{ marginLeft: '12px', color: '#555' }}>Email Preview</span>
            </div>

            {/* iframe */}
            <iframe
                ref={iframeRef}
                srcDoc={resolvedHtml}
                style={{
                    width: '100%',
                    height: `${height}px`,
                    border: 'none',
                    background: '#fff',
                    flexShrink: 0,
                }}
                title="Email Preview"
                sandbox="allow-same-origin"
            />
        </div>
    );
};

/**
 * Helper — renders a React Email component to an HTML string.
 * Use in story render() functions:
 *
 *   render: (args) => <EmailPreview html={renderEmail(<WelcomeEmail {...args} />)} />
 */
export function renderEmail(element: React.ReactElement): Promise<string> {
    return render(element, { pretty: true });
}
