/**
 * storage.js - Local state and persistence manager
 */
const StorageModule = (function () {
  const PREFIX = 'eng_math_v4_';

  const defaultState = {
    currentTopicId: '0.1',
    currentTab: 'lesson',
    currentFilter: 'all',
    totalCorrect: 0,
    totalAttempted: 0,
    completedTopics: {} // { "0.1": 9, "1.1": 10 }
  };

  function loadState() {
    try {
      return {
        currentTopicId: localStorage.getItem(PREFIX + 'topicId') || defaultState.currentTopicId,
        currentTab: localStorage.getItem(PREFIX + 'tab') || defaultState.currentTab,
        currentFilter: localStorage.getItem(PREFIX + 'filter') || defaultState.currentFilter,
        totalCorrect: parseInt(localStorage.getItem(PREFIX + 'correct') || '0', 10),
        totalAttempted: parseInt(localStorage.getItem(PREFIX + 'attempted') || '0', 10),
        completedTopics: JSON.parse(localStorage.getItem(PREFIX + 'completed') || '{}')
      };
    } catch (e) {
      console.warn('Storage unavailable, using defaults', e);
      return { ...defaultState };
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(PREFIX + 'topicId', state.currentTopicId);
      localStorage.setItem(PREFIX + 'tab', state.currentTab);
      localStorage.setItem(PREFIX + 'filter', state.currentFilter);
      localStorage.setItem(PREFIX + 'correct', state.totalCorrect);
      localStorage.setItem(PREFIX + 'attempted', state.totalAttempted);
      localStorage.setItem(PREFIX + 'completed', JSON.stringify(state.completedTopics));
    } catch (e) {
      console.error('Failed to save state', e);
    }
  }

  return {
    loadState,
    saveState
  };
})();