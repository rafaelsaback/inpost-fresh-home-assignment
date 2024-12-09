import test from 'ava';

import { INCORRECT } from './currentResult';
import { getCategories } from './mockedApi';
import { categoryTree } from './task';

test('Task', async (t) => {
  const tree = await categoryTree(getCategories);
  t.deepEqual(tree, INCORRECT);
});
