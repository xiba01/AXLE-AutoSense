import { StoryData } from '../types';
import storyData from '../data/dummy_story.json';

export const useStoryData = (): StoryData => {
    // I need this to fetch from an API
    return storyData as StoryData;
};
