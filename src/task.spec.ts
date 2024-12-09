import test from 'ava';

import { CORRECT } from './correctResult';
import { getCategories } from './mockedApi';
import { getCategoryTree } from './task';

test('Task', async (t) => {
  const categoryTree = await getCategoryTree(getCategories);
  t.deepEqual(categoryTree, CORRECT);
});
