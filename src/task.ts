import { Category } from './mockedApi';

export interface CategoryListElement {
  name: string;
  id: number;
  image: string;
  order: number;
  children: CategoryListElement[];
  showOnHome: boolean;
}

const getOrder = (category: Category): number => {
  const { Title: title, id } = category;

  if (title?.includes('#')) {
    const splitTitle = title.split('#');
    if (isStringAnIntNumber(splitTitle[0])) {
      return parseInt(splitTitle[0]);
    }
  } else if (isStringAnIntNumber(title)) {
    return parseInt(title);
  }

  return id;
};

const isStringAnIntNumber = (strNumber: string): boolean => {
  return !isNaN(parseInt(strNumber));
};

const createCategoryListElement = (
  category: Category,
  isMainCategory = false
): CategoryListElement => {
  const children = category.children?.map((child) =>
    createCategoryListElement(child)
  );

  children?.sort((a, b) => a.order - b.order);

  return {
    id: category.id,
    image: category.MetaTagDescription,
    name: category.name,
    order: getOrder(category),
    children: children ?? [],
    showOnHome: isMainCategory && category.Title.includes('#'),
  };
};

export const getCategoryTree = async (
  getCategories: () => Promise<{ data: Category[] }>
): Promise<CategoryListElement[]> => {
  const res = await getCategories();

  if (!res.data) {
    return [];
  }

  const categories = res.data.map((c1) => createCategoryListElement(c1, true));

  categories.sort((a, b) => a.order - b.order);

  if (categories.length <= 5) {
    return categories.map((category) => ({ ...category, showOnHome: true }));
  } else if (categories.some((category) => category.showOnHome)) {
    return categories;
  }
  return categories.map((category, index) => ({
    ...category,
    showOnHome: index < 3,
  }));
};
