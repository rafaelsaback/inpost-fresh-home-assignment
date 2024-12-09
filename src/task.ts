import { Category } from './mockedApi';

export interface CategoryListElement {
  name: string;
  id: number;
  image: string;
  order: number;
  children: CategoryListElement[];
  showOnHome: boolean;
}

const getOrder = (title: string, mainCategoryTitle: string): string => {
  if (title?.includes('#')) {
    return title.split('#')[0];
  }
  return mainCategoryTitle;
};

const isStringANumber = (strNumber: string): boolean => {
  return !isNaN(parseInt(strNumber));
};

const createCategoryListElement = (
  category: Category,
  mainCategoryTitle: string = category.Title
): CategoryListElement => {
  const order = getOrder(category.Title, mainCategoryTitle);
  const orderNumber = isStringANumber(order) ? parseInt(order) : category.id;

  const children =
    category.children?.map((child) =>
      createCategoryListElement(child, mainCategoryTitle)
    ) ?? [];

  children.sort((a, b) => a.order - b.order);
  return {
    id: category.id,
    image: category.MetaTagDescription,
    name: category.name,
    order: orderNumber,
    children,
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

  const toShowOnHome = res.data
    .filter((category) => category.Title.includes('#'))
    .map((category) => category.id);

  const categories = res.data.map((c1) =>
    createCategoryListElement(c1, c1.Title)
  );

  categories.sort((a, b) => a.order - b.order);

  if (categories.length <= 5) {
    return categories.map((category) => ({ ...category, showOnHome: true }));
  } else if (toShowOnHome.length > 0) {
    return categories.map((category) => ({
      ...category,
      showOnHome: toShowOnHome.includes(category.id),
    }));
  }
  return categories.map((category, index) => ({
    ...category,
    showOnHome: index < 3,
  }));
};
