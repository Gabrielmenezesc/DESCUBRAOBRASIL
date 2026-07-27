"use client";

import { useState, useEffect, useCallback } from "react";
import localNews from "@/data/noticias.json";

export interface NewsItem {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  image: string;
  source: string;
  publishedAt: string;
  state: string;
  category: string;
}

export function useNews(stateCode?: string) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchNews = useCallback(() => {
    setLoading(true);
    
    setTimeout(() => {
      let filtered = localNews as NewsItem[];
      
      if (stateCode) {
        filtered = filtered.filter(item => item.state === stateCode);
      }
      
      // Sort by newest published date
      filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      
      setNews(filtered);
      setLastUpdate(new Date());
      setLoading(false);
    }, 400); // Simulate network delay
  }, [stateCode]);

  useEffect(() => {
    fetchNews();
    
    const interval = setInterval(() => {
      fetchNews();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchNews]);

  return {
    news,
    loading,
    lastUpdate,
    refetch: fetchNews
  };
}
