export default (title: string) =>
  title.toLocaleLowerCase().split(' ').join('-');
