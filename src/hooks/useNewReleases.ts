import { useEffect, useState } from 'react';

import { getNewReleases, type NewRelease } from '../apis/aladin';

type NewReleaseState = {
  items: NewRelease[];
  loading: boolean;
  error: string | null;
};

const defaultState: NewReleaseState = {
  items: [],
  loading: true,
  error: null,
};

let cachedItems: NewRelease[] | null = null;
let cachedSize = 0;
let pendingRequest: Promise<NewRelease[]> | null = null;
let pendingSize = 0;

const fetchNewReleaseItems = async (size: number) => {
  if (cachedItems && cachedSize >= size) {
    return cachedItems;
  }

  if (!pendingRequest || pendingSize < size) {
    pendingSize = size;
    pendingRequest = getNewReleases({ page: 0, size })
      .then((data) => {
        cachedItems = data.items;
        cachedSize = size;
        return data.items;
      })
      .finally(() => {
        pendingRequest = null;
        pendingSize = 0;
      });
  }

  return pendingRequest;
};

export const useNewReleases = (size = 20): NewReleaseState => {
  const [state, setState] = useState<NewReleaseState>(() => {
    if (cachedItems) {
      return {
        items: cachedSize >= size ? cachedItems : [],
        loading: false,
        error: null,
      };
    }

    return defaultState;
  });

  useEffect(() => {
    let ignore = false;

    const loadNewReleases = async () => {
      try {
        setState((prev) => ({
          ...prev,
          loading: !cachedItems || cachedSize < size,
          error: null,
        }));

        const items = await fetchNewReleaseItems(size);

        if (!ignore) {
          setState({
            items,
            loading: false,
            error: null,
          });
        }
      } catch {
        if (!ignore) {
          setState({
            items: [],
            loading: false,
            error: 'Failed to load new releases',
          });
        }
      }
    };

    void loadNewReleases();

    return () => {
      ignore = true;
    };
  }, [size]);

  return state;
};
