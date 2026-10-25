/**
 * @file PlanAura Markdown Renderer Utility
 * @description Transforms raw Markdown text into accessible, styled React elements with header hierarchy and formatting.
 * @module src/utils/markdownRenderer
 */

import React from 'react';

/**
 * Formats inline Markdown styling (bold, italic, code) into styled React elements.
 * @param text - Raw inline text string
 * @returns Array of React elements or strings
 */
export const formatInlineMarkdown = (text: string): React.ReactNode => {
  // Matches ***bold-italic***, **bold**, *italic*, `code`
  const tokenRegex = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const parts = text.split(tokenRegex);
  return parts.map((part, index) => {
    if (part.startsWith('***') && part.endsWith('***') && part.length >= 6) {
      return (
        <strong key={index} className="font-bold italic text-amber-300">
          {part.slice(3, -3)}
        </strong>
      );
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-bold text-amber-300">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={index} className="italic text-slate-300">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={index} className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-xs">
          {part.slice(1, -1)}
        </code>
      );
    }
    // Safety fallback: cleanly strip any stray unmatched asterisks
    return part.replace(/\*{2,3}/g, '');
  });
};

/**
 * Parses multiline Markdown content into semantic HTML elements (h1-h4, lists, blockquotes, paragraphs).
 * @param content - Full Markdown string
 * @returns React elements array
 */
export const renderFormattedMessage = (content: string): React.ReactNode => {
  const lines = content.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let inQuote = false;
  let quoteText: string[] = [];

  const flushList = (key: string) => {
    if (currentList.length > 0) {
      renderedElements.push(
        <ul key={key} className="space-y-1.5 my-2 pl-1">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  const flushQuote = (key: string) => {
    if (quoteText.length > 0) {
      renderedElements.push(
        <div
          key={key}
          className="my-3 p-3 rounded-xl bg-amber-500/10 border-l-4 border-amber-400 text-amber-200 text-xs sm:text-sm leading-relaxed"
        >
          {formatInlineMarkdown(quoteText.join(' '))}
        </div>
      );
      quoteText = [];
      inQuote = false;
    }
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(`l-${i}`);
      return;
    }

    // Dividers: --- or *** or ___
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) {
      flushList(`l-${i}`);
      renderedElements.push(<hr key={i} className="my-3 border-slate-800" />);
      return;
    }

    // Blockquote handling (e.g. > 💡 Cost-Saving Tip)
    if (trimmed.startsWith('>')) {
      flushList(`l-${i}`);
      inQuote = true;
      quoteText.push(trimmed.replace(/^>\s*/, ''));
      return;
    } else if (inQuote) {
      flushQuote(`q-${i}`);
    }

    // Header 1-4 (#, ##, ###, ####)
    const headerMatch = trimmed.match(/^(#{1,6})\s*(.*)$/);
    if (headerMatch) {
      flushList(`l-${i}`);
      const level = headerMatch[1].length;
      const headingContent = formatInlineMarkdown(headerMatch[2]);
      if (level === 1) {
        renderedElements.push(
          <h1 key={i} className="text-base sm:text-lg font-bold text-amber-300 mt-3 mb-1.5 flex items-center space-x-1">
            {headingContent}
          </h1>
        );
      } else if (level === 2) {
        renderedElements.push(
          <h2 key={i} className="text-sm sm:text-base font-bold text-white mt-3 mb-1.5 flex items-center space-x-1">
            {headingContent}
          </h2>
        );
      } else if (level === 3) {
        renderedElements.push(
          <h3 key={i} className="text-xs sm:text-sm font-bold text-amber-200 mt-2.5 mb-1 flex items-center space-x-1">
            {headingContent}
          </h3>
        );
      } else {
        renderedElements.push(
          <h4 key={i} className="text-xs font-semibold text-slate-200 mt-2 mb-1">
            {headingContent}
          </h4>
        );
      }
      return;
    }

    // Bullet points (- or * or +)
    if (/^[-*+]\s+(.*)$/.test(trimmed)) {
      const match = trimmed.match(/^[-*+]\s+(.*)$/);
      const itemText = match ? match[1] : trimmed.slice(2);
      currentList.push(
        <li key={`li-${i}`} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
          <span>{formatInlineMarkdown(itemText)}</span>
        </li>
      );
      return;
    }

    // Numbered lists (1., 2., etc)
    const numMatch = trimmed.match(/^(\d+\.)\s*(.*)$/);
    if (numMatch) {
      flushList(`l-${i}`);
      currentList.push(
        <li key={`ol-${i}`} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-200 my-0.5">
          <span className="font-mono text-amber-400 font-bold shrink-0">{numMatch[1]}</span>
          <span>{formatInlineMarkdown(numMatch[2])}</span>
        </li>
      );
      return;
    }

    flushList(`l-${i}`);

    renderedElements.push(
      <p key={i} className="text-xs sm:text-sm text-slate-200 my-1 leading-relaxed">
        {formatInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList('final-list');
  flushQuote('final-quote');

  return renderedElements;
};
