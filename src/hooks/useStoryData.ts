import { StoryData } from '../types';
import storyData from '../data/dummy_story.json';

export const useStoryData = (): StoryData => {
    // In a real app, this might fetch from an API
    return storyData as StoryData;
};
