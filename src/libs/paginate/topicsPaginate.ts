function paginateTopic(numPage: any) {
  if (!numPage || numPage == null || numPage == undefined || numPage == '') {
    numPage = 1;
  }
  const optionsPaginate = {
    sort: { createdAt: -1 }, // campo a ordenar
    limit: 10,
    page: numPage,
  };
  return optionsPaginate;
}

export default paginateTopic;
