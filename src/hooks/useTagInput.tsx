import React, { useState } from 'react';

const useTagInput = (maxTags = 5, initialTags: string[] = []) => {
  const [tags, setTags] = useState<string[]>(initialTags);

  const handleAddTag = (newTag: string) => {
    if (newTag && !tags.includes(newTag) && tags.length < maxTags) {
      setTags([...tags, newTag]);
    }
  };

  const handleRemoveTag = (tag: string) =>
    setTags(tags.filter((t) => t !== tag));

  return { tags, handleAddTag, handleRemoveTag };
};

export { useTagInput };
