import React, { useState } from 'react';
import { BookOpen, Search, X, ExternalLink, Sparkles, ChevronRight } from 'lucide-react';
import { KnowledgeArticle } from '../types';

interface KnowledgeBaseViewProps {
  articles: KnowledgeArticle[];
  onSelectIncident: (incidentId: string) => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  articles,
  onSelectIncident
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeArticle, setActiveArticle] = useState<KnowledgeArticle | null>(null);

  const categories = Array.from(new Set(articles.map((a) => a.category)));

  const filtered = articles.filter((a) => {
    if (selectedCategory !== 'ALL' && a.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div id="knowledge-base-view" className="p-8 flex-1 bg-slate-50/50 min-h-full space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">Knowledge Base &amp; Runbooks</h3>
          <p className="text-sm text-slate-500">
            Enterprise operating procedures, diagnostic playbooks, and incident resolution references indexed by Aegis
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-600 bg-white border border-gray-200 px-3 py-1.5 rounded">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-slate-700" />
          <span>Vector Index: <strong>Indexed &amp; Active</strong></span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-gray-200 rounded p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search runbooks, post-mortems, procedures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-400 text-slate-900"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs border border-gray-200 rounded px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((art) => (
          <div
            key={art.id}
            onClick={() => setActiveArticle(art)}
            className="bg-white border border-gray-200 rounded p-5 hover:border-slate-400 transition-colors cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {art.id}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {art.readTime}
                </span>
              </div>

              <h2 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 leading-snug">
                {art.title}
              </h2>

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {art.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-2.5">
              <div className="flex items-center space-x-1.5 flex-wrap">
                {art.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Updated: {art.lastUpdated}</span>
                <span className="text-slate-900 font-medium group-hover:text-blue-600 flex items-center">
                  Read Runbook <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ARTICLE READER MODAL */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div 
            id="kb-article-modal"
            className="bg-white border border-gray-300 rounded shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden text-slate-900"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between bg-slate-50">
              <div>
                <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 mb-1">
                  <span className="font-bold text-blue-600">{activeArticle.id}</span>
                  <span>•</span>
                  <span>{activeArticle.category}</span>
                  <span>•</span>
                  <span>Updated {activeArticle.lastUpdated}</span>
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  {activeArticle.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-gray-200 rounded text-slate-700 font-medium">
                {activeArticle.summary}
              </div>

              <div className="prose prose-sm max-w-none text-slate-800 space-y-3 font-sans leading-relaxed whitespace-pre-line">
                {activeArticle.content}
              </div>

              {/* Related Incidents Callout */}
              {activeArticle.relatedIncidents.length > 0 && (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Referenced in Incident Investigations:
                  </span>
                  <div className="flex items-center space-x-2">
                    {activeArticle.relatedIncidents.map((incId) => (
                      <button
                        key={incId}
                        onClick={() => {
                          setActiveArticle(null);
                          onSelectIncident(incId);
                        }}
                        className="inline-flex items-center px-2.5 py-1 bg-white border border-gray-300 rounded font-mono text-xs text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer font-bold"
                      >
                        <span>{incId}</span>
                        <ExternalLink className="w-3 h-3 ml-1.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-gray-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-gray-300 rounded hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
