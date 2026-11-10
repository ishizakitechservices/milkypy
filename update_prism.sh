#!/bin/bash
sed -i -e '/\/\* Prism.js Python Syntax Highlighting Tokens \*\//,$d' src/index.css
cat << 'CSS' >> src/index.css
/* Prism.js Light Theme Tokens */
.token.comment,.token.prolog,.token.doctype,.token.cdata { color: #6a737d; font-style: italic; }
.token.punctuation { color: #24292e; }
.token.property,.token.tag,.token.boolean,.token.number,.token.constant,.token.symbol,.token.deleted { color: #005cc5; }
.token.selector,.token.attr-name,.token.string,.token.char,.token.builtin,.token.inserted { color: #032f62; }
.token.operator,.token.entity,.token.url,.language-css .token.string,.style .token.string { color: #d73a49; }
.token.atrule,.token.attr-value,.token.keyword { color: #d73a49; }
.token.function,.token.class-name { color: #6f42c1; }
.token.regex,.token.important,.token.variable { color: #e36209; }

/* Prism.js Dark Theme Tokens */
.dark .token.comment,.dark .token.prolog,.dark .token.doctype,.dark .token.cdata { color: #6a9955; font-style: italic; }
.dark .token.punctuation { color: #cccccc; }
.dark .token.property,.dark .token.tag,.dark .token.boolean,.dark .token.number,.dark .token.constant,.dark .token.symbol,.dark .token.deleted { color: #b5cea8; }
.dark .token.selector,.dark .token.attr-name,.dark .token.string,.dark .token.char,.dark .token.builtin,.dark .token.inserted { color: #ce9178; }
.dark .token.operator,.dark .token.entity,.dark .token.url,.dark .language-css .token.string,.dark .style .token.string { color: #d4d4d4; }
.dark .token.atrule,.dark .token.attr-value,.dark .token.keyword { color: #569cd6; }
.dark .token.function,.dark .token.class-name { color: #dcdcaa; }
.dark .token.regex,.dark .token.important,.dark .token.variable { color: #9cdcfe; }
CSS
