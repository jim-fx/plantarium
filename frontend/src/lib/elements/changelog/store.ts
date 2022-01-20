import { writable } from 'svelte/store';
import { localState } from '../../helpers';
import type ICommit from './ICommit';

export const commits = writable<ICommit[]>([]);

let lastUpdated = localState.get('lastUpdated', Date.now());

function parseCommit(c) {
  const date = Date.parse(c.date);

  return {
    ...c,
    date,
    new: lastUpdated < date,
  };
}

let commitPromise;
async function _fetchCommits() {
  const response = await fetch('commits.json');
  const json = await response.json();

  lastUpdated = Date.now();
  localState.set('lastUpdated', lastUpdated);

  return json.map((c) => parseCommit(c));
}

export const fetchCommits = async () => {
  if (commitPromise) {
    return commitPromise;
  }

  commitPromise = _fetchCommits();

  const _commits = await commitPromise;

  commits.set(_commits);
};
