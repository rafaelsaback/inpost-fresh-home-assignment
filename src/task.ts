import { Category } from './mockedApi';

export interface CategoryListElement {
  name: string;
  id: number;
  image: string;
  order: number;
  children: CategoryListElement[];
  showOnHome: boolean;
}

const getOrder = (title: string): string => {
  if (title.includes('#')) {
    return title.split('#')[0];
  }
  return title;
};

const isStringANumber = (strNumber: string): boolean => {
  return !isNaN(parseInt(strNumber));
};

const sortElements = (category: Category, fallBackTitle: string) => {
  const order = getOrder(category.Title);
  const orderL1 = isStringANumber(order) ? parseInt(order) : category.id;

  const l2Kids = (category.children ?? []).map((c2) => {
    const order2 =
      c2.Title && c2.Title.includes('#') ? getOrder(c2.Title) : fallBackTitle;
    const orderL2 = isStringANumber(order2) ? parseInt(order2) : c2.id;

    const l3Kids = (c2.children ?? []).map((c3) => {
      const order3 =
        c3.Title && c3.Title.includes('#') ? getOrder(c3.Title) : fallBackTitle;
      const orderL3 = isStringANumber(order3) ? parseInt(order3) : c3.id;
      return {
        id: c3.id,
        image: c3.MetaTagDescription,
        name: c3.name,
        order: orderL3,
        children: [],
        showOnHome: false,
      };
    });
    l3Kids.sort((a, b) => a.order - b.order);
    return {
      id: c2.id,
      image: c2.MetaTagDescription,
      name: c2.name,
      order: orderL2,
      children: l3Kids,
      showOnHome: false,
    };
  });
  l2Kids.sort((a, b) => a.order - b.order);
  return {
    id: category.id,
    image: category.MetaTagDescription,
    name: category.name,
    order: orderL1,
    children: l2Kids,
    showOnHome: false,
  };
};

export const getCategoryTree = async (
  getCategories: () => Promise<{ data: Category[] }>
): Promise<CategoryListElement[]> => {
  const res = await getCategories();

  if (!res.data) {
    return [];
  }

  const toShowOnHome: number[] = [];

  const result = res.data.map((c1) => {
    if (c1.Title.includes('#')) {
      toShowOnHome.push(c1.id);
    }
    return sortElements(c1, c1.Title);
  });

  result.sort((a, b) => a.order - b.order);

  if (result.length <= 5) {
    result.forEach((a) => (a.showOnHome = true));
  } else if (toShowOnHome.length > 0) {
    result.forEach((x) => (x.showOnHome = toShowOnHome.includes(x.id)));
  } else {
    result.forEach((x, index) => (x.showOnHome = index < 3));
  }

  return result;
};
