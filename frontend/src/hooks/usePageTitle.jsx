import { useState, useEffect } from 'react';

export const usePageTitle = () => {
  const [pageTitle, setPageTitle] = useState('Início');

  useEffect(() => {
    // Ouvir eventos customizados de mudança de título
    const handleTitleChange = (event) => {
      setPageTitle(event.detail.title);
    };

    window.addEventListener('pageTitleChange', handleTitleChange);

    return () => {
      window.removeEventListener('pageTitleChange', handleTitleChange);
    };
  }, []);

  const updateTitle = (title) => {
    setPageTitle(title);
    // Disparar evento customizado
    window.dispatchEvent(new CustomEvent('pageTitleChange', { 
      detail: { title } 
    }));
  };

  return { pageTitle, updateTitle };
};