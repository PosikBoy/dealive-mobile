export const getOrderHeaderText = (length: number, id: number, income: number) => {
  const incomeNormalized = `| + ${income ? income.toFixed(0) : ''} ₽/ч`;
  return `${length} адреса | № ${id} ${incomeNormalized}`;
};
